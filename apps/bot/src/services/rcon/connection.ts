import net from 'net';

import { makeRconError } from './errors';
import { consumePackets, encodePacket } from './protocol';
import { withTimeout } from './timers';
import {
  END_PACKET_ID,
  MID_PACKET_ID,
  SERVERDATA_AUTH,
  SERVERDATA_AUTH_RESPONSE,
  SERVERDATA_CHAT_VALUE,
  SERVERDATA_EXECCOMMAND,
  SERVERDATA_RESPONSE_VALUE,
  type DecodedRconPacket,
  type RconConfig,
  type RconConnectionState,
  type RconHealth,
} from './types';

type PendingRequest = {
  count: number;
  mode: 'auth' | 'command';
  bodyParts: string[];
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
};

export const createRconConnection = (config: RconConfig) => {
  let socket: net.Socket | null = null;
  let state: RconConnectionState = 'idle';
  let authenticated = false;
  let incoming = Buffer.alloc(0);
  let pending: PendingRequest | null = null;
  let connecting: Promise<void> | null = null;
  let count = 1;
  let closedByUser = false;
  let lastConnectedAt: string | null = null;
  let lastSuccessAt: string | null = null;
  let lastErrorAt: string | null = null;
  let lastError: string | null = null;

  const setError = (error: unknown) => {
    lastErrorAt = new Date().toISOString();
    lastError = error instanceof Error ? error.message : String(error);
  };

  const nextCount = () => {
    count = count + 1 > 65535 ? 1 : count + 1;
    return count;
  };

  const clearPending = (error: unknown) => {
    if (pending) {
      pending.reject(error);
      pending = null;
    }
  };

  const cleanupSocket = () => {
    if (!socket) { return; }
    socket.removeAllListeners();
    socket.destroy();
    socket = null;
  };

  const markDisconnected = (error?: unknown) => {
    authenticated = false;
    incoming = Buffer.alloc(0);
    state = closedByUser ? 'closed' : 'failed';

    if (error) {
      setError(error);
      clearPending(error);
    } else {
      clearPending(makeRconError('RCON_DISCONNECTED', 'RCON disconnected'));
    }

    cleanupSocket();
    connecting = null;
  };

  const handlePacket = (packet: DecodedRconPacket) => {
    if (packet.type === SERVERDATA_CHAT_VALUE) {
      return;
    }

    if (!pending) {
      return;
    }

    if (packet.count !== pending.count && packet.type !== SERVERDATA_AUTH_RESPONSE) {
      return;
    }

    if (pending.mode === 'auth') {
      if (packet.type !== SERVERDATA_AUTH_RESPONSE) {
        return;
      }

      if (packet.id === 255) {
        pending.reject(makeRconError('RCON_AUTH_ERROR', 'RCON authentication failed'));
      } else {
        authenticated = true;
        lastSuccessAt = new Date().toISOString();
        pending.resolve(packet.body);
      }

      pending = null;
      return;
    }

    if (packet.type !== SERVERDATA_RESPONSE_VALUE && packet.type !== SERVERDATA_AUTH_RESPONSE) {
      const error = makeRconError('RCON_PROTOCOL_ERROR', 'Unexpected RCON packet type', {
        type: packet.type,
        id: packet.id,
        count: packet.count,
      });
      pending.reject(error);
      pending = null;
      return;
    }

    if (packet.id === MID_PACKET_ID) {
      pending.bodyParts.push(packet.body);
      return;
    }

    if (packet.id === END_PACKET_ID) {
      const response = pending.bodyParts.join('');
      pending.resolve(response);
      pending = null;
      lastSuccessAt = new Date().toISOString();
    }
  };

  const handleData = (data: Buffer) => {
    try {
      incoming = Buffer.concat([incoming, data]);
      const consumed = consumePackets(incoming);
      incoming = Buffer.from(consumed.rest);
      for (const packet of consumed.packets) { handlePacket(packet); }
    } catch (error) {
      markDisconnected(error);
    }
  };

  const connectSocket = async () => {
    if (authenticated && socket?.writable) { return; }
    if (connecting) { return connecting; }

    closedByUser = false;
    state = 'connecting';

    connecting = withTimeout(new Promise<void>((resolve, reject) => {
      const nextSocket = new net.Socket();
      socket = nextSocket;

      const fail = (error: unknown) => {
        setError(error);
        reject(error);
      };

      nextSocket.once('connect', async () => {
        state = 'authenticating';
        lastConnectedAt = new Date().toISOString();

        try {
          await writePacket(SERVERDATA_AUTH, config.password, 'auth');
          state = 'ready';
          resolve();
        } catch (error) {
          fail(error);
        }
      });

      nextSocket.on('data', handleData);
      nextSocket.on('error', (error) => {
        setError(error);
        clearPending(makeRconError('RCON_CONNECTION_ERROR', error.message, undefined, error));
      });
      nextSocket.on('close', () => {
        if (!closedByUser) {
          markDisconnected(makeRconError('RCON_DISCONNECTED', 'RCON socket closed'));
        }
      });

      nextSocket.once('error', fail);
      nextSocket.connect(config.port, config.host);
    }), config.connectTimeoutMs, 'RCON connect').finally(() => {
      connecting = null;
    });

    return connecting;
  };

  const writePacket = async (type: number, body: string, mode: 'auth' | 'command') => {
    if (!socket?.writable) {
      throw makeRconError('RCON_DISCONNECTED', 'RCON socket is not writable');
    }

    if (pending) {
      throw makeRconError('RCON_COMMAND_REJECTED', 'RCON transport already has a pending request');
    }

    if (Buffer.byteLength(body, 'utf8') + 14 > config.maxPacketBytes) {
      throw makeRconError('RCON_COMMAND_REJECTED', 'RCON packet is too large', {
        bytes: Buffer.byteLength(body, 'utf8') + 14,
        maxPacketBytes: config.maxPacketBytes,
      });
    }

    const requestCount = nextCount();
    const packet = encodePacket({
      type,
      id: type === SERVERDATA_AUTH ? END_PACKET_ID : MID_PACKET_ID,
      count: requestCount,
      body,
    });
    const endPacket = encodePacket({ type, id: END_PACKET_ID, count: requestCount, body: '' });

    return new Promise<string>((resolve, reject) => {
      pending = { count: requestCount, mode, bodyParts: [], resolve, reject };
      socket?.write(packet);
      if (type !== SERVERDATA_AUTH) { socket?.write(endPacket); }
    });
  };

  const executeRaw = async (command: string, timeoutMs = config.commandTimeoutMs) => {
    await connectSocket();

    if (!authenticated) {
      throw makeRconError('RCON_AUTH_ERROR', 'RCON is not authenticated');
    }

    try {
      return await withTimeout(writePacket(SERVERDATA_EXECCOMMAND, command, 'command'), timeoutMs, `RCON command ${command}`);
    } catch (error) {
      markDisconnected(error);
      throw error;
    }
  };

  const close = async () => {
    closedByUser = true;
    state = 'closing';
    authenticated = false;
    clearPending(makeRconError('RCON_DISCONNECTED', 'RCON closed'));
    cleanupSocket();
    state = 'closed';
  };

  const health = (queues: { readQueue: number; mutationQueue: number }): RconHealth => ({
    ok: state === 'ready' && authenticated && Boolean(socket?.writable),
    state,
    connected: Boolean(socket?.writable),
    authenticated,
    pending: pending ? 1 : 0,
    readQueue: queues.readQueue,
    mutationQueue: queues.mutationQueue,
    lastConnectedAt,
    lastSuccessAt,
    lastErrorAt,
    lastError,
  });

  return { executeRaw, close, health };
};

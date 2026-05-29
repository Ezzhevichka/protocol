import { makeRconError } from './errors';

import type { RconConfig } from './types';

const readInt = (name: string, fallback?: number) => {
  const raw = process.env[name];
  if (!raw && fallback !== undefined) { return fallback; }
  const value = Number(raw);
  if (!Number.isInteger(value)) {
    throw makeRconError('RCON_CONFIG_ERROR', `Invalid ${name}`);
  }
  return value;
};

export const getRconConfig = (): RconConfig => {
  const host = process.env.RCON_HOST;
  const password = process.env.RCON_PASSWORD;
  const serverId = readInt('SERVER_ID');
  const port = readInt('RCON_PORT');

  if (!host) { throw makeRconError('RCON_CONFIG_ERROR', 'RCON_HOST is required'); }
  if (!password) { throw makeRconError('RCON_CONFIG_ERROR', 'RCON_PASSWORD is required'); }
  if (serverId <= 0) { throw makeRconError('RCON_CONFIG_ERROR', 'Invalid SERVER_ID'); }
  if (port <= 0 || port > 65535) { throw makeRconError('RCON_CONFIG_ERROR', 'Invalid RCON_PORT'); }

  return {
    serverId,
    host,
    port,
    password,
    connectTimeoutMs: readInt('RCON_CONNECT_TIMEOUT_MS', 7_000),
    commandTimeoutMs: readInt('RCON_COMMAND_TIMEOUT_MS', 8_000),
    maxPacketBytes: readInt('RCON_MAX_PACKET_BYTES', 4096),
    maxQueueSize: readInt('RCON_MAX_QUEUE_SIZE', 250),
    reconnectBaseDelayMs: readInt('RCON_RECONNECT_BASE_DELAY_MS', 500),
    reconnectMaxDelayMs: readInt('RCON_RECONNECT_MAX_DELAY_MS', 10_000),
  };
};

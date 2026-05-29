import { sendServersSnapshot } from './backend-service';
import { RconCommandKind, type SquadRconServerInfo } from './rcon/types';
import { withRcon } from './rcon.service';

const RECONCILE_INTERVAL_MS = Number(process.env.SERVERS_RECONCILE_INTERVAL_MS ?? 8_000);
const STALE_AFTER_MS = Number(process.env.SERVERS_STALE_AFTER_MS ?? 15_000);
const RCON_COMMAND_TIMEOUT_MS = Number(process.env.SERVERS_RCON_COMMAND_TIMEOUT_MS ?? process.env.RCON_COMMAND_TIMEOUT_MS ?? 8_000);
const { SERVERS_IDS } = process.env;

type ServersSnapshotTarget = {
  id: number;
  host: string;
  port: number;
  password: string;
};

export type LiveServersSnapshotItem = {
  id: number;
  playerCount: number;
  publicQueue: number;
  reserveQueue: number;
  queueCount: number;
  maxPlayers: number;
  updatedAt: string;
  stale: boolean;
  error: Nullable<string>;
};

export type LiveServersSnapshot = {
  servers: LiveServersSnapshotItem[];
  version: number;
  updatedAt: string;
};

let version = 0;
let reconcileTimer: Nullable<ReturnType<typeof setInterval>> = null;
let reconcileRunning = false;

let snapshot: LiveServersSnapshot = {
  servers: [],
  version: 0,
  updatedAt: '',
};

const assertNumber = (value: unknown, field: string): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`SERVERS_RCON_TARGET_INVALID_${field.toUpperCase()}`);
  }

  return parsed;
};

const readRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`${name}_NOT_SET`);
  }

  return value;
};

const parseServerIds = (): number[] => {
  if (!SERVERS_IDS || SERVERS_IDS.trim().length === 0) {
    throw new Error('SERVERS_IDS_NOT_SET');
  }

  return SERVERS_IDS.split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => assertNumber(value, 'id'));
};

const getServerEnvPrefix = (serverId: number) => `SERVER_${serverId}_RCON`;

const parseServersSnapshotTargets = (): ServersSnapshotTarget[] => {
  return parseServerIds().map((id) => {
    const envPrefix = getServerEnvPrefix(id);

    return {
      id,
      host: readRequiredEnv(`${envPrefix}_HOST`),
      port: assertNumber(readRequiredEnv(`${envPrefix}_PORT`), 'port'),
      password: readRequiredEnv(`${envPrefix}_PASSWORD`),
    };
  });
};

const buildFailedServerSnapshot = (server: ServersSnapshotTarget, error: unknown): LiveServersSnapshotItem => ({
  id: server.id,
  playerCount: 0,
  publicQueue: 0,
  reserveQueue: 0,
  queueCount: 0,
  maxPlayers: 0,
  updatedAt: new Date().toISOString(),
  stale: true,
  error: error instanceof Error ? error.message : String(error),
});

const buildServerSnapshot = (server: ServersSnapshotTarget, serverInfo: SquadRconServerInfo): LiveServersSnapshotItem => {
  const publicQueue = serverInfo.publicQueue ?? 0;
  const reserveQueue = serverInfo.reserveQueue ?? 0;

  return {
    id: server.id,
    playerCount: serverInfo.playerCount ?? 0,
    publicQueue,
    reserveQueue,
    queueCount: publicQueue + reserveQueue,
    maxPlayers: serverInfo.maxPlayers ?? 0,
    updatedAt: new Date().toISOString(),
    stale: false,
    error: null,
  };
};

const getServerSnapshotFromRcon = async (server: ServersSnapshotTarget): Promise<LiveServersSnapshotItem> => {
  return withRcon(async (rcon) => {
    try {
      const serverInfo = await rcon.getServerInfo({ timeoutMs: RCON_COMMAND_TIMEOUT_MS });
      return buildServerSnapshot(server, serverInfo);
    } catch (error) {
      return buildFailedServerSnapshot(server, error);
    } finally {
      await rcon.close().catch(() => undefined);
    }
  }, { kind: RconCommandKind.READ, timeoutMs: RCON_COMMAND_TIMEOUT_MS });
};

export const getServersSnapshot = (): LiveServersSnapshot => {
  const now = Date.now();

  return {
    ...snapshot,
    servers: snapshot.servers.map((server) => {
      const updatedAtMs = Date.parse(server.updatedAt);

      return {
        ...server,
        stale: server.stale || !Number.isFinite(updatedAtMs) || now - updatedAtMs > STALE_AFTER_MS,
      };
    }),
  };
};

export const reconcileServersFromRcon = async () => {
  if (reconcileRunning) { return; }

  reconcileRunning = true;

  try {
    const servers = parseServersSnapshotTargets();
    const serversSnapshot = await Promise.all(servers.map(async (server) => getServerSnapshotFromRcon(server)));

    version += 1;
    snapshot = {
      servers: serversSnapshot,
      version,
      updatedAt: new Date().toISOString(),
    };

    await sendServersSnapshot(getServersSnapshot());
  } finally {
    reconcileRunning = false;
  }
};

export const startServersSnapshotWorker = () => {
  if (reconcileTimer) {
    throw new Error('SERVERS_SNAPSHOT_WORKER_ALREADY_STARTED');
  }

  void reconcileServersFromRcon().catch((error) => {
    console.error('SERVERS_SNAPSHOT_RECONCILE_FAILED', error);
  });
  reconcileTimer = setInterval(() => {
    void reconcileServersFromRcon().catch((error) => {
      console.error('SERVERS_SNAPSHOT_RECONCILE_FAILED', error);
    });
  }, RECONCILE_INTERVAL_MS);
};

export const stopServersSnapshotWorker = () => {
  if (reconcileTimer) {
    clearInterval(reconcileTimer);
    reconcileTimer = null;
  }
};

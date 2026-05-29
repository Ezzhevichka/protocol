import { LiveServerSnapshotSource, SquadInfo, type LiveServerSnapshot, type SquadPlayer } from '@squad-admin/shared';

import { PlayerEvent, PlayerEventType } from 'types/parserEvents';

import { sendPlayersSnapshot } from './backend-service/sendPlayersSnapshot';
import { SquadRconServerInfo } from './rcon/types';
import { getPlayersFromRcon, getServerInfoFromRcon, getSquadsFromRcon } from './server-service';

const PUSH_DEBOUNCE_MS = 300;
const RECONCILE_INTERVAL_MS = Number(process.env.PLAYERS_RECONCILE_INTERVAL_MS ?? 8_000);
const STALE_AFTER_MS = Number(process.env.PLAYERS_STALE_AFTER_MS ?? 15_000);

let version = 0;
let pushTimer: Nullable<ReturnType<typeof setTimeout>> = null;
let reconcileTimer: Nullable<ReturnType<typeof setInterval>> = null;
let reconcileRunning = false;

let snapshot: LiveServerSnapshot = {
  serverName: '',
  serverId: 0,
  players: [],
  squads: [],
  teamOne: '',
  teamTwo: '',
  version: 0,
  server: {
    maxPlayers: 0,
    gameVersion: '',
    playerCount: 0,
    publicQueue: 0,
    reserveQueue: 0,
    matchStartTime: 0,
    matchTimeout: 0,
    currentLayer: '',
    nextLayer: '',
  },
  updatedAt: '',
  source: LiveServerSnapshotSource.LOGS,
  stale: false,
};

const touch = (source: LiveServerSnapshotSource, error: Nullable<string>) => {
  version += 1;
  snapshot = {
    ...snapshot,
    version,
    updatedAt: new Date().toISOString(),
    source,
    stale: false,
    error,
  };
};

const setPlayer = (player: SquadPlayer) => {
  const players = snapshot.players.filter((item) => item.steamId !== player.steamId);

  players.push(player);
  snapshot = {
    ...snapshot,
    players,
  };
};

const removePlayer = (steamId: string) => {
  snapshot = {
    ...snapshot,
    players: snapshot.players.filter((player) => player.steamId !== steamId),
  };
};

const schedulePush = () => {
  if (pushTimer) {
    clearTimeout(pushTimer);
  }

  pushTimer = setTimeout(() => {
    pushTimer = null;
    pushSnapshot().catch(() => undefined);
  }, PUSH_DEBOUNCE_MS);
};

const pushSnapshot = async () => {
  try {
    await sendPlayersSnapshot(getPlayersSnapshot());
  } catch (error) {
    throw new Error(`PLAYERS_SNAPSHOT_PUSH_FAILED: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getPlayersSnapshot = (): LiveServerSnapshot => {
  const updatedAtMs = Date.parse(snapshot.updatedAt);

  return {
    ...snapshot,
    stale: !Number.isFinite(updatedAtMs) || Date.now() - updatedAtMs > STALE_AFTER_MS,
  };
};

export const applyPlayerEvent = (event: PlayerEvent) => {
  if (event.type === PlayerEventType.PLAYER_CONNECTED) {
    setPlayer({
      steamId: event.steamId,
      eosId: event.eosId ?? null,
      name: event.name ?? '',
    });
    touch(LiveServerSnapshotSource.LOGS, null);
    schedulePush();
    return;
  }

  if (event.type === PlayerEventType.PLAYER_DISCONNECTED) {
    removePlayer(event.steamId);
    touch(LiveServerSnapshotSource.LOGS, null);
    schedulePush();
  }
};

export const replacePlayersFromRcon = (input: {
  players: SquadPlayer[];
  squads: SquadInfo[];
  server?: SquadRconServerInfo;
}) => {
  snapshot = {
    ...snapshot,
    players: input.players,
    squads: input.squads,
    teamOne: input.server?.teamOne ?? '',
    teamTwo: input.server?.teamTwo ?? '',
    serverName: input.server?.serverName ?? '',
    serverId: Number(process.env.SERVER_ID),
    version: Date.now(),
    updatedAt: new Date().toISOString(),
    source: LiveServerSnapshotSource.RCON_RECONCILE,
    stale: false,
    error: null,
    server: {
      maxPlayers: input.server?.maxPlayers ?? 0,
      gameVersion: input.server?.gameVersion ?? '',
      playerCount: input.server?.playerCount ?? 0,
      publicQueue: input.server?.publicQueue ?? 0,
      reserveQueue: input.server?.reserveQueue ?? 0,
      matchStartTime: input.server?.matchStartTime ?? 0,
      matchTimeout: input.server?.matchTimeout ?? 0,
      currentLayer: input.server?.currentLayer ?? '',
      nextLayer: input.server?.nextLayer ?? '',
    },
  };
  touch(LiveServerSnapshotSource.RCON_RECONCILE, null);
  schedulePush();
};

export const reconcilePlayersFromRcon = async () => {
  if (reconcileRunning) { return; }

  reconcileRunning = true;

  try {
    const players = await getPlayersFromRcon();
    const squads = await getSquadsFromRcon();
    const server = await getServerInfoFromRcon();
    replacePlayersFromRcon({ players, squads, server });
  } catch (error) {
    snapshot = {
      ...snapshot,
      stale: true,
      error: error instanceof Error ? error.message : String(error),
    };
    schedulePush();
  } finally {
    reconcileRunning = false;
  }
};

export const startPlayersSnapshotWorker = () => {
  if (reconcileTimer) {
    throw new Error('PLAYERS_SNAPSHOT_WORKER_ALREADY_STARTED');
  }

  reconcilePlayersFromRcon().catch(() => undefined);
  reconcileTimer = setInterval(async () => reconcilePlayersFromRcon(), RECONCILE_INTERVAL_MS);
};

export const stopPlayersSnapshotWorker = () => {
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }

  if (reconcileTimer) {
    clearInterval(reconcileTimer);
    reconcileTimer = null;
  }
};

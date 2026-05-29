import { LiveServerSnapshotSource, type LiveServerSnapshot } from '@squad-admin/shared';

import { groupPlayersByTeams } from './player-grouping.service';
import { syncPlayerIdentities } from './player-identity.service';
import { redisClient } from '../lib/redis';

const SNAPSHOT_TTL_SECONDS = 60;
const STALE_AFTER_MS = 15_000;

const memorySnapshots = new Map<number, LiveServerSnapshot>();

function snapshotKey(serverId: number) {
  return `players:snapshot:${serverId}`;
}

function markStale(snapshot: LiveServerSnapshot): LiveServerSnapshot {
  const updatedAtMs = Date.parse(snapshot.updatedAt);

  return {
    ...snapshot,
    stale: !Number.isFinite(updatedAtMs) || Date.now() - updatedAtMs > STALE_AFTER_MS,
  };
}

function emptySnapshot(serverId: number): LiveServerSnapshot {
  return {
    serverId,
    players: [],
    squads: [],
    version: 0,
    updatedAt: new Date(0).toISOString(),
    source: LiveServerSnapshotSource.EMPTY,
    stale: true,
    error: null,
    serverName: '',
    teamOne: '',
    teamTwo: '',
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
  };
}

export async function savePlayersSnapshot(input: LiveServerSnapshot): Promise<LiveServerSnapshot> {
  const snapshot = markStale(input);

  memorySnapshots.set(snapshot.serverId, snapshot);

  if (snapshot.players.length > 0) {
    await syncPlayerIdentities(snapshot.players);
  }

  if (redisClient.isOpen) {
    await redisClient.set(snapshotKey(snapshot.serverId), JSON.stringify(snapshot), {
      EX: SNAPSHOT_TTL_SECONDS,
    });
  }

  return snapshot;
}

export async function getPlayersSnapshot(serverId: number): Promise<LiveServerSnapshot> {
  const memorySnapshot = memorySnapshots.get(serverId);

  if (memorySnapshot) {
    return markStale(memorySnapshot);
  }

  if (redisClient.isOpen) {
    const raw = await redisClient.get(snapshotKey(serverId));

    if (raw) {
      const snapshot = markStale(JSON.parse(raw) as LiveServerSnapshot);
      memorySnapshots.set(serverId, snapshot);
      return snapshot;
    }
  }

  return emptySnapshot(serverId);
}

export async function buildPlayersResponse(serverId: number, serverName: string) {
  const snapshot = await getPlayersSnapshot(serverId);
  const teams = groupPlayersByTeams({
    players: snapshot.players,
    squads: snapshot.squads,
  });

  return {
    serverId,
    serverName,
    playersCount: snapshot.players.length,
    squadsCount: snapshot.squads.length,
    players: snapshot.players,
    server: snapshot.server,
    squads: snapshot.squads,
    teams,
    snapshot: {
      version: snapshot.version,
      updatedAt: snapshot.updatedAt,
      source: snapshot.source,
      stale: snapshot.stale,
      error: snapshot.error ?? null,
    },
  };
}

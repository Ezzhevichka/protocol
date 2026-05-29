export type SquadPlayer = {
  steamId: string;
  eosId?: Nullable<string>;
  name: string;
  knownNames?: string[];
  teamId?: Nullable<string>;
  squadId?: Nullable<string>;
  playerId?: Nullable<string>;
  isLeader?: boolean;
  role?: Nullable<string>;
};

export type SquadInfo = {
  squadId: string;
  teamId: string;
  name: string;
  size: number;
  locked?: boolean;
  creatorName: string;
  creatorEOSId: string;
  creatorSteamId: string;
  teamName: Nullable<string>;
};

export enum LiveServerSnapshotSource {
  LOGS = 'logs',
  RCON_RECONCILE = 'rcon_reconcile',
  MANUAL = 'manual',
  EMPTY = 'empty'
}

export type LiveServerSnapshot = {
  serverName: string;
  serverId: number;
  players: SquadPlayer[];
  squads: SquadInfo[];
  teamOne: string;
  teamTwo: string;
  server: {
    maxPlayers: number;
    gameVersion: string;
    playerCount: number;
    publicQueue: number;
    reserveQueue: number;
    matchStartTime: number;
    matchTimeout: number;
    currentLayer: string;
    nextLayer: string;
  };
  updatedAt: string;
  source: LiveServerSnapshotSource;
  stale: boolean;
  error?: string | null;
  version: number;
};

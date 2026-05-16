export type SquadPlayerRaw = {
  playerID?: string;
  eosID?: string;
  steamID?: string;
  name?: string;
  teamID?: string | number | null;
  squadID?: string | number | null;
  isLeader?: boolean;
  role?: string | null;
  rawLine?: string;
};

export type SquadPlayer = {
  steamId: string;
  eosId?: string | null;
  name: string;
  knownNames?: string[];
  raw?: SquadPlayerRaw;
};

export type SquadInfo = {
  squadId: string;
  teamId: string;
  name: string;
  size?: number | null;
  locked?: boolean;
  raw?: unknown;
};

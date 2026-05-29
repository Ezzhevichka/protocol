export enum PlayerEventType {
  PLAYER_CONNECTED = 'PLAYER_CONNECTED',
  PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED',
  PLAYER_DIED = 'PLAYER_DIED',
  PLAYER_DAMAGED = 'PLAYER_DAMAGED',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  ADMIN_CAMERA = 'ADMIN_CAMERA'
}

export type PlayerEvent = {
  type: PlayerEventType;
  steamId: string;
  raw: string;
  eosId?: string | null;
  name?: string | null;
  message?: string | null;
  damage?: number | null;
  weapon?: string | null;
  attackerSteamId?: string | null;
};

export type PlayerEventParser = (line: string) => Nullable<PlayerEvent>;
export type SquadEventHandler = (event: PlayerEvent) => Promise<void> | void;

export enum HandlePlayerConnectedAction {
  ALLOW = 'ALLOW',
  KICK = 'KICK'
}

export type HandlePlayerConnectedResponse = {
  action: HandlePlayerConnectedAction;
  playerId: number;
  reason?: string;
  banId?: number;
};

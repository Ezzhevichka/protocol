export const SERVERDATA_EXECCOMMAND = 0x02;
export const SERVERDATA_RESPONSE_VALUE = 0x00;
export const SERVERDATA_AUTH = 0x03;
export const SERVERDATA_AUTH_RESPONSE = 0x02;
export const SERVERDATA_CHAT_VALUE = 0x01;

export const MID_PACKET_ID = 0x01;
export const END_PACKET_ID = 0x02;

export type RconConnectionState = 'idle' | 'connecting' | 'authenticating' | 'ready' | 'closing' | 'closed' | 'failed';

export type RconConfig = {
  serverId: number;
  host: string;
  port: number;
  password: string;
  connectTimeoutMs: number;
  commandTimeoutMs: number;
  maxPacketBytes: number;
  maxQueueSize: number;
  reconnectBaseDelayMs: number;
  reconnectMaxDelayMs: number;
};

export type DecodedRconPacket = {
  size: number;
  id: number;
  count: number;
  type: number;
  body: string;
};

export type RconExecuteOptions = {
  timeoutMs?: number;
  kind?: RconCommandKind;
  label?: string;
};

export type RconHealth = {
  ok: boolean;
  state: RconConnectionState;
  connected: boolean;
  authenticated: boolean;
  pending: number;
  readQueue: number;
  mutationQueue: number;
  lastConnectedAt: string | null;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  lastError: string | null;
};

export type SquadRconPlayer = {
  playerID?: string;
  steamID: string;
  eosID?: string | null;
  name: string;
  teamID?: string;
  squadID?: string;
  isLeader?: boolean;
  role?: string;
};

export type SquadRconSquad = {
  squadID: string;
  teamID: string;
  teamName?: string;
  squadName: string;
  size: string;
  locked?: boolean;
  creatorName?: string;
  creatorSteamID?: string;
  creatorEOSID?: string;
};

export type SquadRconServerInfo = {
  serverName: string;
  maxPlayers: number;
  gameVersion: string;
  playerCount: number;
  publicQueue: number;
  reserveQueue: number;
  matchStartTime: number;
  matchTimeout: number;
  currentLayer: string;
  nextLayer: string;
  teamOne: string;
  teamTwo: string;
};

export enum RconCommand {
  LIST_PLAYERS = 'ListPlayers',
  LIST_SQUADS = 'ListSquads',
  SHOW_SERVER_INFO = 'ShowServerInfo',
  SHOW_CURRENT_MAP = 'ShowCurrentMap',
  SHOW_NEXT_MAP = 'ShowNextMap',
  SHOW_NEXT_LAYER = 'ShowNextLayer'
}

export enum RconCommandKind {
  READ = 'read',
  MUTATION = 'mutation',
  RAW = 'raw'
}

export type RconApi = {
  execute(command: string, options?: RconExecuteOptions): Promise<string>;
  read(command: string, options?: RconExecuteOptions): Promise<string>;
  mutate(command: string, options?: RconExecuteOptions): Promise<string>;
  getListPlayers(options?: RconExecuteOptions): Promise<SquadRconPlayer[]>;
  getListSquads(options?: RconExecuteOptions): Promise<SquadRconSquad[]>;
  getServerInfo(options?: RconExecuteOptions): Promise<SquadRconServerInfo>;
  health(): RconHealth;
  close(): Promise<void>;
};

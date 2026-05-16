export type SquadEvent = PlayerConnectedEvent | PlayerDisconnectedEvent;

export type PlayerConnectedEvent = {
  type: "PLAYER_CONNECTED";
  steamId: string;
  eosId?: string | null;
  name?: string | null;
  raw: string;
};

export type PlayerDisconnectedEvent = {
  type: "PLAYER_DISCONNECTED";
  steamId: string;
  raw: string;
};

export type SquadEventParser = (line: string) => SquadEvent | null;
export type SquadEventHandler = (event: SquadEvent) => Promise<void> | void;

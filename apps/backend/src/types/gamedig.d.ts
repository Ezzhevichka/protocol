declare module "gamedig" {
  interface QueryOptions {
    type: string;
    host: string;
    port: number;
    maxAttempts?: number;
    attemptTimeout?: number;
    socketTimeout?: number;
  }

  interface Player {
    name?: string;
    score?: number;
    time?: number;
    [key: string]: unknown;
  }

  interface QueryResult {
    name: string;
    map: string;
    password: boolean;
    maxplayers: number;
    players: Player[];
    bots: Player[];
    connect: string;
    ping: number;
    raw?: Record<string, unknown>;
  }

  function query(options: QueryOptions): Promise<QueryResult>;

  export = { query };
}

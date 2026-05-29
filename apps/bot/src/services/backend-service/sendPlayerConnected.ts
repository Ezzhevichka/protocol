import { HandlePlayerConnectedResponse } from 'types/parserEvents';

import { client } from './client';

export type HandlePlayerConnectedInput = {
  steamId: string;
  serverId: number;
  eosId?: Nullable<string>;
  name?: Nullable<string>;
};

export async function sendPlayerConnected(input: HandlePlayerConnectedInput): Promise<HandlePlayerConnectedResponse> {
  const body = {
    serverId: process.env.SERVER_ID,
    steamId: input.steamId,
    eosId: input.eosId ?? null,
    name: input.name ?? null,
    connectedAt: new Date().toISOString(),
  };
  const response = await client.post<HandlePlayerConnectedResponse>('/internal/squad/events/player-connected', body, { signal: AbortSignal.timeout(2_000) });

  return response.data;
}

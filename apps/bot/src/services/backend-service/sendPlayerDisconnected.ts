import { client } from './client';

export const sendPlayerDisconnected = async (input: { serverId: number; steamId: string }) => client.post('/internal/events/player-disconnected', input);

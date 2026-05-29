import { getPlayersSnapshot } from '../server-info-snapshot.service';

export const getCachedPlayer = (steamId: string) => getPlayersSnapshot().players.find((player) => player.steamId === steamId) ?? null;

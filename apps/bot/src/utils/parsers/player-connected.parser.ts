import { PlayerEvent, PlayerEventType } from 'types/parserEvents';

export function parsePlayerConnected(line: string): Nullable<PlayerEvent> {
  if (!/PostLogin: NewPlayer:/i.test(line)) { return null; }
  const steamId = line.match(/steam:\s*(7656119\d{10})/i)?.[1] ?? line.match(/\b(7656119\d{10})\b/)?.[1];
  if (!steamId) { return null; }
  const eosId = line.match(/EOS:\s*([a-f0-9]+)/i)?.[1] ?? null;
  return { type: PlayerEventType.PLAYER_CONNECTED, steamId, eosId, raw: line };
}

import { PlayerEvent, PlayerEventType } from 'types/parserEvents';

export function parsePlayerDied(line: string): Nullable<PlayerEvent> {
  if (!/Died|Wound|Killed/i.test(line)) { return null; }

  const steamId = line.match(/victim.*?(7656119\d{10})/i)?.[1] ?? line.match(/\b(7656119\d{10})\b/)?.[1];
  if (!steamId) { return null; }

  const attackerSteamId = line.match(/attacker.*?(7656119\d{10})/i)?.[1] ?? null;
  const weapon = line.match(/weapon[:=]\s*([^|]+)/i)?.[1]?.trim() ?? null;

  return { type: PlayerEventType.PLAYER_DIED, steamId, attackerSteamId, weapon, raw: line };
}

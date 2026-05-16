import type { SquadEvent } from "../../core/events/types";

export function parsePlayerDisconnected(line: string): SquadEvent | null {
  const looksLikeDisconnect = /Logout|Close|Disconnected|Destroying/i.test(line);
  if (!looksLikeDisconnect) return null;
  const steamId = line.match(/steam:\s*(7656119\d{10})/i)?.[1] ?? line.match(/\b(7656119\d{10})\b/)?.[1];
  if (!steamId) return null;
  return { type: "PLAYER_DISCONNECTED", steamId, raw: line };
}

import { PlayerEvent, PlayerEventType } from 'types/parserEvents';

export function parsePlayerChat(line: string): Nullable<PlayerEvent> {
  if (!/Chat/i.test(line)) { return null; }

  const steamId = line.match(/steam:\s*(7656119\d{10})/i)?.[1] ?? line.match(/\b(7656119\d{10})\b/)?.[1];
  if (!steamId) { return null; }

  const name = line.match(/(?:Name|Player):\s*([^|]+)/i)?.[1]?.trim() ?? null;
  const message = line.match(/Message:\s*(.+)$/i)?.[1]?.trim() ?? line.match(/:\s*([^:]+)$/)?.[1]?.trim() ?? null;

  return { type: PlayerEventType.CHAT_MESSAGE, steamId, name, message, raw: line };
}

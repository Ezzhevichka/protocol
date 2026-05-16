// import type { SquadPlayer } from "@squad-admin/shared";

export function parsePlayers(raw: string): any[] {
  return raw
    .split(/\r?\n/)
    .map(parsePlayerLine)
    .filter((player): player is any => player !== null);
}

function parsePlayerLine(line: string): any | null {
  const trimmed = line.trim();

  if (!trimmed) {
    return null;
  }

  const steamMatch = trimmed.match(/\b(7656119\d{10})\b/);

  if (!steamMatch) {
    return null;
  }

  const steamId = steamMatch[1];

  const name =
    trimmed.match(/Name:\s*([^|]+)/i)?.[1]?.trim() ??
    trimmed.match(/Name=([^|]+)/i)?.[1]?.trim() ??
    trimmed.match(/PlayerName:\s*([^|]+)/i)?.[1]?.trim() ??
    "Unknown";

  return {
    steamId,
    name,
    raw: {
      steamID: steamId,
      name,
      rawLine: trimmed,
    },
  };
}
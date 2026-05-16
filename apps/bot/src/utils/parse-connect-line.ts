export type PlayerConnectEvent = {
  steamId: string;
  eosId?: string;
  name?: string;
  raw: string;
};

export function parsePlayerConnectLine(line: string): PlayerConnectEvent | null {
  if (!/PostLogin: NewPlayer:/i.test(line)) return null;

  const steamId = line.match(/steam:\s*(7656119\d{10})/i)?.[1] ?? line.match(/\b(7656119\d{10})\b/)?.[1];
  if (!steamId) return null;

  const eosId = line.match(/EOS:\s*([a-f0-9]+)/i)?.[1];

  return { steamId, eosId, raw: line };
}

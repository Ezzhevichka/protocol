import type { SquadRconPlayer, SquadRconServerInfo, SquadRconSquad } from './types';

const getPair = (line: string, names: string[]) => {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[|,])\\s*${escaped}\\s*:?\\s*([^|,]+)`, 'i');
    const value = line.match(regex)?.[1]?.trim();
    if (value) { return value; }
  }
  return undefined;
};

const toBool = (value?: string) => value ? /true|yes|1|locked/i.test(value) : undefined;
const toInt = (value?: string) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const parseListPlayers = (raw: string): SquadRconPlayer[] => {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const steamID = getPair(line, ['SteamID', 'Steam ID', 'steam']) ?? line.match(/\b(7656119\d{10})\b/)?.[1];
      if (!steamID) { return null; }

      const player: SquadRconPlayer = {
        playerID: getPair(line, ['ID', 'PlayerID', 'Player ID']),
        steamID,
        eosID: getPair(line, ['EOSID', 'EOS ID', 'EOS']) ?? null,
        name: getPair(line, ['Name']) ?? '',
        teamID: getPair(line, ['Team ID', 'TeamID', 'Team']),
        squadID: getPair(line, ['Squad ID', 'SquadID', 'Squad']),
        isLeader: toBool(getPair(line, ['Is Leader', 'Leader'])),
        role: getPair(line, ['Role']),
      };

      return player;
    })
    .filter((player): player is SquadRconPlayer => Boolean(player));
};

export const parseListSquads = (raw: string): SquadRconSquad[] => {
  let currentTeamID = '';
  let currentTeamName = '';
  const squads: SquadRconSquad[] = [];

  for (const line of raw.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
    const teamHeader = line.match(/^Team\s+ID\s*:?\s*(\d+)\s*(?:\(([^)]+)\))?/i)
            ?? line.match(/^Team\s*(\d+)\s*:?\s*(.*)$/i);

    if (teamHeader) {
      currentTeamID = teamHeader[1] ?? currentTeamID;
      currentTeamName = (teamHeader[2] ?? '').trim() || currentTeamName;
      continue;
    }

    const squadID = getPair(line, ['ID', 'Squad ID', 'SquadID']);
    const squadName = getPair(line, ['Name', 'Squad Name', 'SquadName']);

    if (!squadID || !squadName) { continue; }

    squads.push({
      squadID,
      teamID: getPair(line, ['Team ID', 'TeamID']) ?? currentTeamID,
      teamName: getPair(line, ['Team Name', 'TeamName']) ?? currentTeamName,
      squadName,
      size: getPair(line, ['Size']) ?? '0',
      locked: toBool(getPair(line, ['Locked'])),
      creatorName: getPair(line, ['Creator Name', 'CreatorName']),
      creatorSteamID: getPair(line, ['Creator Steam ID', 'CreatorSteamID', 'Creator SteamID']),
      creatorEOSID: getPair(line, ['Creator EOS ID', 'CreatorEOSID', 'Creator EOSID']),
    });
  }

  return squads;
};

export const parseServerInfo = (raw: string): SquadRconServerInfo => {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const joined = lines.join(' | ');
  const read = (...names: string[]) => getPair(joined, names) ?? getPair(lines.find((line) => names.some((name) => line.toLowerCase().includes(name.toLowerCase()))) ?? '', names);

  return {
    serverName: read('ServerName', 'Server Name', 'Name') ?? process.env.SERVER_NAME ?? '',
    maxPlayers: toInt(read('MaxPlayers', 'Max Players')),
    gameVersion: read('GameVersion', 'Game Version') ?? '',
    playerCount: toInt(read('PlayerCount', 'Player Count', 'Players')),
    publicQueue: toInt(read('PublicQueue', 'Public Queue')),
    reserveQueue: toInt(read('ReserveQueue', 'Reserve Queue')),
    matchStartTime: toInt(read('MatchStartTime', 'Match Start Time')),
    matchTimeout: toInt(read('MatchTimeout', 'Match Timeout')),
    currentLayer: read('CurrentLayer', 'Current Layer', 'Map') ?? '',
    nextLayer: read('NextLayer', 'Next Layer') ?? '',
    teamOne: read('TeamOne', 'Team One', 'Team 1') ?? '',
    teamTwo: read('TeamTwo', 'Team Two', 'Team 2') ?? '',
  };
};

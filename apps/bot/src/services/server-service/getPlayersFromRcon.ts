import { SquadPlayer } from '@squad-admin/shared';

import { RconCommandKind } from 'services/rcon';

import { withRcon } from '../rcon.service';

export const getPlayersFromRcon = async (): Promise<SquadPlayer[]> => {
  return withRcon(async (rcon) => {
    const playersRaw = await rcon.getListPlayers({ timeoutMs: 3_000 });
    return playersRaw
      .filter((player) => player.steamID)
      .map((player) => ({
        steamId: player.steamID,
        eosId: player.eosID ?? null,
        name: player.name,
        teamId: player.teamID,
        squadId: player.squadID,
        playerId: player.playerID,
        isLeader: player.isLeader,
        role: player.role,
      }));
  }, { kind: RconCommandKind.READ, timeoutMs: 3_000 });
};

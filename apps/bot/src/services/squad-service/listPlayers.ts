import type { SquadPlayer } from '@squad-admin/shared';
import type { TPlayer, TSquad } from 'squad-rcon';

import { withRcon } from '../rcon.service';

function normalizePlayer(player: TPlayer): SquadPlayer {
    return {
        steamId: player.steamID,
        eosId: player.eosID,
        name: player.name,
        raw: {
            steamID: player.steamID,
            eosID: player.eosID,
            name: player.name,
            teamID: player.teamID,
            squadID: player.squadID,
            isLeader: player.isLeader,
            role: player.role,
        },
    };
}

export const listPlayers = async () =>
    withRcon(async (rcon) => {
        const playersRaw = await rcon.getListPlayers();
        const squadsRaw = await rcon.getListSquads();
        const server = await rcon.getServerInfo();

        const players = playersRaw.map(normalizePlayer).filter((player) => player.steamId);
        const squads = squadsRaw.map((squad: TSquad) => ({
            squadId: squad.squadID,
            teamId: squad.teamID,
            name: squad.squadName,
            size: squad.size,
            locked: String(squad.locked).toLowerCase() === 'true',
        }));

        return { raw: null, players, squads, server };
    });

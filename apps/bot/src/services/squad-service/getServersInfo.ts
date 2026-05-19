import type { SquadPlayer } from '@squad-admin/shared';
import type { TPlayer, TSquad } from 'squad-rcon';

import { withRcon } from '../rcon.service';

function normalizePlayer(player: TPlayer): SquadPlayer {
    return {
        steamId: player.steamID,
        eosId: player.eosID,
        name: player.name,
    };
}

export const listPlayers = async () => withRcon(async (rcon) => {
    try {
        const [playersRaw, squadsRaw] = await Promise.all([
            rcon.getListPlayers(),
            rcon.getListSquads(),
        ]);
        const server = await rcon.getServerInfo();

        const players = playersRaw.map(normalizePlayer).filter((player) => player.steamId);
        const squads = squadsRaw.map((squad: TSquad) => ({
            squadId: squad.squadID,
            teamId: squad.teamID,
            name: squad.squadName,
            size: squad.size,
            locked: squad.locked,
        }));

        return { raw: null, players, squads, server };
    } finally {
        await rcon.close();
    }
});

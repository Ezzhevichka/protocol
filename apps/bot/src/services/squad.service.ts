import type { SquadPlayer } from '@squad-admin/shared';
import type { TPlayer } from 'squad-rcon';

import { withRcon } from './rcon.service';

function normalizePlayer(player: TPlayer): SquadPlayer {
    return {
        steamId: player.steamID,
        eosId: player.eosID,
        name: player.name,
    };
}

export async function listPlayers() {
    return withRcon(async (rcon) => {
        try {
            const [playersRaw, squadsRaw] = await Promise.all([
                rcon.getListPlayers(),
                rcon.getListSquads(),
            ]);
            const server = await rcon.getServerInfo();

            const players = playersRaw.map(normalizePlayer).filter((player) => player.steamId);
            const squads = squadsRaw.map((squad: any) => ({
                squadId: String(squad.squadID ?? squad.squadId ?? squad.id ?? ''),
                teamId: String(squad.teamID ?? squad.teamId ?? 'unknown'),
                name: String(squad.name ?? squad.squadName ?? `Squad ${squad.squadID ?? squad.id ?? ''}`),
                size: squad.size ?? squad.playerCount ?? null,
                locked: Boolean(squad.locked ?? false),
                raw: squad,
            }));

            return { raw: null, players, squads, server };
        } finally {
            await rcon.close();
        }
    });
}

export async function kickPlayer(steamId: string, reason: string) {
    return withRcon(async (rcon) => {
        const sanitizedReason
            = reason
                .replace(/[\r\n"]/g, ' ')
                .trim()
                .slice(0, 80) || 'Banned';
        const command = `AdminKick ${steamId} ${sanitizedReason}`;
        const result = await rcon.execute(command);

        return { ok: true, command, result };
    });
}

export async function sendCommand(command: string) {
    if (/AdminBan/i.test(command)) {
        const error = new Error('ADMIN_BAN_DISABLED');
        error.name = 'ADMIN_BAN_DISABLED';
        throw error;
    }

    return withRcon(async (rcon) => {
        try {
            const result = await rcon.execute(command);
            return { ok: true, result };
        } finally {
            await rcon.close();
        }
    });
}

export async function warnPlayer(steamId: string, message: string) {
    return withRcon(async (rcon) => {
        try {
            const safeMessage = message
                .replace(/[\r\n"]/g, ' ')
                .trim()
                .slice(0, 180);

            const result = await rcon.execute(`AdminWarn ${steamId} ${safeMessage}`);

            return {
                ok: true,
                result,
            };
        } finally {
            await rcon.close();
        }
    });
}

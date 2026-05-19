import { BanStatus, BanTargetType } from '@squad-admin/database';

import { normalizeEosId, normalizeSteamId } from './normalize';

export function activeBanWhere() {
    return {
        status: BanStatus.ACTIVE,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    };
}

export function banMatchesPlayer(
    ban: { targetType: BanTargetType; normalizedTargetValue: string },
    player: any
) {
    if (ban.targetType === BanTargetType.STEAM_ID) {
        return ban.normalizedTargetValue === normalizeSteamId(player.steamId);
    }

    if (ban.targetType === BanTargetType.EOS_ID) {
        return (
            Boolean(player.eosId) && ban.normalizedTargetValue === normalizeEosId(player.eosId || '')
        );
    }

    return false;
}

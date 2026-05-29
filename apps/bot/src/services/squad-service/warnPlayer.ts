import { RconCommandKind } from 'services/rcon';
import { sanitizeReason } from 'utils/sanitazers';

import { withRcon } from '../rcon.service';

export const warnPlayer = async (steamId: string, message: string) => {
  return withRcon(async (rcon) => {
    const sanitizedReason = sanitizeReason(message) || 'БЕЗ ПРИЧИНЫ';
    const command = `AdminWarn ${steamId} ${sanitizedReason}`;
    const result = await rcon.mutate(command, { timeoutMs: 8_000, label: `AdminWarn:${steamId}` });

    return { ok: true, command, result };
  }, { kind: RconCommandKind.MUTATION, timeoutMs: 8_000 });
};

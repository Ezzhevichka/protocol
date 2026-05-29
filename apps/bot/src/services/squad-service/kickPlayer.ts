import { RconCommandKind } from 'services/rcon';
import { sanitizeReason } from 'utils/sanitazers';

import { withRcon } from '../rcon.service';

export const kickPlayer = async (steamId: string, reason?: string) => {
  return withRcon(async (rcon) => {
    const sanitizedReason = reason ? sanitizeReason(reason) : 'БЕЗ ПРИЧИНЫ';
    const command = `AdminKick ${steamId} ${sanitizedReason}`;
    const result = await rcon.mutate(command, { timeoutMs: 8_000, label: `AdminKick:${steamId}` });

    return { ok: true, command, result };
  }, { kind: RconCommandKind.MUTATION, timeoutMs: 8_000 });
};

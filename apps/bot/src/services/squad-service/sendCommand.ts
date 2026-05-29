import { RconCommandKind } from 'services/rcon';

import { withRcon } from '../rcon.service';

const forbiddenCommandPattern = /^\s*AdminBan\b/i;
const readCommandPattern = /^\s*(ListPlayers|ListSquads|ShowServerInfo|ShowCurrentMap|ShowNextMap|ShowNextLayer|ListCommands|AdminListDisconnectedPlayers)\b/i;

export const sendCommand = async (command: string) => {
  if (forbiddenCommandPattern.test(command)) {
    const error = new Error('НЕЛЬЗЯ ИСПОЛЬЗОВАТЬ КОМАНДУ ADMINBAN');
    error.name = 'ADMIN_BAN_DISABLED';
    throw error;
  }

  return withRcon(async (rcon) => {
    const kind = readCommandPattern.test(command) ? RconCommandKind.READ : RconCommandKind.MUTATION;
    const result = await rcon.execute(command, { kind, timeoutMs: kind === RconCommandKind.READ ? 5_000 : 10_000 });
    return { ok: true, result };
  });
};

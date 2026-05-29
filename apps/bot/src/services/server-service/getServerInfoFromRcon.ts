import { RconCommandKind, SquadRconServerInfo } from 'services/rcon';

import { withRcon } from '../rcon.service';

export const getServerInfoFromRcon = async (): Promise<SquadRconServerInfo | undefined> => {
  return withRcon(async (rcon) => rcon.getServerInfo({ timeoutMs: 3_000 }), { kind: RconCommandKind.READ, timeoutMs: 3_000 });
};

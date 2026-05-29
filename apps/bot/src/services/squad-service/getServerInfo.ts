import { RconCommandKind } from 'services/rcon';

import { withRcon } from '../rcon.service';

export const getServerInfo = async () => {
  return withRcon(async (rcon) => rcon.getServerInfo({ timeoutMs: 5_000 }), {
    kind: RconCommandKind.READ,
    timeoutMs: 5_000,
  });
};

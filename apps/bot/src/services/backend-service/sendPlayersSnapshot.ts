import { LiveServerSnapshot } from '@squad-admin/shared';

import { client } from './client';

export const sendPlayersSnapshot = async (snapshot: LiveServerSnapshot) => {
  await client.post('/internal/players/snapshot', snapshot);
};

import { client } from './client';

import type { LiveServersSnapshot } from '../servers-snapshot.service';

export const sendServersSnapshot = async (snapshot: LiveServersSnapshot) => {
  await client.post('/internal/servers/snapshot', snapshot);
};

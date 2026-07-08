import { withRcon } from '../rcon';
import { parseSnapshot } from '@/utils';
import type { Snapshot } from '@protocol/types';
import { getRedisClient } from '../redis';

type ServerSnapshot = {
	snapshot: Snapshot;
	createdAt: Date;
};

let isSnapshotCollecting = false;

const unwrapSettledResult = <T>(result: PromiseSettledResult<T>): Optional<T> => {
	if (result.status === 'rejected') throw result.reason;
	return result.value;
};

export async function collectServerSnapshot(): Promise<ServerSnapshot> {
	return withRcon(
		async (rcon) => {
			const [playersResult, squadsResult, serverInfoResult] = await Promise.allSettled([rcon.getListPlayers(), rcon.getListSquads(), rcon.getServerInfo()] as const);

			const players = unwrapSettledResult(playersResult) ?? [];
			const squads = unwrapSettledResult(squadsResult) ?? [];
			const serverInfoRaw = unwrapSettledResult(serverInfoResult);

			if (!serverInfoRaw) {
				throw new Error('Failed to collect server info for snapshot');
			}

			const snapshot = parseSnapshot(players, squads, serverInfoRaw);

			const client = await getRedisClient();

			await client.set(`server:${snapshot.id}:snapshot`, JSON.stringify(snapshot), { EX: 6000 });
			console.log('snapshot saved');

			return { snapshot, createdAt: new Date() };
		}, { resetOnError: true }
	);
}

export async function collectServerSnapshotTick(): Promise<Nullable<ServerSnapshot>> {
	if (isSnapshotCollecting) return null;
  
	isSnapshotCollecting = true;
  
	try {
		return await collectServerSnapshot();
	} finally {
		isSnapshotCollecting = false;
	}
}

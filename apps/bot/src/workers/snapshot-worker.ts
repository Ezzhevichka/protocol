// import type { RedisClientType } from 'redis';
// import { collectServerSnapshotTick } from '../services/snapshot/create-snapshot';

// const SNAPSHOT_INTERVAL_MS = 5000;
// const SNAPSHOT_TTL_SECONDS = 15;

// export function startSnapshotWorker(redis: RedisClientType): NodeJS.Timeout {
// 	return setInterval(() => {
// 		void collectAndStoreSnapshot(redis);
// 	}, SNAPSHOT_INTERVAL_MS);
// }

// async function collectAndStoreSnapshot(redis: RedisClientType): Promise<void> {
// 	const snapshot = await collectServerSnapshotTick();

// 	if (!snapshot) {
// 		return;
// 	}

// 	await redis.set(
// 		`server:${snapshot.serverId}:snapshot`,
// 		JSON.stringify(snapshot),
// 		{
// 			EX: SNAPSHOT_TTL_SECONDS,
// 		}
// 	);
// }

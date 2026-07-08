import { createRedisClient, RedisClient } from '@protocol/redis';

let client: Nullable<RedisClient> = null;
let connectionPromise: Nullable<Promise<RedisClient>> = null;

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const connectRedisClient = async () => getRedisClient();

export const getRedisClient = async (): Promise<RedisClient> => {
	if (client?.isReady) {
		return client;
	}

	if (connectionPromise) {
		return connectionPromise;
	}

	const newClient = createRedisClient(url);

	connectionPromise = newClient.connect()
		.then(() => {
			client = newClient;
			return client;
		})
		.finally(() => {
			connectionPromise = null;
		});

	return connectionPromise;
};

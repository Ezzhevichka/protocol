import { createClient, RedisClientType } from 'redis';

export const createRedisClient = (url: string): RedisClientType => {
	const client = createClient({ url });
	return client;
};

export type RedisClient = ReturnType<typeof createRedisClient>;

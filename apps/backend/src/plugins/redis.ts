import fp from 'fastify-plugin';
import { createRedisClient } from '@protocol/redis';
import { env } from '@/config';

export const redisPlugin = fp(async (app) => {
	const client = createRedisClient(env.redisUrl);
	await client.connect();

	app.decorate('redis', client);

	app.addHook('onClose', async () => {
		if (client.isOpen) {
			await client.quit();
		}
	});
});

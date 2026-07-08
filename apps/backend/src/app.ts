import cors from '@fastify/cors';
import Fastify from 'fastify';
import { getRedisClient } from './redis';

export function buildBackendApp() {
	const app = Fastify({ logger: true });

	app.register(cors, { origin: true, credentials: true });

	app.get('/health', async () => ({ service: 'backend', status: 'ok' }));

	app.get('/servers', async (req, res) => {
		const redis = await getRedisClient();
		const servers = await redis.keys('server:*:snapshot');
		const serversData = await Promise.all(servers.map(async (server) => {
			const snapshot = await redis.get(server);
			if (!snapshot) return null;
			return {
				serverId: server.split(':')[1],
				snapshot: JSON.parse(snapshot),
			};
		}));
		return res.status(200).send(serversData);
	});

	app.get('/servers/:serverId', async (req, res) => {
		const { serverId } = req.params as { serverId: string };
		const redis = await getRedisClient();
		const snapshot = await redis.get(`server:${serverId}:snapshot`);
		return res.status(200).send(snapshot);
	});

	return app;
}

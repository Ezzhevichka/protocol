import cors from '@fastify/cors';
import Fastify from 'fastify';
import { getRedisClient } from './redis';
import type { Snapshot } from '@protocol/types';

type ServersData = Nullable<Snapshot>;

const parseStoredSnapshot = (raw: string | null): ServersData => {
	if (!raw) return null;
	return JSON.parse(raw) as Snapshot;
};

export function buildBackendApp() {
	const app = Fastify({ logger: true });

	app.register(cors, { origin: true, credentials: true });

	app.get('/health', async () => ({ service: 'backend', status: 'ok' }));

	app.get('/servers', async (_, res) => {
		const redis = await getRedisClient();
		const servers = await redis.keys('server:*:snapshot');
		const serversData = (await Promise.all(
			servers.map(async (server) => parseStoredSnapshot(await redis.get(server)))
		))
			.filter((snapshot): snapshot is Snapshot => snapshot !== null)
			.sort((a, b) => a.id.localeCompare(b.id));
		return res.status(200).send(serversData);
	});

	app.get('/servers/:serverId', async (req, res) => {
		const { serverId } = req.params as { serverId: string };
		const redis = await getRedisClient();
		const snapshot = parseStoredSnapshot(await redis.get(`server:${serverId}:snapshot`));
		return res.status(200).send(snapshot);
	});

	return app;
}

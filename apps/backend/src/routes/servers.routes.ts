import type { FastifyInstance } from 'fastify';
import type { Snapshot } from '@protocol/types';
import { sseHandler } from '@/services/watchStream';

type ServersData = Nullable<Snapshot>;

const parseStoredSnapshot = (raw: string | null): ServersData => {
	if (!raw) return null;
	return JSON.parse(raw) as Snapshot;
};

export async function serverRoutes(app: FastifyInstance): Promise<void> {
	app.get('/health', async () => ({ service: 'backend', status: 'ok' }));

	app.get('/servers', async (_, reply) => {
		const servers = await app.redis.keys('server:*:snapshot');
		const serversData = (await Promise.all(
			servers.map(async (server) => parseStoredSnapshot(await app.redis.get(server)))
		))
			.filter((snapshot): snapshot is Snapshot => snapshot !== null)
			.sort((a, b) => a.id.localeCompare(b.id));

		return reply.status(200).send(serversData);
	});

	app.get('/servers/:serverId', async (request, reply) => {
		const { serverId } = request.params as { serverId: string };
		const snapshot = parseStoredSnapshot(
			await app.redis.get(`server:${serverId}:snapshot`)
		);
		return reply.status(200).send(snapshot);
	});

	app.get('/stream/:serverId', sseHandler);
}

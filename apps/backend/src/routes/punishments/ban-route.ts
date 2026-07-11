import { ApiRoutes } from '@/config';
import { banPlayer } from '@/services';
import { PunishmentRequest } from '@protocol/types';
import { FastifyInstance, FastifyRequest } from 'fastify';

export const banRoute = async (app: FastifyInstance) => {
	app.post('/punishments/ban', async (request: FastifyRequest<{ Body: PunishmentRequest, Headers: { 'content-type': string } }>, reply) => {
		if (request.headers['content-type'] !== 'application/json') {
			console.log('[banRoute]', request.headers);
			return reply.status(400).send({ error: 'Invalid content type' });
		}

		const { victimId, authorId, reason, description, serverId, until, punishmentType } = request.body;
		const success = await banPlayer({ victimId, authorId, reason, description, until, serverId, punishmentType });

		if (!success) return reply.status(500).send({ error: 'Failed to ban player' });

		return reply.status(200).send({ success: true });
	});
};

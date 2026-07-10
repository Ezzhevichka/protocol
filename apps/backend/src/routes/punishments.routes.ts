import { banPlayer } from '@/services';
import type { FastifyInstance } from 'fastify';

export const punishmentsRoutes = async (app: FastifyInstance): Promise<void> => {

	app.post('/punishments/ban', async (request, reply) => {
		const { steamId, authorId, reason, serverNumberId } = request.body as { steamId: string, authorId: string, reason: string, serverNumberId: number };
		const success = await banPlayer({ steamId, authorId, reason, serverNumberId });
		if (!success) return reply.status(500).send({ error: 'Failed to ban player' });
		return reply.status(200).send({ success: true });
	});

};

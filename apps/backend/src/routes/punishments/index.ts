import type { FastifyInstance } from 'fastify';
import { banRoute } from './ban-route';

export const punishmentsRoutes = async (app: FastifyInstance): Promise<void> => {
	await banRoute(app);
};

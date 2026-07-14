import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';
import { env } from '@/config/env';
import { cookiePlugin } from '@/plugins/cookie';
import { redisPlugin } from '@/plugins/redis';
import { passportPlugin } from '@/plugins/passport';
import { authRoutes, punishmentsRoutes, rolesRoutes, serverRoutes } from '@/routes';

export const buildApp = async (): Promise<FastifyInstance> => {
	const app = Fastify({ logger: true });

	await app.register(cors, {
		origin: true,
		credentials: true,
	});

	await app.register(authRoutes);
	await app.register(punishmentsRoutes);
	await app.register(rolesRoutes);

	await app.register(cookiePlugin);
	await app.register(redisPlugin);
	await app.register(passportPlugin);

	await app.register(serverRoutes);

	return app;
};

export const startApp = async (): Promise<FastifyInstance> => {
	const app = await buildApp();

	await app.listen({
		host: env.apiHost,
		port: env.apiPort,
	});

	return app;
};

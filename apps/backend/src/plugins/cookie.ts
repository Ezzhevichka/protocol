import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';
import { env } from '@/config';

export const cookiePlugin = fp(async (app) => {
	await app.register(cookie, {
		secret: env.cookieSecret,
		parseOptions: {},
	});
});

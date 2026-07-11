import { FastifyInstance } from 'fastify';
import { ApiRoutes, env, SESSION_TOKEN_NAME } from '@/config';
import { deleteSession } from '@/services';

export const authLogoutRoute = async (app: FastifyInstance) => {
	app.get(ApiRoutes.AUTH_LOGOUT, async (request, reply) => {
		const raw = request.cookies[SESSION_TOKEN_NAME];
		if (raw) {
			const unsigned = reply.unsignCookie(raw);
			if (unsigned.valid && unsigned.value) {
				await deleteSession(app.redis, unsigned.value);
			}
		}

		reply.clearCookie(SESSION_TOKEN_NAME, { path: '/' });
		reply.redirect(`${env.frontendUrl}/`);
	});
};

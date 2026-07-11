import { FastifyInstance } from 'fastify';
import { optionalAuthenticate } from '@/middleware';
import { toMeResponse } from '@/services';
import { ApiRoutes } from '@/config';

export const authMeRoute = async (app: FastifyInstance) => {
	app.get(ApiRoutes.AUTH_ME, { preHandler: optionalAuthenticate }, async (request) => ({
		user: request.authUser ? toMeResponse(request.authUser) : null,
		isAdmin: false,
	}));
};

import { FastifyInstance } from 'fastify';
import { ApiRoutes, createSteamStrategyForState, env } from '@/config';
import { consumeSteamState } from '@/services';
import { handleSteamCallback } from '@/utils';

export const authSteamCallbackRoute = async (app: FastifyInstance) => {
	app.get(ApiRoutes.AUTH_STEAM_CALLBACK, async (request, reply) => {
		const state = (request.query as { state?: string }).state;
		if (!state) {
			reply.code(400).send({ error: 'Missing state parameter' });
			return;
		}

		const isValidState = await consumeSteamState(app.redis, state);
		if (!isValidState) {
			reply.code(403).send({ error: 'Invalid or expired state' });
			return;
		}

		const strategy = createSteamStrategyForState(state);
		const runAuth = app.passport.authenticate(strategy, { session: false, authInfo: false, failureRedirect: `${env.frontendUrl}/login` }, handleSteamCallback);

		await runAuth.call(app, request, reply);
	});
};

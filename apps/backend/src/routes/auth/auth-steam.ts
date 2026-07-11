import { FastifyInstance } from 'fastify';
import { ApiRoutes, createSteamStrategyForState } from '@/config';
import { generateState, saveSteamState } from '@/services';

export const authSteamRoute = async (app: FastifyInstance) => {
	app.get(ApiRoutes.AUTH_STEAM, async (request, reply) => {
		const state = generateState();
		await saveSteamState(app.redis, state);

		const strategy = createSteamStrategyForState(state);
		const runAuth = app.passport.authenticate(strategy, {
			session: false,
			authInfo: false,
		});

		await runAuth.call(app, request, reply);
	});
};

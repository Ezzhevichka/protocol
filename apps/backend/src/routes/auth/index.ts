import { FastifyInstance } from 'fastify';
import { authMeRoute } from './me';
import { authSteamRoute } from './auth-steam';
import { authSteamCallbackRoute } from './auth-steam-callback';
import { authLogoutRoute } from './auth-logout';

export const authRoutes = async (app: FastifyInstance): Promise<void> => {
	await authSteamRoute(app);
	await authSteamCallbackRoute(app);
	await authLogoutRoute(app);
	await authMeRoute(app);
};

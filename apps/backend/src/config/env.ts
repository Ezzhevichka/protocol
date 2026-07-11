const apiHost = process.env.API_HOST ?? 'localhost';
const apiPort = Number(process.env.API_PORT ?? 4000);

const requireEnv = (name: string): string => {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
};

export const env = {
	apiHost,
	apiPort,
	backendUrl: (process.env.BACKEND_URL ?? `http://localhost:${apiPort}`).replace(/\/$/, ''),
	frontendUrl: (process.env.FRONTEND_URL ?? process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
	cookieSecret: requireEnv('COOKIE_SECRET'),
	redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
	steamApiKey: requireEnv('STEAM_API_KEY'),
	isProduction: process.env.NODE_ENV === 'production',
	botToken: requireEnv('BOT_TOKEN'),
	internalBotUrl: (process.env.INTERNAL_BOT_URL ?? process.env.ITERNAL_BOT_URL ?? 'http://127.0.0.1:').replace(/\/$/, ''),
};

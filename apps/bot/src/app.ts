import Fastify from 'fastify';

export function buildBotApp() {
	const app = Fastify({ logger: true });

	app.get('/health', async () => ({ service: 'bot', status: 'ok', botId: process.env.BOT_ID!, botName: process.env.BOT_NAME! }));

	return app;
}

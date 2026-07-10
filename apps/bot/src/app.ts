import Fastify from 'fastify';
import { banPlayer } from './services/punishment';

export function buildBotApp() {
	const app = Fastify({ logger: true });

	app.get('/health', async () => ({ service: 'bot', status: 'ok', botId: process.env.BOT_ID!, botName: process.env.BOT_NAME! }));

	app.addHook('onRequest', async (request, reply) => {
		const authHeader = request.headers.authorization;
		if (!authHeader?.startsWith('Bearer ')) {
			reply.code(401).send({ error: 'Missing or invalid Authorization header' });
			return;
		}
		const token = authHeader.slice(7); // убираем "Bearer "
		if (token !== process.env.BOT_TOKEN) {
			reply.code(401).send({ error: 'Invalid token' });
			return;
		}
	});

	app.post('/ban', async (request, reply) => {
		const { steamId, reason } = request.body as { steamId: string, reason: string };
		const success = await banPlayer(steamId, reason);
		if (!success) return reply.status(500).send({ error: 'Failed to ban player' });
		return reply.status(200).send({ success: true });
	});

	return app;
}

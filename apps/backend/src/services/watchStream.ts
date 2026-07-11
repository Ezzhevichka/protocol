import type { FastifyReply, FastifyRequest } from 'fastify';

export async function sseHandler(
	request: FastifyRequest<{ Params: { serverId: string } }>,
	reply: FastifyReply
) {
	const { serverId } = request.params;
	const lastEventId = (request.headers['last-event-id'] as string) || '0-0';

	reply.hijack();

	const raw = reply.raw;
	raw.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
		'X-Accel-Buffering': 'no',
	});

	const client = request.server.redis;
	const streamClient = client.duplicate();
	await streamClient.connect();

	let streamKey = await client.get(`server:${serverId}:current_round`);
	let lastId = lastEventId;

	const cleanup = async () => {
		try { await streamClient.quit(); } catch { /* empty */ }
		raw.end();
	};

	request.raw.on('close', cleanup);

	try {
		while (true) {
			if (!streamKey) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				streamKey = await client.get(`server:${serverId}:current_round`);
				lastId = '0-0';
				continue;
			}

			const results = await streamClient.xRead(
				{ key: streamKey, id: lastId },
				{ BLOCK: 5000, COUNT: 10 }
			);

			if (results) {
				for (const { messages } of results) {
					for (const { id, message } of messages) {
						raw.write(`id: ${id}\nevent: message\ndata: ${message.data}\n\n`);
						lastId = id;

						const event = JSON.parse(message.data) as { type?: string };
						if (event.type === 'ROUND_ENDED') {
							streamKey = null;
						}
					}
				}
			}
		}
	} catch (err) {
		console.error(`SSE stream error for server ${serverId}:`, err);
		raw.write(`event: error\ndata: ${JSON.stringify({ error: 'Internal stream error' })}\n\n`);
	} finally {
		await cleanup();
	}
}

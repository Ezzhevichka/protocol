import { buildBotApp } from './app';
import { startLogEventStreamJob } from './log-reader';
import { collectServerSnapshotTick, connectRedisClient } from './services';

const app = buildBotApp();

const main = async () => {
	await app.listen({
		host: process.env.BOT_HOST ?? '127.0.0.1',
		port: Number(process.env.PORT ?? 4100),
	});

	console.log(`Bot-${process.env.SERVER_INITIAL_NAME} started`);

	await connectRedisClient();

	startLogEventStreamJob();

	await collectServerSnapshotTick();
};

main().catch((error) => {
	app.log.error(error);
	process.exit(1);
});

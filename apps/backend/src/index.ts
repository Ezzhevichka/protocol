import { buildBackendApp } from './app';

const app = buildBackendApp();

const main = async () => {
	try {
		await app.listen({
			host: process.env.API_HOST ?? '127.0.0.1',
			port: Number(process.env.API_PORT ?? 4000),
		});
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
};

main().catch((error) => {
	app.log.error(error);
	process.exit(1);
});

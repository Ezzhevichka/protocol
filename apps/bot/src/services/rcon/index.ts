import { Rcon } from 'squad-rcon';
import { ChatMessageEvent, RawChatMessageEvent } from '@/types';

let client: Rcon | null = null;
let connecting: Promise<Rcon> | null = null;

type WithRconOptions = {
	resetOnError?: boolean;
};

async function createRconClient(): Promise<Rcon> {
	const rcon = new Rcon({
		id: Number(process.env.SERVER_ID ?? 0),
		host: process.env.RCON_HOST as string,
		port: Number(process.env.RCON_PORT ?? 0),
		password: process.env.RCON_PASSWORD as string,
		autoReconnect: false,
		logEnabled: false,
	});

	const markDisconnected = () => {
		if (client === rcon) client = null;
	};

	rcon.on('POSSESSED_ADMIN_CAMERA', (data) => console.log('POSSESSED ADMIN CAMERA:', data));
	rcon.on('UNPOSSESSED_ADMIN_CAMERA', (data) => console.log('UNPOSSESSED ADMIN CAMERA:', data));
	rcon.on('CHAT_MESSAGE', (data: RawChatMessageEvent) => console.log('CHAT MESSAGE:', { ...data, time: undefined, timestamp: data.time }));
	// 18:36:57 2026-07-07: UNPOSSESSED ADMIN CAMERA: {
	//     raw: '[Online IDs:EOS: 0002c12fdcbe444ba4031bf46dc99581 steam: 76561199114356613] (КМЕ) 4elzikys has unpossessed admin camera.',
	//     eosID: '0002c12fdcbe444ba4031bf46dc99581',
	//     steamID: '76561199114356613',
	//     name: '(КМЕ) 4elzikys',
	//     time: 2026-07-07T15:36:57.110Z
	//   }
	// 18:36:35 2026-07-07: POSSESSED ADMIN CAMERA: {
	//     raw: '[Online Ids:EOS: 0002c12fdcbe444ba4031bf46dc99581 steam: 76561199114356613] (КМЕ) 4elzikys has possessed admin camera.',
	//     eosID: '0002c12fdcbe444ba4031bf46dc99581',
	//     steamID: '76561199114356613',
	//     name: '(КМЕ) 4elzikys',
	//     time: 2026-07-07T15:36:35.996Z
	//   }
	rcon.on('close', markDisconnected);
	rcon.on('err', markDisconnected);

	await rcon.init();

	return rcon;
}

export async function getRconClient(): Promise<Rcon> {
	if (client) {
		return client;
	}

	connecting ??= createRconClient()
		.then((rcon) => {
			client = rcon;

			return rcon;
		})
		.finally(() => {
			connecting = null;
		});

	return connecting;
}

export async function resetRconClient(targetClient?: Rcon): Promise<void> {
	const oldClient = targetClient ?? client;
  
	if (!oldClient) return;
  
	if (!targetClient || client === targetClient) {
		client = null;
	}
  
	try {
		await oldClient.close();
	} catch {
		// Ignore close errors.
	}
}

export async function closeRconClient(): Promise<void> {
	await resetRconClient();
}

export async function withRcon<T>(task: (rcon: Rcon) => Promise<T>, options: WithRconOptions = {}): Promise<T> {
	const rcon = await getRconClient();
  
	try {
		return await task(rcon);
	} catch (error) {
		if (options.resetOnError) await resetRconClient(rcon);
  
		throw error;
	}
}

import { Mutex } from 'async-mutex';
import { Rcon } from 'squad-rcon';

import { env } from '../config';

const RCON_COMMAND_TIMEOUT_MS = 8000;

const rconMutex = new Mutex();

let client: Rcon | null = null;
let connecting: Promise<Rcon> | null = null;

async function createRcon() {
    const rcon = new Rcon({
        id: env.serverId,
        host: env.rconHost!,
        port: Number(env.rconPort),
        password: env.rconPassword!,
        autoReconnect: false,
        logEnabled: false,
    });

    await rcon.init();

    return rcon;
}

async function getRcon() {
    if (client) {
        return client;
    }

    if (!connecting) {
        connecting = createRcon()
            .then((rcon) => {
                client = rcon;
                return rcon;
            })
            .finally(() => {
                connecting = null;
            });
    }

    return connecting;
}

async function resetRcon() {
    const oldClient = client;
    client = null;

    if (!oldClient) {
        return;
    }

    try {
        await oldClient.close();
    } catch {
    // ignore close errors
    }
}

async function withPromiseTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    message: string
): Promise<T> {
    let timeout: NodeJS.Timeout;

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
            reject(new Error(message));
        }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
        clearTimeout(timeout);
    });
}

export async function withRcon<T>(task: (rcon: Rcon) => Promise<T>): Promise<T> {
    return rconMutex.runExclusive(async () => {
        const rcon = await getRcon();

        try {
            return await withPromiseTimeout(task(rcon), RCON_COMMAND_TIMEOUT_MS, 'RCON command timeout');
        } catch (error) {
            await resetRcon();
            throw error;
        }
    });
}

export async function closeRcon() {
    await resetRcon();
}

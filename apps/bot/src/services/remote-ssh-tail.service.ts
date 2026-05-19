import { Client } from 'ssh2';

type LineHandler = (line: string) => void | Promise<void>;

type RemoteTailConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
    path: string;
};

export function tailRemoteLogOverSsh(config: RemoteTailConfig, onLine: LineHandler) {
    let reconnectTimer: NodeJS.Timeout | null = null;
    let stopped = false;
    let buffer = '';

    function reconnect() {
        if (stopped) return;
        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(connect, 5000);
    }

    function connect() {
        if (stopped) return;
        const client = new Client();

        client.on('ready', () => {
            console.log(`SSH tail connected: ${config.host}:${config.path}`);
            client.exec(`tail -n 0 -F ${JSON.stringify(config.path)}`, (error, stream) => {
                if (error) {
                    console.error('SSH_TAIL_EXEC_FAILED', error.message);
                    client.end();
                    return;
                }

                stream.on('data', async (chunk: Buffer) => {
                    buffer += chunk.toString('utf8');
                    const lines = buffer.split(/\r?\n/);
                    buffer = lines.pop() ?? '';

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (trimmed) await onLine(trimmed);
                    }
                });

                stream.stderr.on('data', (chunk: Buffer) => {
                    const text = chunk.toString('utf8').trim();
                    if (text) console.error('SSH_TAIL_STDERR', text);
                });

                stream.on('close', () => client.end());
            });
        });

        client.on('error', (error) => console.error('SSH_TAIL_CONNECTION_FAILED', error.message));
        client.on('close', reconnect);

        client.connect({
            host: config.host,
            port: config.port,
            username: config.username,
            password: config.password,
            keepaliveInterval: 15000,
            keepaliveCountMax: 3,
        });
    }

    connect();

    return {
        stop() {
            stopped = true;
            if (reconnectTimer) clearTimeout(reconnectTimer);
        },
    };
}

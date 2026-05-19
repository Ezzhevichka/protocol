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

                let buffer = '';
                let processing = Promise.resolve();

                stream.on('data', (chunk: Buffer) => {
                    buffer += chunk.toString('utf8');

                    const lines = buffer.split(/\r?\n/);
                    buffer = lines.pop() ?? '';

                    for (const line of lines) {
                        const trimmed = line.trim();

                        if (!trimmed) {
                            continue;
                        }

                        processing = processing.then(() => onLine(trimmed)).catch((lineError: unknown) => {
                            console.error('SSH_TAIL_LINE_HANDLER_FAILED', {
                                line: trimmed,
                                error: lineError instanceof Error ? lineError.message : String(lineError),
                            });
                        });
                    }
                });

                stream.stderr.on('data', (chunk: Buffer) => {
                    const text = chunk.toString('utf8').trim();

                    if (!text) {
                        return;
                    }

                    const ignoredTailMessages = [
                        'file truncated',
                        'has been replaced',
                        'following new file',
                    ];

                    if (ignoredTailMessages.some((message) => text.includes(message))) {
                        console.log('SSH_TAIL_INFO', text);
                        return;
                    }

                    console.error('SSH_TAIL_STDERR', text);
                });

                stream.on('close', async () => {
                    try {
                        if (buffer.trim()) {
                            await onLine(buffer.trim());
                        }

                        await processing;
                    } catch (closeError) {
                        console.error(
                            'SSH_TAIL_CLOSE_HANDLER_FAILED',
                            closeError instanceof Error ? closeError.message : String(closeError)
                        );
                    } finally {
                        client.end();
                    }
                });

                stream.on('error', (streamError: Error) => {
                    console.error('SSH_TAIL_STREAM_FAILED', streamError.message);
                    client.end();
                });
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

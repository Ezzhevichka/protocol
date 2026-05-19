// backend/src/services/remote-bot.service.ts

import { Client } from 'ssh2';

function requiredEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is required`);
    }

    return value;
}

function shellEscape(value: string) {
    return `'${value.replace(/'/g, '\'\\\'\'')}'`;
}

function execSsh(command: string) {
    return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        const client = new Client();

        let stdout = '';
        let stderr = '';

        client
            .on('ready', () => {
                client.exec(command, (error, stream) => {
                    if (error) {
                        client.end();
                        reject(error);
                        return;
                    }

                    stream.on('data', (chunk: Buffer) => {
                        stdout += chunk.toString();
                    });

                    stream.stderr.on('data', (chunk: Buffer) => {
                        stderr += chunk.toString();
                    });

                    stream.on('close', (code: number) => {
                        client.end();

                        if (code !== 0) {
                            reject(new Error(stderr || `Remote command failed (${code})`));
                            return;
                        }

                        resolve({ stdout, stderr });
                    });
                });
            })
            .on('error', reject)
            .connect({
                host: requiredEnv('REMOTE_BOT_HOST'),
                port: Number(process.env.REMOTE_BOT_PORT ?? 22),
                username: requiredEnv('REMOTE_BOT_ROOT_USERNAME'),
                password: requiredEnv('REMOTE_BOT_ROOT_PASSWORD'),
            });
    });
}

export async function restartRemoteBot() {
    const runAs = requiredEnv('REMOTE_BOT_RUN_AS');
    const dir = requiredEnv('REMOTE_BOT_DIR');

    const innerScript = `
set -e

cd ${shellEscape(dir)}

SCREENS=$(screen -ls | awk '/\\.bot/ {print $1}' || true)

if [ -n "$SCREENS" ]; then
  for S in $SCREENS; do
    screen -S "$S" -X stuff $'\\003'
  done

  sleep 5
fi

chmod +x ./start_linux.sh

./start_linux.sh

sleep 2

screen -ls | grep '\\.bot' || true
`;

    const command = `
sudo -u ${runAs} bash -lc ${shellEscape(innerScript)}
`;

    return execSsh(command);
}

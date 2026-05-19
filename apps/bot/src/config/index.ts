export const env = {
    serverId: Number(process.env.SERVER_ID ?? 1),
    port: Number(process.env.PORT ?? 4001),
    botToken: process.env.BOT_TOKEN,

    rconHost: process.env.RCON_HOST,
    rconPort: Number(process.env.RCON_PORT ?? 21114),
    rconPassword: process.env.RCON_PASSWORD,

    backendInternalUrl: process.env.BACKEND_INTERNAL_URL,
    internalBotToken: process.env.INTERNAL_BOT_TOKEN,

    logTailMode: process.env.LOG_TAIL_MODE ?? 'remote-ssh',
    squadLogPath: process.env.SQUAD_LOG_PATH,
    sshHost: process.env.SSH_HOST,
    sshPort: Number(process.env.SSH_PORT ?? 22),
    sshUsername: process.env.SSH_USERNAME,
    sshPassword: process.env.SSH_PASSWORD,
};

const required = [
    ['BOT_TOKEN', env.botToken],
    ['RCON_HOST', env.rconHost],
    ['RCON_PASSWORD', env.rconPassword],
    ['BACKEND_INTERNAL_URL', env.backendInternalUrl],
    ['INTERNAL_BOT_TOKEN', env.internalBotToken],
    ['SQUAD_LOG_PATH', env.squadLogPath],
];

for (const [name, value] of required) {
    if (!value) throw new Error(`${name} is required`);
}

if (env.logTailMode === 'remote-ssh' && (!env.sshHost || !env.sshUsername || !env.sshPassword)) {
    throw new Error('SSH_HOST, SSH_USERNAME and SSH_PASSWORD are required for remote-ssh log tail');
}

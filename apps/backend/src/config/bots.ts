export type BotEndpointConfig = {
  serverId: number;
  botUrl: string;
  botToken: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

export function getBotEndpointConfig(serverId: number): BotEndpointConfig {
  const baseUrl = process.env.BOT_BASE_URL ?? 'http://127.0.0.1';
  const portBase = Number(process.env.BOT_PORT_BASE ?? 4000);
  const botToken = getRequiredEnv('BOT_BASE_TOKEN');

  return {
    serverId,
    botUrl: `${baseUrl}:${portBase + serverId}`,
    botToken,
  };
}

export type SquadServerConfig = {
  id: number;
  name: string;
  botUrl: string;
  botToken: string;
};

export const squadServers: SquadServerConfig[] = [
  {
    id: 1,
    name: "#1 INVASION",
    botUrl: process.env.BOT_1_URL ?? "",
    botToken: process.env.BOT_1_TOKEN ?? "",
  },
  {
    id: 2,
    name: "#2 SUPERMOD ALL MODS",
    botUrl: process.env.BOT_2_URL ?? "",
    botToken: process.env.BOT_2_TOKEN ?? "",
  },
  {
    id: 3,
    name: "#3 RU vs UA",
    botUrl: process.env.BOT_3_URL ?? "",
    botToken: process.env.BOT_3_TOKEN ?? "",
  },
  {
    id: 4,
    name: "#4 SUPERMOD INVASION",
    botUrl: process.env.BOT_4_URL ?? "",
    botToken: process.env.BOT_4_TOKEN ?? "",
  },
].filter((server) => Boolean(server.botUrl && server.botToken));

export function getSquadServer(serverId: number) {
  return squadServers.find((server) => server.id === serverId);
}
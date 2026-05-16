import { Rcon } from "squad-rcon";
import { env } from "../config";

export async function createRcon() {
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

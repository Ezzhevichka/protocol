/**
 * Seed script: populate SquadServerSeed table.
 * Run: pnpm --filter backend tsx src/scripts/seed-autoseed-servers.ts
 *
 * Edit the SERVERS array below with the correct IP and ports for each server.
 */

import "dotenv/config";
import { prisma } from "@squad-admin/database";

const SERVERS = [
  {
    serverId: 1,
    name: "#1 INVASION",
    ip: "0.0.0.0",       // ← вставь IP сервера
    gamePort: 7787,       // ← игровой порт
    queryPort: 27165,     // ← query порт (обычно gamePort + 19378 или смотри server.cfg)
    seedThreshold: 60,    // сколько игроков считается "заполнен"
    lowerHysteresis: 55,
    priority: 1,
    enabled: true,
  },
  {
    serverId: 2,
    name: "#2 SUPERMOD ALL MODS",
    ip: "0.0.0.0",
    gamePort: 7787,
    queryPort: 27165,
    seedThreshold: 60,
    lowerHysteresis: 55,
    priority: 2,
    enabled: true,
  },
  {
    serverId: 3,
    name: "#3 RU vs UA",
    ip: "0.0.0.0",
    gamePort: 7787,
    queryPort: 27165,
    seedThreshold: 60,
    lowerHysteresis: 55,
    priority: 3,
    enabled: true,
  },
  {
    serverId: 4,
    name: "#4 SUPERMOD INVASION",
    ip: "0.0.0.0",
    gamePort: 7787,
    queryPort: 27165,
    seedThreshold: 60,
    lowerHysteresis: 55,
    priority: 4,
    enabled: true,
  },
];

async function main() {
  console.log("Seeding SquadServerSeed...");

  for (const server of SERVERS) {
    const result = await prisma.squadServerSeed.upsert({
      where: { serverId: server.serverId },
      create: server,
      update: {
        name: server.name,
        ip: server.ip,
        gamePort: server.gamePort,
        queryPort: server.queryPort,
        seedThreshold: server.seedThreshold,
        lowerHysteresis: server.lowerHysteresis,
        priority: server.priority,
        enabled: server.enabled,
      },
    });
    console.log(`  ✓ Server ${result.serverId}: ${result.name} (${result.ip}:${result.queryPort})`);
  }

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

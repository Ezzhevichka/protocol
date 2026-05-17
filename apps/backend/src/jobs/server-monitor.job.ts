import { prisma } from "@squad-admin/database";
import Gamedig from "gamedig";

let interval: NodeJS.Timeout | null = null;

const MONITOR_INTERVAL_MS = 20_000;
const QUERY_TIMEOUT_MS = 5_000;

export function startServerMonitorJob() {
  if (interval) return;

  interval = setInterval(async () => {
    try {
      await queryAllServers();
    } catch (err) {
      console.error("[server-monitor] error:", err);
    }
  }, MONITOR_INTERVAL_MS);

  console.log(`[server-monitor] Started (${MONITOR_INTERVAL_MS}ms)`);
}

async function queryAllServers() {
  const servers = await prisma.squadServerSeed.findMany({
    where: { enabled: true },
  });

  await Promise.allSettled(servers.map(queryServer));
}

async function queryServer(server: { id: string; ip: string; queryPort: number }) {
  try {
    const state = await Gamedig.query({
      type: "squad",
      host: server.ip,
      port: server.queryPort,
      maxAttempts: 1,
      attemptTimeout: QUERY_TIMEOUT_MS,
    });

    const players = state.players.length;
    const maxPlayers = state.maxplayers;
    const map = (state.map as string) || null;

    await prisma.$transaction([
      prisma.serverMetricSeed.create({
        data: {
          serverId: server.id,
          players,
          maxPlayers,
          map,
        },
      }),
      prisma.squadServerSeed.update({
        where: { id: server.id },
        data: {
          lastPlayers: players,
          lastMaxPlayers: maxPlayers,
          lastMap: map,
          lastQueryAt: new Date(),
          lastQueryError: null,
        },
      }),
    ]);

    // Prune old metrics (keep last 100 per server to avoid unbounded growth)
    const oldMetrics = await prisma.serverMetricSeed.findMany({
      where: { serverId: server.id },
      orderBy: { queriedAt: "desc" },
      skip: 100,
      select: { id: true },
    });
    if (oldMetrics.length > 0) {
      await prisma.serverMetricSeed.deleteMany({
        where: { id: { in: oldMetrics.map((m) => m.id) } },
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);

    await prisma.squadServerSeed.update({
      where: { id: server.id },
      data: { lastQueryError: errorMsg, lastQueryAt: new Date() },
    });

    await prisma.serverMetricSeed.create({
      data: {
        serverId: server.id,
        players: 0,
        maxPlayers: 0,
        error: errorMsg,
      },
    });
  }
}

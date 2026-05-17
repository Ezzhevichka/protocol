import { prisma } from "@squad-admin/database";
import type { SeedSession, AgentDevice, SquadServerSeed, SeedSessionTarget } from "@squad-admin/database";
import { sendToAgent } from "../lib/agent-socket";
import { awardMinutePoints } from "../services/rating.service";
import { env } from "../config/env";

type SessionWithIncludes = SeedSession & {
  agentDevice: AgentDevice;
  currentServer: SquadServerSeed | null;
  targets: (SeedSessionTarget & { server: SquadServerSeed })[];
};

let interval: NodeJS.Timeout | null = null;
let isRunning = false;

// Rating tick: award minute points every 60 seconds
let ratingInterval: NodeJS.Timeout | null = null;

const HEARTBEAT_TIMEOUT_MS = 60_000;
const SCHEDULER_INTERVAL_MS = 15_000;
const RATING_INTERVAL_MS = 60_000;

export function startAutoseedSchedulerJob() {
  if (interval) return;

  interval = setInterval(async () => {
    if (isRunning) return;
    isRunning = true;
    try {
      await processActiveSessions();
    } catch (err) {
      console.error("[autoseed-scheduler] error:", err);
    } finally {
      isRunning = false;
    }
  }, SCHEDULER_INTERVAL_MS);

  ratingInterval = setInterval(async () => {
    try {
      await processRatingTick();
    } catch (err) {
      console.error("[autoseed-scheduler] rating tick error:", err);
    }
  }, RATING_INTERVAL_MS);

  console.log(`[autoseed-scheduler] Started (${SCHEDULER_INTERVAL_MS}ms / rating ${RATING_INTERVAL_MS}ms)`);
}

async function processActiveSessions() {
  const sessions = await prisma.seedSession.findMany({
    where: { status: { in: ["QUEUED", "ASSIGNED", "SEEDING"] } },
    include: {
      agentDevice: true,
      currentServer: true,
      targets: {
        where: { status: "PENDING" },
        include: { server: true },
      },
    },
  });

  for (const session of sessions) {
    try {
      await processSession(session as SessionWithIncludes);
    } catch (err) {
      console.error(`[autoseed-scheduler] error processing session ${session.id}:`, err);
    }
  }
}

async function processRatingTick() {
  const seedingSessions = await prisma.seedSession.findMany({
    where: { status: "SEEDING" },
    include: { agentDevice: true, currentServer: true },
  });

  for (const session of seedingSessions) {
    try {
      await awardMinutePoints(session as Parameters<typeof awardMinutePoints>[0]);
    } catch (err) {
      console.error(`[autoseed-scheduler] rating error for session ${session.id}:`, err);
    }
  }
}

async function processSession(session: SessionWithIncludes) {
  // Liveness check
  const { agentDevice } = session;
  if (agentDevice.status !== "CONNECTED") {
    await markAgentOffline(session);
    return;
  }

  const heartbeatAge = agentDevice.lastHeartbeatAt
    ? Date.now() - agentDevice.lastHeartbeatAt.getTime()
    : Infinity;

  if (heartbeatAge > HEARTBEAT_TIMEOUT_MS) {
    await markAgentOffline(session);
    return;
  }

  if (session.status === "QUEUED") {
    await assignInitialServer(session);
    return;
  }

  if (session.status === "SEEDING" && session.currentServer) {
    const seeded = await isServerSeeded(session.currentServer);
    if (seeded) {
      await handleServerSeeded(session);
    }
  }
}

async function assignInitialServer(session: SessionWithIncludes) {
  const server = await selectNextServer(session);
  if (!server) {
    await finishSession(session, "NO_SERVERS_AVAILABLE");
    return;
  }
  await assignServerToSession(session, server);
}

async function selectNextServer(
  session: SessionWithIncludes
): Promise<SquadServerSeed | null> {
  // Re-fetch pending targets with fresh server data
  const pendingTargets = await prisma.seedSessionTarget.findMany({
    where: { seedSessionId: session.id, status: "PENDING" },
    include: { server: true },
  });

  if (!pendingTargets.length) return null;

  // Count how many sessions are already assigned to each server
  const serverSessionCounts = await prisma.seedSession.groupBy({
    by: ["currentServerId"],
    where: {
      status: { in: ["ASSIGNED", "SEEDING"] },
      currentServerId: { in: pendingTargets.map((t) => t.serverId) },
    },
    _count: { currentServerId: true },
  });

  const countMap = new Map(
    serverSessionCounts.map((r) => [r.currentServerId, r._count.currentServerId])
  );

  const available = pendingTargets
    .map((t) => t.server)
    .filter((s) => {
      if (!s.enabled) return false;
      if (session.skipUnavailableServers && s.lastQueryError) return false;
      if (s.lastPlayers != null && s.lastPlayers >= s.seedThreshold) return false;
      return true;
    });

  if (!available.length) return null;

  available.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    const aEff = (a.lastPlayers ?? 0) + (countMap.get(a.id) ?? 0);
    const bEff = (b.lastPlayers ?? 0) + (countMap.get(b.id) ?? 0);
    return aEff - bEff;
  });

  return available[0];
}

async function assignServerToSession(session: SessionWithIncludes, server: SquadServerSeed) {
  await prisma.seedSession.update({
    where: { id: session.id },
    data: { status: "ASSIGNED", currentServerId: server.id },
  });

  await prisma.seedSessionTarget.updateMany({
    where: { seedSessionId: session.id, serverId: server.id },
    data: { status: "ASSIGNED", assignedAt: new Date() },
  });

  await sendToAgent(session.agentDeviceId, {
    type: "CONNECT_SERVER",
    sessionId: session.id,
    serverId: server.id,
    ip: server.ip,
    gamePort: server.gamePort,
    queryPort: server.queryPort,
    serverName: server.name,
  });

  console.log(`[autoseed-scheduler] Assigned ${server.name} → session ${session.id}`);
}

async function isServerSeeded(server: SquadServerSeed): Promise<boolean> {
  const metrics = await prisma.serverMetricSeed.findMany({
    where: { serverId: server.id },
    orderBy: { queriedAt: "desc" },
    take: 2,
  });

  if (metrics.length < 2) return false;
  return metrics.every((m) => m.players >= server.seedThreshold);
}

async function handleServerSeeded(session: SessionWithIncludes) {
  await prisma.seedSessionTarget.updateMany({
    where: { seedSessionId: session.id, serverId: session.currentServerId!, status: "ASSIGNED" },
    data: { status: "SEEDED", seededAt: new Date() },
  });

  const updated = await prisma.seedSession.update({
    where: { id: session.id },
    data: { seededCount: { increment: 1 } },
  });

  console.log(`[autoseed-scheduler] Server seeded for session ${session.id}, count=${updated.seededCount}`);

  if (session.maxServersToSeed && updated.seededCount >= session.maxServersToSeed) {
    await finishSession(updated as SessionWithIncludes, "MAX_SERVERS_REACHED");
    return;
  }

  const nextServer = await selectNextServer(session);
  if (!nextServer) {
    await finishSession(updated as SessionWithIncludes, "ALL_TARGETS_SEEDED");
    return;
  }

  // Switch cooldown
  const cooldownMs = env.switchCooldownSeconds * 1000;
  if (session.lastSwitchAt && Date.now() - session.lastSwitchAt.getTime() < cooldownMs) {
    console.log(`[autoseed-scheduler] Session ${session.id} in switch cooldown`);
    return;
  }

  await switchServer(session, nextServer);
}

async function switchServer(session: SessionWithIncludes, nextServer: SquadServerSeed) {
  await prisma.seedSession.update({
    where: { id: session.id },
    data: { currentServerId: nextServer.id, lastSwitchAt: new Date(), status: "SWITCHING" },
  });

  await prisma.seedSessionTarget.updateMany({
    where: { seedSessionId: session.id, serverId: nextServer.id },
    data: { status: "ASSIGNED", assignedAt: new Date() },
  });

  await sendToAgent(session.agentDeviceId, {
    type: "SWITCH_SERVER",
    sessionId: session.id,
    fromServerId: session.currentServerId,
    toServerId: nextServer.id,
    ip: nextServer.ip,
    gamePort: nextServer.gamePort,
    queryPort: nextServer.queryPort,
    serverName: nextServer.name,
  });

  console.log(`[autoseed-scheduler] Session ${session.id} switching to ${nextServer.name}`);
}

async function finishSession(session: Pick<SeedSession, "id" | "agentDeviceId" | "postCompletionAction" | "shutdownDelaySeconds">, reason: string) {
  await prisma.seedSession.update({
    where: { id: session.id },
    data: { status: "FINISHED", finishedAt: new Date() },
  });

  await sendToAgent(session.agentDeviceId, {
    type: "FINISH_SESSION",
    sessionId: session.id,
    reason,
    postCompletionAction: session.postCompletionAction,
    shutdownDelaySeconds: session.shutdownDelaySeconds,
  });

  console.log(`[autoseed-scheduler] Session ${session.id} finished: ${reason}`);
}

async function markAgentOffline(session: Pick<SeedSession, "id">) {
  await prisma.seedSession.update({
    where: { id: session.id },
    data: { status: "AGENT_OFFLINE" },
  });

  console.warn(`[autoseed-scheduler] Session ${session.id} → AGENT_OFFLINE`);
}

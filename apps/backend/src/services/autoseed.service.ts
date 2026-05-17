import { prisma } from "@squad-admin/database";
import type { ServerSelectionMode, PostCompletionAction } from "@squad-admin/database";
import { sendToAgent } from "../lib/agent-socket";

export interface StartSessionOptions {
  mode?: ServerSelectionMode;
  selectedServerIds?: string[];
  maxServersToSeed?: number;
  postCompletionAction?: PostCompletionAction;
  shutdownDelaySeconds?: number;
  skipUnavailableServers?: boolean;
}

/**
 * Start a new seed session for a user.
 * Requires an active (CONNECTED) agent device for that user.
 */
export async function startSession(userId: string, options: StartSessionOptions = {}) {
  const {
    mode = "AUTO_ALL",
    selectedServerIds,
    maxServersToSeed,
    postCompletionAction = "NONE",
    shutdownDelaySeconds = 120,
    skipUnavailableServers = true,
  } = options;

  // Find the user's connected agent
  const agentDevice = await prisma.agentDevice.findFirst({
    where: { userId, status: "CONNECTED", revokedAt: null },
  });

  if (!agentDevice) {
    throw Object.assign(
      new Error("No connected agent device found. Please connect your agent first."),
      { status: 400 }
    );
  }

  // Check for an already-active session
  const existingSession = await prisma.seedSession.findFirst({
    where: { userId, status: { in: ["QUEUED", "ASSIGNED", "LAUNCHING", "SEEDING", "SWITCHING"] } },
  });
  if (existingSession) {
    throw Object.assign(new Error("You already have an active seed session"), { status: 409 });
  }

  // Determine target servers
  let serverIds: string[] = [];
  if (mode === "AUTO_ALL" || mode === "SELECTED_SERVERS") {
    if (mode === "SELECTED_SERVERS" && selectedServerIds?.length) {
      serverIds = selectedServerIds;
    } else {
      const servers = await prisma.squadServerSeed.findMany({
        where: { enabled: true },
        select: { id: true },
      });
      serverIds = servers.map((s) => s.id);
    }
  }

  const session = await prisma.seedSession.create({
    data: {
      userId,
      agentDeviceId: agentDevice.id,
      mode,
      maxServersToSeed,
      postCompletionAction,
      shutdownDelaySeconds,
      skipUnavailableServers,
      status: "QUEUED",
      targets:
        serverIds.length > 0
          ? {
              create: serverIds.map((serverId) => ({ serverId })),
            }
          : undefined,
    },
    include: {
      agentDevice: true,
      targets: { include: { server: true } },
    },
  });

  return session;
}

/**
 * Stop an active seed session. Sends FINISH_SESSION command to agent.
 */
export async function stopSession(sessionId: string, userId: string) {
  const session = await prisma.seedSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw Object.assign(new Error("Session not found"), { status: 404 });
  }
  if (session.userId !== userId) {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  }
  if (!["QUEUED", "ASSIGNED", "LAUNCHING", "SEEDING", "SWITCHING"].includes(session.status)) {
    throw Object.assign(new Error("Session is not active"), { status: 400 });
  }

  await prisma.seedSession.update({
    where: { id: sessionId },
    data: { status: "CANCELLED", finishedAt: new Date() },
  });

  await sendToAgent(session.agentDeviceId, {
    type: "FINISH_SESSION",
    sessionId,
    reason: "USER_CANCELLED",
    postCompletionAction: "NONE",
    shutdownDelaySeconds: 0,
  });
}

/**
 * Get the current active session for a user (with targets and currentServer).
 */
export async function getMySession(userId: string) {
  return prisma.seedSession.findFirst({
    where: {
      userId,
      status: { in: ["QUEUED", "ASSIGNED", "LAUNCHING", "SEEDING", "SWITCHING"] },
    },
    include: {
      currentServer: true,
      targets: {
        include: { server: true },
        orderBy: { createdAt: "asc" },
      },
      agentDevice: { select: { id: true, name: true, status: true, lastHeartbeatAt: true } },
    },
    orderBy: { startedAt: "desc" },
  });
}

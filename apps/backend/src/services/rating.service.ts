import { prisma } from "@squad-admin/database";
import type { SeedSession, AgentDevice, SquadServerSeed } from "@squad-admin/database";

type ActiveSession = SeedSession & {
  agentDevice: AgentDevice;
  currentServer: SquadServerSeed | null;
};

const HEARTBEAT_MAX_AGE_MS = 30_000; // 30 seconds

/**
 * Award 1 minute-point to a user for an active SEEDING session.
 * Uses SeedMinuteLedger to ensure idempotency (one record per minute per user/session/server).
 */
export async function awardMinutePoints(session: ActiveSession): Promise<void> {
  if (session.status !== "SEEDING") return;
  if (!session.currentServer) return;

  // Check heartbeat freshness
  const { lastHeartbeatAt } = session.agentDevice;
  if (!lastHeartbeatAt || Date.now() - lastHeartbeatAt.getTime() > HEARTBEAT_MAX_AGE_MS) {
    return;
  }

  // Only award if server still needs seeding
  const server = session.currentServer;
  if (server.lastPlayers == null || server.lastPlayers >= server.seedThreshold) {
    return;
  }

  // Minute bucket: floor to current UTC minute
  const now = new Date();
  const minuteBucket = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    0,
    0
  );

  // Idempotency check via unique constraint
  try {
    await prisma.$transaction(async (tx) => {
      await tx.seedMinuteLedger.create({
        data: {
          userId: session.userId,
          seedSessionId: session.id,
          serverId: server.id,
          minuteBucket,
          pointsAwarded: 1,
          multiplier: 1.0,
        },
      });

      await tx.seedRatingEvent.create({
        data: {
          userId: session.userId,
          seedSessionId: session.id,
          serverId: server.id,
          type: "MINUTE_SEEDED",
          points: 1,
          minutes: 1,
          multiplier: 1.0,
        },
      });

      await tx.seedRatingProfile.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          totalPoints: 1,
          totalSeedMinutes: 1,
        },
        update: {
          totalPoints: { increment: 1 },
          totalSeedMinutes: { increment: 1 },
        },
      });

      await tx.seedSession.update({
        where: { id: session.id },
        data: {
          ratingPointsEarned: { increment: 1 },
          ratingMinutesEarned: { increment: 1 },
        },
      });
    });
  } catch (err: unknown) {
    // Unique constraint violation = already awarded this minute, ignore
    if ((err as { code?: string })?.code === "P2002") return;
    throw err;
  }
}

// backend/src/jobs/expire-bans.job.ts

import { prisma } from "@squad-admin/database";

let interval: NodeJS.Timeout | null = null;
let isRunning = false;

export function startExpireBansJob() {
  if (interval) return;

  const intervalMs = Number(process.env.EXPIRE_BANS_INTERVAL_MS ?? 60_000);

  interval = setInterval(async () => {
    if (isRunning) return;

    isRunning = true;

    try {
      const result = await prisma.ban.updateMany({
        where: {
          status: "ACTIVE",
          expiresAt: {
            not: null,
            lte: new Date(),
          },
        },
        data: {
          status: "EXPIRED",
        },
      });

      if (result.count > 0) {
        console.log("EXPIRED_BANS_UPDATED:", result.count);
      }
    } catch (error) {
      console.error("EXPIRE_BANS_JOB_FAILED:", error);
    } finally {
      isRunning = false;
    }
  }, intervalMs);

  console.log(`Expire bans job started: ${intervalMs}ms`);
}
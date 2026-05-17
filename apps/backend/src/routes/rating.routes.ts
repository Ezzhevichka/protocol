import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "@squad-admin/database";

const router = Router();

// GET /rating/leaderboard?period=allTime|season|7d|30d
router.get("/leaderboard", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = (req.query.period as string) ?? "allTime";
    const limit = Math.min(Number(req.query.limit ?? 50), 100);

    let orderBy: { totalPoints?: "asc" | "desc"; currentSeasonPoints?: "asc" | "desc" };
    orderBy = period === "season" ? { currentSeasonPoints: "desc" } : { totalPoints: "desc" };

    const profiles = await prisma.seedRatingProfile.findMany({
      orderBy,
      take: limit,
      include: {
        user: { select: { id: true, steamId: true, displayName: true, avatarUrl: true } },
      },
    });

    res.json({ period, leaderboard: profiles });
  } catch (err) {
    next(err);
  }
});

// GET /rating/me — my rating profile + recent session history
router.get("/me", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const [profile, recentSessions, recentEvents] = await Promise.all([
      prisma.seedRatingProfile.findUnique({ where: { userId } }),
      prisma.seedSession.findMany({
        where: { userId, status: { in: ["FINISHED", "CANCELLED"] } },
        orderBy: { startedAt: "desc" },
        take: 10,
        include: { currentServer: { select: { name: true } } },
      }),
      prisma.seedRatingEvent.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    res.json({ profile: profile ?? null, recentSessions, recentEvents });
  } catch (err) {
    next(err);
  }
});

export default router;

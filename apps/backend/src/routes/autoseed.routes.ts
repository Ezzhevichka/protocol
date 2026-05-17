import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { startSession, stopSession, getMySession } from "../services/autoseed.service";
import { prisma } from "@squad-admin/database";

const router = Router();

// GET /autoseed/status — current session for the authenticated user
router.get("/status", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await getMySession(req.user!.id);
    res.json({ session: session ?? null });
  } catch (err) {
    next(err);
  }
});

// POST /autoseed/start — start a new seed session
router.post("/start", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      mode,
      selectedServerIds,
      maxServersToSeed,
      postCompletionAction,
      shutdownDelaySeconds,
      skipUnavailableServers,
    } = req.body as Record<string, unknown>;

    const session = await startSession(req.user!.id, {
      mode: mode as import("../services/autoseed.service").StartSessionOptions["mode"],
      selectedServerIds: Array.isArray(selectedServerIds) ? (selectedServerIds as string[]) : undefined,
      maxServersToSeed: typeof maxServersToSeed === "number" ? maxServersToSeed : undefined,
      postCompletionAction: postCompletionAction as import("../services/autoseed.service").StartSessionOptions["postCompletionAction"],
      shutdownDelaySeconds: typeof shutdownDelaySeconds === "number" ? shutdownDelaySeconds : undefined,
      skipUnavailableServers: typeof skipUnavailableServers === "boolean" ? skipUnavailableServers : undefined,
    });

    res.status(201).json({ session });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    if (e?.status) {
      return res.status(e.status).json({ error: "START_FAILED", message: e.message });
    }
    next(err);
  }
});

// POST /autoseed/stop — stop the active session
router.post("/stop", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.body as { sessionId?: string };
    if (!sessionId) {
      return res.status(400).json({ error: "MISSING_SESSION_ID" });
    }
    await stopSession(sessionId, req.user!.id);
    res.json({ ok: true });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    if (e?.status) {
      return res.status(e.status).json({ error: "STOP_FAILED", message: e.message });
    }
    next(err);
  }
});

// GET /autoseed/servers — public list of seed servers with current stats
router.get("/servers", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const servers = await prisma.squadServerSeed.findMany({
      where: { enabled: true },
      select: {
        id: true,
        serverId: true,
        name: true,
        lastPlayers: true,
        lastMaxPlayers: true,
        lastMap: true,
        lastQueryAt: true,
        lastQueryError: true,
        seedThreshold: true,
        priority: true,
      },
      orderBy: { priority: "asc" },
    });
    res.json({ servers });
  } catch (err) {
    next(err);
  }
});

export default router;

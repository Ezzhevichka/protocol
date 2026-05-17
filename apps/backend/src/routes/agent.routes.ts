import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { createPairingToken, pairAgent, revokeAgent } from "../services/agent.service";

const router = Router();

// POST /agent/pairing-token — generate a one-time pairing token (authenticated user only)
router.post("/pairing-token", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await createPairingToken(req.user!.id);
    res.json({ token, expiresInSeconds: 300 });
  } catch (err) {
    next(err);
  }
});

// POST /agent/pair — exchange pairing token for permanent agent token (open, called by Electron agent)
router.post("/pair", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, name, platform, osVersion, agentVersion } = req.body as {
      token?: string;
      name?: string;
      platform?: string;
      osVersion?: string;
      agentVersion?: string;
    };

    if (!token) {
      return res.status(400).json({ error: "MISSING_TOKEN", message: "token is required" });
    }

    const result = await pairAgent(token, { name, platform, osVersion, agentVersion });
    res.json(result);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    if (e?.status) {
      return res.status(e.status).json({ error: "PAIR_FAILED", message: e.message });
    }
    next(err);
  }
});

// DELETE /agent/:id/revoke — revoke an agent device (owner only)
router.delete("/:id/revoke", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await revokeAgent(req.params.id as string, req.user!.id);
    res.json({ ok: true });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    if (e?.status) {
      return res.status(e.status).json({ error: "REVOKE_FAILED", message: e.message });
    }
    next(err);
  }
});

export default router;

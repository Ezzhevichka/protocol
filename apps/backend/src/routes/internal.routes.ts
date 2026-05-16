import { Router } from "express";
import { requireInternalToken } from "../middleware/internal-auth.middleware";
import { getBanStatus } from "../services/bans.service";
import { closePlayerSession, openPlayerSession } from "../services/player-identity.service";

const router = Router();

router.get("/bans/check/:steamId", requireInternalToken, async (req, res, next) => {
  try {
    const result = await getBanStatus({
      steamId: String(req.params.steamId),
      eosId: typeof req.query.eosId === "string" ? req.query.eosId : undefined,
      nickname: typeof req.query.name === "string" ? req.query.name : undefined,
    });
    res.json(result);
  } catch (error) { next(error); }
});

router.post("/events/player-connected", requireInternalToken, async (req, res, next) => {
  try {
    const result = await openPlayerSession({
      serverId: Number(req.body.serverId),
      steamId: String(req.body.steamId),
      eosId: req.body.eosId ?? null,
      name: req.body.name ?? null,
      raw: req.body.raw ?? null,
    });
    res.status(201).json(result);
  } catch (error) { next(error); }
});

router.post("/events/player-disconnected", requireInternalToken, async (req, res, next) => {
  try {
    const result = await closePlayerSession({
      serverId: Number(req.body.serverId),
      steamId: String(req.body.steamId),
      raw: req.body.raw ?? null,
    });
    res.json({ session: result });
  } catch (error) { next(error); }
});

export default router;

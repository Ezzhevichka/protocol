import { Router } from "express";
import { kickSchema } from "../schemas/command.schema";
import { kickPlayer } from "../services/squad.service";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const input = kickSchema.parse(req.body);
    res.json(await kickPlayer(input.steamId, input.reason));
  } catch (error) {
    next(error);
  }
});

export default router;

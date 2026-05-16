import { Router } from "express";
import { getPlayerProfileController, listKnownPlayersController } from "../controllers/players.controller";

const router = Router();

router.get("/known", listKnownPlayersController);
router.get("/:steamId/profile", getPlayerProfileController);

export default router;

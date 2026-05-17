import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware";
import { listPlayersFromServer } from "../controllers/players.controller";
import { listServers } from "../controllers/servers.controller";

const router = Router();

router.get("/", listServers);
router.get("/:serverId/players", requireAuth, listPlayersFromServer);

export default router;
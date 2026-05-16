import { Router } from "express";
import { listPlayersFromServer } from "../controllers/players.controller";
import { listServers } from "../controllers/servers.controller";

const router = Router();

router.get("/", listServers);
router.get("/:serverId/players", listPlayersFromServer);

export default router;
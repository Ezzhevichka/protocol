import { Router } from "express";
import {
  checkBanController,
  createBanController,
  listBansController,
  revokeBanController,
} from "../controllers/bans.controller";
import { validateBody } from "../middleware/validate.middleware";
import { createBanSchema, revokeBanSchema } from "../schemas/bans.schema";

const router = Router();

router.get("/", listBansController);
router.get("/check/:steamId", checkBanController);
router.post("/", validateBody(createBanSchema), createBanController);
router.post("/:banId/revoke", validateBody(revokeBanSchema), revokeBanController);

export default router;
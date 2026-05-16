import { Router } from "express";
import { createWarnController, listWarnsController } from "../controllers/punishments.controller";
import { validateBody } from "../middleware/validate.middleware";
import { createWarnSchema } from "../schemas/punishments.schema";

const router = Router();
router.get("/warns", listWarnsController);
router.post("/warns", validateBody(createWarnSchema), createWarnController);
export default router;

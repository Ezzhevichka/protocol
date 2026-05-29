import { Router } from 'express';

import { commandSchema } from 'schemas/command.schema';
import { sendCommand } from 'services/squad-service';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const input = commandSchema.parse(req.body);
    const result = await sendCommand(input.command);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

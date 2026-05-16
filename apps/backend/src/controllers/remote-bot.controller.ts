import type { NextFunction, Request, Response } from "express";
import { restartRemoteBot } from "../services/remote-bot.service";

export async function restartRemoteBotController(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await restartRemoteBot();

    res.json({
      ok: true,
      stdout: result.stdout,
      stderr: result.stderr,
    });
  } catch (error) {
    next(error);
  }
}
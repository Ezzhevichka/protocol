import type { NextFunction, Request, Response } from "express";

export function requireInternalToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token || token !== process.env.INTERNAL_BOT_TOKEN) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Неверный internal token" });
  }

  next();
}

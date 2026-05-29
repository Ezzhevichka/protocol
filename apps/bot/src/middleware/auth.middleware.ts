import type { NextFunction, Request, Response } from 'express';

export function botAuth(req: Request, res: Response, next: NextFunction) {
  const expected = `Bearer ${process.env.BOT_TOKEN}`;

  if (req.headers.authorization !== expected) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  next();
}

import type { NextFunction, Request, Response } from "express";
import { prisma } from "@squad-admin/database";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.isAuthenticated?.() || !req.user?.id) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Нужна авторизация" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      req.logout(() => undefined);
      return res.status(401).json({ error: "USER_NOT_FOUND", message: "Пользователь не найден" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

import type { NextFunction, Request, Response } from "express";
import { createWarn, listWarns } from "../services/punishments.service";

export async function listWarnsController(req: Request, res: Response, next: NextFunction) {
  try { res.json({ warns: await listWarns(typeof req.query.q === "string" ? req.query.q : undefined) }); } catch (error) { next(error); }
}

export async function createWarnController(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ warn: await createWarn(req.body) }); } catch (error) { next(error); }
}

import type { NextFunction, Request, Response } from "express";
import {
  createBan,
  getBanStatusBySteamId,
  listBans,
  revokeBan,
} from "../services/bans.service";

export async function listBansController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bans = await listBans(req.query.status as string | undefined);
    res.json({ bans });
  } catch (error) {
    next(error);
  }
}

export async function checkBanController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getBanStatusBySteamId(String(req.params.steamId));
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function createBanController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await createBan(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function revokeBanController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ban = await revokeBan(String(req.params.banId), req.body);
    res.json({ ban });
  } catch (error) {
    next(error);
  }
}
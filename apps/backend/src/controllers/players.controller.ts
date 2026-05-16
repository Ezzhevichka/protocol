import type { NextFunction, Request, Response } from "express";
import { getPlayersByServerId } from "../services/players.service";
import { getPlayerProfileBySteamId, listKnownPlayers } from "../services/player-identity.service";
import { refreshSteamProfile } from "../services/steam.service";

export async function listPlayersFromServer(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getPlayersByServerId(Number(req.params.serverId));
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === "SERVER_NOT_FOUND") return res.status(404).json({ error: "SERVER_NOT_FOUND" });
    next(error);
  }
}

export async function listKnownPlayersController(req: Request, res: Response, next: NextFunction) {
  try {
    const players = await listKnownPlayers(typeof req.query.q === "string" ? req.query.q : undefined);
    res.json({ players });
  } catch (error) { next(error); }
}

export async function getPlayerProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const steamId = String(req.params.steamId);
    const [profile, steamProfile] = await Promise.all([
      getPlayerProfileBySteamId(steamId),
      refreshSteamProfile(steamId).catch((error) => ({ error: error instanceof Error ? error.message : String(error) })),
    ]);
    res.json({ player: profile, steamProfile });
  } catch (error) { next(error); }
}

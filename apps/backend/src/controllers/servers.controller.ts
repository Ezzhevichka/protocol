import type { Request, Response } from "express";
import { squadServers } from "../config/servers";

export function listServers(_req: Request, res: Response) {
  res.json({
    servers: squadServers.map(({ id, name, botUrl }) => ({
      id,
      name,
      botUrl,
    })),
  });
}
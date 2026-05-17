import type { NextFunction, Request, Response } from "express";
import { prisma } from "@squad-admin/database";
import bcrypt from "bcryptjs";

export async function requireAgentAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "AGENT_UNAUTHORIZED", message: "Agent token required" });
  }

  const token = authHeader.slice(7);

  try {
    const devices = await prisma.agentDevice.findMany({
      where: { revokedAt: null },
    });

    for (const device of devices) {
      const isValid = await bcrypt.compare(token, device.tokenHash);
      if (isValid) {
        req.agentDevice = device;
        return next();
      }
    }

    return res.status(401).json({ error: "INVALID_AGENT_TOKEN", message: "Invalid or revoked agent token" });
  } catch (error) {
    next(error);
  }
}

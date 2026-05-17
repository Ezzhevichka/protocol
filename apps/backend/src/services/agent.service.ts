import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@squad-admin/database";
import { redisClient } from "../lib";

const PAIRING_TTL_SECONDS = 300; // 5 minutes

/**
 * Generate a one-time pairing token. Stores userId in Redis under
 * "pairing:<tokenHash>" with a 5-minute TTL.
 * Returns the plain token to show to the user once.
 */
export async function createPairingToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  await redisClient.set(`pairing:${hash}`, userId, { EX: PAIRING_TTL_SECONDS });

  return token;
}

/**
 * Exchange a pairing token for a permanent agent device token.
 * The pairing token is consumed (deleted) on use.
 */
export async function pairAgent(
  token: string,
  deviceInfo: {
    name?: string;
    platform?: string;
    osVersion?: string;
    agentVersion?: string;
  }
): Promise<{ deviceId: string; agentToken: string }> {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const key = `pairing:${hash}`;

  const userId = await redisClient.get(key);
  if (!userId) {
    throw Object.assign(new Error("Invalid or expired pairing token"), { status: 400 });
  }

  // Consume — one-time use
  await redisClient.del(key);

  const agentToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(agentToken, 10);

  const device = await prisma.agentDevice.create({
    data: {
      userId,
      name: deviceInfo.name ?? `Agent-${Date.now()}`,
      tokenHash,
      status: "DISCONNECTED",
      platform: deviceInfo.platform,
      osVersion: deviceInfo.osVersion,
      agentVersion: deviceInfo.agentVersion,
    },
  });

  return { deviceId: device.id, agentToken };
}

/**
 * Revoke an agent device. Verifies ownership before revoking.
 * The WebSocket connection will be closed by the socket server on next heartbeat check.
 */
export async function revokeAgent(
  agentDeviceId: string,
  requestingUserId: string
): Promise<void> {
  const device = await prisma.agentDevice.findUnique({
    where: { id: agentDeviceId },
  });

  if (!device) {
    throw Object.assign(new Error("Agent device not found"), { status: 404 });
  }
  if (device.userId !== requestingUserId) {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  }

  await prisma.agentDevice.update({
    where: { id: agentDeviceId },
    data: { revokedAt: new Date(), status: "REVOKED" },
  });
}

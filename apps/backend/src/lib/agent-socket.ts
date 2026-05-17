import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { prisma } from "@squad-admin/database";
import bcrypt from "bcryptjs";
import { env } from "../config/env";

// Map of agentDeviceId → connected socket
const connectedAgents = new Map<string, Socket>();

let ioInstance: Server | null = null;

export function createAgentSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: env.frontendUrl,
      credentials: true,
    },
  });

  ioInstance = io;

  const agentNs = io.of("/agent");

  agentNs.on("connection", async (socket) => {
    const token =
      (socket.handshake.auth?.token as string) ||
      (socket.handshake.query?.token as string);

    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const device = await validateAgentToken(token);
      if (!device) {
        console.warn(`[agent-socket] Invalid token, disconnecting ${socket.id}`);
        socket.disconnect();
        return;
      }

      socket.data.agentDeviceId = device.id;
      connectedAgents.set(device.id, socket);

      await prisma.agentDevice.update({
        where: { id: device.id },
        data: { status: "CONNECTED" },
      });

      console.log(`[agent-socket] Agent connected: ${device.id}`);

      // Send any pending commands immediately
      await flushPendingCommands(device.id, socket);

      socket.on("heartbeat", async (data: Record<string, unknown>) => {
        try {
          await prisma.agentDevice.update({
            where: { id: device.id },
            data: {
              lastHeartbeatAt: new Date(),
              agentVersion: (data?.agentVersion as string) ?? undefined,
              platform: (data?.platform as string) ?? undefined,
              osVersion: (data?.osVersion as string) ?? undefined,
            },
          });
        } catch (err) {
          console.error(`[agent-socket] heartbeat error for ${device.id}:`, err);
        }
      });

      socket.on("command_ack", async (data: { commandId: string; success: boolean }) => {
        try {
          await prisma.agentSeedCommand.update({
            where: { id: data.commandId },
            data: {
              status: data.success ? "ACKED" : "FAILED",
              ackedAt: new Date(),
            },
          });
        } catch (err) {
          console.error(`[agent-socket] command_ack error:`, err);
        }
      });

      socket.on("process_status", (data: unknown) => {
        console.log(`[agent-socket] process_status from ${device.id}:`, data);
      });

      socket.on("disconnect", async () => {
        connectedAgents.delete(device.id);
        try {
          await prisma.agentDevice.update({
            where: { id: device.id },
            data: { status: "DISCONNECTED" },
          });
        } catch {
          // device may have been deleted
        }
        console.log(`[agent-socket] Agent disconnected: ${device.id}`);
      });
    } catch (err) {
      console.error(`[agent-socket] connection error:`, err);
      socket.disconnect();
    }
  });

  return io;
}

async function validateAgentToken(token: string) {
  const devices = await prisma.agentDevice.findMany({
    where: { revokedAt: null },
  });
  for (const device of devices) {
    if (await bcrypt.compare(token, device.tokenHash)) {
      return device;
    }
  }
  return null;
}

async function flushPendingCommands(agentDeviceId: string, socket: Socket) {
  const commands = await prisma.agentSeedCommand.findMany({
    where: { agentDeviceId, status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  for (const cmd of commands) {
    socket.emit("command", { commandId: cmd.id, type: cmd.type, ...cmd.payload as object });
    await prisma.agentSeedCommand.update({
      where: { id: cmd.id },
      data: { status: "SENT", sentAt: new Date() },
    });
  }
}

/**
 * Send a command to an agent. If the agent is offline, persists the command
 * in AgentSeedCommand with status=PENDING so it's delivered on reconnect.
 */
export async function sendToAgent(
  agentDeviceId: string,
  command: { type: string; sessionId?: string; [key: string]: unknown }
) {
  const socket = connectedAgents.get(agentDeviceId);

  const savedCommand = await prisma.agentSeedCommand.create({
    data: {
      agentDeviceId,
      sessionId: command.sessionId ?? null,
      type: command.type as import("@squad-admin/database").SeedCommandType,
      payload: command as object,
      status: "PENDING",
    },
  });

  if (socket) {
    socket.emit("command", { commandId: savedCommand.id, ...command });
    await prisma.agentSeedCommand.update({
      where: { id: savedCommand.id },
      data: { status: "SENT", sentAt: new Date() },
    });
  }

  return savedCommand;
}

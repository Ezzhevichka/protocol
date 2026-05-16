import { ServerStatusServer, ServerStatusState } from "../model";

export const SERVER_SLOTS = 4;

const DEFAULT_SERVER_NAMES = [
  "Invasion",
  "AAS/RAAS",
  "RU vs UA 24/7",
  "ALL MODS",
] as const;

type ResolvedServer = {
  key: string;
  badge: string;
  name: string;
  state: ServerStatusState;
  playersLabel: string;
  onClick?: () => void;
};

const formatPlayersLabel = (server?: ServerStatusServer) => {
  const maxPlayers = server?.maxPlayers ?? 100;

  const base =
    typeof server?.playersCount === "number"
      ? `${server.playersCount}/${maxPlayers}`
      : server?.playersCount?.trim() || `0/${maxPlayers}`;

  if (!server || server.state === "disabled") {
    return `0/${maxPlayers}`;
  }

  if (typeof server.queueCount === "number" && server.queueCount > 0) {
    return `${base} (+${server.queueCount})`;
  }

  return base;
};

const isValidSlot = (slot: number) => {
  return Number.isInteger(slot) && slot >= 1 && slot <= SERVER_SLOTS;
};

const getPreferredSlotIndex = (server: ServerStatusServer) => {
  if (typeof server.slot === "number" && isValidSlot(server.slot)) {
    return server.slot - 1;
  }

  if (typeof server.badge === "number" && isValidSlot(server.badge)) {
    return server.badge - 1;
  }

  return undefined;
};

export const mapServersToSlots = (servers: ServerStatusServer[]) => {
  const slots: Array<ServerStatusServer | undefined> = Array.from(
    { length: SERVER_SLOTS },
    () => undefined,
  );
  const fallbackQueue: ServerStatusServer[] = [];

  servers.forEach((server) => {
    const preferredSlotIndex = getPreferredSlotIndex(server);

    if (preferredSlotIndex !== undefined && slots[preferredSlotIndex] === undefined) {
      slots[preferredSlotIndex] = server;
      return;
    }

    fallbackQueue.push(server);
  });

  fallbackQueue.forEach((server) => {
    const freeSlotIndex = slots.findIndex((slotServer) => slotServer === undefined);
    if (freeSlotIndex === -1) {
      return;
    }

    slots[freeSlotIndex] = server;
  });

  return slots;
};

export const resolveServerBySlot = (index: number, server?: ServerStatusServer): ResolvedServer => {
  const fallbackName = DEFAULT_SERVER_NAMES[index] ?? `Server #${index + 1}`;
  const state: ServerStatusState = server ? (server.state ?? "default") : "disabled";

  return {
    key: `${server?.id ?? `slot-${index + 1}`}`,
    badge: `#${server?.badge ?? index + 1}`,
    name: server?.name ?? fallbackName,
    state,
    playersLabel: formatPlayersLabel({ ...server, state }),
    onClick: state === "disabled" ? undefined : server?.onClick,
  };
};

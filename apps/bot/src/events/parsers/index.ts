import type { SquadEventParser } from "../../core/events/types";
import { parsePlayerConnected } from "./player-connected.parser";
import { parsePlayerDisconnected } from "./player-disconnected.parser";

export const squadEventParsers: SquadEventParser[] = [parsePlayerConnected, parsePlayerDisconnected];

export function parseSquadLogLine(line: string) {
  for (const parser of squadEventParsers) {
    const event = parser(line);
    if (event) return event;
  }
  return null;
}

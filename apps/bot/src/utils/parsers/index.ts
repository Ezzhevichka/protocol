import { PlayerEventParser } from 'types/parserEvents';

import { parsePlayerChat } from './player-chat.parser';
import { parsePlayerConnected } from './player-connected.parser';
import { parsePlayerDied } from './player-died.parser';
import { parsePlayerDisconnected } from './player-disconnected.parser';

export const playerEventParsers: PlayerEventParser[] = [
  parsePlayerConnected,
  parsePlayerDisconnected,
  parsePlayerChat,
  parsePlayerDied,
];

export function parseSquadLogLine(line: string) {
  for (const parser of playerEventParsers) {
    const event = parser(line);
    if (event) { return event; }
  }
  return null;
}

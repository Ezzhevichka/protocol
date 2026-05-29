import type { PlayerEvent, SquadEventHandler } from 'types/parserEvents';

const handlers: SquadEventHandler[] = [];

export function registerEventHandler(handler: SquadEventHandler) {
  handlers.push(handler);
}

export async function emitPlayerEvent(event: PlayerEvent) {
  for (const handler of handlers) {
    await handler(event);
  }
}

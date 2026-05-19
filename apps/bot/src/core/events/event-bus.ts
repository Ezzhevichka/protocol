import type { SquadEvent, SquadEventHandler } from './types';

const handlers: SquadEventHandler[] = [];

export function registerEventHandler(handler: SquadEventHandler) {
    handlers.push(handler);
}

export async function emitSquadEvent(event: SquadEvent) {
    for (const handler of handlers) {
        await handler(event);
    }
}

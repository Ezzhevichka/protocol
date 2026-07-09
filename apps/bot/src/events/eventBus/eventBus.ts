import { EventEmitter } from 'node:events';
import { BaseEvent } from '../../types';

export class EventBus {
	private emitter = new EventEmitter();

	subscribe<T extends BaseEvent>(
		eventType: T['type'],
		handler: (event: T) => Promise<void> | void
	): void {
		this.emitter.on(eventType, async (event: T) => {
			try {
				await handler(event);
			} catch (err) {
				console.error(`Error in handler for ${eventType}:`, err);
			}
		});
	}

	emit<T extends BaseEvent>(event: T): void {
		this.emitter.emit(event.type, event);
	}

	removeAllListeners(): void {
		this.emitter.removeAllListeners();
	}
}

export const eventBus = new EventBus();

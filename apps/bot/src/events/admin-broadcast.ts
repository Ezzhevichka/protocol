import { BaseEvent, EventType } from '../types';
import { eventBus } from './eventBus';

export interface AdminBroadcastEvent extends BaseEvent {
	type: EventType.ADMIN_BROADCAST;
	timestamp: Date | string;
	chainID: string;
	message: string;
	from: string
};

eventBus.subscribe(EventType.ADMIN_BROADCAST, async (event: AdminBroadcastEvent) => {
	console.log('ADMIN BROADCAST:', event);
});

export const adminBroadcastEvent = {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: ADMIN COMMAND: Message broadcasted <(.+)> from (.+)/,
	type: EventType.ADMIN_BROADCAST,
	onMatch: (args: string[]) => {
		return {
			type: EventType.ADMIN_BROADCAST,
			raw: args[0],
			timestamp: args[1],
			chainID: args[2],
			message: args[3],
			from: args[4].trim(),
		};
	},
};

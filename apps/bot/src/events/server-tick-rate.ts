import { getRedisClient } from '@/services';
import { BaseEvent, EventType } from '@/types';
import { eventBus } from './eventBus';

export interface ServerTickRateEvent extends BaseEvent {
	type: EventType.SERVER_TICK_RATE;
	timestamp: Date | string;
	tickRate: number;
};

eventBus.subscribe(EventType.SERVER_TICK_RATE, async (event: ServerTickRateEvent) => {
	console.log('SERVER TICK RATE:', event);
	const redis = await getRedisClient();
	const streamKey = await redis.get(`server:${process.env.SERVER_INITIAL_NAME}:current_round`);
	if (!streamKey) {
		console.log('NO CURRENT ROUND FOR SERVER:', process.env.SERVER_INITIAL_NAME);
		return;
	}
	await redis.xAdd(streamKey, '*', { data: JSON.stringify(event) });
});

export const serverTickRateEvent = {
	type: EventType.SERVER_TICK_RATE,
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: USQGameState: Server Tick Rate: ([0-9.]+)/,
	onMatch: (args: string[]) => {
		return {
			type: EventType.SERVER_TICK_RATE,
			raw: args[0],
			timestamp: args[1],
			chainID: args[2],
			tickRate: parseFloat(args[3]),
		};
	},
};

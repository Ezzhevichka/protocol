import { collectServerSnapshotTick, getRedisClient } from '../services';
import { BaseEvent, EventType } from '../types';
import { eventBus } from './eventBus';

export interface RoundEndedEvent extends BaseEvent {
	type: EventType.ROUND_ENDED;
	timestamp: Date | string;
};

eventBus.subscribe(EventType.ROUND_ENDED, async (event: RoundEndedEvent) => {
	console.log('ROUND ENDED:', event);
	await collectServerSnapshotTick();
	const redis = await getRedisClient();
	const streamKey = await redis.get(`server:${process.env.SERVER_INITIAL_NAME}:current_round`);
	if (!streamKey) {
		console.log('NO CURRENT ROUND FOR SERVER:', process.env.SERVER_INITIAL_NAME);
		return;
	}
	await redis.xAdd(streamKey, '*', { data: JSON.stringify(event) });
	await redis.del(`server:${process.env.SERVER_INITIAL_NAME}:current_round`);

	await redis.expire(streamKey, 86400);
});

export const roundEndedEvent = {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogGameState: Match State Changed from InProgress to WaitingPostMatch/,
	type: EventType.ROUND_ENDED,
	onMatch: (args: string[]) => {
		return {
			type: EventType.ROUND_ENDED,
			raw: args[0],
			timestamp: args[1],
		};
	},
};

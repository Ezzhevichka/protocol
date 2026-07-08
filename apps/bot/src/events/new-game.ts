import { collectServerSnapshotTick, getRedisClient } from '../services';
import { BaseEvent, EventType } from '../types';
import { eventBus } from './eventBus';

export interface NewGameEvent extends BaseEvent {
	type: EventType.NEW_GAME;
	timestamp: Date | string;
	chainID: string;
	dlc: string;
	mapClassname: string;
	layerClassname: string;
};

eventBus.subscribe(EventType.NEW_GAME, async (event: NewGameEvent) => {
	if (!event.mapClassname || event.mapClassname === 'TransitionMap') {
		return;
	}
	console.log('NEW GAME:', event);
	const res = await collectServerSnapshotTick();
	const redis = await getRedisClient();
	const streamKey = `stream:${res?.serverInfo.initialName}:${event.mapClassname}:${event.layerClassname}:${Date.now()}`;
	await redis.xAdd(streamKey, '*', { data: JSON.stringify(event) });
	await redis.set(`server:${res?.serverInfo.initialName}:current_round`, streamKey);
});

export const newGameEvent = {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogWorld: Bringing World \/([A-z]+)\/(?:Maps\/)?([A-z0-9-]+)\/(?:.+\/)?([A-z0-9-]+)(?:\.[A-z0-9-]+)/,
	type: EventType.NEW_GAME,
	onMatch: (args: string[]) => {
		if (args[5] === 'TransitionMap') {
			return;
		}
		return {
			type: EventType.NEW_GAME,
			raw: args[0],
			timestamp: args[1],
			chainID: args[2],
			dlc: args[3],
			mapClassname: args[4],
			layerClassname: args[5],
		};
	},
};

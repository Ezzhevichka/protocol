import { collectServerSnapshotTick, getRedisClient } from '../services';
import { BaseEvent, EventType } from '../types';
import { eventBus } from './eventBus';

export interface PlayerConnectedEvent extends BaseEvent {
	type: EventType.PLAYER_CONNECTED;
	playercontroller: string,
	ip: string,
	eosID: string,
	steamID: string,
};

eventBus.subscribe(EventType.PLAYER_CONNECTED, async (event: PlayerConnectedEvent) => {
	console.log('CONNECTED:', event);
	await collectServerSnapshotTick();
	const redis = await getRedisClient();
	const streamKey = await redis.get(`server:${process.env.SERVER_INITIAL_NAME}:current_round`);
	if (!streamKey) {
		console.log('NO CURRENT ROUND FOR SERVER:', process.env.SERVER_INITIAL_NAME);
		return;
	}
	await redis.xAdd(streamKey, '*',{ data: JSON.stringify(event) });
});

export const playerConnectedEvent = {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: PostLogin: NewPlayer: BP_PlayerController_C .+PersistentLevel\.([^\s]+) \(IP: ([\d.]+) \| Online IDs: EOS: ([0-9a-f]{32}) steam: (\d+)\)/,
	type: EventType.PLAYER_CONNECTED,
	onMatch: (args: string[]) => {
		return {
			type: EventType.PLAYER_CONNECTED,
			raw: args[0],
			timestamp: args[1],
			chainID: args[2],
			playercontroller: args[3],
			ip: args[4],
			eosID: args[5],
			steamID: args[6],
		};
	},
};

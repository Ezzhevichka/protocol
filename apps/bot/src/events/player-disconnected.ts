import { collectServerSnapshotTick, getRedisClient } from '../services';
import { BaseEvent, EventType } from '../types';
import { eventBus } from './eventBus';

export interface PlayerDisconnectedEvent extends BaseEvent {
	type: EventType.PLAYER_DISCONNECTED;
	playercontroller: string,
	ip: string,
	eosID: string,
	steamID: string,
};

eventBus.subscribe(EventType.PLAYER_DISCONNECTED, async (event: PlayerDisconnectedEvent) => {
	console.log('DISCONNECTED:', event);
	const res = await collectServerSnapshotTick();
	const redis = await getRedisClient();
	const streamKey = await redis.get(`server:${res?.serverInfo.initialName}:current_round`);
	if (!streamKey) {
		console.log('NO CURRENT ROUND FOR SERVER:', res?.serverInfo.initialName);
		return;
	}
	await redis.xAdd(streamKey, '*',{ data: JSON.stringify(event) });
});

export const playerDisconnectedEvent = {
	regex: /^\[([0-9.:-]+)\]\[([ 0-9]*)\]LogNet: UChannel::Close: Sending CloseBunch\. ChIndex == [0-9]+\. Name: \[UChannel\] ChIndex: [0-9]+, Closing: [0-9]+ \[UNetConnection\] RemoteAddr: ([\d.]+):[\d]+, Name: (?:EOSIpNetConnection_|RedpointEOSIpNetConnection_)[0-9]+, Driver: (?:GameNetDriver EOSNetDriver_[0-9]+|Name:GameNetDriver Def:GameNetDriver RedpointEOSNetDriver_[0-9]+), IsServer: YES, PC: ([^ ]+PlayerController_C_[0-9]+), Owner: [^ ]+PlayerController_C_[0-9]+, UniqueId: RedpointEOS:([\d\w]+)/,
	type: EventType.PLAYER_DISCONNECTED,
	onMatch: (args: string[]) => {
		return {
			type: EventType.PLAYER_DISCONNECTED,
			raw: args[0],
			timestamp: args[1],
			chainID: args[2],
			ip: args[3],
			playerController: args[4],
			eosID: args[5],
		};
	},
};

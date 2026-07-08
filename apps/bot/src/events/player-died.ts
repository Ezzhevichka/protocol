import { getRedisClient } from '@/services';
import { BaseEvent, EventType } from '@/types';
import { weapons } from '../weapons';
import { eventBus } from './eventBus';

export interface PlayerDiedEvent extends BaseEvent {
	type: EventType.PLAYER_DIED;
	victimName: string,
	damage: number,
	attackerPlayerController: string,
	attackerEOSID: string,
	attackerSteamID: string,
	weapon: keyof typeof weapons
};

eventBus.subscribe(EventType.PLAYER_DIED, async (event: PlayerDiedEvent) => {
	const weaponName = weapons[event.weapon] ?? event.weapon;
	if (!weaponName) {
		console.log('Unknown weapon:', event.weapon);
	}
	const parsedWeaponEvent = { ...event, weapon: weaponName };
	console.log('DIED:', parsedWeaponEvent);
	const redis = await getRedisClient();
	const streamKey = await redis.get(`server:${process.env.SERVER_INITIAL_NAME}:current_round`);
	if (!streamKey) {
		console.log('NO CURRENT ROUND FOR SERVER:', process.env.SERVER_INITIAL_NAME);
		return;
	}
	await redis.xAdd(streamKey, '*', { data: JSON.stringify(event) });
});

export const playerDiedEvent = {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQSoldier::)?Wound\(\): Player:(.+) KillingDamage=(?:-)*([0-9.]+) from ([A-z_0-9]+) \(Online IDs: EOS: ([\w\d]{32}) steam: (\d{17}) \| Controller ID: ([\w\d]+)\) caused by ([A-z_0-9-]+)_C/,
	type: EventType.PLAYER_DIED,
	onMatch: (args: string[]) => {
		return {
			type: EventType.PLAYER_DIED,
			raw: args[0],
			timestamp: args[1],
			chainId: args[2],
			victimName: args[3].trim(),
			damage: parseFloat(args[4]).toFixed(),
			attackerPlayerController: args[5],
			attackerEOSID: args[6],
			attackerSteamID: args[7],
			weapon: args[9],
		};
	},
};

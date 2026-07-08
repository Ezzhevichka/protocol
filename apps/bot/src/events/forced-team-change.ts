import { BaseEvent, EventType } from '../types';
import { eventBus } from './eventBus';

export interface ForcedTeamChangeEvent extends BaseEvent {
	type: EventType.FORCED_TEAM_CHANGE;
	timestamp: Date | string;
	chainID: string;
	eosId: string;
	steamId: string;
	name: string;
};

eventBus.subscribe(EventType.FORCED_TEAM_CHANGE, async (event: ForcedTeamChangeEvent) => {
	console.log('FORCED TEAM CHANGE:', event);
});

export const forcedTeamChangeEvent = {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: ADMIN COMMAND: Forced team change for player \d+\. \[Online IDs= EOS: ([0-9a-f]{32}) steam: (\d+)] (.+) from /,
	type: EventType.FORCED_TEAM_CHANGE,
	onMatch: (args: string[]) => {
		return {
			type: EventType.FORCED_TEAM_CHANGE,
			raw: args[0],
			timestamp: args[1],
			chainID: args[2],
			eosId: args[3],
			steamId: args[4],
			name: args[5].trim(),
		};
	},
};

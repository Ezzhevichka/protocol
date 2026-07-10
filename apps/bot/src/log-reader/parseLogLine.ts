import { playerWoundedEvent, playerConnectedEvent, playerDisconnectedEvent, roundEndedEvent, newGameEvent, playerDiedEvent, serverTickRateEvent, adminBroadcastEvent, forcedTeamChangeEvent } from '../events';

const events = [ 
	playerWoundedEvent, 
	playerConnectedEvent, 
	playerDisconnectedEvent, 
	roundEndedEvent, 
	newGameEvent, 
	serverTickRateEvent, 
	playerDiedEvent,
	adminBroadcastEvent,
	forcedTeamChangeEvent,
];

export const parseLogLine = (line: string) => {
	for (const event of events) {
		const match = event.regex.exec(line);
		if (match) {
			const matchedEvent = event.onMatch(match) ?? null;
			if (!matchedEvent) return;
			matchedEvent.raw = line;
			return matchedEvent;
		}
	}
	return null;
};

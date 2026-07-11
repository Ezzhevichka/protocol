import { withRcon } from '../rcon';

export const banPlayer = async (victimId: string, reason: string) => withRcon(async (rcon) => {
	// const players = await rcon.getListPlayers();
	// const victim = players.find((player) => player.steamID === steamId);
	// if (!victim) throw new Error('Player not found');
	await rcon.execute(`AdminKick ${victimId} ${reason}`);

	return true;
}, { resetOnError: false });

import { withRcon } from '../rcon';
import { parseSnapshot } from '@/utils';
import { ServerSnapshot as ServerSnapshotType } from '@/types';
import { getRedisClient } from '../redis';

type ServerSnapshot = {
	serverId: string;
	teams: ServerSnapshotType.Team[];
	serverInfo: ServerSnapshotType.ServerInfo;
	createdAt: Date;
};

let isSnapshotCollecting = false;

const unwrapSettledResult = <T>(result: PromiseSettledResult<T>): Optional<T> => {
	if (result.status === 'rejected') throw result.reason;
	return result.value;
};

export async function collectServerSnapshot(): Promise<ServerSnapshot> {
	return withRcon(
		async (rcon) => {
			const [playersResult, squadsResult, serverInfoResult] = await Promise.allSettled([rcon.getListPlayers(), rcon.getListSquads(), rcon.getServerInfo()] as const);

			const players = unwrapSettledResult(playersResult) ?? [];
			const squads = unwrapSettledResult(squadsResult) ?? [];
			const serverInfoRaw = unwrapSettledResult(serverInfoResult);

			const { teams, serverInfo } = parseSnapshot(players, squads, serverInfoRaw);
			const serverId = String(process.env.SERVER_INITIAL_NAME);

			const client = await getRedisClient();

			const data = {
				serverId: String(process.env.SERVER_ID),
				teams,
				serverInfo: { ...serverInfo, initialName: String(process.env.SERVER_INITIAL_NAME) },
				createdAt: new Date(),
			};

			await client.set(`server:${serverId}:snapshot`, JSON.stringify(data), { EX: 6000 });
			console.log('snapshot saved');

			return data;
		}, { resetOnError: true }
	);
}

export async function collectServerSnapshotTick(): Promise<Nullable<ServerSnapshot>> {
	if (isSnapshotCollecting) return null;
  
	isSnapshotCollecting = true;
  
	try {
		return await collectServerSnapshot();
	} finally {
		isSnapshotCollecting = false;
	}
}

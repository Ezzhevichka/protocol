import { TPlayer, TServerInfo, TSquad } from 'squad-rcon';

export namespace ServerSnapshot {
	export type Squad = TSquad & { players: TPlayer[] };

	export enum TeamId {
		ONE = '1',
		TWO = '2'
	}

	export type Team = {
		name: string;
		id: TeamId;
		unassignedPlayers: TPlayer[];
		squads: Squad[];
	};

	export type ServerInfo = Partial<TServerInfo> & { initialName: string };
}

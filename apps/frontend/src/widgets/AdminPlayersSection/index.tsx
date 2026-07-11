'use client';

import { useState } from 'react';
import { AdminFractionBlock } from 'widgets/AdminFractionBlock';
import { AdminMessageModal } from 'widgets/AdminMessageModal';
import { AdminSwitchSideModal } from 'widgets/AdminSwitchSideModal';
import { AdminClearNameModal } from 'widgets/AdminClearNameModal';
import { AdminDisbandModal } from 'widgets/AdminDisbandModal';
import { AdminKickModal } from 'widgets/AdminKickModal';
import { AdminKillModal } from 'widgets/AdminKillModal';
import { AdminPunishModal } from 'widgets/AdminPunishModal';
import type { PunishPayload } from 'widgets/AdminPunishModal';
import type { AdminSquad, AdminSquadPlayer } from 'widgets/AdminSquadList';

type TeamData = {
	teamId: string;
	playerCount: number;
	squads: AdminSquad[];
	unassigned: AdminSquadPlayer[];
};

type AdminPlayersSectionProps = {
	team1: TeamData;
	team2: TeamData;
};

type MessageTarget = { squadId: string | number; squadName: string };
type SwitchTarget = { squadId: string | number; squadName: string; players: string[] };
type ClearNameTarget = { squadId: string | number; squadName: string; squadNumber: number };
type DisbandTarget = { squadId: string | number; squadName: string; players: string[] };
type KickTarget = { playerId: string; playerNick: string; squadName: string };
type KillTarget = { playerId: string; playerNick: string };
type PunishTarget = { playerId: string; playerNick: string };

const findSquad = (teams: TeamData[], squadId: string | number): AdminSquad | undefined => {
	for (const team of teams) {
		const squad = team.squads.find((s) => s.id === squadId);
		if (squad) return squad;
	}
	return undefined;
};

const findSquadName = (teams: TeamData[], squadId: string | number): string =>
	findSquad(teams, squadId)?.name ?? String(squadId);

const findPlayerContext = (teams: TeamData[], playerId: string): { playerNick: string; squadName: string } | undefined => {
	for (const team of teams) {
		for (const squad of team.squads) {
			const player = squad.players.find((p) => p.id === playerId);
			if (player) return { playerNick: player.nickname, squadName: squad.name };
		}
	}
	return undefined;
};

export const AdminPlayersSection = ({ team1, team2 }: AdminPlayersSectionProps) => {
	const [messageTarget, setMessageTarget] = useState<MessageTarget | null>(null);
	const [switchTarget, setSwitchTarget] = useState<SwitchTarget | null>(null);
	const [clearNameTarget, setClearNameTarget] = useState<ClearNameTarget | null>(null);
	const [disbandTarget, setDisbandTarget] = useState<DisbandTarget | null>(null);
	const [kickTarget, setKickTarget] = useState<KickTarget | null>(null);
	const [killTarget, setKillTarget] = useState<KillTarget | null>(null);
	const [punishTarget, setPunishTarget] = useState<PunishTarget | null>(null);

	const handleKick = (playerId: string) => {
		const ctx = findPlayerContext([team1, team2], playerId);
		if (!ctx) return;
		setKickTarget({ playerId, ...ctx });
	};
	const handleKill = (playerId: string) => {
		const ctx = findPlayerContext([team1, team2], playerId);
		if (!ctx) return;
		setKillTarget({ playerId, playerNick: ctx.playerNick });
	};
	const handleBan = (playerId: string) => {
		const ctx = findPlayerContext([team1, team2], playerId);
		if (!ctx) return;
		setPunishTarget({ playerId, playerNick: ctx.playerNick });
	};
	const handleTp     = (playerId: string) => console.log('[teleport]', playerId);

	const handleMessage = (squadId: string | number) => {
		const squadName = findSquadName([team1, team2], squadId);
		setMessageTarget({ squadId, squadName });
	};
	const handleSwitch = (squadId: string | number) => {
		const squad = findSquad([team1, team2], squadId);
		if (!squad) return;
		setSwitchTarget({
			squadId,
			squadName: squad.name,
			players: squad.players.map((p) => p.nickname),
		});
	};
	const handleClear = (squadId: string | number) => {
		const squad = findSquad([team1, team2], squadId);
		if (!squad) return;
		setClearNameTarget({ squadId, squadName: squad.name, squadNumber: squad.number });
	};
	const handleDisband = (squadId: string | number) => {
		const squad = findSquad([team1, team2], squadId);
		if (!squad) return;
		setDisbandTarget({ squadId, squadName: squad.name, players: squad.players.map((p) => p.nickname) });
	};

	const handleSend = (text: string) => {
		console.log('[message]', messageTarget?.squadId, text);
	};

	const handleConfirmSwitch = () => {
		console.log('[switch]', switchTarget?.squadId);
	};

	const handleConfirmClearName = () => {
		console.log('[clearName]', clearNameTarget?.squadId);
	};

	const handleConfirmDisband = () => {
		console.log('[disband]', disbandTarget?.squadId);
	};

	const handleConfirmKick = () => {
		console.log('[kick]', kickTarget?.playerId);
	};

	const handleConfirmKill = () => {
		console.log('[kill]', killTarget?.playerId);
	};

	const handlePunishSubmit = (payload: PunishPayload) => {
		console.log('[punish]', punishTarget?.playerId, payload);
	};

	return (
		<>
			{messageTarget && (
				<AdminMessageModal
					squadName={messageTarget.squadName}
					onSend={handleSend}
					onClose={() => setMessageTarget(null)}
				/>
			)}
			{switchTarget && (
				<AdminSwitchSideModal
					squadName={switchTarget.squadName}
					players={switchTarget.players}
					onConfirm={handleConfirmSwitch}
					onClose={() => setSwitchTarget(null)}
				/>
			)}
			{clearNameTarget && (
				<AdminClearNameModal
					squadName={clearNameTarget.squadName}
					squadNumber={clearNameTarget.squadNumber}
					onConfirm={handleConfirmClearName}
					onClose={() => setClearNameTarget(null)}
				/>
			)}
			{disbandTarget && (
				<AdminDisbandModal
					squadName={disbandTarget.squadName}
					players={disbandTarget.players}
					onConfirm={handleConfirmDisband}
					onClose={() => setDisbandTarget(null)}
				/>
			)}
			{kickTarget && (
				<AdminKickModal
					playerNick={kickTarget.playerNick}
					squadName={kickTarget.squadName}
					onConfirm={handleConfirmKick}
					onClose={() => setKickTarget(null)}
				/>
			)}
			{killTarget && (
				<AdminKillModal
					playerNick={killTarget.playerNick}
					onConfirm={handleConfirmKill}
					onClose={() => setKillTarget(null)}
				/>
			)}
			{punishTarget && (
				<AdminPunishModal
					playerNick={punishTarget.playerNick}
					onSubmit={handlePunishSubmit}
					onClose={() => setPunishTarget(null)}
				/>
			)}
			<AdminFractionBlock
				teamId={team1.teamId}
				playerCount={team1.playerCount}
				squads={team1.squads}
				unassigned={team1.unassigned}
				onKickFromSquad={handleKick}
				onKill={handleKill}
				onBan={handleBan}
				onCopyTeleport={handleTp}
				onMessageSquad={handleMessage}
				onSwitchSide={handleSwitch}
				onClearName={handleClear}
				onDisbandSquad={handleDisband}
			/>
			<AdminFractionBlock
				teamId={team2.teamId}
				playerCount={team2.playerCount}
				squads={team2.squads}
				unassigned={team2.unassigned}
				onKickFromSquad={handleKick}
				onKill={handleKill}
				onBan={handleBan}
				onCopyTeleport={handleTp}
				onMessageSquad={handleMessage}
				onSwitchSide={handleSwitch}
				onClearName={handleClear}
				onDisbandSquad={handleDisband}
			/>
		</>
	);
};

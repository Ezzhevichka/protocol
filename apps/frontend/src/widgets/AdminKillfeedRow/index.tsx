import type { KillEvent } from 'widgets/AdminKillfeed/lib/types';

type Props = {
	event: KillEvent;
	isEven: boolean;
	onServerClick?: (id: string) => void;
	onWeaponClick?: (weapon: string) => void;
};

const tdBase: React.CSSProperties = {
	height: 40,
	borderBottom: '1px solid var(--at-border-content)',
};

export const AdminKillfeedRow = ({ event, isEven, onServerClick, onWeaponClick }: Props) => {
	const attackerUrl = `https://steamcommunity.com/profiles/${event.attackerSteamId}`;
	const victimUrl   = `https://steamcommunity.com/profiles/${event.victimSteamId}`;

	return (
		<tr style={{ backgroundColor: isEven ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
			{/* Дата */}
			<td className="px-16 font-mono text-[12px] whitespace-nowrap" style={{ ...tdBase, color: 'var(--at-text-section)' }}>
				{event.date}
			</td>

			{/* Время */}
			<td className="px-16 font-mono text-[12px] whitespace-nowrap" style={{ ...tdBase, color: 'var(--at-text-section)' }}>
				{event.timestamp}
			</td>

			{/* Сервер */}
			<td className="px-16" style={tdBase}>
				<button
					type="button"
					onClick={() => onServerClick?.(event.serverId)}
					className="inline-flex items-center rounded px-7 py-2 text-[11px] font-medium whitespace-nowrap transition-opacity hover:opacity-70"
					style={{
						backgroundColor: 'var(--at-bg-tab-active)',
						border: '1px solid var(--at-border-section)',
						color: 'var(--at-text-section)',
						cursor: onServerClick ? 'pointer' : 'default',
					}}
				>
					{event.serverName}
				</button>
			</td>

			{/* Атакующий */}
			<td className="px-16 text-[13px] whitespace-nowrap" style={{ ...tdBase, color: 'var(--at-text-nav)' }}>
				<a
					href={attackerUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="transition-opacity hover:opacity-70"
					style={{ color: 'inherit', textDecoration: 'none' }}
				>
					{event.attackerName}
				</a>
			</td>

			{/* Оружие */}
			<td className="px-16" style={tdBase}>
				<button
					type="button"
					onClick={() => onWeaponClick?.(event.weapon)}
					className="inline-flex items-center rounded px-7 py-2 text-[11px] font-medium whitespace-nowrap transition-opacity hover:opacity-70"
					style={{
						backgroundColor: 'var(--at-bg-badge-active)',
						border: '1px solid var(--at-border-active)',
						color: 'var(--at-text-nav-active)',
						cursor: onWeaponClick ? 'pointer' : 'default',
					}}
				>
					{event.weapon}
				</button>
			</td>

			{/* Жертва */}
			<td className="px-16 text-[13px] whitespace-nowrap" style={{ ...tdBase, color: 'var(--at-text-nav)' }}>
				<a
					href={victimUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="transition-opacity hover:opacity-70"
					style={{ color: 'inherit', textDecoration: 'none' }}
				>
					{event.victimName}
				</a>
			</td>

			{/* Урон */}
			<td className="px-16 text-[13px] font-semibold whitespace-nowrap" style={{ ...tdBase, color: 'rgba(239,68,68,0.9)' }}>
				{event.damage}
			</td>
		</tr>
	);
};

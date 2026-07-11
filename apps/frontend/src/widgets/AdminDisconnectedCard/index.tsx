import { HugeiconsIcon } from '@hugeicons/react';
import { UserMinus01Icon } from '@hugeicons/core-free-icons';

export type DisconnectedPlayer = {
	id: string;
	nickname: string;
	/** CSS-цвет индикатора фракции */
	teamColor?: string;
	timeAgo?: string;
};

export type AdminDisconnectedCardProps = {
	count?: number;
	periodMinutes?: number;
	players?: DisconnectedPlayer[];
	onShowAll?: () => void;
};


export const AdminDisconnectedCard = ({
	count = 0,
	periodMinutes,
	players = [],
	onShowAll,
}: AdminDisconnectedCardProps) => (
	<div
		className="flex h-full w-full flex-col overflow-hidden rounded-md"
		style={{
			backgroundColor: 'var(--at-glass-bg)',
			border: '1px solid var(--at-glass-border)',
			backdropFilter: 'var(--at-glass-blur)',
			WebkitBackdropFilter: 'var(--at-glass-blur)',
			boxShadow: 'var(--at-glass-shadow)',
		}}
	>
		{/* Заголовок */}
		<div className="flex items-center gap-8 px-14 pt-12 pb-10">
			<span style={{ color: 'var(--at-text-section)' }}>
				<HugeiconsIcon icon={UserMinus01Icon} size={18} color="currentColor" strokeWidth={1.5} />
			</span>
			<span
				className="text-[12px] font-semibold uppercase tracking-wider"
				style={{ color: 'var(--at-text-nav)' }}
			>
				Отключившиеся
			</span>
		</div>

		{/* Статистика */}
		<div
			className="flex items-baseline gap-8 px-14 py-10"
			style={{ borderTop: '1px solid var(--at-border-content)', borderBottom: '1px solid var(--at-border-content)' }}
		>
			<span
				className="text-[20px] font-semibold leading-none tabular-nums"
				style={{ color: 'var(--at-text-nav-active)' }}
			>
				{count}
			</span>
			{periodMinutes !== undefined && (
				<span className="text-[9px]" style={{ color: 'var(--at-text-section)' }}>
					(за {periodMinutes} мин.)
				</span>
			)}
		</div>

		{/* Список игроков */}
		<div className="flex flex-1 flex-col py-6">
			{players.length === 0 ? (
				<span className="px-14 py-8 text-[10px]" style={{ color: 'var(--at-text-section)' }}>
					Нет данных
				</span>
			) : (
				players.map((player, idx) => (
					<div
						key={player.id}
						className="flex h-28 items-center gap-8 px-14"
						style={idx < players.length - 1 ? { borderBottom: '1px solid var(--at-border-content)' } : undefined}
					>
						{/* Индикатор фракции */}
						<span
							className="size-7 shrink-0 rounded-full"
							style={{ backgroundColor: player.teamColor ?? 'var(--at-text-section)' }}
						/>
						{/* Никнейм */}
						<span
							className="flex-1 truncate text-[10px]"
							style={{ color: 'var(--at-text-nav)' }}
						>
							{player.nickname}
						</span>
						{/* Время */}
						{player.timeAgo && (
							<span
								className="shrink-0 text-[8px] tabular-nums"
								style={{ color: 'var(--at-text-section)' }}
							>
								{player.timeAgo}
							</span>
						)}
					</div>
				))
			)}
		</div>

		{/* Кнопка */}
		<div className="px-10 pb-10 pt-4">
			<button
				type="button"
				onClick={onShowAll}
				className="w-full rounded-[3px] py-8 text-[9px] transition-opacity duration-150 hover:opacity-80"
				style={{
					cursor: 'pointer',
					backgroundColor: 'var(--at-bg-tab-inactive)',
					border: '1px solid var(--at-border-tab-inactive)',
					color: 'var(--at-text-section)',
				}}
			>
				Показать всех
			</button>
		</div>
	</div>
);

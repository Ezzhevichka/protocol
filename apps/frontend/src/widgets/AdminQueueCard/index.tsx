import Image from 'next/image';

import { resolveKitIcon, resolveKitIconSize } from 'shared/constants';

export type QueuePlayer = {
	id: string;
	nickname: string;
	role?: string;
};

export type AdminQueueCardProps = {
	queueCount?: number;
	avgWaitTime?: string;
	players?: QueuePlayer[];
	onManage?: () => void;
};

const IconFlame = () => (
	<svg width="10" height="13" viewBox="0 0 10 13" fill="none">
		<path
			d="M5 0C5 0 8.5 3.5 8.5 7a3.5 3.5 0 0 1-7 0C1.5 5 3 3 3 3S2 5.5 3.5 7A1.5 1.5 0 0 0 6 7c0-1.5-1-4-1-7Z"
			fill="currentColor"
		/>
	</svg>
);

export const AdminQueueCard = ({
	queueCount = 0,
	avgWaitTime,
	players = [],
	onManage,
}: AdminQueueCardProps) => (
	<div
		className="flex h-full w-full flex-col overflow-hidden rounded-[6px]"
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
				<IconFlame />
			</span>
			<span
				className="text-[12px] font-semibold uppercase tracking-wider"
				style={{ color: 'var(--at-text-nav)' }}
			>
				очередь
			</span>
		</div>

		{/* Статистика */}
		<div
			className="flex items-center px-14 py-10"
			style={{ borderTop: '1px solid var(--at-border-content)', borderBottom: '1px solid var(--at-border-content)' }}
		>
			<div className="flex flex-1 flex-col gap-4">
				<span className="text-[9px]" style={{ color: 'var(--at-text-section)' }}>
					В очереди
				</span>
				<span
					className="text-[16px] font-semibold leading-none tabular-nums"
					style={{ color: '#c7920b' }}
				>
					{queueCount}
				</span>
			</div>

			<div
				className="mx-10 self-stretch"
				style={{ width: 1, backgroundColor: 'var(--at-border-divider)' }}
			/>

			<div className="flex flex-1 flex-col gap-4">
				<span className="text-[9px]" style={{ color: 'var(--at-text-section)' }}>
					Среднее время
				</span>
				<span
					className="text-[16px] font-semibold leading-none tabular-nums"
					style={{ color: 'var(--at-text-nav-active)' }}
				>
					{avgWaitTime ?? '—:——'}
				</span>
			</div>
		</div>

		{/* Список игроков */}
		<div className="flex flex-1 flex-col py-6">
			{players.length === 0 ? (
				<span className="px-14 py-8 text-[10px]" style={{ color: 'var(--at-text-section)' }}>
					Очередь пуста
				</span>
			) : (
				players.map((player, idx) => {
					const icon = resolveKitIcon(player.role);
					const iconSize = resolveKitIconSize(player.role);
					const hasIcon = Boolean(player.role);

					return (
						<div
							key={player.id}
							className="flex h-[30px] items-center gap-8 px-14"
							style={idx < players.length - 1 ? { borderBottom: '1px solid var(--at-border-content)' } : undefined}
						>
							<span
								className="w-[14px] shrink-0 text-right text-[9px] tabular-nums"
								style={{ color: 'var(--at-text-section)' }}
							>
								{idx + 1}.
							</span>
							<span className="flex size-[16px] shrink-0 items-center justify-center">
								{hasIcon && (
									<Image
										src={icon}
										alt=""
										aria-hidden="true"
										width={iconSize.width}
										height={iconSize.height}
										unoptimized
										className="block h-auto w-auto"
									/>
								)}
							</span>
							<span
								className="flex-1 truncate text-[10px]"
								style={{ color: 'var(--at-text-nav)' }}
							>
								{player.nickname}
							</span>
						</div>
					);
				})
			)}
		</div>

		{/* Кнопка управления */}
		<div className="px-10 pb-10 pt-4">
			<button
				type="button"
				onClick={onManage}
				className="w-full rounded-[3px] py-8 text-[9px] transition-opacity duration-150 hover:opacity-80"
				style={{
					cursor: 'pointer',
					backgroundColor: 'var(--at-bg-tab-inactive)',
					border: '1px solid var(--at-border-tab-inactive)',
					color: 'var(--at-text-section)',
				}}
			>
				Управление очередью
			</button>
		</div>
	</div>
);

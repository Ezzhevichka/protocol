'use client';

import { useEffect, useRef, useState } from 'react';

export type ChatMessage = {
	id: string;
	sender: string;
	/** CSS-цвет имени отправителя */
	senderColor?: string;
	text: string;
};

export type AdminChatCardProps = {
	messages?: ChatMessage[];
	onSend?: (text: string) => void;
};

const IconChat = () => (
	<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
		<path
			d="M1 1.5A.5.5 0 0 1 1.5 1h7a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H3L1 9V1.5Z"
			stroke="currentColor"
			strokeWidth="1.2"
			strokeLinejoin="round"
		/>
	</svg>
);

const IconSend = () => (
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
		<path
			d="M10.5 6 1.5 1.5l2.25 4.5-2.25 4.5L10.5 6Z"
			stroke="currentColor"
			strokeWidth="1.2"
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
	</svg>
);

export const AdminChatCard = ({
	messages = [],
	onSend,
}: AdminChatCardProps) => {
	const [input, setInput] = useState('');
	const listRef = useRef<HTMLDivElement>(null);

	// Автоскролл вниз при новых сообщениях
	useEffect(() => {
		const el = listRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages]);

	const handleSend = () => {
		const text = input.trim();
		if (!text) return;
		onSend?.(text);
		setInput('');
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleSend();
	};

	return (
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
					<IconChat />
				</span>
				<span
					className="text-[12px] font-semibold uppercase tracking-wider"
					style={{ color: 'var(--at-text-nav)' }}
				>
					Чат
				</span>
			</div>

			{/* Список сообщений */}
			<div
				ref={listRef}
				className="flex flex-1 flex-col overflow-y-auto py-6"
				style={{ borderTop: '1px solid var(--at-border-content)' }}
			>
				{messages.length === 0 ? (
					<span className="px-14 py-8 text-[10px]" style={{ color: 'var(--at-text-section)' }}>
						Сообщений нет
					</span>
				) : (
					messages.map((msg, idx) => (
						<div
							key={msg.id}
							className="flex min-h-[26px] items-baseline gap-6 px-14 py-[4px]"
							style={
								idx < messages.length - 1
									? { borderBottom: '1px solid var(--at-border-content)' }
									: undefined
							}
						>
							<span
								className="shrink-0 text-[9px] font-medium"
								style={{ color: msg.senderColor ?? 'var(--at-text-nav)' }}
							>
								{msg.sender}:
							</span>
							<span
								className="text-[9px] leading-[1.4]"
								style={{ color: 'var(--at-text-section)' }}
							>
								{msg.text}
							</span>
						</div>
					))
				)}
			</div>

			{/* Поле ввода */}
			<div
				className="flex items-center gap-8 px-10 py-8"
				style={{ borderTop: '1px solid var(--at-border-content)' }}
			>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Написать сообщение…"
					className="flex-1 bg-transparent text-[9px] outline-none placeholder:opacity-40"
					style={{ color: 'var(--at-text-nav)' }}
				/>
				<button
					type="button"
					onClick={handleSend}
					disabled={!input.trim()}
					className="flex size-[22px] shrink-0 items-center justify-center rounded-[3px] transition-opacity duration-150"
					style={{
						backgroundColor: input.trim() ? 'var(--at-accent)' : 'var(--at-bg-tab-inactive)',
						border: '1px solid var(--at-border-tab-inactive)',
						color: input.trim() ? '#fff' : 'var(--at-text-section)',
						cursor: input.trim() ? 'pointer' : 'default',
						opacity: input.trim() ? 1 : 0.5,
						transition: 'background-color 150ms ease, opacity 150ms ease',
					}}
				>
					<IconSend />
				</button>
			</div>
		</div>
	);
};

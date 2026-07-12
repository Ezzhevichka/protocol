export const AdminLoadingOverlay = () => (
	<div
		className="absolute inset-0 z-10 flex items-center justify-center"
		style={{
			backgroundColor: 'var(--at-glass-bg)',
			backdropFilter: 'blur(2px)',
			WebkitBackdropFilter: 'blur(2px)',
		}}
	>
		<div className="flex flex-col items-center gap-12">
			<div
				className="size-30 animate-spin rounded-full"
				style={{
					border: '2px solid var(--at-border-content)',
					borderTopColor: 'var(--at-accent)',
				}}
			/>
			<span className="text-[11px] font-medium" style={{ color: 'var(--at-text-section)' }}>
				Загрузка…
			</span>
		</div>
	</div>
);

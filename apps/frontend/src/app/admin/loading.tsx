export default function AdminLoading() {
    return (
        <div className="flex flex-1 items-center justify-center px-20 pb-20">
            <div className="flex flex-col items-center gap-12">
                <div
                    className="size-[32px] animate-spin rounded-full"
                    style={{
                        border: '2px solid var(--at-border-content)',
                        borderTopColor: 'var(--at-accent)',
                    }}
                />
                <span className="text-[11px] font-medium" style={{ color: 'var(--at-text-section)' }}>
                    Загрузка данных сервера…
                </span>
            </div>
        </div>
    );
}

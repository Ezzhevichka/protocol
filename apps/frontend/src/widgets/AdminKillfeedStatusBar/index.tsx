type Props = {
  shown: number;
  total: number;
  maxRows: number;
};

export const AdminKillfeedStatusBar = ({ shown, total, maxRows }: Props) => {
  if (total <= maxRows) return null;

  return (
    <div
      className="px-16 py-8 text-[11px]"
      style={{
        color: 'var(--at-text-section)',
        borderTop: '1px solid var(--at-border-section)',
      }}
    >
      Показаны последние{' '}
      <span style={{ color: 'var(--at-text-nav-active)', fontWeight: 600 }}>{shown}</span>
      {' из '}
      <span style={{ color: 'var(--at-text-nav)' }}>{total}</span>
      {' событий'}
    </div>
  );
};

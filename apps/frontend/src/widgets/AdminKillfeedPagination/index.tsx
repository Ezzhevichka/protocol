import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

type Props = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

const btnBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 8,
  border: '1px solid var(--at-border)',
  backgroundColor: 'var(--at-bg-content)',
  color: 'var(--at-text-nav)',
  cursor: 'pointer',
  flexShrink: 0,
};

export const AdminKillfeedPagination = ({ page, pageCount, onChange }: Props) => {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  // Показываем не более 7 кнопок: первую, последнюю и ±2 от текущей
  const visible = pages.filter((p) =>
    p === 1 || p === pageCount || Math.abs(p - page) <= 2
  );

  const renderPage = (p: number, key: string | number) => {
    const isActive = p === page;
    return (
      <button
        key={key}
        type="button"
        onClick={() => onChange(p)}
        style={{
          ...btnBase,
          backgroundColor: isActive ? 'var(--at-bg-active)' : 'var(--at-bg-content)',
          border: isActive ? '1px solid var(--at-border-active)' : '1px solid var(--at-border)',
          color: isActive ? 'var(--at-text-nav-active)' : 'var(--at-text-nav)',
          fontWeight: isActive ? 600 : 400,
          fontSize: 13,
        }}
      >
        {p}
      </button>
    );
  };

  const withEllipsis: React.ReactNode[] = [];
  visible.forEach((p, i) => {
    if (i > 0 && p - visible[i - 1] > 1) {
      withEllipsis.push(
        <span key={`e-${p}`} className="text-[13px] px-4" style={{ color: 'var(--at-text-section)' }}>
          …
        </span>
      );
    }
    withEllipsis.push(renderPage(p, p));
  });

  return (
    <div className="flex items-center gap-6 px-16 py-12">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        style={{ ...btnBase, opacity: page === 1 ? 0.35 : 1 }}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="currentColor" strokeWidth={1.5} />
      </button>

      {withEllipsis}

      <button
        type="button"
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        style={{ ...btnBase, opacity: page === pageCount ? 0.35 : 1 }}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={1.5} />
      </button>

      <span className="ml-8 text-[11px]" style={{ color: 'var(--at-text-section)' }}>
        стр. {page} / {pageCount}
      </span>
    </div>
  );
};

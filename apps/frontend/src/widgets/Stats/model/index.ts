import type { StatCard } from 'shared/types';

export type { StatPlayer, StatCard as StatCardData } from 'shared/types';

export type StatsProps = {
  title?: string;
  dateRange?: string;
  cards: StatCard[];
  className?: string;
};

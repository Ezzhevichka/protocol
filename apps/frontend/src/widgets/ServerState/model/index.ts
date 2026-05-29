import type { ServerLevelType } from 'shared/types';

export type { ServerLevelType };

export type ServerLevelInfo = {
  label: string;
  icon: string;
  titleClassName: string;
  infoClassName: string;
};

export type ServerStateProps = {
  hoursAmount: number | string;
  openProfilePercentages: number | string;
  level?: ServerLevelType;
  title?: string;
  className?: string;
};

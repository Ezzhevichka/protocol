export type PlayerCardVariant = 'default' | 'extended';

export type PlayerCardProps = {
  kitName?: string;
  kitIcon?: string;
  nickname: string;
  caption?: string;
  role?: string;
  hashNumber?: string | number;
  variant?: PlayerCardVariant;
  showDivider?: boolean;
  className?: string;
};

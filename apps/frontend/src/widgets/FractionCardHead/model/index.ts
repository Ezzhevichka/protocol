export type FractionCardHeadVariant = 'default' | 'withPlayers';

export type FractionCardHeadProps = {
  playersAmount: number | string;
  hoursAmount: number | string;
  variant?: FractionCardHeadVariant;
  className?: string;
};

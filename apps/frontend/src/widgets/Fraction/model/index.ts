export type FractionVariant = "large" | "small";
export type FractionSmallSide = "left" | "right";

export type FractionProps = {
  playersAmount: number | string;
  fractionName: string;
  doctrine: string;
  flag: string;
  variant?: FractionVariant;
  smallSide?: FractionSmallSide;
  className?: string;
};

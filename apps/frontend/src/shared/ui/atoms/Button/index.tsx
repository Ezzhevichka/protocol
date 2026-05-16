import cn from "classnames";
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import "./styles.css";

export enum ButtonVariant {
  Primary = "Primary",
  Secondary = "Secondary",
  Tertiary = "Tertiary",
}

export enum ButtonAppearance {
  Accent = "Accent",
  Neutral = "Neutral",
  Positive = "Positive",
  Vip = "Vip",
  Discord = "Discord",
}

export enum ButtonSize {
  S = "S",
  M = "M",
  L = "L",
}

export enum ButtonState {
  Default = "Default",
  Hover = "Hover",
  Disabled = "Disabled",
}

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & PropsWithChildren & {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  loading?: boolean;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  state?: ButtonState;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
};

const SIZE_CLASS_MAP: Record<ButtonSize, { button: string; text: string; icon: string }> = {
  [ButtonSize.S]: { button: "btn-kit-size-s", text: "btn-kit-text-s", icon: "btn-kit-icon-s" },
  [ButtonSize.M]: { button: "btn-kit-size-m", text: "btn-kit-text-m", icon: "btn-kit-icon-m" },
  [ButtonSize.L]: { button: "btn-kit-size-l", text: "btn-kit-text-l", icon: "btn-kit-icon-l" },
};

const VARIANT_CLASS_MAP = {
  [ButtonVariant.Primary]: {
    [ButtonAppearance.Accent]: "btn-primary-accent",
    [ButtonAppearance.Neutral]: "btn-primary-neutral",
    [ButtonAppearance.Positive]: "btn-primary-positive",
    [ButtonAppearance.Vip]: "btn-primary-vip",
    [ButtonAppearance.Discord]: "btn-primary-discord",
  },
  [ButtonVariant.Secondary]: {
    [ButtonAppearance.Accent]: "btn-secondary-accent",
    [ButtonAppearance.Neutral]: "btn-secondary-neutral",
  },
  [ButtonVariant.Tertiary]: {
    [ButtonAppearance.Accent]: "btn-tertiary-accent",
    [ButtonAppearance.Neutral]: "btn-tertiary-neutral",
  },
} as const;

const DEFAULT_APPEARANCE_MAP: Record<ButtonVariant, ButtonAppearance> = {
  [ButtonVariant.Primary]: ButtonAppearance.Accent,
  [ButtonVariant.Secondary]: ButtonAppearance.Neutral,
  [ButtonVariant.Tertiary]: ButtonAppearance.Neutral,
};

const isAppearanceSupported = (variant: ButtonVariant, appearance: ButtonAppearance) => {
  return appearance in VARIANT_CLASS_MAP[variant];
};

const ArrowIcon = ({ direction, className = "" }: { direction: "left" | "right"; className?: string }) => {
  const path =
    direction === "left"
      ? "M8.20711 14.7071C8.59763 14.3166 8.59763 13.6834 8.20711 13.2929L2.41421 7.5L8.20711 1.70711C8.59763 1.31658 8.59763 0.683418 8.20711 0.292894C7.81658 -0.0976312 7.18342 -0.0976312 6.79289 0.292894L0.292893 6.79289C-0.0976311 7.18342 -0.0976311 7.81658 0.292893 8.20711L6.79289 14.7071C7.18342 15.0976 7.81658 15.0976 8.20711 14.7071Z"
      : "M0.292894 0.292893C-0.0976299 0.683417 -0.09763 1.31658 0.292894 1.70711L6.08579 7.5L0.292893 13.2929C-0.0976311 13.6834 -0.0976311 14.3166 0.292893 14.7071C0.683417 15.0976 1.31658 15.0976 1.70711 14.7071L8.20711 8.20711C8.59763 7.81658 8.59763 7.18342 8.20711 6.79289L1.70711 0.292893C1.31658 -0.097631 0.683418 -0.0976311 0.292894 0.292893Z";

  return (
    <svg className={className} viewBox="0 0 9 15" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d={path} fill="currentColor" />
    </svg>
  );
};

export const Button = ({
  type = "button",
  loading = false,
  variant = ButtonVariant.Primary,
  appearance = ButtonAppearance.Accent,
  size = ButtonSize.L,
  state = ButtonState.Default,
  leftIcon,
  rightIcon,
  showLeftIcon = false,
  showRightIcon = false,
  children,
  disabled,
  className,
  ...restProps
}: ButtonProps) => {
  const isDisabled = Boolean(state === ButtonState.Disabled || disabled || loading);
  const isHoverPreview = state === ButtonState.Hover;

  const resolvedAppearance = isAppearanceSupported(variant, appearance) ? appearance : DEFAULT_APPEARANCE_MAP[variant];
  const variantClass = VARIANT_CLASS_MAP[variant][resolvedAppearance as keyof (typeof VARIANT_CLASS_MAP)[typeof variant]];
  const sizeClasses = SIZE_CLASS_MAP[size];

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        "btn-kit",
        "cursor-pointer",
        "select-none",
        "disabled:cursor-not-allowed",
        "disabled:pointer-events-none",
        { "btn-force-hover": isHoverPreview },
        sizeClasses.button,
        variantClass,
        className,
      )}
      {...restProps}
    >
      {showLeftIcon && (leftIcon || <ArrowIcon direction="left" className={sizeClasses.icon} />)}
      {children && <span className={cn("btn-kit-label", sizeClasses.text)}>{children}</span>}
      {showRightIcon && (rightIcon || <ArrowIcon direction="right" className={sizeClasses.icon} />)}
    </button>
  );
};

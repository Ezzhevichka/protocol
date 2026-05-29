// components/Text/Text.tsx
import type { CSSProperties, ElementType, ReactNode } from 'react';

interface TextProps<T extends ElementType = 'p'> {
  /** HTML тег или React компонент для рендеринга */
  as?: T;
  /** Дочерние элементы */
  children: ReactNode;
  /** Дополнительные CSS классы */
  className?: string;
  /** Вариант стилизации */
  variant?: 'default' | 'muted' | 'error' | 'success' | 'warning' | 'primary';
  /** Размер текста */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  /** Насыщенность шрифта */
  weight?: 'thin' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  /** Выравнивание текста */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Дополнительные стили */
  style?: CSSProperties;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

const weightClasses = {
  thin: 'font-thin',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const variantClasses = {
  default: '',
  muted: 'text-gray-400',
  error: 'text-red-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  primary: 'text-white-primary',
};

export function Text<T extends ElementType = 'p'>({
  as,
  children,
  className = '',
  variant = 'default',
  size = 'base',
  weight = 'normal',
  align = 'left',
  style,
  ...props
}: TextProps<T>) {
  const Component = as || 'p';

  const baseClasses = 'leading-normal transition-colors duration-200';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    weightClasses[weight],
    alignClasses[align],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} style={style} {...props}>
      {children}
    </Component>
  );
}

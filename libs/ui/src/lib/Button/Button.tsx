import clsx from 'clsx';
import type { JSX, ReactNode } from 'react';
import { type VariantProps, tv } from 'tailwind-variants';

const loading = tv({
  base: ['absolute', 'flex', 'items-center '],
  variants: {
    variant: {
      primary: ['border-white'],
      'primary-900': ['border-white'],
      secondary: ['border-gray-950'],
      destructive: ['border-white'],
      disabled: ['border-gray-300'],
      'grey-400': ['border-gray-400'],
      'grey-300': ['border-gray-300'],
      'grey-600': ['border-gray-600'],
      'grey-200': ['border-gray-200'],
      'danger-500': ['border-danger-500'],
    },
  },
});

type LoadingVariant = VariantProps<typeof loading>['variant'];

const Loading = ({ variant }: { variant?: LoadingVariant }) => (
  <div className={loading({ variant })}>
    <div className="w-4 h-4 rounded-full border-2 border-b-transparent animate-spin border-[inherit]" />
  </div>
);

const variants = tv({
  base: [
    'flex items-center justify-center rounded-lg cursor-pointer transition-all outline-none focus-visible:ring-4 font-ubuntu gap-1 ring-(--bg-color)/50 hover:[--bg-color:var(--hover-color)]',
  ],
  variants: {
    disabled: {
      true: '!bg-grey-200 !text-grey-300 !border-grey-300 pointer-events-none cursor-not-allowed',
    },
    color: {
      primary: [
        '[--bg-color:var(--color-primary-500)]',
        '[--fg-color:var(--color-primary-foreground)]',
        '[--hover-color:var(--color-primary-200)]',
        '[--hover-text-color:var(--color-primary-foreground)]',
      ],
      'primary-900': [
        '[--bg-color:var(--color-primary-900)]',
        '[--fg-color:var(--color-primary-foreground)]',
        '[--hover-color:var(--color-primary)]',
        '[--hover-text-color:var(--color-primary-foreground)]',
      ],
      'grey-400': [
        '[--bg-color:var(--color-grey-400)]',
        '[--fg-color:var(--color-primary-foreground)]',
        '[--hover-color:var(--color-grey-300)]',
        '[--hover-text-color:var(--color-primary-foreground)]',
      ],
      'grey-300': [
        '[--bg-color:var(--color-grey-300)]',
        '[--fg-color:var(--color-primary-foreground)]',
        '[--hover-color:var(--color-grey-200)]',
        '[--hover-text-color:var(--color-primary-foreground)]',
      ],
      'grey-600': [
        '[--bg-color:var(--color-grey-600)]',
        '[--fg-color:var(--color-background)]',
        '[--hover-color:var(--color-grey-500)]',
        '[--hover-text-color:var(--color-background)]',
      ],
      'grey-200': [
        '[--bg-color:var(--color-grey-200)]',
        '[--fg-color:var(--color-foreground)]',
        '[--hover-color:var(--color-grey-100)]',
        '[--hover-text-color:var(--color-foreground)]',
      ],
      'danger-500': [
        '[--bg-color:var(--color-danger-500)]',
        '[--fg-color:var(--color-danger-foreground)]',
        '[--hover-color:var(--color-danger-200)]',
        '[--hover-text-color:var(--color-danger-foreground)]',
      ],
    },
    variant: {
      default:
        'bg-(--bg-color) text-(--fg-color) hover:text-(--hover-text-color)',
      outline: 'bg-transparent border border-(--bg-color) text-(--bg-color)',
      simple:
        'bg-transparent !px-0 !py-0 !h-auto !min-h-auto text-(--bg-color)',
    },
    size: {
      small: ['text-sm', 'min-h-8', 'px-2'],
      default: ['text-base', 'min-h-10', 'px-4'],
      large: ['text-lg', 'min-h-12', 'px-6'],
    },
    iconPosition: {
      before: ['flex-row'],
      after: ['flex-row-reverse'],
    },
  },
  defaultVariants: {
    color: 'primary',
    variant: 'default',
    size: 'default',
    iconPosition: 'before',
    disabled: false,
  },
});

type ButtonColor = VariantProps<typeof variants>['color'];
type ButtonVariant = VariantProps<typeof variants>['variant'];
type ButtonSize = VariantProps<typeof variants>['size'];

type ButtonProps = JSX.IntrinsicElements['button'] & {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'before' | 'after';
};

const Button = ({
  variant,
  color,
  size,
  icon,
  iconPosition,
  className,
  children,
  loading,
  disabled,
  ...rest
}: ButtonProps) => (
  <button
    className={variants({
      variant,
      color,
      size,
      iconPosition,
      disabled,
      className,
    })}
    disabled={disabled}
    {...rest}
  >
    {loading && <Loading variant={color} />}
    <span
      className={clsx('transition flex items-center justify-center gap-1', {
        'opacity-0': loading,
        'opacity-100': !loading,
      })}
    >
      {icon}
      {children}
    </span>
  </button>
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };

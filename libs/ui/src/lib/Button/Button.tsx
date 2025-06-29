import clsx from 'clsx';
import type { JSX } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

const variants = tv({
  base: [
    'inline-flex',
    'items-center',
    'justify-center',
    'relative',
    'cursor-pointer',
    'disabled:cursor-not-allowed',
    'tracking-wide',
    'transition',
    'rounded-full',
    'outline-none',
    'focus:scale-[0.98]',
    'font-ubuntu',
  ],
  variants: {
    variant: {
      primary: [
        'font-semibold',
        'bg-primary',
        'hover:bg-primary-200',
        'text-background',
        'shadow',
        'hover:shadow-md',
        'disabled:bg-indigo-500/50',
        'disabled:shadow',
        'ring-offset-2',
        'focus-visible:ring-2',
        'ring-indigo-500/70',
      ],
      destructive: [
        'font-semibold',
        'bg-red-500',
        'hover:bg-red-600',
        'text-white',
        'rounded-full',
        'shadow',
        'hover:shadow-md',
        'disabled:bg-red-500/50',
        'disabled:shadow',
        'ring-offset-2',
        'focus-visible:ring-2',
        'ring-red-500',
      ],
      ghost: [
        'font-light',
        'text-gray-950',
        'hover:text-gray-600',
        'disabled:text-gray-950',
        'ring-gray-300',
        'focus-visible:ring-1',
      ],
      link: [
        'font-light',
        'text-indigo-500',
        'hover:text-indigo-600',
        'disabled:text-indigo-500/50',
        'disabled:no-underline',
        'hover:underline',
        'ring-indigo-300',
        'focus-visible:ring-1',
      ],
    },
    size: {
      small: ['text-sm', 'py-1', 'px-4'],
      default: ['text-base', 'py-2', 'px-8'],
      large: ['text-lg', 'py-3', 'px-12'],
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

const loading = tv({
  base: ['absolute', 'inline-flex', 'items-center'],
  variants: {
    variant: {
      primary: ['border-white'],
      secondary: ['border-gray-950'],
      destructive: ['border-white'],
      ghost: ['border-gray-950'],
      link: ['border-indigo-500'],
    },
  },
});

type LoadingVariant = VariantProps<typeof loading>['variant'];

const Loading = ({ variant }: { variant?: LoadingVariant }) => (
  <div className={loading({ variant })}>
    <div className="w-4 h-4 rounded-full border-2 border-b-transparent animate-spin border-[inherit]" />
  </div>
);

type ButtonVariant = VariantProps<typeof variants>['variant'];
type ButtonSize = VariantProps<typeof variants>['size'];

type ButtonProps = JSX.IntrinsicElements['button'] & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const Button = ({
  className,
  children,
  variant,
  size,
  loading,
  ...rest
}: ButtonProps) => (
  <button className={variants({ variant, size, className })} {...rest}>
    {loading && <Loading variant={variant} />}
    <span
      className={clsx('transition', {
        'opacity-0': loading,
        'opacity-100': !loading,
      })}
    >
      {children}
    </span>
  </button>
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };

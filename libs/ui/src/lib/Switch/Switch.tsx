import clsx from 'clsx';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const switchVariants = tv({
  slots: {
    root: [
      'relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-gray-300',
      'transition-colors duration-200 ease-in-out',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ],
    input: 'sr-only peer',
    thumb: [
      'pointer-events-none block rounded-full bg-white shadow-lg ring-0',
      'transition-transform duration-200 ease-in-out',
    ],
  },
  variants: {
    size: {
      sm: {
        root: 'h-4 w-7',
        thumb: 'h-3 w-3 peer-checked:translate-x-3',
      },
      base: {
        root: 'h-6 w-11',
        thumb: 'h-5 w-5 peer-checked:translate-x-5',
      },
    },
    checked: {
      true: {
        root: 'bg-primary border-primary',
      },
      false: {
        root: 'bg-gray-200',
      },
    },
  },
  defaultVariants: {
    size: 'base',
    checked: false,
  },
});

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'>,
    VariantProps<typeof switchVariants> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    { className, size, checked, onCheckedChange, onChange, disabled, ...props },
    ref
  ) => {
    const styles = switchVariants({ size, checked: !!checked });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    return (
      <label className={clsx(styles.root(), className)}>
        <input
          ref={ref}
          type="checkbox"
          className={styles.input()}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <span className={styles.thumb()} />
      </label>
    );
  }
);

Switch.displayName = 'Switch';

import { CheckIcon, MinusIcon } from '@phosphor-icons/react';
import clsx from 'clsx';
import type { JSX } from 'react';
import { tv } from 'tailwind-variants';

type CheckBoxVariant = 'button' | 'default';

interface CheckboxCustomProps {
  className?: string;
  disabled?: boolean;
  label?: string;
  variant?: CheckBoxVariant;
  selectedAll?: boolean;
}

type CheckboxNativeProps = JSX.IntrinsicElements['input'];

type CheckboxProps = CheckboxNativeProps & CheckboxCustomProps;

const checkbox = tv({
  slots: {
    root: 'select-none',
    label: 'flex items-center gap-2',
    input: 'block peer accent-primary stroke-white',
  },
  variants: {
    variant: {
      button: {
        input: 'sr-only',
      },
      default: '',
    },
    disabled: {
      true: {
        label: 'cursor-not-allowed',
      },
      false: {
        label: 'cursor-pointer',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const Checkbox = ({
  className,
  disabled,
  label,
  variant,
  selectedAll,
  onChange,
  checked,
  ...props
}: CheckboxProps) => {
  const checkboxTailwind = checkbox({ variant, disabled });
  let checkboxLabel: JSX.Element | string | undefined = label;

  switch (variant) {
    case 'button':
      checkboxLabel = (
        <span className="text-base w-full items-center h-10 flex justify-center peer-checked:bg-primary-500 peer-checked:text-primary-foreground peer-focus-visible:ring-4 peer-focus-visible:ring-primary-500/50 rounded transition-all">
          {label}
        </span>
      );
      break;
  }

  return (
    <div className={clsx(checkboxTailwind.root(), className)}>
      <label className={checkboxTailwind.label()}>
        <input
          className="sr-only peer"
          type="checkbox"
          disabled={disabled}
          onChange={onChange}
          checked={checked}
          {...props}
        />
        <div
          className="w-4 h-4 rounded-sm border flex items-center justify-center 
           peer-checked:bg-primary peer-checked:border-primary text-xs transition-colors peer-not-checked:[&>svg]:hidden peer-checked:[&>svg]:block"
        >
          {selectedAll ? (
            <MinusIcon weight="bold" className="text-white h-3 w-3" />
          ) : (
            <CheckIcon className="text-white h-3 w-[9.375px]" />
          )}
        </div>
        {checkboxLabel}
      </label>
    </div>
  );
};

Checkbox.displayName = 'Checkbox';

import { CircleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';
import { JSX, ReactNode } from 'react';
import { tv } from 'tailwind-variants';

type RadioVariant = 'default' | 'button';

interface RadioCustomProps {
  className?: string;
  disabled?: boolean;
  label?: ReactNode | string;
  variant?: RadioVariant;
}

type RadioNativeProps = JSX.IntrinsicElements['input'];

type RadioProps = RadioNativeProps & RadioCustomProps;

const radio = tv({
  slots: {
    label: 'flex items-center gap-2 leading-[1.1875]',
    inputWrapper:
      'flex items-center justify-center relative rounded-full text-xs',
    input:
      'block peer appearance-none rounded-full size-4 border-grey-500 border ',
    icon: 'hidden peer-checked:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-auto text-grey-500',
    checkedIcon: '',
    span: [
      'w-[7rem] h-10 flex justify-center items-center rounded-lg',
      'text-base font-lato',
    ],
  },
  variants: {
    variant: {
      default: {
        input: 'checked:bg-background checked:border-grey-500',
        label: '',
      },
      button: {
        input: 'sr-only peer',
        label: 'flex items-center border-primary border rounded-lg',
      },
    },
    disabled: {
      true: {
        label: 'cursor-not-allowed hover:outline-none',
      },
      false: {
        label: 'cursor-pointer',
      },
    },
  },
});

export const Radio = ({
  className,
  disabled,
  label,
  variant = 'default',
  checked,
  ...props
}: RadioProps) => {
  const radioTailwind = radio({ variant, disabled });

  let radioLabel: ReactNode | string | undefined = label;

  switch (variant) {
    case 'button':
      radioLabel = (
        <span className="text-base w-full items-center h-10 flex justify-center peer-checked:bg-primary-500 peer-checked:text-primary-foreground peer-focus-visible:ring-4 peer-focus-visible:ring-primary-500/50 rounded transition-all">
          {label}
        </span>
      );
      break;
  }

  return (
    <label className={clsx(radioTailwind.label({ variant }), className)}>
      {variant === 'button' ? (
        <input
          aria-checked={checked}
          checked={checked}
          className={radioTailwind.input()}
          disabled={disabled}
          type="radio"
          {...props}
        />
      ) : (
        <span className={radioTailwind.inputWrapper()}>
          <input
            aria-checked={checked}
            checked={checked}
            className={radioTailwind.input()}
            disabled={disabled}
            type="radio"
            {...props}
          />
          <CircleIcon weight="fill" className={radioTailwind.icon()} />
        </span>
      )}
      {radioLabel}
    </label>
  );
};

Radio.displayName = 'Radio';

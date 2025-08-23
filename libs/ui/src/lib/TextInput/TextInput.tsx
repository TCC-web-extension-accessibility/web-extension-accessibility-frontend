import clsx from 'clsx';
import type { ChangeEvent, JSX } from 'react';
import { useEffect, useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { tv } from 'tailwind-variants';
import type { ButtonProps } from '../Button/Button';
import { Button } from '../Button/Button';

export type TextInputCustomProps = {
  disabled?: boolean;
  error?: React.ReactNode;
  success?: React.ReactNode;
  helpText?: React.ReactNode;
  label: React.ReactNode;
  hideLabel?: boolean;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'before' | 'after';
  buttonProps?: Pick<
    ButtonProps,
    'icon' | 'iconPosition' | 'size' | 'variant' | 'className'
  >;
  register?: UseFormRegisterReturn;
};

type TextInputNativeProps = JSX.IntrinsicElements['input'];

export type TextInputProps = TextInputNativeProps & TextInputCustomProps;

const textInput = tv({
  base: 'flex flex-col gap-2 w-full',
  slots: {
    labelSpan:
      'font-lato text-base font-normal text-foreground leading-[1.1875]',
    inputDiv:
      'flex w-full h-full max-h-10 rounded-lg border-solid border-1 border-grey-500 group has-[input:focus]:border-foreground has-[input:focus]:ring-2 has-[input:focus]:ring-foreground/50 flex-1 gap-2 py-[9.5px] px-4 items-center',

    input:
      'w-full border-none h-4.75 bg-transparent m-0 outline-none shadow-none appearance-none text-foreground placeholder-shown:text-grey-500 leading-[1.1875]',
    icon: 'group-has-[input:focus]:text-foreground text-grey-500',
    button:
      'mr-[-0.75rem] my-[-0.5rem] aspect-square flex items-center justify-center',
    text: 'font-lato text-sm font-normal text-grey-600',
  },
  variants: {
    hasError: {
      true: {
        inputDiv: '!border-danger-500 has-[input:focus]:ring-danger-500/50',
        icon: '!text-danger-500',
        text: '!text-danger-500',
      },
    },
    isDisabled: {
      true: {
        labelSpan: 'text-grey-300',
        input: 'text-grey-300',
        inputDiv: '!border-grey-300 bg-disabled-input-background',
        icon: '!text-grey-300',
      },
    },
    hasSuccess: {
      true: { text: ' !text-success' },
    },
    hideLabel: {
      true: { labelSpan: 'sr-only' },
    },
  },
  defaultVariants: {
    hasError: false,
    hasSuccess: false,
    isDisabled: false,
    hideLabel: false,
  },
});

export const TextInput: React.FC<TextInputProps> = ({
  label,
  icon,
  iconPosition = 'before',
  buttonProps,
  error,
  className,
  disabled,
  helpText,
  success,
  hideLabel,
  onChange,
  value,
  defaultValue,
  type,
  ref,
  register,
  ...restInputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const event = {
        ...e,
        target: {
          ...e.target,
          value: e.target.value,
        },
      } as ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const textInputVariants = {
    hasIcon: Boolean(icon),
    hasButton: Boolean(buttonProps),
    hasError: Boolean(error),
    hasSuccess: Boolean(success),
    isDisabled: Boolean(disabled),
    hideLabel: Boolean(hideLabel),
  };

  const textInputClassNames = textInput({ ...textInputVariants });
  const isControlled = onChange && !register;

  const inputProps = {
    onChange: handleChange,
    className: textInputClassNames.input(),
    disabled,
    type: type === 'password' ? (showPassword ? 'text' : 'password') : type,
    ...(isControlled ? { value: value } : { defaultValue: defaultValue }),
    ...restInputProps,
  };

  const handleIconClick = () => {
    if (type === 'password') {
      setShowPassword(!showPassword);
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <span
        className={clsx(
          textInputClassNames.icon(),
          type === 'password' && 'cursor-pointer'
        )}
        onClick={handleIconClick}
      >
        {icon}
      </span>
    );
  };

  const renderButton = () => {
    if (!buttonProps) return null;
    const { className: buttonClassName, ...rest } = buttonProps;
    return (
      <Button
        {...rest}
        disabled={disabled}
        className={clsx(textInputClassNames.button(), buttonClassName)}
      />
    );
  };

  const renderText = () => {
    const hasHelpText = Boolean(helpText);
    if (textInputVariants.hasSuccess) {
      return <div className={textInputClassNames.text()}>{success}</div>;
    }
    if (textInputVariants.hasError) {
      return <div className={textInputClassNames.text()}>{error}</div>;
    }
    if (hasHelpText) {
      return <div className={textInputClassNames.text()}>{helpText}</div>;
    }
    return null;
  };

  useEffect(() => {
    if (value) {
      const initialValue = String(value);
      const customEvent = {
        target: { value: initialValue },
      } as ChangeEvent<HTMLInputElement>;
      handleChange(customEvent);
    }
  }, []);

  return (
    <label className={clsx(textInputClassNames.base(), className)}>
      {!hideLabel && (
        <span className={textInputClassNames.labelSpan()}>{label}</span>
      )}
      <div className={textInputClassNames.inputDiv()}>
        {iconPosition === 'before' && renderIcon()}
        <input {...(register ? { ...register } : {})} {...inputProps} />
        {iconPosition === 'after' && renderIcon()}
        {renderButton()}
      </div>
      {renderText()}
    </label>
  );
};

TextInput.displayName = 'TextInput';

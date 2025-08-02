import { Button } from '@web-extension-accessibility-frontend/ui';
import clsx from 'clsx';
type WidgetButtonProps = {
  icon: React.ReactNode;
  text: string;
  step?: number;
  maxSteps?: number;
  onClick?: () => void;
  checked?: boolean;
  disabled?: boolean;
};

export function WidgetButton({
  icon,
  text,
  onClick,
  step,
  maxSteps,
  checked,
  disabled = false,
}: WidgetButtonProps) {
  const active = (step && step > 0) || checked;

  return (
    <Button
      color="grey-200"
      onClick={onClick}
      className={clsx(
        'p-2.5 min-h-[90px] min-w-[150px] h-auto text-sm duration-100',
        {
          'border-3 border-primary shadow-primary ring-4 ring-primary-200':
            active,
        }
      )}
      aria-label={`${text} ${active ? 'active' : 'inactive'}`}
      disabled={disabled}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-1 ">
          <span className="text-2xl">{icon}</span>
          <p className="text-wrap">{text}</p>
        </div>
        {step && step > 0 && maxSteps ? (
          <div className="flex gap-1 justify-center w-full">
            {Array.from({ length: step }, (_, i) => (
              <span
                key={i}
                className={`inline-block w-full h-1 rounded-lg bg-primary`}
              />
            ))}
            {Array.from({ length: maxSteps - step }, (_, i) => (
              <span
                key={i}
                className={`inline-block w-full h-1 rounded-lg bg-primary-200`}
              />
            ))}
          </div>
        ) : (
          <div className="h-1" />
        )}
      </div>
    </Button>
  );
}

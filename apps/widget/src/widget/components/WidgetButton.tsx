import { Button } from '@web-extension-accessibility-frontend/ui';
type WidgetButtonProps = {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
};

export function WidgetButton({ icon, text, onClick }: WidgetButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="p-2.5 h-[90px] min-w-[150px] max-w-full rounded-lg flex flex-col !justify-center !items-center hover:bg-grey-100 bg-grey-200 text-sm text-foreground !border-none !shadow-none"
    >
      <div className="flex flex-col items-center gap-1 ">
        {icon}
        {text}
      </div>
    </Button>
  );
}

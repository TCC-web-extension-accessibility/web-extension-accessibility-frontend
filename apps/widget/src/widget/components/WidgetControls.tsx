import { TextAaIcon, TextTIcon } from '@phosphor-icons/react';
import { WidgetButton } from './WidgetButton';

type WidgetControlsProps = {
  increaseFontSize: () => void;
  changeFontFamily: () => void;
  currentFontSizeStep: number;
  maxFontSizeStep: number;
  currentFontFamilyStep: number;
  maxFontFamilyStep: number;
};

export function WidgetControls({
  increaseFontSize,
  changeFontFamily,
  currentFontSizeStep,
  maxFontSizeStep,
  currentFontFamilyStep,
  maxFontFamilyStep,
}: WidgetControlsProps) {
  return (
    <div className="flex gap-2.5 flex-wrap">
      <WidgetButton
        text="Tamanho do texto"
        icon={<TextAaIcon weight="bold" />}
        step={currentFontSizeStep}
        maxSteps={maxFontSizeStep}
        onClick={() => increaseFontSize()}
      />
      <WidgetButton
        text="Estilo de fonte"
        icon={<TextTIcon weight="fill" />}
        step={currentFontFamilyStep}
        maxSteps={maxFontFamilyStep}
        onClick={changeFontFamily}
      />
    </div>
  );
}

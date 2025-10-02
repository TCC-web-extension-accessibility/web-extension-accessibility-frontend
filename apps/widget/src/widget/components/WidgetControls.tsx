import {
  ArrowsInLineHorizontalIcon,
  ArrowsOutLineVerticalIcon,
  CircleHalfIcon,
  DropHalfIcon,
  ImageIcon,
  LinkSimpleHorizontalIcon,
  PauseCircleIcon,
  SpeakerHighIcon,
  SquareSplitVerticalIcon,
  TextAaIcon,
  TextTIcon,
} from '@phosphor-icons/react';
import { READING_GUIDE_MODES } from '../lib/hooks/use-reading-guide';
import { WidgetButton } from './WidgetButton';

type WidgetControlsProps = {
  increaseFontSize: () => void;
  currentFontSizeStep: number;
  maxFontSizeStep: number;
  changeFontFamily: () => void;
  currentFontFamilyStep: number;
  maxFontFamilyStep: number;
  increaseLineHeight: () => void;
  currentLineHeightStep: number;
  maxLineHeightStep: number;
  increaseLetterSpacing: () => void;
  currentLetterSpacingStep: number;
  maxLetterSpacingStep: number;
  disabledAnimations: boolean;
  toggleDisabledAnimations: () => void;
  hideImages: boolean;
  toggleHideImages: () => void;
  highlightLinks: boolean;
  toggleHighlightLinks: () => void;
  readingGuideMode: (typeof READING_GUIDE_MODES)[keyof typeof READING_GUIDE_MODES];
  changeReadingGuideMode: () => void;
  maxReadingGuideMode: number;
  currentReadingGuideModeStep: number;
  increaseContrast: () => void;
  currentContrastStep: number;
  maxContrastStep: number;
  increaseSaturation: () => void;
  currentSaturationStep: number;
  maxSaturationStep: number;
  onActivateVoiceNavigation: () => void;
  voiceNavigationEnabled: boolean;
};

export function WidgetControls({
  increaseFontSize,
  changeFontFamily,
  currentFontSizeStep,
  maxFontSizeStep,
  currentFontFamilyStep,
  maxFontFamilyStep,
  increaseLineHeight,
  currentLineHeightStep,
  maxLineHeightStep,
  increaseLetterSpacing,
  currentLetterSpacingStep,
  maxLetterSpacingStep,
  disabledAnimations,
  toggleDisabledAnimations,
  hideImages,
  toggleHideImages,
  highlightLinks,
  toggleHighlightLinks,
  readingGuideMode,
  changeReadingGuideMode,
  maxReadingGuideMode,
  currentReadingGuideModeStep,
  increaseContrast,
  currentContrastStep,
  maxContrastStep,
  increaseSaturation,
  currentSaturationStep,
  maxSaturationStep,
  onActivateVoiceNavigation,
  voiceNavigationEnabled,
}: WidgetControlsProps) {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 gap-2.5 @[470px]:grid-cols-3">
        <WidgetButton
          text="Contraste"
          icon={<CircleHalfIcon weight="fill" />}
          step={currentContrastStep}
          maxSteps={maxContrastStep}
          onClick={() => increaseContrast()}
        />
        <WidgetButton
          text="Leitor"
          icon={<SpeakerHighIcon weight="fill" />}
          onClick={() => {
            alert('Reader feature not implemented yet');
          }}
          disabled={true}
        />
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
          onClick={() => changeFontFamily()}
        />
        <WidgetButton
          text="Altura da linha"
          icon={<ArrowsOutLineVerticalIcon weight="fill" />}
          step={currentLineHeightStep}
          maxSteps={maxLineHeightStep}
          onClick={() => increaseLineHeight()}
        />
        <WidgetButton
          text="Espaçamento letras"
          icon={<ArrowsInLineHorizontalIcon weight="fill" />}
          step={currentLetterSpacingStep}
          maxSteps={maxLetterSpacingStep}
          onClick={() => increaseLetterSpacing()}
        />
        <WidgetButton
          text="Pausar animações"
          icon={<PauseCircleIcon />}
          onClick={() => toggleDisabledAnimations()}
          checked={disabledAnimations}
        />
        <WidgetButton
          text="Esconder imagens"
          icon={<ImageIcon weight="fill" />}
          checked={hideImages}
          onClick={() => toggleHideImages()}
        />
        <WidgetButton
          text="Guia de leitura"
          icon={<SquareSplitVerticalIcon />}
          onClick={() => changeReadingGuideMode()}
          checked={readingGuideMode !== READING_GUIDE_MODES.OFF}
          maxSteps={maxReadingGuideMode}
          step={currentReadingGuideModeStep}
        />
        <WidgetButton
          text="Navegação por voz"
          icon={<SpeakerHighIcon weight="fill" />}
          onClick={onActivateVoiceNavigation}
          checked={voiceNavigationEnabled}
        />
        <WidgetButton
          text="Destacar links"
          icon={<LinkSimpleHorizontalIcon />}
          onClick={() => toggleHighlightLinks()}
          checked={highlightLinks}
        />
        <WidgetButton
          text="Saturação"
          icon={<DropHalfIcon />}
          step={currentSaturationStep}
          maxSteps={maxSaturationStep}
          onClick={() => increaseSaturation()}
        />
      </div>
    </div>
  );
}

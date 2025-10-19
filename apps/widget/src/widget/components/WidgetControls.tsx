import {
  ArrowsInLineHorizontalIcon,
  ArrowsOutLineVerticalIcon,
  CircleHalfIcon,
  DropHalfIcon,
  ImageIcon,
  LinkSimpleHorizontalIcon,
  PaletteIcon,
  PauseCircleIcon,
  SpeakerHighIcon,
  SquareSplitVerticalIcon,
  TextAaIcon,
  TextTIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';
import {
  READING_GUIDE_MODES,
  useColorFilter,
  useContrast,
  useDisableAnimations,
  useFontFamily,
  useFontSize,
  useHideImages,
  useHighlightLinks,
  useLetterSpacing,
  useLineHeight,
  useReadingGuide,
  useSaturation,
} from '../lib/hooks';
import { FilterMenu } from './FilterMenu';
import { WidgetButton } from './WidgetButton';

type WidgetControlsProps = {
  fontSize: ReturnType<typeof useFontSize>;
  fontFamily: ReturnType<typeof useFontFamily>;
  lineHeight: ReturnType<typeof useLineHeight>;
  letterSpacing: ReturnType<typeof useLetterSpacing>;
  disableAnimations: ReturnType<typeof useDisableAnimations>;
  hideImages: ReturnType<typeof useHideImages>;
  highlightLinks: ReturnType<typeof useHighlightLinks>;
  readingGuide: ReturnType<typeof useReadingGuide>;
  contrast: ReturnType<typeof useContrast>;
  saturation: ReturnType<typeof useSaturation>;
  colorFilter: ReturnType<typeof useColorFilter>;
  onActivateVoiceNavigation: () => void;
  voiceNavigationEnabled: boolean;
  onToggleReader: () => void;
  readerIsLoading: boolean;
  readerIsPlaying: boolean;
  readerIsPaused: boolean;
  readerText: string;
};

export function WidgetControls({
  fontSize,
  fontFamily,
  lineHeight,
  letterSpacing,
  disableAnimations,
  hideImages,
  highlightLinks,
  readingGuide,
  contrast,
  saturation,
  colorFilter,
  onActivateVoiceNavigation,
  voiceNavigationEnabled,
  onToggleReader,
  readerIsLoading,
  readerIsPlaying,
  readerIsPaused,
  readerText,
}: WidgetControlsProps) {
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  return (
    <div className="@container">
      <div className="grid grid-cols-2 gap-2.5 @[470px]:grid-cols-3">
        {contrast.isEnabled && (
          <WidgetButton
            text="Contraste"
            icon={<CircleHalfIcon weight="fill" />}
            step={contrast.currentStep}
            maxSteps={contrast.maxContrastStep}
            onClick={() => contrast.increaseContrast()}
          />
        )}
        {import.meta.env.VITE_FEATURE_READER === 'true' && (
          <WidgetButton
          text={readerText}
          icon={<SpeakerHighIcon weight="fill" />}
          onClick={onToggleReader}
          checked={readerIsLoading || readerIsPlaying || readerIsPaused}
          />
        )}
        {fontSize.isEnabled && (
          <WidgetButton
            text="Tamanho do texto"
            icon={<TextAaIcon weight="bold" />}
            step={fontSize.currentStep}
            maxSteps={fontSize.maxFontStep}
            onClick={() => fontSize.increaseFontSize()}
          />
        )}
        {fontFamily.isEnabled && (
          <WidgetButton
            text="Estilo de fonte"
            icon={<TextTIcon weight="fill" />}
            step={fontFamily.currentStep}
            maxSteps={fontFamily.maxFontStep}
            onClick={() => fontFamily.changeFontFamily()}
          />
        )}
        {lineHeight.isEnabled && (
          <WidgetButton
            text="Altura da linha"
            icon={<ArrowsOutLineVerticalIcon weight="fill" />}
            step={lineHeight.currentStep}
            maxSteps={lineHeight.maxLineHeightStep}
            onClick={() => lineHeight.increaseLineHeight()}
          />
        )}
        {letterSpacing.isEnabled && (
          <WidgetButton
            text="Espaçamento letras"
            icon={<ArrowsInLineHorizontalIcon weight="fill" />}
            step={letterSpacing.currentStep}
            maxSteps={letterSpacing.maxLetterSpacingStep}
            onClick={() => letterSpacing.increaseLetterSpacing()}
          />
        )}
        {disableAnimations.isEnabled && (
          <WidgetButton
            text="Pausar animações"
            icon={<PauseCircleIcon />}
            onClick={() => disableAnimations.toggleDisabledAnimations()}
            checked={disableAnimations.disabledAnimations}
          />
        )}
        {hideImages.isEnabled && (
          <WidgetButton
            text="Esconder imagens"
            icon={<ImageIcon weight="fill" />}
            checked={hideImages.hideImages}
            onClick={() => hideImages.toggleHideImages()}
          />
        )}
        {readingGuide.isEnabled && (
          <WidgetButton
            text="Guia de leitura"
            icon={<SquareSplitVerticalIcon />}
            onClick={() => readingGuide.cycleReadingGuideMode()}
            checked={readingGuide.readingGuideMode !== READING_GUIDE_MODES.OFF}
            maxSteps={readingGuide.maxReadingGuideMode}
            step={readingGuide.currentStep}
          />
        )}
        {import.meta.env.VITE_FEATURE_VOICENAVIGATION === 'true' && (
          <WidgetButton
            text="Navegação por voz"
            icon={<SpeakerHighIcon weight="fill" />}
            onClick={onActivateVoiceNavigation}
            checked={voiceNavigationEnabled}
          />
        )}
        {highlightLinks.isEnabled && (
          <WidgetButton
            text="Destacar links"
            icon={<LinkSimpleHorizontalIcon />}
            onClick={() => highlightLinks.toggleHighlightLinks()}
            checked={highlightLinks.highlightLinks}
          />
        )}
        {saturation.isEnabled && (
          <WidgetButton
            text="Saturação"
            icon={<DropHalfIcon />}
            step={saturation.currentStep}
            maxSteps={saturation.maxSaturationStep}
            onClick={() => saturation.increaseSaturation()}
          />
        )}
        {colorFilter.isEnabled && (
          <WidgetButton
            text="Filtro de Cor"
            icon={<PaletteIcon weight="fill" />}
            onClick={() => setFilterMenuOpen((prev) => !prev)}
            checked={isFilterMenuOpen}
          />
        )}
      </div>
      {colorFilter.isEnabled && isFilterMenuOpen && (
        <FilterMenu applyFilter={colorFilter.applyFilter} />
      )}
    </div>
  );
}

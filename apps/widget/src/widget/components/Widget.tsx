import { GearIcon, PersonArmsSpreadIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@web-extension-accessibility-frontend/ui';
import { useContext, useEffect, useState } from 'react';
import { WidgetContext } from '../lib/context';
import { useContrast } from '../lib/hooks/use-contrast';
import { useDisableAnimations } from '../lib/hooks/use-disable-animations';
import { useFontFamily } from '../lib/hooks/use-font-family';
import { useFontSize } from '../lib/hooks/use-font-size';
import { useHideImages } from '../lib/hooks/use-hide-images';
import { useHighlightLinks } from '../lib/hooks/use-highlight-links';
import { useLetterSpacing } from '../lib/hooks/use-letter-spacing';
import { useLineHeight } from '../lib/hooks/use-line-height';
import { useReadingGuide } from '../lib/hooks/use-reading-guide';
import { useSaturation } from '../lib/hooks/use-saturation';
import { useReader } from '../lib/hooks/use-reader';
import { useSelectLanguage } from '../lib/hooks/use-select-language';
import { useColorFilter } from '../lib/hooks/use-color-filter';
import { translateWidgetIfNeeded } from '../lib/translator';
import { AccessibilityProfilesAccordion } from './AccessibilityProfilesAccordion';
import { LanguageSelectorAccordion } from './LanguageSelectorAccordion';
import { VoiceNavigationPanel } from './VoiceNavigationPanel';
import { WidgetControls } from './WidgetControls';
import { WidgetSettings } from './WidgetSettings';

export function Widget() {
  const { isOpen, setIsOpen } = useContext(WidgetContext);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVoiceNavigation, setShowVoiceNavigation] = useState(false);

  const fontSize = useFontSize();
  const fontFamily = useFontFamily();
  const lineHeight = useLineHeight();
  const letterSpacing = useLetterSpacing();
  const disableAnimations = useDisableAnimations();
  const hideImages = useHideImages();
  const highlightLinks = useHighlightLinks();
  const readingGuide = useReadingGuide();
  const language = useSelectLanguage();
  const contrast = useContrast();
  const saturation = useSaturation();
  const colorFilter = useColorFilter();
  const [readerState, readerActions] = useReader({ selectedLanguage: language.selectedLanguage ?? 'en' });

  const nameOfTheSelectedLanguage =
    language.languages.find((lang) => lang.code === language.selectedLanguage)
      ?.name || 'English';

  // Function to reset all accessibility settings to default
  const resetAllSettings = () => {
    fontSize.resetFontSize();
    fontFamily.changeFontFamily('default');
    lineHeight.resetLineHeight();
    letterSpacing.resetLetterSpacing();
    disableAnimations.toggleDisabledAnimations(false);
    if (hideImages.hideImages) {
      hideImages.toggleHideImages();
    }
    if (highlightLinks.highlightLinks) {
      highlightLinks.toggleHighlightLinks();
    }
    readingGuide.cycleReadingGuideMode('off');
    language.selectLanguage('en');
    contrast.resetContrast();
    saturation.resetSaturation();
    colorFilter.resetFilter();
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      // parar leitura ao fechar
      readerActions.stop();
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        translateWidgetIfNeeded();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const showVoiceNavigationPanel = () => (
    <VoiceNavigationPanel
      isOpen={showVoiceNavigation}
      onClose={() => setShowVoiceNavigation(false)}
      isOpenWidget={isOpen}
      selectedLanguage={language.selectedLanguage ?? 'en'}
      nameOfTheSelectedLanguage={nameOfTheSelectedLanguage}
    />
  );

  const drawerClasses = `
    fixed bottom-0 right-0 w-full md:w-[600px] h-screen bg-white rounded-l-lg p-6 border border-gray-300
    transform transition-transform duration-300 ease-in-out flex flex-col gap-2
    ${animateIn ? 'translate-x-0' : 'translate-x-full'}
    ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
  `;

  return (
    <>
      {!isVisible && (
        <Button
          className="rounded-full p-5 fixed cursor-pointer bottom-10 right-10"
          icon={<PersonArmsSpreadIcon size={24} />}
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu de acessibilidade"
        />
      )}

      {isOpen && isVisible && (
        <div className={drawerClasses}>
          <div className="flex justify-between items-center ">
            <h2 className="text-xl font-bold">Menu acessibilidade</h2>
            <div className="flex items-center gap-2">
              <Button
                className="rounded-full p-2 text-2xl"
                aria-label="Abrir configurações"
                variant="simple"
                icon={<GearIcon />}
                onClick={() => setShowSettings(true)}
              />
              <Button
                className="p-2 rounded-full text-2xl"
                aria-label="Fechar menu"
                onClick={() => setIsOpen(false)}
                icon={<XIcon weight="bold" />}
              />
            </div>
          </div>

          <div className="border-t border-gray-300 mx-5" />

          <div className={`flex-1 min-h-0 overflow-y-auto p-2 space-y-4`}>
            <LanguageSelectorAccordion
              languages={language.languages}
              selectedLanguage={language.selectedLanguage}
              onLanguageChange={language.selectLanguage}
              isLoading={language.isLoading}
              ariaLabel="Idioma"
            />

            <AccessibilityProfilesAccordion
              resetAllSettings={resetAllSettings}
              increaseFontSize={fontSize.increaseFontSize}
              toggleDisabledAnimations={
                disableAnimations.toggleDisabledAnimations
              }
              changeFontFamily={fontFamily.changeFontFamily}
              changeReadingGuideMode={readingGuide.cycleReadingGuideMode}
              ariaLabel="Perfis de acessibilidade"
            />

            <WidgetControls
              increaseFontSize={fontSize.increaseFontSize}
              changeFontFamily={fontFamily.changeFontFamily}
              currentFontSizeStep={fontSize.currentStep}
              maxFontSizeStep={fontSize.maxFontStep}
              currentFontFamilyStep={fontFamily.currentStep}
              maxFontFamilyStep={fontFamily.maxFontStep}
              increaseLineHeight={lineHeight.increaseLineHeight}
              currentLineHeightStep={lineHeight.currentStep}
              maxLineHeightStep={lineHeight.maxLineHeightStep}
              increaseLetterSpacing={letterSpacing.increaseLetterSpacing}
              currentLetterSpacingStep={letterSpacing.currentStep}
              maxLetterSpacingStep={letterSpacing.maxLetterSpacingStep}
              toggleDisabledAnimations={
                disableAnimations.toggleDisabledAnimations
              }
              disabledAnimations={disableAnimations.disabledAnimations}
              hideImages={hideImages.hideImages}
              toggleHideImages={hideImages.toggleHideImages}
              highlightLinks={highlightLinks.highlightLinks}
              toggleHighlightLinks={highlightLinks.toggleHighlightLinks}
              readingGuideMode={readingGuide.readingGuideMode}
              changeReadingGuideMode={readingGuide.cycleReadingGuideMode}
              maxReadingGuideMode={readingGuide.maxReadingGuideMode}
              currentReadingGuideModeStep={readingGuide.currentStep}
              increaseContrast={contrast.increaseContrast}
              currentContrastStep={contrast.currentStep}
              maxContrastStep={contrast.maxContrastStep}
              increaseSaturation={saturation.increaseSaturation}
              currentSaturationStep={saturation.currentStep}
              maxSaturationStep={saturation.maxSaturationStep}
              onActivateVoiceNavigation={() => {
                setShowVoiceNavigation(true);
              }}
              voiceNavigationEnabled={showVoiceNavigation}
              applyFilter={colorFilter.applyFilter}
              onToggleReader={readerActions.toggle}
              readerIsPlaying={readerState.isPlaying}
              readerIsLoading={readerState.isLoading}
              readerIsPaused={readerState.isPaused}
              onResumeReader={readerActions.resume}
            />
          </div>
        </div>
      )}

      {showVoiceNavigationPanel()}

      {isOpen && isVisible && (
        <WidgetSettings
          isOpen={showSettings}
          onClose={() => {
            setShowSettings(false);
            setIsOpen(false);
          }}
          onBack={() => setShowSettings(false)}
          onResetSettings={resetAllSettings}
        />
      )}
    </>
  );
}

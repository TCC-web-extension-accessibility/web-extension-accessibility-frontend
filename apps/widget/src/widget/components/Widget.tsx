import { GearIcon, PersonArmsSpreadIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@web-extension-accessibility-frontend/ui';
import { useContext, useEffect, useState } from 'react';
import { WidgetContext } from '../lib/context';
import {
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
  useSelectLanguage,
} from '../lib/hooks';
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
            {import.meta.env.VITE_FEATURE_LANGUAGE_SELECTOR === 'true' && (
              <LanguageSelectorAccordion
                languages={language.languages}
                selectedLanguage={language.selectedLanguage}
                onLanguageChange={language.selectLanguage}
                isLoading={language.isLoading}
                ariaLabel="Idioma"
              />
            )}

            {import.meta.env.VITE_FEATURE_ACCESSIBILITY_PROFILES === 'true' && (
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
            )}

            <WidgetControls
              fontSize={fontSize}
              fontFamily={fontFamily}
              lineHeight={lineHeight}
              letterSpacing={letterSpacing}
              disableAnimations={disableAnimations}
              hideImages={hideImages}
              highlightLinks={highlightLinks}
              readingGuide={readingGuide}
              contrast={contrast}
              saturation={saturation}
              colorFilter={colorFilter}
              onActivateVoiceNavigation={() => {
                setShowVoiceNavigation(true);
              }}
              voiceNavigationEnabled={showVoiceNavigation}
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

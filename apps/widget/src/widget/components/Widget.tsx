import { GearIcon, PersonArmsSpreadIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@web-extension-accessibility-frontend/ui';
import { useContext, useEffect, useState } from 'react';
import { WidgetContext } from '../lib/context';
import { useDisableAnimations } from '../lib/hooks/use-disable-animations';
import { useFontFamily } from '../lib/hooks/use-font-family';
import { useFontSize } from '../lib/hooks/use-font-size';
import { useHideImages } from '../lib/hooks/use-hide-images';
import { useHighlightLinks } from '../lib/hooks/use-highlight-links';
import { useLetterSpacing } from '../lib/hooks/use-letter-spacing';
import { useLineHeight } from '../lib/hooks/use-line-height';
import { useReadingGuide } from '../lib/hooks/use-reading-guide';
import { useSelectLanguage } from '../lib/hooks/use-select-language';
import { translateWidgetIfNeeded } from '../lib/translator';
import { AccessibilityProfilesAccordion } from './AccessibilityProfilesAccordion';
import { LanguageSelectorAccordion } from './LanguageSelectorAccordion';
import { WidgetControls } from './WidgetControls';
import { WidgetSettings } from './WidgetSettings';

export function Widget() {
  const { isOpen, setIsOpen } = useContext(WidgetContext);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const fontSize = useFontSize();
  const fontFamily = useFontFamily();
  const lineHeight = useLineHeight();
  const letterSpacing = useLetterSpacing();
  const disableAnimations = useDisableAnimations();
  const hideImages = useHideImages();
  const highlightLinks = useHighlightLinks();
  const readingGuide = useReadingGuide();
  const language = useSelectLanguage();

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

  if (!isVisible) {
    return (
      <Button
        className="rounded-full p-5 fixed cursor-pointer bottom-10 right-10"
        icon={<PersonArmsSpreadIcon size={24} />}
        onClick={() => setIsOpen(true)}
      />
    );
  }
  const drawerClasses = `
    fixed bottom-0 right-0 w-full md:w-[600px] h-screen bg-white rounded-l-lg p-6 border border-gray-300
    transform transition-transform duration-300 ease-in-out flex flex-col gap-2
    ${animateIn ? 'translate-x-0' : 'translate-x-full'}
    ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
  `;

  return (
    <>
      <div className={drawerClasses}>
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">Menu acessibilidade</h2>
          <div className="flex items-center gap-2">
            <Button
              className="rounded-full p-2 text-2xl"
              variant="simple"
              icon={<GearIcon />}
              onClick={() => setShowSettings(true)}
            />
            <Button
              className="p-2 rounded-full text-2xl"
              onClick={() => setIsOpen(false)}
              icon={<XIcon weight="bold" />}
            />
          </div>
        </div>

        <div className="border-t border-gray-300 mx-5" />

        <LanguageSelectorAccordion
          languages={language.languages}
          selectedLanguage={language.selectedLanguage}
          onLanguageChange={language.selectLanguage}
        />

        <AccessibilityProfilesAccordion
          resetAllSettings={resetAllSettings}
          increaseFontSize={fontSize.increaseFontSize}
          toggleDisabledAnimations={disableAnimations.toggleDisabledAnimations}
          changeFontFamily={fontFamily.changeFontFamily}
          changeReadingGuideMode={readingGuide.cycleReadingGuideMode}
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
          toggleDisabledAnimations={disableAnimations.toggleDisabledAnimations}
          disabledAnimations={disableAnimations.disabledAnimations}
          hideImages={hideImages.hideImages}
          toggleHideImages={hideImages.toggleHideImages}
          highlightLinks={highlightLinks.highlightLinks}
          toggleHighlightLinks={highlightLinks.toggleHighlightLinks}
          readingGuideMode={readingGuide.readingGuideMode}
          changeReadingGuideMode={readingGuide.cycleReadingGuideMode}
          maxReadingGuideMode={readingGuide.maxReadingGuideMode}
          currentReadingGuideModeStep={readingGuide.currentStep}
        />
      </div>

      <WidgetSettings
        isOpen={showSettings}
        onClose={() => {
          setShowSettings(false);
          setIsOpen(false);
        }}
        onBack={() => setShowSettings(false)}
        onResetSettings={resetAllSettings}
      />
    </>
  );
}

import { useCallback, useLayoutEffect, useState } from 'react';
import {
  getStorageValue,
  setStorageValue,
  shouldExcludeFromStyling,
} from '../accessibility-utils';

type Font = {
  name: string;
  font?: string;
};

const FONTS_PATH = `${import.meta.env.VITE_DIST_URL}/fonts`;

export const useFontFamily = () => {
  if (import.meta.env.VITE_FEATURE_FONT_FAMILY !== 'true') {
    return {
      changeFontFamily: () => {},
      currentStep: 0,
      maxFontStep: 0,
      isEnabled: false,
    };
  }
  const FONT_FAMILY_STORAGE_KEY = 'accessibility-font-family';

  const FONTS: Record<string, Font> = {
    default: { name: 'default' },
    arial: { name: 'arial', font: 'Arial, Helvetica, sans-serif' },
    dyslexic: { name: 'dyslexic', font: '"Dislexia", serif' },
    monospace: { name: 'monospace', font: 'monospace' },
  };

  const FONT_KEYS = Object.keys(FONTS);
  const MAX_FONT_STEP = FONT_KEYS.length - 1;

  const [currentFontName, setCurrentFontName] = useState<string>(() =>
    getStorageValue(FONT_FAMILY_STORAGE_KEY, FONTS.default.name)
  );

  // Add dyslexic font face to document
  useLayoutEffect(() => {
    const loadDyslexicFont = async () => {
      if ('FontFace' in window) {
        const dislexiaFontFamily = new FontFace(
          'Dislexia',
          `url(${FONTS_PATH}/dyslexic/OpenDyslexic-Regular.woff2)`
        );

        try {
          await dislexiaFontFamily.load();
          document.fonts.add(dislexiaFontFamily);

          if (document.fonts.check('1em Dislexia')) {
            console.log('Dislexia font loaded and available.');
          } else {
            console.warn(
              'Dislexia font loaded but not yet reported as available by document.fonts.check().'
            );
          }
        } catch (error) {
          console.error('Failed to load Dislexia font:', error);
        }
      }
    };
    loadDyslexicFont();
  }, []);

  const applyFontFamily = useCallback(
    (fontName: string) => {
      const fontToApply = FONTS[fontName];
      if (!fontToApply) {
        console.warn(
          `Attempted to apply unknown font: ${fontName}. Falling back to default.`
        );
        return;
      }

      const allElements = document.querySelectorAll('*');

      if (fontName === 'default' || !fontToApply.font) {
        allElements.forEach((element) => {
          if (!shouldExcludeFromStyling(element)) {
            (element as HTMLElement).style.removeProperty('font-family');
          }
        });
      } else {
        allElements.forEach((element) => {
          if (!shouldExcludeFromStyling(element) && fontToApply.font) {
            (element as HTMLElement).style.setProperty(
              'font-family',
              fontToApply.font,
              'important'
            );
          }
        });
      }

      setStorageValue(FONT_FAMILY_STORAGE_KEY, fontName);
      setCurrentFontName(fontName);
    },
    [FONTS, FONT_FAMILY_STORAGE_KEY]
  );

  const currentStep = FONT_KEYS.indexOf(currentFontName);

  const changeFontFamily = useCallback(
    (fontName?: string) => {
      if (fontName) {
        applyFontFamily(fontName);
      } else {
        const nextStep = (currentStep + 1) % FONT_KEYS.length;
        applyFontFamily(FONT_KEYS[nextStep]);
      }
    },
    [currentStep, FONT_KEYS, applyFontFamily]
  );

  return {
    changeFontFamily,
    currentStep,
    maxFontStep: MAX_FONT_STEP,
    isEnabled: true,
  };
};

import { useCallback, useLayoutEffect, useState } from 'react';

type Font = {
  name: string;
  font?: string;
};

const FONTS_PATH = import.meta.env.PROD
  ? `${import.meta.env.VITE_DIST_URL}/fonts`
  : '/public/fonts';

export const useFontFamily = () => {
  const FONT_FAMILY_STORAGE_KEY = 'accessibility-font-family';

  const FONTS: Record<string, Font> = {
    default: { name: 'default' },
    arial: { name: 'arial', font: 'Arial, Helvetica, sans-serif' },
    dyslexic: { name: 'dyslexic', font: '"Dislexia", serif' },
    monospace: { name: 'monospace', font: 'monospace' },
  };

  const FONT_KEYS = Object.keys(FONTS);
  const MAX_FONT_STEP = FONT_KEYS.length - 1;

  const [currentFontName, setCurrentFontName] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return FONTS.default.name;
    }
    const storedFontName = localStorage.getItem(FONT_FAMILY_STORAGE_KEY);
    return storedFontName && FONT_KEYS.includes(storedFontName)
      ? storedFontName
      : FONTS.default.name;
  });

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

      document.body.style.fontFamily = fontToApply.font || '';

      if (typeof window !== 'undefined') {
        localStorage.setItem(FONT_FAMILY_STORAGE_KEY, fontName);
      }

      setCurrentFontName(fontName);
    },
    [FONTS, FONT_FAMILY_STORAGE_KEY]
  );

  useLayoutEffect(() => {
    applyFontFamily(currentFontName);
  }, [currentFontName, applyFontFamily]);

  const currentStep = FONT_KEYS.indexOf(currentFontName);

  const changeFontFamily = useCallback(() => {
    const nextStep = (currentStep + 1) % FONT_KEYS.length;
    applyFontFamily(FONT_KEYS[nextStep]);
  }, [currentStep, FONT_KEYS, applyFontFamily]);

  return { changeFontFamily, currentStep, maxFontStep: MAX_FONT_STEP };
};

import { useState } from 'react';
import {
  clamp,
  getStorageNumber,
  setStorageNumber,
  shouldExcludeFromStyling,
} from '../accessibility-utils';

export const useLetterSpacing = () => {
  if (import.meta.env.VITE_FEATURE_LETTER_SPACING !== 'true') {
    return {
      increaseLetterSpacing: () => {},
      currentStep: 0,
      maxLetterSpacingStep: 0,
      resetLetterSpacing: () => {},
      isEnabled: false,
    };
  }
  const LETTER_SPACING_STORAGE_KEY = 'accessibilty-letter-spacing';
  const BASE_LETTER_SPACING = 1;
  const LETTER_SPACING_STEP = 1;
  const MIN_LETTER_SPACING = 1;
  const MAX_LETTER_SPACING = 5;
  const MAX_LETTER_SPACING_STEP =
    (MAX_LETTER_SPACING - BASE_LETTER_SPACING) / LETTER_SPACING_STEP;

  const [letterSpacingPercent, setLetterSpacingPercent] = useState(() =>
    getStorageNumber(LETTER_SPACING_STORAGE_KEY, BASE_LETTER_SPACING)
  );

  const applyLetterSpacing = (value: number) => {
    let clamped = clamp(value, MIN_LETTER_SPACING, MAX_LETTER_SPACING);
    if (MAX_LETTER_SPACING === clamped) {
      clamped = clamp(
        BASE_LETTER_SPACING,
        MIN_LETTER_SPACING,
        MAX_LETTER_SPACING
      );
    }

    const allElements = document.querySelectorAll('*');

    if (clamped === BASE_LETTER_SPACING) {
      allElements.forEach((element) => {
        if (!shouldExcludeFromStyling(element)) {
          (element as HTMLElement).style.removeProperty('letter-spacing');
        }
      });
    } else {
      allElements.forEach((element) => {
        if (!shouldExcludeFromStyling(element)) {
          (element as HTMLElement).style.setProperty(
            'letter-spacing',
            `${clamped}px`,
            'important'
          );
        }
      });
    }

    setStorageNumber(LETTER_SPACING_STORAGE_KEY, clamped);
    setLetterSpacingPercent(clamped);
  };

  const currentStep =
    MAX_LETTER_SPACING_STEP -
    (MAX_LETTER_SPACING - letterSpacingPercent) / LETTER_SPACING_STEP;

  const increaseLetterSpacing = (size?: number) => {
    size
      ? applyLetterSpacing(size)
      : applyLetterSpacing(letterSpacingPercent + LETTER_SPACING_STEP);
  };
  const resetLetterSpacing = () => {
    applyLetterSpacing(BASE_LETTER_SPACING);
  };

  return {
    increaseLetterSpacing,
    currentStep,
    maxLetterSpacingStep: MAX_LETTER_SPACING_STEP - 1,
    resetLetterSpacing,
    isEnabled: true,
  };
};

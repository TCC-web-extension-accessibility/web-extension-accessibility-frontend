import { useState } from 'react';

export const useLetterSpacing = () => {
  const LETTER_SPACING_STORAGE_KEY = 'accessibilty-letter-spacing';
  const BASE_LETTER_SPACING = 1;
  const LETTER_SPACING_STEP = 1;
  const MIN_LETTER_SPACING = 1;
  const MAX_LETTER_SPACING = 5;
  const MAX_LETTER_SPACING_STEP =
    (MAX_LETTER_SPACING - BASE_LETTER_SPACING) / LETTER_SPACING_STEP;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const [letterSpacingPercent, setLetterSpacingPercent] =
    useState(BASE_LETTER_SPACING);

  const applyLetterSpacing = (value: number) => {
    let clamped = clamp(value, MIN_LETTER_SPACING, MAX_LETTER_SPACING);
    if (MAX_LETTER_SPACING === clamped) {
      clamped = clamp(
        BASE_LETTER_SPACING,
        MIN_LETTER_SPACING,
        MAX_LETTER_SPACING
      );
    }

    // Remove letter-spacing style when at base value to restore website defaults
    if (clamped === BASE_LETTER_SPACING) {
      document.body.style.removeProperty('letter-spacing');
    } else {
      document.body.style.letterSpacing = `${clamped}px`;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(LETTER_SPACING_STORAGE_KEY, clamped.toString());
    }

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
  };
};

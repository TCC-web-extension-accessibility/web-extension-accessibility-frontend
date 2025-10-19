import { useState } from 'react';
import {
  clamp,
  getStorageNumber,
  setStorageNumber,
  shouldExcludeFromStyling,
} from '../accessibility-utils';

export const useFontSize = () => {
  if (import.meta.env.VITE_FEATURE_FONT_SIZE !== 'true') {
    return {
      increaseFontSize: () => {},
      currentStep: 0,
      maxFontStep: 0,
      resetFontSize: () => {},
      isEnabled: false,
    };
  }

  const FONT_SIZE_STORAGE_KEY = 'accessibilty-font-size';
  const BASE_FONT_PERCENT = 100;
  const FONT_STEP = 1;
  const MIN_FONT_PERCENT = 50;
  const MAX_FONT_PERCENT = 110;
  const MAX_FONT_STEP = (MAX_FONT_PERCENT - BASE_FONT_PERCENT) / FONT_STEP;

  const [fontPercent, setFontPercent] = useState(() =>
    getStorageNumber(FONT_SIZE_STORAGE_KEY, BASE_FONT_PERCENT)
  );

  const applyFontSize = (value: number) => {
    let clamped = clamp(value, MIN_FONT_PERCENT, MAX_FONT_PERCENT);
    if (MAX_FONT_PERCENT === clamped) {
      clamped = clamp(BASE_FONT_PERCENT, MIN_FONT_PERCENT, MAX_FONT_PERCENT);
    }

    const allElements = document.querySelectorAll('*');

    console.log(clamped);

    if (clamped === BASE_FONT_PERCENT) {
      allElements.forEach((element) => {
        if (!shouldExcludeFromStyling(element)) {
          (element as HTMLElement).style.removeProperty('font-size');
        }
      });
    } else {
      allElements.forEach((element) => {
        if (!shouldExcludeFromStyling(element)) {
          (element as HTMLElement).style.setProperty(
            'font-size',
            `${clamped}%`,
            'important'
          );
        }
      });
    }

    setStorageNumber(FONT_SIZE_STORAGE_KEY, clamped);
    setFontPercent(clamped);
  };

  const currentStep =
    MAX_FONT_STEP - (MAX_FONT_PERCENT - fontPercent) / FONT_STEP;

  const increaseFontSize = (size?: number) => {
    size ? applyFontSize(size) : applyFontSize(fontPercent + FONT_STEP);
  };
  const resetFontSize = () => {
    applyFontSize(BASE_FONT_PERCENT);
  };

  return {
    increaseFontSize,
    currentStep,
    maxFontStep: MAX_FONT_STEP - 1,
    resetFontSize,
    isEnabled: true,
  };
};

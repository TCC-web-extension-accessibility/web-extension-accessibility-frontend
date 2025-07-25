import { useLayoutEffect, useState } from 'react';

export const useFontSize = () => {
  const FONT_SIZE_STORAGE_KEY = 'accessibilty-font-size';
  const BASE_FONT_PERCENT = 100;
  const FONT_STEP = 12.5;
  const MIN_FONT_PERCENT = 50;
  const MAX_FONT_PERCENT = 200;
  const MAX_FONT_STEP = (MAX_FONT_PERCENT - BASE_FONT_PERCENT) / FONT_STEP;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const [fontPercent, setFontPercent] = useState(() => {
    if (typeof window === 'undefined') return BASE_FONT_PERCENT;
    const stored = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    return stored
      ? clamp(parseFloat(stored), MIN_FONT_PERCENT, MAX_FONT_PERCENT)
      : BASE_FONT_PERCENT;
  });

  const applyFontSize = (value: number) => {
    let clamped = clamp(value, MIN_FONT_PERCENT, MAX_FONT_PERCENT);
    if (MAX_FONT_PERCENT === clamped) {
      clamped = clamp(BASE_FONT_PERCENT, MIN_FONT_PERCENT, MAX_FONT_PERCENT);
    }
    document.body.style.fontSize = `${clamped}%`;

    if (typeof window !== 'undefined') {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, clamped.toString());
    }

    setFontPercent(clamped);
  };

  const currentStep =
    MAX_FONT_STEP - (MAX_FONT_PERCENT - fontPercent) / FONT_STEP;

  useLayoutEffect(() => {
    applyFontSize(fontPercent);
  }, []);

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
  };
};

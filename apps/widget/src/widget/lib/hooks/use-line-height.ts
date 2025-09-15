import { useState } from 'react';

export const useLineHeight = () => {
  const LINE_HEIGHT_STORAGE_KEY = 'accessibilty-line-height';
  const BASE_LINE_HEIGHT_PERCENT = 100;
  const LINE_HEIGHT_STEP = 12.5;
  const MIN_LINE_HEIGHT_PERCENT = 50;
  const MAX_LINE_HEIGHT_PERCENT = 200;
  const MAX_LINE_HEIGHT_STEP =
    (MAX_LINE_HEIGHT_PERCENT - BASE_LINE_HEIGHT_PERCENT) / LINE_HEIGHT_STEP;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const [lineHeightPercent, setLineHeightPercent] = useState(
    BASE_LINE_HEIGHT_PERCENT
  );

  const applyLineHeight = (value: number) => {
    let clamped = clamp(
      value,
      MIN_LINE_HEIGHT_PERCENT,
      MAX_LINE_HEIGHT_PERCENT
    );
    if (MAX_LINE_HEIGHT_PERCENT === clamped) {
      clamped = clamp(
        BASE_LINE_HEIGHT_PERCENT,
        MIN_LINE_HEIGHT_PERCENT,
        MAX_LINE_HEIGHT_PERCENT
      );
    }

    // Remove line-height style when at base value to restore website defaults
    if (clamped === BASE_LINE_HEIGHT_PERCENT) {
      document.body.style.removeProperty('line-height');
    } else {
      document.body.style.lineHeight = `${clamped}%`;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(LINE_HEIGHT_STORAGE_KEY, clamped.toString());
    }

    setLineHeightPercent(clamped);
  };

  const currentStep =
    MAX_LINE_HEIGHT_STEP -
    (MAX_LINE_HEIGHT_PERCENT - lineHeightPercent) / LINE_HEIGHT_STEP;

  const increaseLineHeight = (size?: number) => {
    size
      ? applyLineHeight(size)
      : applyLineHeight(lineHeightPercent + LINE_HEIGHT_STEP);
  };
  const resetLineHeight = () => {
    applyLineHeight(BASE_LINE_HEIGHT_PERCENT);
  };

  return {
    increaseLineHeight,
    currentStep,
    maxLineHeightStep: MAX_LINE_HEIGHT_STEP - 1,
    resetLineHeight,
  };
};

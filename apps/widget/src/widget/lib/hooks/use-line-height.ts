import { useLayoutEffect, useState } from 'react';

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

  const [lineHeightPercent, setLineHeightPercent] = useState(() => {
    if (typeof window === 'undefined') return BASE_LINE_HEIGHT_PERCENT;
    const stored = localStorage.getItem(LINE_HEIGHT_STORAGE_KEY);
    return stored
      ? clamp(
          parseFloat(stored),
          MIN_LINE_HEIGHT_PERCENT,
          MAX_LINE_HEIGHT_PERCENT
        )
      : BASE_LINE_HEIGHT_PERCENT;
  });

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
    document.body.style.lineHeight = `${clamped}%`;

    if (typeof window !== 'undefined') {
      localStorage.setItem(LINE_HEIGHT_STORAGE_KEY, clamped.toString());
    }

    setLineHeightPercent(clamped);
  };

  const currentStep =
    MAX_LINE_HEIGHT_STEP -
    (MAX_LINE_HEIGHT_PERCENT - lineHeightPercent) / LINE_HEIGHT_STEP;

  useLayoutEffect(() => {
    applyLineHeight(lineHeightPercent);
  }, []);

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

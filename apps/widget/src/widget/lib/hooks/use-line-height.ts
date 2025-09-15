import { useState } from 'react';
import {
  clamp,
  getStorageNumber,
  setStorageNumber,
  shouldExcludeFromStyling,
} from '../accessibility-utils';

export const useLineHeight = () => {
  const LINE_HEIGHT_STORAGE_KEY = 'accessibilty-line-height';
  const BASE_LINE_HEIGHT_PERCENT = 100;
  const LINE_HEIGHT_STEP = 12.5;
  const MIN_LINE_HEIGHT_PERCENT = 50;
  const MAX_LINE_HEIGHT_PERCENT = 200;
  const MAX_LINE_HEIGHT_STEP =
    (MAX_LINE_HEIGHT_PERCENT - BASE_LINE_HEIGHT_PERCENT) / LINE_HEIGHT_STEP;

  const [lineHeightPercent, setLineHeightPercent] = useState(() =>
    getStorageNumber(LINE_HEIGHT_STORAGE_KEY, BASE_LINE_HEIGHT_PERCENT)
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

    const allElements = document.querySelectorAll('*');

    if (clamped === BASE_LINE_HEIGHT_PERCENT) {
      allElements.forEach((element) => {
        if (!shouldExcludeFromStyling(element)) {
          (element as HTMLElement).style.removeProperty('line-height');
        }
      });
    } else {
      allElements.forEach((element) => {
        if (!shouldExcludeFromStyling(element)) {
          (element as HTMLElement).style.setProperty(
            'line-height',
            `${clamped}%`,
            'important'
          );
        }
      });
    }

    setStorageNumber(LINE_HEIGHT_STORAGE_KEY, clamped);
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

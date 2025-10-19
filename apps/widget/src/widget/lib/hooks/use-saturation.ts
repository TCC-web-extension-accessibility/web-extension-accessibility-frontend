import { useState } from 'react';
import {
  getStorageValue,
  setStorageValue,
  shouldExcludeFromStyling,
} from '../accessibility-utils';

type SaturationLevel = 'normal' | 'low' | 'high' | 'zero';

const SATURATION_LEVELS: SaturationLevel[] = ['normal', 'low', 'high', 'zero'];

export const useSaturation = () => {
  if (import.meta.env.VITE_FEATURE_SATURATION !== 'true') {
    return {
      saturationLevel: 'normal',
      increaseSaturation: () => {},
      resetSaturation: () => {},
      currentStep: 0,
      maxSaturationStep: 0,
      isEnabled: false,
    };
  }
  const SATURATION_STORAGE_KEY = 'accessibility-saturation';

  const [saturationLevel, setSaturationLevel] = useState<SaturationLevel>(() =>
    getStorageValue(SATURATION_STORAGE_KEY, 'normal')
  );

  const applySaturation = (level: SaturationLevel) => {
    const allElements = document.querySelectorAll('*');

    allElements.forEach((element) => {
      if (!shouldExcludeFromStyling(element)) {
        const htmlElement = element as HTMLElement;

        if (level === 'normal') {
          htmlElement.style.removeProperty('filter');
        } else {
          let filterValue = '';

          switch (level) {
            case 'low':
              filterValue = 'saturate(0.5)';
              break;
            case 'high':
              filterValue = 'saturate(2)';
              break;
            case 'zero':
              filterValue = 'saturate(0)';
              break;
          }

          const existingFilter = htmlElement.style.filter || '';
          const saturationRegex = /saturate\([^)]*\)\s?/g;
          const cleanedFilter = existingFilter
            .replace(saturationRegex, '')
            .trim();
          const newFilter = cleanedFilter
            ? `${cleanedFilter} ${filterValue}`
            : filterValue;

          htmlElement.style.setProperty('filter', newFilter, 'important');
        }
      }
    });

    setStorageValue(SATURATION_STORAGE_KEY, level);
    setSaturationLevel(level);
  };

  const increaseSaturation = () => {
    const currentIndex = SATURATION_LEVELS.indexOf(saturationLevel);
    const nextIndex = (currentIndex + 1) % SATURATION_LEVELS.length;
    applySaturation(SATURATION_LEVELS[nextIndex]);
  };

  const resetSaturation = () => {
    applySaturation('normal');
  };

  const currentStep = SATURATION_LEVELS.indexOf(saturationLevel);
  const maxSaturationStep = SATURATION_LEVELS.length - 1;

  return {
    saturationLevel,
    increaseSaturation,
    resetSaturation,
    currentStep,
    maxSaturationStep,
    isEnabled: true,
  };
};

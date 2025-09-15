import { useLayoutEffect, useState } from 'react';
import {
  getStorageValue,
  setStorageValue,
  shouldExcludeFromStyling,
} from '../accessibility-utils';

export const useDisableAnimations = () => {
  const DISABLED_ANIMATIONS_STORAGE_KEY = 'accessibility-disabled-animations';
  const [disabledAnimations, setDisabledAnimations] = useState(() =>
    getStorageValue(DISABLED_ANIMATIONS_STORAGE_KEY, false)
  );

  const applyDisabledAnimations = (value: boolean) => {
    // Apply animation disabling to all elements except widget elements
    const allElements = document.querySelectorAll('*');

    allElements.forEach((element) => {
      if (!shouldExcludeFromStyling(element)) {
        const htmlElement = element as HTMLElement;
        if (value) {
          htmlElement.style.setProperty(
            'transition-duration',
            '0s',
            'important'
          );
          htmlElement.style.setProperty(
            'animation-duration',
            '0s',
            'important'
          );
          htmlElement.style.setProperty('animation-delay', '0s', 'important');
        } else {
          htmlElement.style.removeProperty('transition-duration');
          htmlElement.style.removeProperty('animation-duration');
          htmlElement.style.removeProperty('animation-delay');
        }
      }
    });

    setStorageValue(DISABLED_ANIMATIONS_STORAGE_KEY, value);
    setDisabledAnimations(value);
  };

  useLayoutEffect(() => {
    applyDisabledAnimations(disabledAnimations);
  }, []);

  const toggleDisabledAnimations = (disabled?: boolean) => {
    applyDisabledAnimations(
      disabled !== undefined ? disabled : !disabledAnimations
    );
  };

  return {
    disabledAnimations,
    toggleDisabledAnimations,
  };
};

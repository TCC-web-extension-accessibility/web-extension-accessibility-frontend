import { useLayoutEffect, useState } from 'react';

export const useDisableAnimations = () => {
  const DISABLED_ANIMATIONS_STORAGE_KEY = 'accessibility-disabled-animations';
  const [disabledAnimations, setDisabledAnimations] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(DISABLED_ANIMATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  const applyDisabledAnimations = (value: boolean) => {
    document.body.style.transitionDuration = value ? '0s' : '';

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        DISABLED_ANIMATIONS_STORAGE_KEY,
        JSON.stringify(value)
      );
    }

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

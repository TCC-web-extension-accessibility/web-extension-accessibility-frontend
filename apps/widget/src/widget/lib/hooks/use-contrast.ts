import { useLayoutEffect, useState } from 'react';
import {
  getStorageValue,
  isInsideWidget,
  setStorageValue,
} from '../accessibility-utils';

type ContrastLevel = 'normal' | 'high' | 'highest';

const CONTRAST_LEVELS: ContrastLevel[] = ['normal', 'high', 'highest'];

const hasTextContent = (element: Element): boolean => {
  const textContent = element.childNodes
    ? Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent?.trim())
        .join('')
        .trim()
    : '';

  return textContent.length > 0;
};

const applyContrastToElement = (element: HTMLElement, level: ContrastLevel) => {
  if (!element.dataset.originalBgColor) {
    element.dataset.originalBgColor = element.style.backgroundColor || '';
  }
  if (!element.dataset.originalColor) {
    element.dataset.originalColor = element.style.color || '';
  }
  if (!element.dataset.originalBorder) {
    element.dataset.originalBorder = element.style.border || '';
  }

  if (level === 'high') {
    element.style.setProperty('background-color', 'white', 'important');
    element.style.setProperty('color', 'black', 'important');

    if (
      element.tagName.toLowerCase() === 'input' ||
      element.tagName.toLowerCase() === 'textarea' ||
      element.tagName.toLowerCase() === 'select' ||
      element.tagName.toLowerCase() === 'button'
    ) {
      element.style.setProperty('border', '2px solid black', 'important');
    }
  } else if (level === 'highest') {
    element.style.setProperty('background-color', 'white', 'important');
    element.style.setProperty('color', 'black', 'important');

    if (element.tagName.toLowerCase() === 'a') {
      element.style.setProperty('color', 'blue', 'important');
      element.style.setProperty('text-decoration', 'underline', 'important');
    }

    if (
      element.tagName.toLowerCase() === 'input' ||
      element.tagName.toLowerCase() === 'textarea' ||
      element.tagName.toLowerCase() === 'select' ||
      element.tagName.toLowerCase() === 'button'
    ) {
      element.style.setProperty('border', '3px solid black', 'important');
    }

    if (element.tagName.toLowerCase() === 'img') {
      element.style.setProperty('border', '2px solid black', 'important');
    }
  }
};

const restoreElementStyles = (element: HTMLElement) => {
  if (element.dataset.originalBgColor !== undefined) {
    if (element.dataset.originalBgColor) {
      element.style.backgroundColor = element.dataset.originalBgColor;
    } else {
      element.style.removeProperty('background-color');
    }
    delete element.dataset.originalBgColor;
  }

  if (element.dataset.originalColor !== undefined) {
    if (element.dataset.originalColor) {
      element.style.color = element.dataset.originalColor;
    } else {
      element.style.removeProperty('color');
    }
    delete element.dataset.originalColor;
  }

  if (element.dataset.originalBorder !== undefined) {
    if (element.dataset.originalBorder) {
      element.style.border = element.dataset.originalBorder;
    } else {
      element.style.removeProperty('border');
    }
    delete element.dataset.originalBorder;
  }
};

const applyContrastToTextElements = (level: ContrastLevel) => {
  const styledElements = document.querySelectorAll(
    '[data-original-bg-color], [data-original-color], [data-original-border]'
  );
  styledElements.forEach((el) => restoreElementStyles(el as HTMLElement));

  if (level === 'normal') return;

  const allElements = document.querySelectorAll('*');

  allElements.forEach((element) => {
    if (isInsideWidget(element)) return;

    const isFormElement = ['input', 'textarea', 'select', 'button'].includes(
      element.tagName.toLowerCase()
    );
    const isImage = element.tagName.toLowerCase() === 'img';

    if (
      hasTextContent(element) ||
      isFormElement ||
      (isImage && level === 'highest')
    ) {
      applyContrastToElement(element as HTMLElement, level);
    }
  });
};

export const useContrast = () => {
  if (import.meta.env.VITE_FEATURE_CONTRAST !== 'true') {
    return {
      contrastLevel: 'normal',
      increaseContrast: () => {},
      resetContrast: () => {},
      currentStep: 0,
      maxContrastStep: 0,
      isEnabled: false,
    };
  }

  const CONTRAST_STORAGE_KEY = 'accessibility-contrast';

  const [contrastLevel, setContrastLevel] = useState<ContrastLevel>(() =>
    getStorageValue(CONTRAST_STORAGE_KEY, 'normal')
  );

  const [observer, setObserver] = useState<MutationObserver | null>(null);

  const applyContrast = (level: ContrastLevel) => {
    applyContrastToTextElements(level);

    if (level !== 'normal' && !observer) {
      const newObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;

              const elementsToCheck = [
                element,
                ...element.querySelectorAll('*'),
              ];
              elementsToCheck.forEach((el) => {
                if (isInsideWidget(el)) return;

                const isFormElement = [
                  'input',
                  'textarea',
                  'select',
                  'button',
                ].includes(el.tagName.toLowerCase());
                const isImage = el.tagName.toLowerCase() === 'img';

                if (
                  hasTextContent(el) ||
                  isFormElement ||
                  (isImage && level === 'highest')
                ) {
                  applyContrastToElement(el as HTMLElement, level);
                }
              });
            }
          });
        });
      });

      newObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setObserver(newObserver);
    } else if (level === 'normal' && observer) {
      observer.disconnect();
      setObserver(null);
    }

    setStorageValue(CONTRAST_STORAGE_KEY, level);

    setContrastLevel(level);
  };

  const increaseContrast = () => {
    const currentIndex = CONTRAST_LEVELS.indexOf(contrastLevel);
    const nextIndex = (currentIndex + 1) % CONTRAST_LEVELS.length;
    applyContrast(CONTRAST_LEVELS[nextIndex]);
  };

  const resetContrast = () => {
    applyContrast('normal');
  };

  const currentStep = CONTRAST_LEVELS.indexOf(contrastLevel);
  const maxContrastStep = CONTRAST_LEVELS.length - 1;

  useLayoutEffect(() => {
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observer]);

  return {
    contrastLevel,
    increaseContrast,
    resetContrast,
    currentStep,
    maxContrastStep,
    isEnabled: true,
  };
};

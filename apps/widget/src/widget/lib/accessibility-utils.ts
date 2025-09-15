export const isInsideWidget = (element: Element): boolean => {
  if (element.id === 'web-extension-accessibility') {
    return true;
  }

  const widgetContainer = document.getElementById(
    'web-extension-accessibility'
  );
  if (widgetContainer && widgetContainer.contains(element)) {
    return true;
  }

  let currentElement = element as Element | null;
  while (currentElement) {
    if (
      currentElement.id === 'web-extension-accessibility' ||
      currentElement.id === 'widget-root' ||
      currentElement.closest('#web-extension-accessibility')
    ) {
      return true;
    }
    currentElement = currentElement.parentElement;
  }

  return false;
};

export const shouldExcludeFromStyling = (element: Element): boolean => {
  if (!(element instanceof HTMLElement)) {
    return true;
  }

  if (isInsideWidget(element)) {
    return true;
  }

  const tagName = element.tagName.toLowerCase();
  const excludedTags = [
    'script',
    'style',
    'meta',
    'link',
    'title',
    'body',
    'html',
  ];

  return excludedTags.includes(tagName);
};

export const getStorageValue = (key: string, defaultValue: any = null): any => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

export const setStorageValue = (key: string, value: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getStorageNumber = (key: string, defaultValue: number): number => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? parseFloat(stored) : defaultValue;
};

export const setStorageNumber = (key: string, value: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value.toString());
  }
};

export const applyStyleToAllElements = (
  property: string,
  value: string | null,
  important = true
): void => {
  const allElements = document.querySelectorAll('*');
  allElements.forEach((element) => {
    if (element instanceof HTMLElement && !isInsideWidget(element)) {
      if (value === null) {
        element.style.removeProperty(property);
      } else {
        element.style.setProperty(
          property,
          value,
          important ? 'important' : ''
        );
      }
    }
  });
};

export const removeStyleFromAllElements = (property: string): void => {
  applyStyleToAllElements(property, null);
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

interface PercentageConfig {
  storageKey: string;
  basePercent: number;
  step: number;
  minPercent: number;
  maxPercent: number;
}

export const createPercentageAccessibilityHook = (
  config: PercentageConfig,
  cssProperty: string
) => {
  const { storageKey, basePercent, step, minPercent, maxPercent } = config;
  const maxStep = (maxPercent - basePercent) / step;

  const applyValue = (value: number) => {
    let clamped = clamp(value, minPercent, maxPercent);
    if (maxPercent === clamped) {
      clamped = clamp(basePercent, minPercent, maxPercent);
    }

    if (clamped === basePercent) {
      removeStyleFromAllElements(cssProperty);
    } else {
      applyStyleToAllElements(cssProperty, `${clamped}%`);
    }

    setStorageNumber(storageKey, clamped);
    return clamped;
  };

  const getCurrentStep = (percent: number) =>
    maxStep - (maxPercent - percent) / step;

  return {
    applyValue,
    getCurrentStep,
    maxStep: maxStep - 1,
    basePercent,
    step,
  };
};

interface ValueConfig {
  storageKey: string;
  baseValue: number;
  step: number;
  minValue: number;
  maxValue: number;
}

export const createValueAccessibilityHook = (
  config: ValueConfig,
  cssProperty: string,
  unit = 'px'
) => {
  const { storageKey, baseValue, step, minValue, maxValue } = config;
  const maxStep = (maxValue - baseValue) / step;

  const applyValue = (value: number) => {
    let clamped = clamp(value, minValue, maxValue);
    if (maxValue === clamped) {
      clamped = clamp(baseValue, minValue, maxValue);
    }

    if (clamped === baseValue) {
      removeStyleFromAllElements(cssProperty);
    } else {
      applyStyleToAllElements(cssProperty, `${clamped}${unit}`);
    }

    setStorageNumber(storageKey, clamped);
    return clamped;
  };

  const getCurrentStep = (value: number) => maxStep - (maxValue - value) / step;

  return {
    applyValue,
    getCurrentStep,
    maxStep: maxStep - 1,
    baseValue,
    step,
  };
};

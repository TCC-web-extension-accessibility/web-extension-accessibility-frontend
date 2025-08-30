import { toast } from 'react-toastify';
import { getClientApi } from '../../lib/api-client';

const originalTexts = new Map<Element, string>();
const originalPlaceholders = new Map<Element, string>();
let areOriginalsStored = false;
let areWidgetTranslated = false;
let currentLanguage: string | null = null;
const documentLanguage = document.documentElement.lang;

function storeOriginals(rootElement: HTMLElement) {
  processElementsRecursively(rootElement);
  areOriginalsStored = true;
}

function processElementsRecursively(rootElement: HTMLElement | ShadowRoot) {
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_ELEMENT
  );

  while (walker.nextNode()) {
    const element = walker.currentNode as Element;

    if (shouldSkipElement(element)) {
      continue;
    }

    if (element.children.length === 0 && element.textContent?.trim()) {
      originalTexts.set(element, element.textContent);
    }

    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      const placeholder = element.placeholder;
      if (placeholder?.trim()) {
        originalPlaceholders.set(element, placeholder);
      }
    }

    if (element.shadowRoot) {
      processElementsRecursively(element.shadowRoot);
    }
  }
}

function shouldSkipElement(element: Element): boolean {
  let current: Element | null = element;
  while (current) {
    if (current.getAttribute('data-no-translate') === 'true') {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

function revertToOriginals() {
  for (const [element, originalText] of originalTexts.entries()) {
    element.textContent = originalText;
  }

  for (const [element, originalPlaceholder] of originalPlaceholders.entries()) {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      element.placeholder = originalPlaceholder;
    }
  }
}

async function translate(language: string) {
  const textToTranslate = Array.from(originalTexts.keys()).map(
    (element) => element.textContent
  );

  const placeholdersToTranslate = Array.from(originalPlaceholders.values());

  const allTextToTranslate = [
    ...textToTranslate.filter((text) => text !== null),
    ...placeholdersToTranslate,
  ];

  const api = getClientApi();

  const getTranslationResponse =
    await api.Default.Api.translateTextListApiV1TranslatePost({
      from_language: documentLanguage,
      text_list: allTextToTranslate,
      to_language: language,
    });

  if (!getTranslationResponse.data) {
    toast.error('Error getting translation');
    return;
  }

  const translationMap = getTranslationResponse.data;

  // Apply translations to text content
  for (const [element, originalText] of originalTexts.entries()) {
    // Try exact match first (preserves formatting)
    if (translationMap[originalText]) {
      element.textContent = translationMap[originalText];
    } else {
      // Fallback to normalized key match
      const normalizedKey = originalText.trim().replace(/\s+/g, ' ');
      if (translationMap[normalizedKey]) {
        element.textContent = translationMap[normalizedKey];
      }
    }
  }

  // Apply translations to placeholder attributes
  for (const [element, originalPlaceholder] of originalPlaceholders.entries()) {
    // Try exact match first
    if (translationMap[originalPlaceholder]) {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.placeholder = translationMap[originalPlaceholder];
      }
    } else {
      // Fallback to normalized key match
      const normalizedKey = originalPlaceholder.trim().replace(/\s+/g, ' ');
      if (
        translationMap[normalizedKey] &&
        (element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement)
      ) {
        element.placeholder = translationMap[normalizedKey];
      }
    }
  }
}

function findAllShadowRoots(): ShadowRoot[] {
  const shadowRoots: ShadowRoot[] = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT
  );

  while (walker.nextNode()) {
    const element = walker.currentNode as Element;
    if (element.shadowRoot) {
      shadowRoots.push(element.shadowRoot);
    }
  }

  return shadowRoots;
}

export const translatePage = (language: string) => {
  currentLanguage = language;

  if (!areOriginalsStored) {
    storeOriginals(document.body);

    const shadowRoots = findAllShadowRoots();
    shadowRoots.forEach((shadowRoot) => {
      processElementsRecursively(shadowRoot);
    });
  }

  revertToOriginals();

  if (language.toLowerCase() !== documentLanguage) {
    translate(language);
  }

  areWidgetTranslated = false;
};

export const translateWidgetIfNeeded = async () => {
  if (process.env.NODE_ENV === 'development') {
    storeOriginals(document.body);
  }

  if (!currentLanguage || currentLanguage.toLowerCase() === documentLanguage) {
    return;
  }

  if (areWidgetTranslated) {
    return;
  }

  const shadowRoots = findAllShadowRoots();
  const widgetShadowRoots = shadowRoots.filter(
    (shadowRoot) => shadowRoot.getElementById('widget-root') !== null
  );

  if (widgetShadowRoots.length !== 0) {
    widgetShadowRoots.forEach((shadowRoot) => {
      processElementsRecursively(shadowRoot);
    });
  }

  await translate(currentLanguage);
  areWidgetTranslated = true;
};

import { toast } from 'react-toastify';
import { getClientApi } from '../../lib/api-client';

const originalTexts = new Map<Element, string>();
const originalPlaceholders = new Map<Element, string>();
let areOriginalsStored = false;
const documentLanguage = document.documentElement.lang;

function storeOriginals(rootElement: HTMLElement) {
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
  }
  areOriginalsStored = true;
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
    const key = originalText.trim().replace(/\s+/g, ' ');
    if (translationMap[key]) {
      element.textContent = translationMap[key];
    }
  }

  // Apply translations to placeholder attributes
  for (const [element, originalPlaceholder] of originalPlaceholders.entries()) {
    const key = originalPlaceholder.trim().replace(/\s+/g, ' ');
    if (
      translationMap[key] &&
      (element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement)
    ) {
      element.placeholder = translationMap[key];
    }
  }
}

export const translatePage = (language: string) => {
  if (document.readyState !== 'complete') {
    return;
  }

  if (!areOriginalsStored) {
    storeOriginals(document.body);
  }

  revertToOriginals();

  if (language.toLowerCase() !== documentLanguage) {
    translate(language);
  }
};

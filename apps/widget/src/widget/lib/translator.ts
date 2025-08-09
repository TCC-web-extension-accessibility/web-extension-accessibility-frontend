import { translations } from '../../mocks/mock-translation';

const originalTexts = new Map<Element, string>();
let areOriginalsStored = false;

function storeOriginals(rootElement: HTMLElement) {
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_ELEMENT
  );
  while (walker.nextNode()) {
    const element = walker.currentNode as Element;
    if (element.children.length === 0 && element.textContent?.trim()) {
      originalTexts.set(element, element.textContent);
    }
  }
  areOriginalsStored = true;
}

function revertToOriginals() {
  for (const [element, originalText] of originalTexts.entries()) {
    element.textContent = originalText;
  }
}

function translate(language: string) {
  // TODO: Replace mock translation with backend API call
  const translationMap = translations[language.toLowerCase()];
  if (!translationMap) {
    return;
  }

  for (const [element, originalText] of originalTexts.entries()) {
    const key = originalText.trim().replace(/\s+/g, ' ');
    if (translationMap[key]) {
      element.textContent = translationMap[key];
    }
  }
}

export const translatePage = (language: string) => {
  if (!areOriginalsStored) {
    storeOriginals(document.body);
  }

  revertToOriginals();

  if (language.toLowerCase() !== 'en') {
    translate(language);
  }
};

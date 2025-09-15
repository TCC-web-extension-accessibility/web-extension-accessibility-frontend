import { VOICE_NAVIGATION_CONSTANTS } from '../constants/voice-navigation.constants';
import { ELEMENT_SEARCH_SELECTORS, FOCUSABLE_SELECTORS } from '../constants/focusable-selectors.constants';
import { normalizeText, escapeSelector } from '../utils/text-normalization.util';

export class ElementFinderService {
  private readonly HOST: HTMLElement;
  private readonly WIDGET: HTMLElement | null;

  constructor() {
    this.HOST = document.querySelector(VOICE_NAVIGATION_CONSTANTS.HOST_SELECTOR) as HTMLElement;
    this.WIDGET = this.HOST?.shadowRoot?.querySelector(VOICE_NAVIGATION_CONSTANTS.WIDGET_SELECTOR) as HTMLElement | null;
  }

  findElementByTarget(target: string): Element | null {
    // Try ID selector search
    const idElement = this.searchById(target);
    if (idElement) return idElement;

    // Try name selector search
    const nameElement = this.searchByName(target);
    if (nameElement) return nameElement;

    // Try aria-label selector search
    const ariaLabelElement = this.searchByAriaLabel(target);
    if (ariaLabelElement) return ariaLabelElement;

    // Manual search through all elements
    const manualElement = this.manualSearch(target);
    if (manualElement) return manualElement;

    // Index-based search
    const indexElement = this.searchByIndex(target);
    if (indexElement) return indexElement;

    return null;
  }

  getFocusableElements(): HTMLElement[] {
    const elementsAll = [
      ...Array.from(document.querySelectorAll(FOCUSABLE_SELECTORS.join(','))),
      ...Array.from(this.WIDGET?.querySelectorAll(FOCUSABLE_SELECTORS.join(',')) || []),
    ];

    return elementsAll.filter(el => {
      const htmlEl = el as HTMLElement;
      return !htmlEl.hasAttribute('disabled') && htmlEl.offsetParent !== null;
    }) as HTMLElement[];
  }

  private searchById(target: string): Element | null {
    try {
      const escapedTarget = escapeSelector(target);
      const idSelector = `#${escapedTarget}`;
      return document.querySelector(idSelector) || this.WIDGET?.querySelector(idSelector) || null;
    } catch (e) {
      return null;
    }
  }

  private searchByName(target: string): Element | null {
    try {
      const escapedTarget = escapeSelector(target);
      const nameSelector = `[name="${escapedTarget}"]`;
      return document.querySelector(nameSelector) || this.WIDGET?.querySelector(nameSelector) || null;
    } catch (e) {
      return null;
    }
  }

  private searchByAriaLabel(target: string): Element | null {
    try {
      const escapedTarget = escapeSelector(target);
      const ariaLabelSelector = `[aria-label*="${escapedTarget}" i]`;
      return document.querySelector(ariaLabelSelector) || this.WIDGET?.querySelector(ariaLabelSelector) || null;
    } catch (e) {
      return null;
    }
  }

  private manualSearch(target: string): Element | null {
    const elements = Array.from(document.querySelectorAll(ELEMENT_SEARCH_SELECTORS.join(',')));
    const normalizedTarget = normalizeText(target);

    for (const el of elements) {
      // Check ID attribute
      if (this.checkAttribute(el, 'id', target, normalizedTarget)) return el;

      // Check name attribute
      if (this.checkAttribute(el, 'name', target, normalizedTarget)) return el;

      // Check placeholder attribute
      if (this.checkAttribute(el, 'placeholder', target, normalizedTarget)) return el;

      // Check text content
      if (this.checkTextContent(el, target, normalizedTarget)) return el;

      // Check aria-label attribute
      if (this.checkAttribute(el, 'aria-label', target, normalizedTarget)) return el;

      // Check associated label
      if (this.checkAssociatedLabel(el, target, normalizedTarget)) return el;
    }

    return null;
  }

  private checkAttribute(element: Element, attributeName: string, target: string, normalizedTarget: string): boolean {
    const attributeValue = element.getAttribute(attributeName);
    if (!attributeValue) return false;

    const normalizedAttributeValue = normalizeText(attributeValue);

    // Exact match
    if (attributeValue.toLowerCase().includes(target.toLowerCase())) {
      return true;
    }

    // Normalized match
    return normalizedAttributeValue.includes(normalizedTarget);
  }

  private checkTextContent(element: Element, target: string, normalizedTarget: string): boolean {
    if (!element.textContent) return false;

    const elementText = element.textContent.trim();
    const normalizedElementText = normalizeText(elementText);

    // Exact match
    if (elementText.toLowerCase().includes(target.toLowerCase())) {
      return true;
    }

    // Normalized match
    return normalizedElementText.includes(normalizedTarget);
  }

  private checkAssociatedLabel(element: Element, target: string, normalizedTarget: string): boolean {
    if (!['input', 'textarea', 'select'].includes(element.tagName.toLowerCase())) {
      return false;
    }

    const elementId = element.getAttribute('id');
    if (!elementId) return false;

    const associatedLabel = document.querySelector(`label[for="${elementId}"]`) ||
                           this.WIDGET?.querySelector(`label[for="${elementId}"]`);

    if (!associatedLabel?.textContent) return false;

    const labelText = associatedLabel.textContent.trim();
    const normalizedLabelText = normalizeText(labelText);

    // Exact match
    if (labelText.toLowerCase().includes(target.toLowerCase())) {
      return true;
    }

    // Normalized match
    return normalizedLabelText.includes(normalizedTarget);
  }

  private searchByIndex(target: string): Element | null {
    if (!target.startsWith('index_')) return null;

    const index = parseInt(target.split('_')[1]);
    const focusableElements = this.getFocusableElements();
    return focusableElements[index - 1] || null;
  }
}

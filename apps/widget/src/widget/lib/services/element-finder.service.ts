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

  findClickableElementByTarget(target: string): Element | null {
    const normalizedTarget = normalizeText(target);
    const focusableElements = this.getFocusableElements();

    // Verificar cada elemento clicável um por um
    for (const element of focusableElements) {
      // 1. Verificar por ID
      if (this.checkAttribute(element, 'id', target, normalizedTarget)) {
        return element;
      }

      // 2. Verificar por name
      if (this.checkAttribute(element, 'name', target, normalizedTarget)) {
        return element;
      }

      // 3. Verificar por aria-label
      if (this.checkAttribute(element, 'aria-label', target, normalizedTarget)) {
        return element;
      }

      // 3.5. Verificar por title
      if (this.checkAttribute(element, 'title', target, normalizedTarget)) {
        return element;
      }

      // 4. Verificar texto do elemento clicável (ignorando elementos clicáveis filhos)
      if (this.checkClickableElementText(element, target, normalizedTarget)) {
        return element;
      }

      // 5. Verificar elementos clicáveis filhos (se houver)
      const childClickableElements = element.querySelectorAll(FOCUSABLE_SELECTORS.join(','));
      if (childClickableElements.length > 0) {
        for (const childElement of childClickableElements) {
          // Verificar ID do filho
          if (this.checkAttribute(childElement, 'id', target, normalizedTarget)) {
            return childElement;
          }

          // Verificar name do filho
          if (this.checkAttribute(childElement, 'name', target, normalizedTarget)) {
            return childElement;
          }

          // Verificar aria-label do filho
          if (this.checkAttribute(childElement, 'aria-label', target, normalizedTarget)) {
            return childElement;
          }

          // Verificar title do filho
          if (this.checkAttribute(childElement, 'title', target, normalizedTarget)) {
            return childElement;
          }

          // Verificar texto do filho
          if (this.checkClickableElementText(childElement as HTMLElement, target, normalizedTarget)) {
            return childElement;
          }
        }
      }

      // 6. Verificar por index (se o target for numérico)
      const indexMatch = target.match(/^(\d+)$/);
      if (indexMatch) {
        const targetIndex = parseInt(indexMatch[1]) - 1; // Converter para 0-based
        if (targetIndex >= 0 && targetIndex < focusableElements.length) {
          const indexElement = focusableElements[targetIndex];
          return indexElement;
        }
      }
    }

    return null;
  }

  getFocusableElements(): HTMLElement[] {
      const elementsAll = [
      ...Array.from(document.querySelectorAll(FOCUSABLE_SELECTORS.join(','))),
      ...Array.from(this.WIDGET?.querySelectorAll(FOCUSABLE_SELECTORS.join(',')) || []),
    ];

    // Adicionar elementos com cursor pointer via CSS computado
    const allElements = Array.from(document.querySelectorAll('*'));
    const widgetElements = this.WIDGET ? Array.from(this.WIDGET.querySelectorAll('*')) : [];

    const cursorPointerElements = [...allElements, ...widgetElements]
      .filter(el => {
        const htmlEl = el as HTMLElement;
        try {
          const computedStyle = window.getComputedStyle(htmlEl);
          return computedStyle.cursor === 'pointer' && !elementsAll.includes(htmlEl);
        } catch {
          return false;
        }
      }) as HTMLElement[];

    const combinedElements = [...elementsAll, ...cursorPointerElements];

    return combinedElements.filter(el => {
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

  private checkClickableElementText(element: HTMLElement, target: string, normalizedTarget: string): boolean {
    // Para elementos clicáveis, verificar apenas o texto direto do elemento,
    // ignorando elementos clicáveis filhos
    const ownText = this.getElementOwnText(element);
    if (!ownText) return false;

    const normalizedOwnText = normalizeText(ownText);

    // Exact match
    if (ownText.toLowerCase().includes(target.toLowerCase())) {
      return true;
    }

    // Normalized match
    return normalizedOwnText.includes(normalizedTarget);
  }

  private getElementOwnText(element: HTMLElement): string {
    // Criar uma cópia do elemento para remover filhos clicáveis
    const clone = element.cloneNode(true) as HTMLElement;

    // Remover todos os elementos clicáveis filhos
    const clickableSelectors = FOCUSABLE_SELECTORS.join(',');
    const clickableChildren = clone.querySelectorAll(clickableSelectors);
    clickableChildren.forEach(child => child.remove());

    // Retornar o texto restante
    return clone.textContent?.trim() || '';
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

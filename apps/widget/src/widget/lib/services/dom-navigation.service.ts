import { VOICE_NAVIGATION_CONSTANTS } from '../constants/voice-navigation.constants';
import { ElementFinderService } from './element-finder.service';
import { getElementDescription } from '../utils/element-description.util';
import type { ZoomDirection } from '../types/voice-navigation.types';

export class DomNavigationService {
  private readonly HOST: HTMLElement;
  private readonly elementFinder: ElementFinderService;

  constructor() {
    this.HOST = document.querySelector(VOICE_NAVIGATION_CONSTANTS.HOST_SELECTOR) as HTMLElement;
    if (!this.HOST) {
      this.HOST = document.getElementById("root") as HTMLElement;
    }
    this.elementFinder = new ElementFinderService();
  }

  // Gets all focusable elements on the page
  getFocusableElements(): HTMLElement[] {
    return this.elementFinder.getFocusableElements();
  }

  // Navigates to a specific element by target string
  navigateToElement(target: string): HTMLElement | null {
    const element = this.elementFinder.findElementByTarget(target) as HTMLElement | null;
    if (element) {
      element.focus();
      this.highlightElement(element);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return element;
  }

  // Clicks on an element identified by target string
  clickElement(target: string): HTMLElement | null {
    const element = this.elementFinder.findElementByTarget(target) as HTMLElement | null;
    if (element) {
      element.click();
    }
    return element;
  }

  // Gets text content from an element for reading
  getElementTextContent(target: string): string | null {
    const element = this.elementFinder.findElementByTarget(target);
    if (element) {
      return element.textContent || element.getAttribute('aria-label') || 'Elemento sem texto';
    }
    return null;
  }

  // Gets page content for reading
  getPageContent(): string {
    const mainContent = document.querySelector('main') || document.body;
    const text = mainContent.textContent || '';
    return text;
  }

  // Applies zoom to the page
  applyPageZoom(direction: ZoomDirection): void {
    const currentZoom = parseFloat(document.body.style.zoom || '1');
    const { ZOOM_STEP, MIN_ZOOM, MAX_ZOOM } = VOICE_NAVIGATION_CONSTANTS;

    let newZoom: number;
    if (direction === 'in') {
      newZoom = Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM);
    } else {
      newZoom = Math.max(currentZoom - ZOOM_STEP, MIN_ZOOM);
    }

    document.body.style.zoom = newZoom.toString();

    // Neutralizes the zoom on the widget so that it maintains its original size
    if (this.HOST) {
      const inverseZoom = 1 / newZoom;
      this.HOST.style.zoom = inverseZoom.toString();
      this.HOST.style.transformOrigin = 'bottom right';
    }
  }

  // Scrolls the page in a specific direction
  scrollPage(direction: 'up' | 'down' | 'left' | 'right'): void {
    const { SCROLL_DISTANCE } = VOICE_NAVIGATION_CONSTANTS;

    switch (direction) {
      case 'down':
        window.scrollBy(0, SCROLL_DISTANCE);
        break;
      case 'up':
        window.scrollBy(0, -SCROLL_DISTANCE);
        break;
      case 'left':
        window.scrollBy(-SCROLL_DISTANCE, 0);
        break;
      case 'right':
        window.scrollBy(SCROLL_DISTANCE, 0);
        break;
    }
  }

  // Highlights an element visually
  highlightElement(element: Element): void {
    // Helper to remove highlights from a root
    const removeHighlights = (root: ParentNode | ShadowRoot | Document) => {
      root.querySelectorAll(`.${VOICE_NAVIGATION_CONSTANTS.VOICE_HIGHLIGHT_CLASS}`).forEach(el => {
        el.classList.remove(VOICE_NAVIGATION_CONSTANTS.VOICE_HIGHLIGHT_CLASS);
      });
    };

    // Remove highlights from main document and shadow-root (if exists)
    removeHighlights(document);
    const shadowRoot = this.HOST?.shadowRoot;
    if (shadowRoot) removeHighlights(shadowRoot);

    // Add highlight
    element.classList.add(VOICE_NAVIGATION_CONSTANTS.VOICE_HIGHLIGHT_CLASS);

    // Remove after specified duration
    setTimeout(() => {
      element.classList.remove(VOICE_NAVIGATION_CONSTANTS.VOICE_HIGHLIGHT_CLASS);
      if (shadowRoot) removeHighlights(shadowRoot);
    }, VOICE_NAVIGATION_CONSTANTS.HIGHLIGHT_DURATION);
  }

  // Injects CSS styles for element highlighting
  injectHighlightStyles(): void {
    if (!document.getElementById(VOICE_NAVIGATION_CONSTANTS.VOICE_HIGHLIGHT_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = VOICE_NAVIGATION_CONSTANTS.VOICE_HIGHLIGHT_STYLE_ID;
      style.textContent = `
        .${VOICE_NAVIGATION_CONSTANTS.VOICE_HIGHLIGHT_CLASS} {
          outline: 3px solid #c52509 !important;
          outline-offset: 2px !important;
          transition: outline 0.2s ease-in-out;
          position: relative;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Gets description for an element
  getElementDescription(element: Element): string {
    return getElementDescription(element);
  }
}

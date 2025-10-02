import { VOICE_NAVIGATION_CONSTANTS } from '../constants/voice-navigation.constants';

// Gets a comprehensive description for any element type
export function getElementDescription(element: Element): string {
  const HOST = document.querySelector(VOICE_NAVIGATION_CONSTANTS.HOST_SELECTOR) as HTMLElement;
  const WIDGET = HOST?.shadowRoot?.querySelector(VOICE_NAVIGATION_CONSTANTS.WIDGET_SELECTOR) as HTMLElement;

  // Priority 1: aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  // Priority 2: aria-labelledby
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy) || WIDGET?.querySelector(`#${ariaLabelledBy}`);
    if (labelElement && labelElement.textContent) {
      return labelElement.textContent.trim();
    }
  }

  // Priority 3: associated label for form elements
  const elementId = element.getAttribute('id');
  if (elementId && (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'select')) {
    const associatedLabel = document.querySelector(`label[for="${elementId}"]`) || WIDGET?.querySelector(`label[for="${elementId}"]`);
    if (associatedLabel && associatedLabel.textContent) {
      return associatedLabel.textContent.trim();
    }
  }

  // Priority 4: parent label
  const parentLabel = element.closest('label');
  if (parentLabel && parentLabel.textContent) {
    const labelText = parentLabel.textContent.trim();
    const elementText = element.textContent?.trim() || '';
    if (labelText !== elementText && labelText.includes(elementText)) {
      return labelText.replace(elementText, '').trim();
    } else if (labelText !== elementText) {
      return labelText;
    }
  }

  // Priority 5: placeholder for inputs
  const placeholder = element.getAttribute('placeholder');
  if (placeholder && placeholder.trim()) {
    return `Campo: ${placeholder.trim()}`;
  }

  // Priority 6: title attribute
  const title = element.getAttribute('title');
  if (title && title.trim()) {
    return title.trim();
  }

  // Priority 7: name attribute
  const name = element.getAttribute('name');
  if (name && name.trim()) {
    return `Campo: ${name.trim()}`;
  }

  // Priority 8: id attribute
  const id = element.getAttribute('id');
  if (id && id.trim()) {
    return id.trim().replace(/[-_]/g, ' ');
  }

  // Priority 9: alt for images
  if (element.tagName.toLowerCase() === 'img') {
    const alt = element.getAttribute('alt');
    if (alt && alt.trim()) {
      return alt.trim();
    }
  }

  // Priority 10: value for button-type inputs
  if (element.tagName.toLowerCase() === 'input') {
    const inputType = element.getAttribute('type')?.toLowerCase();
    if (['button', 'submit', 'reset'].includes(inputType || '')) {
      const value = (element as HTMLInputElement).value;
      if (value && value.trim()) {
        return value.trim();
      }
    }
  }

  // Priority 11: text content
  const textContent = element.textContent?.trim();
  return textContent && textContent.length <= 20 ? textContent : element.tagName.toLowerCase();
}

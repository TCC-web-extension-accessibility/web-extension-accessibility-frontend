export const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button',
  'input',
  'textarea',
  'select',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
  '[role="button"]',
  '[role="link"]'
] as const;

export const ELEMENT_SEARCH_SELECTORS = [
  'button',
  'a',
  '[role="button"]',
  '[role="link"]',
  '[aria-label]',
  '[tabindex]',
  'input',
  'textarea',
  'select'
] as const;

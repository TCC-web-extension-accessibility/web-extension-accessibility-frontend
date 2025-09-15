// Normalizes text by removing accents and special characters
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s]/g, '') // Remove special characters
    .toLowerCase()
    .trim();
}

// Escapes special CSS selector characters
export function escapeSelector(str: string): string {
  return str.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

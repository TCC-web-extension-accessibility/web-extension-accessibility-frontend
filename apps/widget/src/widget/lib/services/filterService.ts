import type { ColorFilterType } from '../types/color-filter.types';
import domtoimage from 'dom-to-image-more';

const GLOBAL_STYLES_ID = 'widget-global-filters';

function injectGlobalFilterStyles(): void {
  if (document.getElementById(GLOBAL_STYLES_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = GLOBAL_STYLES_ID;
  style.innerHTML = `
    body.filter-grayscale > *:not(#web-extension-accessibility) {
      filter: grayscale(100%);
    }
    body.filter-sepia > *:not(#web-extension-accessibility) {
      filter: sepia(100%);
    }
    body.filter-invert > *:not(#web-extension-accessibility) {
      filter: invert(100%) hue-rotate(180deg);
    }
    body.filter-saturate > *:not(#web-extension-accessibility) {
      filter: saturate(200%);
    }
    body.filter-protanopia-assist > *:not(#web-extension-accessibility) {
      filter: url(#protanopia-assist);
    }
  `;
  document.head.appendChild(style);
}

export function applyColorFilter(filter: ColorFilterType): void {
  injectGlobalFilterStyles();

  const allFilters: ColorFilterType[] = [
    'filter-grayscale',
    'filter-sepia',
    'filter-invert',
    'filter-saturate',
    'filter-protanopia-assist',
  ];

  if (document.body) {
    document.body.classList.remove(...allFilters);
    if (filter !== 'no-filter') {
      document.body.classList.add(filter);
    }
  }
}

export async function suggestFilterWithAI(): Promise<string> {
  try {

    const options = {
      'cacheBust': true,
      'quality': 0.95,
    };

    const imageBase64 = await domtoimage.toPng(document.body, options);

    const fetchRes = await fetch(imageBase64);
    const blob = await fetchRes.blob();
    const imageFile = new File([blob], 'screenshot.png', { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('color_blindness_type', 'protanopia');

    const API_URL = 'http://127.0.0.1:8000/api/v1/analyze-colors/';

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'A resposta da API não foi bem-sucedida.');
    }

    const result = await response.json();
    return result.suggested_filter;

  } catch (error) {
    console.error("Erro ao gerar a imagem do DOM: ", error);
    throw error;
  };
}

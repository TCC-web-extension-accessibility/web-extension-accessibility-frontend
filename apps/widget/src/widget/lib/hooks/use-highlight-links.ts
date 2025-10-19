import { useLayoutEffect, useState } from 'react';
import { getStorageValue, setStorageValue } from '../accessibility-utils';

const STYLE_TAG_ID = 'accessibility-highlight-links-style';

const createStyleTag = (): HTMLStyleElement => {
  const styleTag = document.createElement('style');
  styleTag.id = STYLE_TAG_ID;
  styleTag.innerHTML = `
    a:not(#web-extension-accessibility *),
    a:link:not(#web-extension-accessibility *),
    a:visited:not(#web-extension-accessibility *),
    a:hover:not(#web-extension-accessibility *),
    a:active:not(#web-extension-accessibility *),
    [href]:not(#web-extension-accessibility *) {
      background-color: black !important;
      color: yellow !important;
      text-decoration: underline !important;
    }
  `;
  return styleTag;
};

export const useHighlightLinks = () => {
  if (import.meta.env.VITE_FEATURE_HIGHLIGHTLINKS !== 'true') {
    return {
      highlightLinks: false,
      toggleHighlightLinks: () => {},
      isEnabled: false,
    };
  }
  const HIGHLIGHT_LINKS_STORAGE_KEY = 'accessibility-highlight-links';
  const [highlightLinks, setHighlightLinks] = useState(() =>
    getStorageValue(HIGHLIGHT_LINKS_STORAGE_KEY, false)
  );

  const applyHighlightLinks = (value: boolean) => {
    const styleTag = document.getElementById(STYLE_TAG_ID);

    if (value) {
      if (!styleTag) {
        document.head.appendChild(createStyleTag());
      }
    } else {
      if (styleTag) {
        styleTag.remove();
      }
    }

    setStorageValue(HIGHLIGHT_LINKS_STORAGE_KEY, value);

    setHighlightLinks(value);
  };

  useLayoutEffect(() => {
    applyHighlightLinks(highlightLinks);
  }, []);

  const toggleHighlightLinks = () => {
    applyHighlightLinks(!highlightLinks);
  };

  return {
    highlightLinks,
    toggleHighlightLinks,
    isEnabled: true,
  };
};

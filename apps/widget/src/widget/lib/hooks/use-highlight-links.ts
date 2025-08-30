import { useLayoutEffect, useState } from 'react';

const STYLE_TAG_ID = 'accessibility-highlight-links-style';

const createStyleTag = (): HTMLStyleElement => {
  const styleTag = document.createElement('style');
  styleTag.id = STYLE_TAG_ID;
  styleTag.innerHTML = `
    a,
    a:link,
    a:visited,
    a:hover,
    a:active,
    [href] {
      background-color: black !important;
      color: yellow !important;
      text-decoration: underline !important;
    }
  `;
  return styleTag;
};

export const useHighlightLinks = () => {
  const HIGHLIGHT_LINKS_STORAGE_KEY = 'accessibility-highlight-links';
  const [highlightLinks, setHighlightLinks] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(HIGHLIGHT_LINKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });

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

    if (typeof window !== 'undefined') {
      localStorage.setItem(HIGHLIGHT_LINKS_STORAGE_KEY, JSON.stringify(value));
    }

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
  };
};

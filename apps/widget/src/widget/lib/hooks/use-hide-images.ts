import { useLayoutEffect, useState } from 'react';

const STYLE_TAG_ID = 'accessibility-hide-images-style';

const createStyleTag = (): HTMLStyleElement => {
  const styleTag = document.createElement('style');
  styleTag.id = STYLE_TAG_ID;
  styleTag.innerHTML = `
    img,
    image,
    [role="img"],
    [style*="background-image"] {
      visibility: hidden !important;
    }
  `;
  return styleTag;
};

export const useHideImages = () => {
  const HIDE_IMAGES_STORAGE_KEY = 'accessibility-hide-images';
  const [hideImages, setHideImages] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(HIDE_IMAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  const applyHideImages = (value: boolean) => {
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
      localStorage.setItem(HIDE_IMAGES_STORAGE_KEY, JSON.stringify(value));
    }

    setHideImages(value);
  };

  useLayoutEffect(() => {
    applyHideImages(hideImages);
  }, []);

  const toggleHideImages = () => {
    applyHideImages(!hideImages);
  };

  return {
    hideImages,
    toggleHideImages,
  };
};

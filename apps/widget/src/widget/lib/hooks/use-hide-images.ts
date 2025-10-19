import { useLayoutEffect, useState } from 'react';
import { getStorageValue, setStorageValue } from '../accessibility-utils';

const STYLE_TAG_ID = 'accessibility-hide-images-style';

const createStyleTag = (): HTMLStyleElement => {
  const styleTag = document.createElement('style');
  styleTag.id = STYLE_TAG_ID;
  styleTag.innerHTML = `
    img:not(#web-extension-accessibility *),
    image:not(#web-extension-accessibility *),
    [role="img"]:not(#web-extension-accessibility *),
    [style*="background-image"]:not(#web-extension-accessibility *) {
      visibility: hidden !important;
    }
  `;
  return styleTag;
};

export const useHideImages = () => {
  if (import.meta.env.VITE_FEATURE_HIDEIMAGES !== 'true') {
    return {
      hideImages: false,
      toggleHideImages: () => {},
      isEnabled: false,
    };
  }
  const HIDE_IMAGES_STORAGE_KEY = 'accessibility-hide-images';
  const [hideImages, setHideImages] = useState(() =>
    getStorageValue(HIDE_IMAGES_STORAGE_KEY, false)
  );

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

    setStorageValue(HIDE_IMAGES_STORAGE_KEY, value);

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
    isEnabled: true,
  };
};

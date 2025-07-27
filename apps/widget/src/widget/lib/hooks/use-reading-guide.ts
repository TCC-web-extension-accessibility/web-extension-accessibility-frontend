import { useCallback, useLayoutEffect, useState } from 'react';

const STYLE_TAG_ID = 'accessibility-reading-guide-style';
const MASK_ID = 'accessibility-reading-guide-mask';

export const READING_GUIDE_MODES = {
  OFF: 'off',
  BAR: 'bar',
  MASK: 'mask',
} as const;

type ReadingGuideMode =
  (typeof READING_GUIDE_MODES)[keyof typeof READING_GUIDE_MODES];

const createStyleTag = (): HTMLStyleElement => {
  const styleTag = document.createElement('style');
  styleTag.id = STYLE_TAG_ID;
  styleTag.innerHTML = `
    body.reading-guide-bar-active {
      cursor: none;
    }
    body.reading-guide-bar-active::after { /* The bar */
      content: '';
      position: fixed;
      top: calc(var(--reading-guide-y, -100px) - 10px);
      left: var(--reading-guide-x, -100px);
      transform: translateX(-50%);
      width: 500px;
      height: 7px;
      background: #184677;
      border: 1px solid #000;
      border-radius: 8px;
      z-index: 2147483647;
      pointer-events: none;
    }
    body.reading-guide-bar-active::before { /* The triangle */
      content: '';
      position: fixed;
      top: calc(var(--reading-guide-y, -100px) - 20px);
      left: var(--reading-guide-x, -100px);
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-bottom: 15px solid #184677;
      z-index: 2147483647;
      pointer-events: none;
    }
    #${MASK_ID} {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 2147483647;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0.7) calc(var(--reading-guide-y, -100px) - 50px),
        transparent calc(var(--reading-guide-y, -100px) - 50px),
        transparent calc(var(--reading-guide-y, -100px) + 50px),
        rgba(0, 0, 0, 0.7) calc(var(--reading-guide-y, -100px) + 50px),
        rgba(0, 0, 0, 0.7) 100%
      );
    }
  `;
  return styleTag;
};

let animationFrameId: number | null = null;

const handleMouseMove = (event: MouseEvent) => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = requestAnimationFrame(() => {
    document.documentElement.style.setProperty(
      '--reading-guide-x',
      `${event.clientX}px`
    );
    document.documentElement.style.setProperty(
      '--reading-guide-y',
      `${event.clientY}px`
    );
  });
};

export const useReadingGuide = () => {
  const READING_GUIDE_STORAGE_KEY = 'accessibility-reading-guide-mode';
  const modes = Object.values(READING_GUIDE_MODES);
  const [mode, setMode] = useState<ReadingGuideMode>(READING_GUIDE_MODES.OFF);
  const currentIndex = modes.indexOf(mode);

  const applyMode = useCallback((newMode: ReadingGuideMode) => {
    document.body.classList.remove('reading-guide-bar-active');
    const existingMask = document.getElementById(MASK_ID);
    if (existingMask) {
      existingMask.remove();
    }
    window.removeEventListener('mousemove', handleMouseMove);

    if (newMode === READING_GUIDE_MODES.BAR) {
      document.body.classList.add('reading-guide-bar-active');
      window.addEventListener('mousemove', handleMouseMove);
    } else if (newMode === READING_GUIDE_MODES.MASK) {
      const mask = document.createElement('div');
      mask.id = MASK_ID;
      document.body.appendChild(mask);
      window.addEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useLayoutEffect(() => {
    const styleTag = createStyleTag();
    document.head.appendChild(styleTag);

    const storedMode = localStorage.getItem(
      READING_GUIDE_STORAGE_KEY
    ) as ReadingGuideMode | null;
    const initialMode =
      storedMode && Object.values(READING_GUIDE_MODES).includes(storedMode)
        ? storedMode
        : READING_GUIDE_MODES.OFF;
    setMode(initialMode);
    applyMode(initialMode);

    return () => {
      if (document.head.contains(styleTag)) {
        document.head.removeChild(styleTag);
      }
      applyMode(READING_GUIDE_MODES.OFF);
    };
  }, [applyMode]);

  const cycleReadingGuideMode = () => {
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];
    localStorage.setItem(READING_GUIDE_STORAGE_KEY, nextMode);
    setMode(nextMode);
    applyMode(nextMode);
  };

  return {
    readingGuideMode: mode,
    maxReadingGuideMode: modes.length - 1,
    currentStep: currentIndex,
    cycleReadingGuideMode,
  };
};

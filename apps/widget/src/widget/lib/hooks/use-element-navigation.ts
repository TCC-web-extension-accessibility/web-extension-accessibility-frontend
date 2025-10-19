import { useCallback, useRef } from 'react';
import { VOICE_NAVIGATION_CONSTANTS } from '../constants/voice-navigation.constants';
import { DomNavigationService } from '../services/dom-navigation.service';
import { SpeechFeedbackService } from '../services/speech-feedback.service';

type UseElementNavigationProps = {
  selectedLanguage?: string;
  domService: DomNavigationService;
  speechService: SpeechFeedbackService;
};

export function useElementNavigation({
  selectedLanguage,
  domService,
  speechService,
}: UseElementNavigationProps) {
  if (import.meta.env.VITE_FEATURE_VOICENAVIGATION !== 'true') {
    return {
      navigateToNextElement: () => {},
      navigateToPreviousElement: () => {},
      navigateToElement: () => {},
      isEnabled: false,
    };
  }
  // Uses sessionStorage to persist the navigation index between component mounts/unmounts
  const getInitialNavIndex = () => {
    const stored = sessionStorage.getItem(
      VOICE_NAVIGATION_CONSTANTS.VOICE_NAV_INDEX_KEY
    );
    return stored ? parseInt(stored, 10) : null;
  };

  // Ref to store the index of the last element focused by voice navigation
  const lastVoiceNavIndexRef = useRef<number | null>(getInitialNavIndex());

  const navigateToNextElement = useCallback(() => {
    const focusableElements = domService.getFocusableElements();

    if (focusableElements.length === 0) {
      speechService.speak('Nenhum elemento focável encontrado na página', 'pt');
      return;
    }

    let nextIndex: number;

    if (lastVoiceNavIndexRef.current === null) {
      nextIndex = 0;
    } else {
      nextIndex = (lastVoiceNavIndexRef.current + 1) % focusableElements.length;
    }

    const nextEl = focusableElements[nextIndex] as HTMLElement;
    if (nextEl) {
      nextEl.focus();
      domService.highlightElement(nextEl);
      const description = domService.getElementDescription(nextEl);
      speechService.speak(`Focando em ${description}`, 'pt');
      lastVoiceNavIndexRef.current = nextIndex;
      sessionStorage.setItem(
        VOICE_NAVIGATION_CONSTANTS.VOICE_NAV_INDEX_KEY,
        nextIndex.toString()
      );
    }
  }, [selectedLanguage, domService, speechService]);

  const navigateToPreviousElement = useCallback(() => {
    const focusableElements = domService.getFocusableElements();

    if (focusableElements.length === 0) {
      speechService.speak('Nenhum elemento focável encontrado na página', 'pt');
      return;
    }

    let prevIndex: number;

    if (lastVoiceNavIndexRef.current === null) {
      prevIndex = 0;
    } else {
      prevIndex =
        lastVoiceNavIndexRef.current > 0
          ? lastVoiceNavIndexRef.current - 1
          : focusableElements.length - 1;
    }

    const prevEl = focusableElements[prevIndex] as HTMLElement;
    if (prevEl) {
      prevEl.focus();
      domService.highlightElement(prevEl);
      const description = domService.getElementDescription(prevEl);
      speechService.speak(`Focando em ${description}`, 'pt');
      lastVoiceNavIndexRef.current = prevIndex;
      sessionStorage.setItem(
        VOICE_NAVIGATION_CONSTANTS.VOICE_NAV_INDEX_KEY,
        prevIndex.toString()
      );
    }
  }, [selectedLanguage, domService, speechService]);

  const navigateToElement = useCallback(
    (target: string) => {
      const element = domService.navigateToElement(target);
      if (element) {
        const focusableElements = domService.getFocusableElements();
        const elementIndex = focusableElements.findIndex(
          (el) => el === element
        );

        const description = domService.getElementDescription(element);
        speechService.speak(`Focando em ${description}`, 'pt');

        if (elementIndex !== -1) {
          lastVoiceNavIndexRef.current = elementIndex;
          sessionStorage.setItem(
            VOICE_NAVIGATION_CONSTANTS.VOICE_NAV_INDEX_KEY,
            elementIndex.toString()
          );
        }
      } else {
        speechService.speak(`Elemento ${target} não encontrado`, 'pt');
      }
    },
    [selectedLanguage, domService, speechService]
  );

  return {
    navigateToNextElement,
    navigateToPreviousElement,
    navigateToElement,
    isEnabled: true,
  };
}

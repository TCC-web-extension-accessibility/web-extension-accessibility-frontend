import { useCallback } from 'react';
import type { VoiceCommand } from '../types/voice-navigation.types';
import { DomNavigationService } from '../services/dom-navigation.service';
import { SpeechFeedbackService } from '../services/speech-feedback.service';
import { useElementNavigation } from './use-element-navigation';

type UseVoiceCommandsProps = {
  selectedLanguage?: string;
  domService: DomNavigationService;
  speechService: SpeechFeedbackService;
}

export function useVoiceCommands({ selectedLanguage, domService, speechService }: UseVoiceCommandsProps) {

  const { navigateToNextElement, navigateToPreviousElement, navigateToElement } = useElementNavigation({
    selectedLanguage,
    domService,
    speechService
  });

  const executeCommand = useCallback(async (command: VoiceCommand) => {
    switch (command.action) {
      case 'scroll_down':
        domService.scrollPage('down');
        speechService.speak('Rolando para baixo', selectedLanguage);
        break;

      case 'scroll_up':
        domService.scrollPage('up');
        speechService.speak('Rolando para cima', selectedLanguage);
        break;

      case 'scroll_left':
        domService.scrollPage('left');
        speechService.speak('Rolando para esquerda', selectedLanguage);
        break;

      case 'scroll_right':
        domService.scrollPage('right');
        speechService.speak('Rolando para direita', selectedLanguage);
        break;

      case 'navigate_next':
        navigateToNextElement();
        break;

      case 'navigate_previous':
        navigateToPreviousElement();
        break;

      case 'navigate_to':
        if (command.target) {
          navigateToElement(command.target);
        } else {
          speechService.speak('Nenhum destino especificado para navegação', selectedLanguage);
        }
        break;

      case 'click':
        if (command.target) {
          const element = domService.clickElement(command.target);
          if (element) {
            const description = domService.getElementDescription(element);
            speechService.speak(`Clicado em ${description}`, selectedLanguage);
          } else {
            speechService.speak(`Elemento ${command.target} não encontrado`, selectedLanguage);
          }
        }
        break;

      case 'read':
        if (command.target && command.target !== 'página') {
          const text = domService.getElementTextContent(command.target);
          if (text) {
            speechService.speak(text, selectedLanguage);
          } else {
            speechService.speak(`Elemento ${command.target} não encontrado`, selectedLanguage);
          }
        } else {
          const pageContent = domService.getPageContent();
          speechService.speak(pageContent, selectedLanguage);
        }
        break;

      case 'show_help':
        speechService.provideHelp(selectedLanguage);
        break;

      case 'go_back':
        window.history.back();
        speechService.speak('Voltando para página anterior', selectedLanguage);
        break;

      case 'zoom_in':
        domService.applyPageZoom('in');
        speechService.speak('Zoom aumentado', selectedLanguage);
        break;

      case 'zoom_out':
        domService.applyPageZoom('out');
        speechService.speak('Zoom diminuído', selectedLanguage);
        break;

      default:
        speechService.speak('Comando não reconhecido', selectedLanguage);
    }
  }, [selectedLanguage, domService, speechService]);

  return {
    executeCommand
  };
}

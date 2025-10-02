import { VOICE_NAVIGATION_CONSTANTS } from '../constants/voice-navigation.constants';
import { getRecognitionLanguage } from '../utils/language-mapping.util';

export class SpeechFeedbackService {
  // Provides voice feedback using speech synthesis
  speak(text: string, language?: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getRecognitionLanguage(language);
      utterance.rate = VOICE_NAVIGATION_CONSTANTS.SPEECH_RATE;
      speechSynthesis.speak(utterance);
    }
  }

  // Provides help text about available voice commands
  provideHelp(language?: string): void {
    const helpText = `
      Comandos disponíveis:
      - Navegação: "ir para [elemento]", "rolar para baixo", "próximo elemento"
      - Interação: "clicar em [elemento]", "botão [nome]"
      - Leitura: "ler [elemento]", "ler página"
      - Sistema: "ajuda", "voltar", "aumentar zoom"
    `;
    this.speak(helpText, language);
  }
}

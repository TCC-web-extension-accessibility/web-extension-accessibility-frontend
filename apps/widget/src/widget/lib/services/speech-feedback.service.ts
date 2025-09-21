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

  // Cancels any ongoing speech synthesis
  cancel(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  // Pauses ongoing speech synthesis
  pause(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.pause();
    }
  }

  // Resumes paused speech synthesis
  resume(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.resume();
    }
  }

  // Gets available voices for speech synthesis
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if ('speechSynthesis' in window) {
      return speechSynthesis.getVoices();
    }
    return [];
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

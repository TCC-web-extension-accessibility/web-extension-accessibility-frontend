import { LANGUAGE_MAPPING, DEFAULT_LANGUAGE } from '../constants/language-codes.constants';

// Maps language codes to speech recognition language codes
export function getRecognitionLanguage(languageCode?: string): string {
  return LANGUAGE_MAPPING.RECOGNITION[languageCode as keyof typeof LANGUAGE_MAPPING.RECOGNITION] || DEFAULT_LANGUAGE;
}

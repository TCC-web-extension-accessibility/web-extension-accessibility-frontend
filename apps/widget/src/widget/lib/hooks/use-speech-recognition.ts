import { useCallback, useEffect, useRef, useState } from 'react';
import { VOICE_NAVIGATION_CONSTANTS } from '../constants/voice-navigation.constants';
import type { SpeechRecognition } from '../types/speech-api.types';
import { getRecognitionLanguage } from '../utils/language-mapping.util';

type UseSpeechRecognitionProps = {
  selectedLanguage?: string;
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
};

type SpeechRecognitionState = {
  isListening: boolean;
  isSupported: boolean;
  error?: string;
};

export function useSpeechRecognition({
  selectedLanguage,
  onResult,
  onError,
}: UseSpeechRecognitionProps) {
  if (import.meta.env.VITE_FEATURE_VOICE_NAVIGATION !== 'true') {
    return {
      isListening: false,
      isSupported: false,
      error: undefined,
      startListening: () => {},
      stopListening: () => {},
      isEnabled: false,
    };
  }
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isSupported: false,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for Web Speech API support
  useEffect(() => {
    const isSupported =
      'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setState((prev) => ({ ...prev, isSupported }));
  }, []);

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (!state.isSupported) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort?.();
        recognitionRef.current.stop?.();
      } catch {}
      recognitionRef.current = null;
    }

    const SpeechRecognitionClass = (window.SpeechRecognition ||
      window.webkitSpeechRecognition) as typeof window.SpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getRecognitionLanguage(selectedLanguage);
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState((prev) => ({ ...prev, isListening: true, error: undefined }));

      // Clear previous timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set timeout to detect lack of speech
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setState((prev) => ({ ...prev, isListening: false }));
        onError('Nenhuma fala detectada. Clique no botão Ativar novamente.');
      }, VOICE_NAVIGATION_CONSTANTS.SPEECH_TIMEOUT);
    };

    recognition.onresult = (event) => {
      // Clear the timeout as speech was detected
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      // Clear the timeout in case of error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      let errorMessage = 'Erro no reconhecimento de fala';

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'Nenhuma fala detectada';
          break;
        case 'audio-capture':
          errorMessage = 'Erro na captura de áudio';
          break;
        case 'not-allowed':
          errorMessage = 'Permissão de microfone negada';
          break;
        case 'network':
          errorMessage = 'Erro de rede';
          break;
      }

      setState((prev) => ({
        ...prev,
        isListening: false,
        error: errorMessage,
      }));
      onError(errorMessage);
    };

    recognition.onend = () => {
      // Clear the timeout when recognition ends
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setState((prev) => ({ ...prev, isListening: false }));
    };

    recognitionRef.current = recognition as any;
  }, [state.isSupported, selectedLanguage, onResult, onError]);

  // Start listening to voice
  const startListening = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: undefined }));

      if (state.isSupported && recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        const error = 'Web Speech API não suportada neste navegador';
        setState((prev) => ({ ...prev, error }));
        onError(error);
      }
    } catch (error) {
      const errorMessage = 'Erro ao iniciar escuta';
      setState((prev) => ({ ...prev, error: errorMessage }));
      onError(errorMessage);
    }
  }, [state.isSupported, onError]);

  const stopListening = useCallback(() => {
    // Clear the timeout when stopping manually
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }

    setState((prev) => ({ ...prev, isListening: false }));
  }, [state.isListening]);

  // Initialize components
  useEffect(() => {
    if (state.isSupported) {
      initializeSpeechRecognition();
    }

    return () => {
      // Clear the timeout on cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort?.();
          recognitionRef.current.stop?.();
        } catch {}
        recognitionRef.current = null;
      }
    };
  }, [state.isSupported, initializeSpeechRecognition]);

  return {
    ...state,
    startListening,
    stopListening,
    isEnabled: true,
  };
}

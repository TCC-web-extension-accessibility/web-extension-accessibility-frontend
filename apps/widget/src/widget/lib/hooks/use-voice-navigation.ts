import { useState, useEffect, useCallback, useMemo } from 'react';
import type { VoiceCommandRequest } from '@web-extension-accessibility-frontend/api-client';
import type {
  VoiceNavigationState,
  VoiceNavigationActions,
  UseVoiceNavigationProps,
  VoiceCommand,
  VoiceNavigationApiError
} from '../types/voice-navigation.types';
import { VoiceNavigationApiService } from '../services/voice-navigation-api.service';
import { DomNavigationService } from '../services/dom-navigation.service';
import { SpeechFeedbackService } from '../services/speech-feedback.service';
import { useSpeechRecognition } from './use-speech-recognition';
import { useVoiceCommands } from './use-voice-commands';

export function useVoiceNavigation(props?: UseVoiceNavigationProps): [VoiceNavigationState, VoiceNavigationActions] {
  const [state, setState] = useState<VoiceNavigationState>({
    isListening: false,
    isConnected: false,
    isSupported: false,
    status: 'idle'
  });

  // Initialize services
  const apiService = useMemo(() => new VoiceNavigationApiService(), []);
  const domService = useMemo(() => new DomNavigationService(), []);
  const speechService = useMemo(() => new SpeechFeedbackService(), []);

  // Initialize specialized hooks
  const { executeCommand } = useVoiceCommands({
    selectedLanguage: props?.selectedLanguage,
    domService,
    speechService
  });

  // Process command via API REST
  const processCommandWithAPI = useCallback(async (text: string): Promise<VoiceCommand | null> => {
    try {
      setState(prev => ({ ...prev, isConnected: true }));

      const request: VoiceCommandRequest = {
        text: text
      };

      const command = await apiService.processCommand(request);
      return command;
    } catch (error) {
      console.error('Erro ao processar comando:', error);

      const apiError = error as VoiceNavigationApiError;
      setState(prev => ({
        ...prev,
        error: apiError.message,
        status: 'error',
        isConnected: false
      }));
      return null;
    }
  }, [props?.selectedLanguage, apiService]);

  // Enhanced execute command with navigation support
  const executeCommandEnhanced = useCallback(async (command: VoiceCommand) => {
    try {
      setState(prev => ({ ...prev, status: 'processing' }));

      await executeCommand(command);

      setState(prev => ({ ...prev, status: 'idle' }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao executar comando',
        status: 'error'
      }));
    }
  }, [executeCommand]);

  // Sends text command to the backend
  const sendTextCommand = useCallback(async (text: string) => {
    setState(prev => ({ ...prev, status: 'processing' }));

    const command = await processCommandWithAPI(text);
    if (command) {
      setState(prev => ({
        ...prev,
        lastCommand: command,
        status: 'idle'
      }));
      await executeCommandEnhanced(command);
    }
  }, [processCommandWithAPI, executeCommandEnhanced]);

  // Speech recognition handlers
  const handleSpeechResult = useCallback((transcript: string) => {
    setState(prev => ({
      ...prev,
      lastTranscription: transcript,
      status: 'processing'
    }));
    void sendTextCommand(transcript);
  }, [sendTextCommand]);

  const handleSpeechError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      error,
      status: 'error'
    }));
  }, []);

  // Initialize speech recognition
  const speechRecognition = useSpeechRecognition({
    selectedLanguage: props?.selectedLanguage,
    onResult: handleSpeechResult,
    onError: handleSpeechError
  });

  // Update state based on speech recognition
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isSupported: speechRecognition.isSupported,
      isListening: speechRecognition.isListening
    }));
  }, [speechRecognition.isSupported, speechRecognition.isListening]);

  // Start listening to voice
  const startListening = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'listening', error: undefined }));
    await speechRecognition.startListening();
  }, [speechRecognition]);

  const stopListening = useCallback(() => {
    speechRecognition.stopListening();
    setState(prev => ({ ...prev, isListening: false, status: 'idle' }));
  }, [speechRecognition]);

  const reset = useCallback(() => {
    stopListening();
    setState({
      isListening: false,
      isConnected: false,
      isSupported: speechRecognition.isSupported,
      status: 'idle'
    });
  }, [stopListening, speechRecognition.isSupported]);

  // Inject highlight styles on mount
  useEffect(() => {
    domService.injectHighlightStyles();
  }, [domService]);

  const actions: VoiceNavigationActions = {
    startListening,
    stopListening,
    sendTextCommand,
    executeCommand: executeCommandEnhanced,
    reset
  };

  return [state, actions];
}

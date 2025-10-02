export type VoiceCommand = {
  intent: string;
  action: string;
  target?: string;
  confidence: number;
}

export type VoiceNavigationApiError = {
  message: string;
  status?: number;
  code?: string;
}

export type VoiceNavigationState = {
  isListening: boolean;
  isConnected: boolean;
  isSupported: boolean;
  lastCommand?: VoiceCommand;
  lastTranscription?: string;
  error?: string;
  status: 'idle' | 'listening' | 'processing' | 'error';
}

export type VoiceNavigationActions = {
  startListening: () => Promise<void>;
  stopListening: () => void;
  sendTextCommand: (text: string) => Promise<void>;
  executeCommand: (command: VoiceCommand) => Promise<void>;
  reset: () => void;
}

export type UseVoiceNavigationProps = {
  selectedLanguage: string | 'en';
}

export type ZoomDirection = 'in' | 'out';

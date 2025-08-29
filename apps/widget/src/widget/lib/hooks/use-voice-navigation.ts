import { useState, useEffect, useCallback, useRef } from 'react';

import type {
  SpeechRecognition
} from '../../../vite-env';

interface VoiceCommand {
  intent: string;
  action: string;
  target?: string;
  confidence: number;
}

interface VoiceNavigationState {
  isListening: boolean;
  isConnected: boolean;
  isSupported: boolean;
  lastCommand?: VoiceCommand;
  lastTranscription?: string;
  error?: string;
  status: 'idle' | 'listening' | 'processing' | 'error';
}

interface VoiceNavigationActions {
  startListening: () => Promise<void>;
  stopListening: () => void;
  sendTextCommand: (text: string) => Promise<void>;
  executeCommand: (command: VoiceCommand) => Promise<void>;
  reset: () => void;
}

export function useVoiceNavigation(): [VoiceNavigationState, VoiceNavigationActions] {
  const [state, setState] = useState<VoiceNavigationState>({
    isListening: false,
    isConnected: false,
    isSupported: false,
    status: 'idle'
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Verifica suporte à Web Speech API
  useEffect(() => {
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setState(prev => ({ ...prev, isSupported }));
  }, []);

  // Executa comando de voz
  const executeCommand = useCallback(async (command: VoiceCommand) => {
    try {
      setState(prev => ({ ...prev, status: 'processing' }));

      console.log(command.action);
      switch (command.action) {
        case 'scroll_down':
          window.scrollBy(0, 300);
          speakFeedback('Rolando para baixo');
          break;
        case 'scroll_up':
          window.scrollBy(0, -300);
          speakFeedback('Rolando para cima');
          break;
        case 'scroll_left':
          window.scrollBy(-300, 0);
          speakFeedback('Rolando para esquerda');
          break;
        case 'scroll_right':
          window.scrollBy(300, 0);
          speakFeedback('Rolando para direita');
          break;
        case 'navigate_next':
          navigateToNextElement();
          break;
        case 'navigate_previous':
          navigateToPreviousElement();
          break;
        case 'click':
          if (command.target) {
            clickElement(command.target);
          }
          break;
        case 'read':
          console.log(command.target);
          if (command.target && command.target !== 'página') {
            readElement(command.target);
          } else {
            readPageContent();
          }
          break;
        case 'show_help':
          showVoiceCommandsHelp();
          break;
        case 'go_back':
          window.history.back();
          speakFeedback('Voltando para página anterior');
          break;
        case 'zoom_in':
          document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') + 0.1).toString();
          speakFeedback('Zoom aumentado');
          break;
        case 'zoom_out':
          document.body.style.zoom = (parseFloat(document.body.style.zoom || '1') - 0.1).toString();
          speakFeedback('Zoom diminuído');
          break;
        default:
          speakFeedback(`Comando não reconhecido: ${command.action}`);
      }

      setState(prev => ({ ...prev, status: 'idle' }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao executar comando',
        status: 'error'
      }));
    }
    return Promise.resolve();
  }, []);

  // Processa mensagens do WebSocket
  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'connection_status':
        setState(prev => ({
          ...prev,
          isConnected: data.status === 'connected',
          error: undefined
        }));
        break;
      case 'transcription_result':
        setState(prev => ({
          ...prev,
          lastTranscription: data.transcription.text,
          lastCommand: data.command,
          status: 'idle'
        }));
        void executeCommand(data.command);
        break;
      case 'command_result':
        setState(prev => ({
          ...prev,
          lastCommand: data.command,
          status: 'idle'
        }));
        void executeCommand(data.command);
        break;
      case 'error':
        setState(prev => ({
          ...prev,
          error: data.message,
          status: 'error'
        }));
        break;
    }
  }, [executeCommand]);

  // Inicializa WebSocket
  const initializeWebSocket = useCallback(() => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket("ws://localhost:8000/api/v1/voice-navigation/");
    console.log(ws);

    ws.onopen = () => {
      setState(prev => ({ ...prev, isConnected: true, error: undefined }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
      }
    };

    ws.onerror = () => {
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: 'Erro na conexão WebSocket',
        status: 'error'
      }));
    };

    ws.onclose = () => {
      setState(prev => ({ ...prev, isConnected: false }));
    };

    websocketRef.current = ws;
  }, [handleWebSocketMessage]);

  // Inicializa reconhecimento de fala
  const sendTextCommand = useCallback(async (text: string) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        type: 'text_command',
        text: text
      }));
    }
    return Promise.resolve();
  }, []);

  const initializeSpeechRecognition = useCallback(() => {
    if (!state.isSupported) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort?.();
        recognitionRef.current.stop?.();
      } catch {}
      recognitionRef.current = null;
    }

    const SpeechRecognitionClass = (window.SpeechRecognition || window.webkitSpeechRecognition) as typeof window.SpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'pt-BR';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, status: 'listening' }));
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setState(prev => ({
        ...prev,
        lastTranscription: transcript,
        status: 'processing'
      }));
      void sendTextCommand(transcript);
    };

    recognition.onerror = (event) => {
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

      setState(prev => ({
        ...prev,
        isListening: false,
        error: errorMessage,
        status: 'error'
      }));
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognitionRef.current = recognition as any;
  }, [state.isSupported, sendTextCommand]);

  // Inicializa gravação de áudio para fallback
  const initializeMediaRecorder = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];

        // Converte para base64 e envia via WebSocket
        const reader = new FileReader();
        reader.onload = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          if (websocketRef.current?.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({
              type: 'audio_data',
              audio_data: base64Audio,
              sample_rate: 16000
            }));
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error('Erro ao inicializar gravação de áudio:', error);
    }
  }, []);

  // Inicia escuta
  const startListening = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, status: 'listening', error: undefined }));

      // Inicializa WebSocket se necessário
      if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
        initializeWebSocket();
      }

      // Tenta usar Web Speech API primeiro
      if (state.isSupported && recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        // Fallback para gravação de áudio
        if (!mediaRecorderRef.current) {
          await initializeMediaRecorder();
        }

        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.start();
          setState(prev => ({ ...prev, isListening: true }));
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao iniciar escuta',
        status: 'error'
      }));
    }
  }, [state.isSupported, initializeWebSocket, initializeMediaRecorder]);

  // Para escuta
  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }

    if (mediaRecorderRef.current && state.isListening) {
      mediaRecorderRef.current.stop();
    }

    setState(prev => ({ ...prev, isListening: false, status: 'idle' }));
  }, [state.isListening]);

  // Funções auxiliares
  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const navigateToNextElement = () => {
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.findIndex(el => el === document.activeElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;

    const nextEl = focusableElements[nextIndex] as HTMLElement;
    if (nextEl) {
      nextEl.focus();
      highlightElement(nextEl);
      speakFeedback(`Foco em ${getElementDescription(nextEl)}`);
    }
  };

  const navigateToPreviousElement = () => {
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.findIndex(el => el === document.activeElement);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;

    const prevEl = focusableElements[prevIndex] as HTMLElement;
    if (prevEl) {
      prevEl.focus();
      highlightElement(prevEl);
      speakFeedback(`Foco em ${getElementDescription(prevEl)}`);
    }
  };

  const clickElement = (target: string) => {
    const element = findElementByTarget(target) as HTMLElement | null;
    if (element) {
      element.click();
      speakFeedback(`Clicado em ${getElementDescription(element)}`);
    } else {
      speakFeedback(`Elemento ${target} não encontrado`);
    }
  };

  const readElement = (target: string) => {
    const element = findElementByTarget(target);
    console.log(target);
    if (element) {
      const text = element.textContent || element.getAttribute('aria-label') || 'Elemento sem texto';
      speakFeedback(text);
    } else {
      speakFeedback(`Elemento ${target} não encontrado`);
    }
  };

  const readPageContent = () => {
    const mainContent = document.querySelector('main') || document.body;
    console.log(mainContent);
    const text = mainContent.textContent || '';
    const truncatedText = text.substring(0, 500) + (text.length > 500 ? '...' : '');
    speakFeedback(truncatedText);
  };

  const showVoiceCommandsHelp = () => {
    const helpText = `
      Comandos disponíveis:
      - Navegação: "ir para [elemento]", "rolar para baixo", "próximo elemento"
      - Interação: "clicar em [elemento]", "botão [nome]"
      - Leitura: "ler [elemento]", "ler página"
      - Sistema: "ajuda", "voltar", "aumentar zoom"
    `;
    speakFeedback(helpText);
  };

  const findElementByTarget = (target: string): Element | null => {
    // Procura por aria-label
    let element = document.querySelector(`[aria-label*="${target}" i]`);
    if (element) return element;

    // Procura por texto (busca manual)
    const elements = Array.from(document.querySelectorAll('button, a, [role="button"], [role="link"], [aria-label], [tabindex]'));
    for (const el of elements) {
      if (el.textContent && el.textContent.trim().toLowerCase().includes(target.toLowerCase())) {
        return el;
      }
    }

    // Procura por índice
    if (target.startsWith('index_')) {
      const index = parseInt(target.split('_')[1]);
      const focusableElements = getFocusableElements();
      return focusableElements[index - 1] || null;
    }

    return null;
  };

  const getFocusableElements = (): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]', 'button', 'input', 'textarea', 'select',
      '[tabindex]:not([tabindex="-1"]):not([disabled])', '[role="button"]', '[role="link"]'
    ];

    return Array.from(document.querySelectorAll(focusableSelectors.join(',')))
      .filter(el => {
        const htmlEl = el as HTMLElement;
        return !htmlEl.hasAttribute('disabled') && htmlEl.offsetParent !== null;
      }) as HTMLElement[];
  };

  const getElementDescription = (element: Element): string => {
    return element.getAttribute('aria-label') ||
           element.textContent?.trim() ||
           element.tagName.toLowerCase();
  };

  const highlightElement = (element: Element) => {
    // Remove highlight anterior
    document.querySelectorAll('.voice-highlight').forEach(el => {
      el.classList.remove('voice-highlight');
    });

    // Adiciona highlight
    element.classList.add('voice-highlight');

    // Remove após 2 segundos
    setTimeout(() => {
      element.classList.remove('voice-highlight');
    }, 2000);
  };

  const reset = useCallback(() => {
    stopListening();
    setState({
      isListening: false,
      isConnected: false,
      isSupported: state.isSupported,
      status: 'idle'
    });
  }, [stopListening, state.isSupported]);

  // Inicializa componentes
  useEffect(() => {
    if (state.isSupported) {
      initializeSpeechRecognition();
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
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

  const actions: VoiceNavigationActions = {
    startListening,
    stopListening,
    sendTextCommand,
    executeCommand,
    reset
  };

  return [state, actions];
}

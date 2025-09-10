import { useState, useEffect, useCallback, useRef } from 'react';

import type {
  SpeechRecognition
} from '../../../vite-env';

type VoiceCommand = {
  intent: string;
  action: string;
  target?: string;
  confidence: number;
}

type VoiceNavigationState = {
  isListening: boolean;
  isConnected: boolean;
  isSupported: boolean;
  lastCommand?: VoiceCommand;
  lastTranscription?: string;
  error?: string;
  status: 'idle' | 'listening' | 'processing' | 'error';
}

type VoiceNavigationActions = {
  startListening: () => Promise<void>;
  stopListening: () => void;
  sendTextCommand: (text: string) => Promise<void>;
  executeCommand: (command: VoiceCommand) => Promise<void>;
  reset: () => void;
}

type UseVoiceNavigationProps = {
  selectedLanguage: string | 'en';
}

export function useVoiceNavigation(props?: UseVoiceNavigationProps): [VoiceNavigationState, VoiceNavigationActions] {
  const [state, setState] = useState<VoiceNavigationState>({
    isListening: false,
    isConnected: false,
    isSupported: false,
    status: 'idle'
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Estado para controlar o último elemento focado pela navegação por voz
  const lastVoiceNavIndexRef = useRef<number | null>(null);

  // Base URL do backend
  const API_BASE_URL = 'http://localhost:8000/api/v1';

  // Verifica suporte à Web Speech API
  useEffect(() => {
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setState(prev => ({ ...prev, isSupported }));
  }, []);

  // Processa comando via API REST
  const processCommandWithAPI = useCallback(async (text: string): Promise<VoiceCommand | null> => {
    try {
      // Atualiza estado de conexão baseado na tentativa de comunicação
      setState(prev => ({ ...prev, isConnected: true }));

      const response = await fetch(`${API_BASE_URL}/voice-navigation/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: props?.selectedLanguage || 'auto'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const command = await response.json();
      return command;
    } catch (error) {
      console.error('Erro ao processar comando via API:', error);
      setState(prev => ({
        ...prev,
        error: 'Erro ao processar comando no servidor',
        status: 'error',
        isConnected: false
      }));
      return null;
    }
  }, [props?.selectedLanguage]);

  // Executa comando de voz
  const executeCommand = useCallback(async (command: VoiceCommand) => {
    try {
      setState(prev => ({ ...prev, status: 'processing' }));

      console.log(command.action);
      switch (command.action) {
        case 'scroll_down':
          window.scrollBy(0, 300);
          speakFeedback('Rolando para baixo', props?.selectedLanguage);
          break;
        case 'scroll_up':
          window.scrollBy(0, -300);
          speakFeedback('Rolando para cima', props?.selectedLanguage);
          break;
        case 'scroll_left':
          window.scrollBy(-300, 0);
          speakFeedback('Rolando para esquerda', props?.selectedLanguage);
          break;
        case 'scroll_right':
          window.scrollBy(300, 0);
          speakFeedback('Rolando para direita', props?.selectedLanguage);
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
          speakFeedback('Voltando para página anterior', props?.selectedLanguage);
          break;
        case 'zoom_in':
          applyPageZoom('in');
          speakFeedback('Zoom aumentado', props?.selectedLanguage);
          break;
        case 'zoom_out':
          applyPageZoom('out');
          speakFeedback('Zoom diminuído', props?.selectedLanguage);
          break;
        default:
          speakFeedback(`Comando não reconhecido: ${command.action}`, props?.selectedLanguage);
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
  }, [props?.selectedLanguage]);

  // Envia comando de texto para o backend
  const sendTextCommand = useCallback(async (text: string) => {
    setState(prev => ({ ...prev, status: 'processing' }));

    const command = await processCommandWithAPI(text);
    if (command) {
      setState(prev => ({
        ...prev,
        lastCommand: command,
        status: 'idle'
      }));
      await executeCommand(command);
    }
    return Promise.resolve();
  }, [processCommandWithAPI, executeCommand]);

  // Inicializa reconhecimento de fala
  const initializeSpeechRecognition = useCallback(() => {
    if (!state.isSupported) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort?.();
        recognitionRef.current.stop?.();
      } catch { }
      recognitionRef.current = null;
    }

    const SpeechRecognitionClass = (window.SpeechRecognition || window.webkitSpeechRecognition) as typeof window.SpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getRecognitionLanguage(props?.selectedLanguage);
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
  }, [state.isSupported, sendTextCommand, props?.selectedLanguage]);


  // Start listening to voice
  const startListening = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, status: 'listening', error: undefined }));

      if (state.isSupported && recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        setState(prev => ({
          ...prev,
          error: 'Web Speech API não suportada neste navegador',
          status: 'error'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao iniciar escuta',
        status: 'error'
      }));
    }
  }, [state.isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }

    setState(prev => ({ ...prev, isListening: false, status: 'idle' }));
  }, [state.isListening]);

  const speakFeedback = (text: string, language?: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getSpeechLanguage(language);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const applyPageZoom = (direction: 'in' | 'out') => {
    const currentZoom = parseFloat(document.body.style.zoom || '1');
    const zoomStep = 0.1;
    const minZoom = 0.5;
    const maxZoom = 3.0;

    let newZoom: number;
    if (direction === 'in') {
      newZoom = Math.min(currentZoom + zoomStep, maxZoom);
    } else {
      newZoom = Math.max(currentZoom - zoomStep, minZoom);
    }

    document.body.style.zoom = newZoom.toString();

    // Neutralizes the zoom on the widget so that it maintains its original size
    const widgetHost = document.querySelector('#shadow-host') as HTMLElement;
    if (widgetHost) {
      // Applies the inverse zoom on the widget to cancel the effect of the body zoom
      const inverseZoom = 1 / newZoom;
      widgetHost.style.zoom = inverseZoom.toString();
      widgetHost.style.transformOrigin = 'bottom right';
    }
  };

  // Mapeia códigos de idioma para reconhecimento de fala
  const getRecognitionLanguage = (languageCode?: string): string => {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'pt': 'pt-BR',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT'
    };
    return languageMap[languageCode || 'pt'] || 'pt-BR';
  };

  // Mapeia códigos de idioma para síntese de fala
  const getSpeechLanguage = (languageCode?: string): string => {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'pt': 'pt-BR',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT'
    };
    return languageMap[languageCode || 'pt'] || 'pt-BR';
  };

  const navigateToNextElement = () => {
    const focusableElements = getFocusableElements();
    let activeElement: Element | null = document.activeElement;
    let currentIndex = focusableElements.findIndex(el => el === activeElement);

    // Se for a primeira navegação, sempre foca o primeiro elemento
    if (lastVoiceNavIndexRef.current === null) {
      const firstEl = focusableElements[0] as HTMLElement;
      if (firstEl) {
        firstEl.focus();
        highlightElement(firstEl);
        speakFeedback(`Foco em ${getElementDescription(firstEl)}`, props?.selectedLanguage);
        lastVoiceNavIndexRef.current = 0;
      }
      return;
    }

    // Se o foco não está em nenhum elemento válido, usa o último index salvo
    if (currentIndex === -1 && lastVoiceNavIndexRef.current !== null) {
      currentIndex = lastVoiceNavIndexRef.current;
    }

    let nextIndex = (currentIndex + 1) % focusableElements.length;
    if (currentIndex === -1) nextIndex = 0; // Se nada está focado, começa do primeiro

    const nextEl = focusableElements[nextIndex] as HTMLElement;
    console.log("nextEl: ", nextEl);
    if (nextEl) {
      nextEl.focus();
      highlightElement(nextEl);
      speakFeedback(`Foco em ${getElementDescription(nextEl)}`, props?.selectedLanguage);
      lastVoiceNavIndexRef.current = nextIndex;
    }
  };

  const navigateToPreviousElement = () => {
    const focusableElements = getFocusableElements();
    let activeElement: Element | null = document.activeElement;
    let currentIndex = focusableElements.findIndex(el => el === activeElement);

    if (currentIndex === -1 && lastVoiceNavIndexRef.current !== null) {
      currentIndex = lastVoiceNavIndexRef.current;
    }

    let prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
    const prevEl = focusableElements[prevIndex] as HTMLElement;
    if (prevEl) {
      prevEl.focus();
      highlightElement(prevEl);
      speakFeedback(`Foco em ${getElementDescription(prevEl)}`, props?.selectedLanguage);
      lastVoiceNavIndexRef.current = prevIndex;
    }
  };

  const clickElement = (target: string) => {
    const element = findElementByTarget(target) as HTMLElement | null;
    console.log(element);
    if (element) {
      element.click();
      speakFeedback(`Clicado em ${getElementDescription(element)}`, props?.selectedLanguage);
    } else {
      speakFeedback(`Elemento ${target} não encontrado`, props?.selectedLanguage);
    }
  };

  const readElement = (target: string) => {
    const element = findElementByTarget(target);
    if (element) {
      const text = element.textContent || element.getAttribute('aria-label') || 'Elemento sem texto';
      speakFeedback(text, props?.selectedLanguage);
    } else {
      speakFeedback(`Elemento ${target} não encontrado`, props?.selectedLanguage);
    }
  };

  const readPageContent = () => {
    const mainContent = document.querySelector('main') || document.body;
    console.log(mainContent);
    const text = mainContent.textContent || '';
    const truncatedText = text.substring(0, 500) + (text.length > 500 ? '...' : '');
    console.log("Tamanho do texto: " + text.length);
    console.log(truncatedText);
    speakFeedback(truncatedText, props?.selectedLanguage);
  };

  const showVoiceCommandsHelp = () => {
    const helpText = `
      Comandos disponíveis:
      - Navegação: "ir para [elemento]", "rolar para baixo", "próximo elemento"
      - Interação: "clicar em [elemento]", "botão [nome]"
      - Leitura: "ler [elemento]", "ler página"
      - Sistema: "ajuda", "voltar", "aumentar zoom"
    `;
    speakFeedback(helpText, props?.selectedLanguage);
  };

  const findElementByTarget = (target: string): Element | null => {
    // Procura por aria-label
    let element =
      document.querySelector(`[aria-label*="${target}" i]`) ||
      document.querySelector("#web-extension-accessibility")?.shadowRoot?.
        querySelector("#widget-root")?.querySelector(`[aria-label*="${target}" i]`);

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

    const ElementsAll = [
      ...Array.from(document.querySelectorAll(focusableSelectors.join(','))),
      ...Array.from(
      document.querySelector("#shadow-host")?.shadowRoot
        ?.querySelector("#widget-root")
        ?.querySelectorAll(focusableSelectors.join(',')) || []
      ),
    ];

    return ElementsAll.filter(el => {
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
    // Helper para remover highlights de um root
    const removeHighlights = (root: ParentNode | ShadowRoot | Document) => {
      root.querySelectorAll('.voice-highlight').forEach(el => {
        el.classList.remove('voice-highlight');
      });
    };

    // Remove highlights do documento principal e do shadow-root (se existir)
    removeHighlights(document);
    const shadowRoot = document.querySelector('#shadow-host')?.shadowRoot;
    console.log("shadowRoot: ", shadowRoot);
    if (shadowRoot) removeHighlights(shadowRoot);

    // Adiciona highlight
    element.classList.add('voice-highlight');

    // Remove após 10 segundos
    setTimeout(() => {
      element.classList.remove('voice-highlight');
      if (shadowRoot) removeHighlights(shadowRoot);
    }, 10000);
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
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort?.();
          recognitionRef.current.stop?.();
        } catch { }
        recognitionRef.current = null;
      }
    };
  }, [state.isSupported, initializeSpeechRecognition]);

  useEffect(() => {
    // Só injeta se ainda não existir
    if (!document.getElementById('voice-highlight-style')) {
      const style = document.createElement('style');
      style.id = 'voice-highlight-style';
      style.textContent = `
        .voice-highlight {
          outline: 3px solid #c52509 !important;
          outline-offset: 2px !important;
          transition: outline 0.2s ease-in-out;
          position: relative;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const actions: VoiceNavigationActions = {
    startListening,
    stopListening,
    sendTextCommand,
    executeCommand,
    reset
  };

  return [state, actions];
}

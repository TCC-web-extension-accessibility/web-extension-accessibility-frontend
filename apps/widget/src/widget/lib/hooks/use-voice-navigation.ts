import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';

import type {
  SpeechRecognition
} from '../../../vite-env';

// Voice Navigation API Types - seguindo padrões do api-client
interface VoiceNavigationCommandRequest {
  text: string;
  language: string;
}

interface VoiceCommand {
  intent: string;
  action: string;
  target?: string;
  confidence: number;
}

interface VoiceNavigationApiError {
  message: string;
  status?: number;
  code?: string;
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
  const HOST = document.querySelector("#web-extension-accessibility") as HTMLElement;
  const WIDGET = HOST.shadowRoot?.querySelector("#widget-root") as HTMLElement;

  const [state, setState] = useState<VoiceNavigationState>({
    isListening: false,
    isConnected: false,
    isSupported: false,
    status: 'idle'
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Usa sessionStorage para persistir entre montagens/desmontagens do componente
  const getInitialNavIndex = () => {
    const stored = sessionStorage.getItem('voice-nav-index');
    return stored ? parseInt(stored, 10) : null;
  };

  // Estado para controlar o último elemento focado pela navegação por voz
  const lastVoiceNavIndexRef = useRef<number | null>(getInitialNavIndex());

  // Cria uma instância do axios reutilizável configurada com a mesma base URL do api-client
  const axiosInstanceRef = useRef(
    axios.create({
      baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
      timeout: 10000, // 10 segundos de timeout
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );

  // Verifica suporte à Web Speech API
  useEffect(() => {
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setState(prev => ({ ...prev, isSupported }));
  }, []);

  // Voice Navigation API Service - seguindo padrões do api-client
  const voiceNavigationApiService = useMemo(() => ({
    async processCommand(request: VoiceNavigationCommandRequest): Promise<VoiceCommand | null> {
      console.log(process.env.VITE_API_BASE_URL);
      try {
        const response = await axiosInstanceRef.current.post<VoiceCommand>(
          '/api/v1/voice-navigation/command',
          request
        );
        return response.data;
      } catch (error) {
        const apiError: VoiceNavigationApiError = {
          message: 'Erro ao processar comando no servidor'
        };

        if (axios.isAxiosError(error)) {
          if (error.response) {
            apiError.status = error.response.status;
            apiError.message = `Erro ${error.response.status}: ${error.response.statusText}`;
          } else if (error.request) {
            apiError.message = 'Erro de conectividade com o servidor';
            apiError.code = 'NETWORK_ERROR';
          }
        }

        throw apiError;
      }
    }
  }), []);

  // Processa comando via API REST usando padrões do api-client
  const processCommandWithAPI = useCallback(async (text: string): Promise<VoiceCommand | null> => {
    try {
      // Atualiza estado de conexão baseado na tentativa de comunicação
      setState(prev => ({ ...prev, isConnected: true }));

      const request: VoiceNavigationCommandRequest = {
        text: text,
        language: props?.selectedLanguage || 'auto'
      };

      const command = await voiceNavigationApiService.processCommand(request);
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
  }, [props?.selectedLanguage, voiceNavigationApiService]);

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
        case 'navigate_to':
          if (command.target) {
            navigateToElement(command.target);
          } else {
            speakFeedback('Nenhum destino especificado para navegação', props?.selectedLanguage);
          }
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
          if(state.error) {
            setState(prev => ({
              ...prev,
              lastCommand: undefined,
              lastTranscription: undefined,
            }));
          }
          speakFeedback(`Comando não reconhecido`, props?.selectedLanguage);
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

      // Limpa timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Define timeout de 5 segundos para detectar falta de fala
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setState(prev => ({
          ...prev,
          isListening: false,
          lastCommand: undefined,
          lastTranscription: undefined,
          status: 'error',
          error: 'Nenhuma fala detectada. Clique no botão Ativar novamente.'
        }));
      }, 5000);
    };

    recognition.onresult = (event) => {
      // Limpa o timeout pois fala foi detectada
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const transcript = event.results[0][0].transcript;
      setState(prev => ({
        ...prev,
        lastTranscription: transcript,
        status: 'processing'
      }));
      void sendTextCommand(transcript);
    };

    recognition.onerror = (event) => {
      // Limpa o timeout em caso de erro
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

      setState(prev => ({
        ...prev,
        isListening: false,
        error: errorMessage,
        status: 'error'
      }));
    };

    recognition.onend = () => {
      // Limpa o timeout quando o reconhecimento termina
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

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
    // Limpa o timeout ao parar manualmente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

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
    if (HOST) {
      // Applies the inverse zoom on the widget to cancel the effect of the body zoom
      const inverseZoom = 1 / newZoom;
      HOST.style.zoom = inverseZoom.toString();
      HOST.style.transformOrigin = 'bottom right';
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

    // Se não há elementos focáveis, retorna
    if (focusableElements.length === 0) {
      speakFeedback('Nenhum elemento focável encontrado na página', props?.selectedLanguage);
      return;
    }

    let nextIndex: number;

    // Se for a primeira navegação ou não há índice salvo, foca o primeiro elemento
    if (lastVoiceNavIndexRef.current === null) {
      nextIndex = 0;
    } else {
      // Usa o índice salvo e navega para o próximo
      nextIndex = (lastVoiceNavIndexRef.current + 1) % focusableElements.length;
    }

    const nextEl = focusableElements[nextIndex] as HTMLElement;
    if (nextEl) {
      nextEl.focus();
      highlightElement(nextEl);
      speakFeedback(`Foco em ${getElementDescription(nextEl)}`, props?.selectedLanguage);
      lastVoiceNavIndexRef.current = nextIndex;
      sessionStorage.setItem('voice-nav-index', nextIndex.toString());
    }
  };

  const navigateToPreviousElement = () => {
    const focusableElements = getFocusableElements();

    // Se não há elementos focáveis, retorna
    if (focusableElements.length === 0) {
      speakFeedback('Nenhum elemento focável encontrado na página', props?.selectedLanguage);
      return;
    }

    let prevIndex: number;

    // Se for a primeira navegação ou não há índice salvo, foca o primeiro elemento
    if (lastVoiceNavIndexRef.current === null) {
      prevIndex = 0;
    } else {
      // Usa o índice salvo e navega para o anterior
      prevIndex = lastVoiceNavIndexRef.current > 0
        ? lastVoiceNavIndexRef.current - 1
        : focusableElements.length - 1;
    }

    const prevEl = focusableElements[prevIndex] as HTMLElement;
    if (prevEl) {
      prevEl.focus();
      highlightElement(prevEl);
      speakFeedback(`Foco em ${getElementDescription(prevEl)}`, props?.selectedLanguage);
      lastVoiceNavIndexRef.current = prevIndex;
      sessionStorage.setItem('voice-nav-index', prevIndex.toString());
    }
  };

  const navigateToElement = (target: string) => {
    const element = findElementByTarget(target) as HTMLElement | null;
    if (element) {
      // Encontra o índice do elemento na lista de elementos focáveis
      const focusableElements = getFocusableElements();
      const elementIndex = focusableElements.findIndex(el => el === element);

      element.focus();
      highlightElement(element);
      speakFeedback(`Foco em ${getElementDescription(element)}`, props?.selectedLanguage);

      // Armazena o índice se o elemento estiver na lista de focáveis
      if (elementIndex !== -1) {
        lastVoiceNavIndexRef.current = elementIndex;
        sessionStorage.setItem('voice-nav-index', elementIndex.toString());
      }
    } else {
      speakFeedback(`Elemento ${target} não encontrado`, props?.selectedLanguage);
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
    // Função auxiliar para escapar caracteres especiais em seletores CSS
    const escapeSelector = (str: string): string => {
      return str.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
    };

    // Função auxiliar para normalizar texto (remove acentos e caracteres especiais)
    const normalizeText = (text: string): string => {
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s]/g, '') // Remove caracteres especiais
        .toLowerCase()
        .trim();
    };

    // Procura por ID com escape de caracteres especiais
    try {
      const escapedTarget = escapeSelector(target);
      const idSelector = `#${escapedTarget}`;
      let element = document.querySelector(idSelector) || WIDGET?.querySelector(idSelector);
      if (element) return element;
    } catch (e) {
      // Se falhar com caracteres especiais, continua
    }

    // Procura por name com escape de caracteres especiais
    try {
      const escapedTarget = escapeSelector(target);
      const nameSelector = `[name="${escapedTarget}"]`;
      let element = document.querySelector(nameSelector) || WIDGET?.querySelector(nameSelector);
      if (element) return element;
    } catch (e) {
      // Se falhar com caracteres especiais, continua
    }

    // Procura por aria-label com escape de caracteres especiais
    try {
      const escapedTarget = escapeSelector(target);
      const ariaLabelSelector = `[aria-label*="${escapedTarget}" i]`;
      let element = document.querySelector(ariaLabelSelector) || WIDGET?.querySelector(ariaLabelSelector);
      if (element) return element;
    } catch (e) {
      // Se falhar com caracteres especiais, continua para busca manual
    }

    // Procura por texto (busca manual com normalização)
    const elements = Array.from(document.querySelectorAll('button, a, [role="button"], [role="link"], [aria-label], [tabindex], input, textarea, select'));
    const normalizedTarget = normalizeText(target);
    console.log("Por texto: ", elements);

    for (const el of elements) {
      // Verifica ID
      const elementId = el.getAttribute('id');
      if (elementId) {
        const normalizedId = normalizeText(elementId);

        // Busca exata no ID
        if (elementId.toLowerCase().includes(target.toLowerCase())) {
          return el;
        }

        // Busca normalizada no ID
        if (normalizedId.includes(normalizedTarget)) {
          return el;
        }
      }

      // Verifica name
      const elementName = el.getAttribute('name');
      if (elementName) {
        const normalizedName = normalizeText(elementName);

        // Busca exata no name
        if (elementName.toLowerCase().includes(target.toLowerCase())) {
          return el;
        }

        // Busca normalizada no name
        if (normalizedName.includes(normalizedTarget)) {
          return el;
        }
      }

      // Verifica placeholder (comum em inputs)
      const placeholder = el.getAttribute('placeholder');
      if (placeholder) {
        const normalizedPlaceholder = normalizeText(placeholder);

        // Busca exata no placeholder
        if (placeholder.toLowerCase().includes(target.toLowerCase())) {
          return el;
        }

        // Busca normalizada no placeholder
        if (normalizedPlaceholder.includes(normalizedTarget)) {
          return el;
        }
      }

      // Verifica textContent
      if (el.textContent) {
        const elementText = el.textContent.trim();
        const normalizedElementText = normalizeText(elementText);

        // Busca exata (com caracteres especiais)
        if (elementText.toLowerCase().includes(target.toLowerCase())) {
          return el;
        }

        // Busca normalizada (sem acentos e caracteres especiais)
        if (normalizedElementText.includes(normalizedTarget)) {
          return el;
        }
      }

      // Verifica aria-label
      const ariaLabel = el.getAttribute('aria-label');
      if (ariaLabel) {
        const normalizedAriaLabel = normalizeText(ariaLabel);

        // Busca exata no aria-label
        if (ariaLabel.toLowerCase().includes(target.toLowerCase())) {
          return el;
        }

        // Busca normalizada no aria-label
        if (normalizedAriaLabel.includes(normalizedTarget)) {
          return el;
        }
      }

      // Verifica label associado (para inputs)
      if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea' || el.tagName.toLowerCase() === 'select') {
        const elementId = el.getAttribute('id');
        if (elementId) {
          const associatedLabel = document.querySelector(`label[for="${elementId}"]`) || WIDGET?.querySelector(`label[for="${elementId}"]`);
          if (associatedLabel && associatedLabel.textContent) {
            const labelText = associatedLabel.textContent.trim();
            const normalizedLabelText = normalizeText(labelText);

            // Busca exata no label
            if (labelText.toLowerCase().includes(target.toLowerCase())) {
              return el;
            }

            // Busca normalizada no label
            if (normalizedLabelText.includes(normalizedTarget)) {
              return el;
            }
          }
        }
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
      ...Array.from(WIDGET.querySelectorAll(focusableSelectors.join(',')) || []),
    ];

    return ElementsAll.filter(el => {
      const htmlEl = el as HTMLElement;
      return !htmlEl.hasAttribute('disabled') && htmlEl.offsetParent !== null;
    }) as HTMLElement[];
  };

  const getElementDescription = (element: Element): string => {
    // check textContent
    const textContent = element.textContent?.trim();
    if (textContent) {
      return textContent;
    }

    // check aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim()) {
      return ariaLabel.trim();
    }

    // check aria-labelledby
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy) || WIDGET?.querySelector(`#${ariaLabelledBy}`);
      if (labelElement && labelElement.textContent) {
        return labelElement.textContent.trim();
      }
    }

    // check associated label for inputs
    const elementId = element.getAttribute('id');
    if (elementId && (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'select')) {
      const associatedLabel = document.querySelector(`label[for="${elementId}"]`) || WIDGET?.querySelector(`label[for="${elementId}"]`);
      if (associatedLabel && associatedLabel.textContent) {
        return associatedLabel.textContent.trim();
      }
    }

    // check if the element is inside a label
    const parentLabel = element.closest('label');
    if (parentLabel && parentLabel.textContent) {
      const labelText = parentLabel.textContent.trim();
      const elementText = element.textContent?.trim() || '';
      if (labelText !== elementText && labelText.includes(elementText)) {
        return labelText.replace(elementText, '').trim();
      } else if (labelText !== elementText) {
        return labelText;
      }
    }

    // check placeholder for inputs
    const placeholder = element.getAttribute('placeholder');
    if (placeholder && placeholder.trim()) {
      return `Campo: ${placeholder.trim()}`;
    }

    // check title attribute
    const title = element.getAttribute('title');
    if (title && title.trim()) {
      return title.trim();
    }

    // check name attribute
    const name = element.getAttribute('name');
    if (name && name.trim()) {
      return `Campo: ${name.trim()}`;
    }

    // check id attribute
    const id = element.getAttribute('id');
    if (id && id.trim()) {
      return id.trim().replace(/[-_]/g, ' ');
    }

    // check alt for images
    if (element.tagName.toLowerCase() === 'img') {
      const alt = element.getAttribute('alt');
      if (alt && alt.trim()) {
        return alt.trim();
      }
    }

    // check value for button, submit, reset input types
    if (element.tagName.toLowerCase() === 'input') {
      const inputType = element.getAttribute('type')?.toLowerCase();
      if (['button', 'submit', 'reset'].includes(inputType || '')) {
        const value = (element as HTMLInputElement).value;
        if (value && value.trim()) {
          return value.trim();
        }
      }
    }

    return element.tagName.toLowerCase();
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
    const shadowRoot = HOST.shadowRoot;
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
    // Limpa o timeout no reset
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

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
      // Limpa o timeout no cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

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

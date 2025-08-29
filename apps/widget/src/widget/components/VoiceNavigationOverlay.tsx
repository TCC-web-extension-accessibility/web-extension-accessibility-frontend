import { useEffect, useState } from 'react';
import { useVoiceNavigation } from '../lib/hooks/use-voice-navigation';

interface ElementInfo {
  element: Element;
  index: number;
  description: string;
}

export function VoiceNavigationOverlay() {
  const [state] = useVoiceNavigation();
  const [numberedElements, setNumberedElements] = useState<ElementInfo[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Atualiza elementos numerados quando necessário
  useEffect(() => {
    if (state.isListening || state.status === 'processing') {
      updateNumberedElements();
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [state.isListening, state.status]);

  // Atualiza elementos quando a página muda
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (state.isListening) {
        updateNumberedElements();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [state.isListening]);

  const updateNumberedElements = () => {
    const focusableElements = getFocusableElements();
    const elementInfos: ElementInfo[] = [];

    focusableElements.forEach((element, index) => {
      const description = getElementDescription(element);
      if (description) {
        elementInfos.push({
          element,
          index: index + 1,
          description
        });
      }
    });

    setNumberedElements(elementInfos);
  };

  const getFocusableElements = (): Element[] => {
    const focusableSelectors = [
      'a[href]', 'button', 'input', 'textarea', 'select',
      '[tabindex]:not([tabindex="-1"])', '[role="button"]', '[role="link"]',
      '[data-voice]', '[aria-label]'
    ];

    return Array.from(document.querySelectorAll(focusableSelectors.join(',')))
      .filter(el => {
        // Filtra elementos visíveis e não desabilitados
        const style = window.getComputedStyle(el);
        // Corrige offsetParent para HTMLElement
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               !el.hasAttribute('disabled') &&
               (el as HTMLElement).offsetParent !== null;
      });
  };

  const getElementDescription = (element: Element): string => {
    // Prioriza atributos de acessibilidade
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const ariaLabelledby = element.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      const labelElement = document.getElementById(ariaLabelledby);
      if (labelElement) return labelElement.textContent || '';
    }

    // Usa texto do elemento
    const text = element.textContent?.trim();
    if (text && text.length > 0 && text.length < 100) return text;

    // Usa atributo data-voice se disponível
    const dataVoice = element.getAttribute('data-voice');
    if (dataVoice) return dataVoice;

    // Fallback para tag name
    return element.tagName.toLowerCase();
  };

  if (!isVisible || numberedElements.length === 0) {
    return null;
  }

  return (
    <div className="voice-navigation-overlay">
      {numberedElements.map(({ element, index, description }) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (!isVisible) return null;

        return (
          <div
            key={`${index}-${description}`}
            className="voice-element-number"
            style={{
              position: 'fixed',
              top: rect.top + window.scrollY - 25,
              left: rect.left + window.scrollX - 25,
              zIndex: 10000,
              pointerEvents: 'none'
            }}
          >
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
              {index}
            </div>
            <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded mt-1 whitespace-nowrap">
              {description}
            </div>
          </div>
        );
      })}

      {/* Estilos CSS inline para garantir funcionamento */}
      <style>{`
        .voice-navigation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }

        .voice-element-number {
          animation: voice-highlight 0.3s ease-in-out;
        }

        @keyframes voice-highlight {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .voice-highlight {
          outline: 3px solid #3b82f6 !important;
          outline-offset: 2px !important;
          transition: outline 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

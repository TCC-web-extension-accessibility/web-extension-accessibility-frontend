import { VoiceNavigationControl } from './VoiceNavigationControl';
import { XIcon } from '@phosphor-icons/react';

type VoiceNavigationPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string | 'en';
}

export function VoiceNavigationPanel({
  isOpen,
  onClose,
  selectedLanguage,
}: VoiceNavigationPanelProps) {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 rounded-l-lg">
      <div
        id="voice-navigation-panel"
        className={`bg-white rounded-t-lg md:rounded-lg shadow-lg w-full md:w-[480px] max-h-[90vh] overflow-y-auto p-6 relative voice-navigation-control`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold flex items-center gap-2">
            Painel de Navegação por Voz
          </div>
          <div className="flex items-center gap-2">
            <button
              className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              onClick={onClose}
              aria-label="Fechar painel de navegação por voz"
              type="button"
            >
              <XIcon size={20} weight="bold" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <VoiceNavigationControl selectedLanguage={selectedLanguage} />
        </div>
      </div>
    </div>
  );
}

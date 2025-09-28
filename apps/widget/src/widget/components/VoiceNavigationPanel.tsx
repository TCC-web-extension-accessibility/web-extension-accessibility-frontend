import { XIcon } from '@phosphor-icons/react';
import { VoiceNavigationControl } from './VoiceNavigationControl';

type VoiceNavigationPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string | 'en';
  nameOfTheSelectedLanguage: string;
};

export function VoiceNavigationPanel({
  isOpen,
  onClose,
  selectedLanguage,
  nameOfTheSelectedLanguage,
}: VoiceNavigationPanelProps) {
  if (!isOpen) return null;
  return (
    <div
      id="voice-navigation-panel"
      className={`
        fixed bottom-0 inset-x-0 mx-auto w-full md:w-[520px] max-h-[90vh]
        bg-white rounded-l-lg shadow-lg border border-gray-300 p-6
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        voice-navigation-control overflow-y-auto z-40
      `}
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
        <VoiceNavigationControl
          selectedLanguage={selectedLanguage}
          nameOfTheSelectedLanguage={nameOfTheSelectedLanguage}
        />
      </div>
    </div>
  );
}

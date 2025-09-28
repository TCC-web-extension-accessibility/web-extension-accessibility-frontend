import { XIcon } from '@phosphor-icons/react';
import { VoiceNavigationControl } from './VoiceNavigationControl';

type VoiceNavigationPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  isOpenWidget: boolean;
  selectedLanguage: string | 'en';
  nameOfTheSelectedLanguage: string;
};

export function VoiceNavigationPanel({
  isOpen,
  onClose,
  selectedLanguage,
  nameOfTheSelectedLanguage,
  isOpenWidget,
}: VoiceNavigationPanelProps) {
  if (!isOpen) return null;
  return (
    <div
      id="voice-navigation-panel"
      className={`
        fixed right-0 ${
          isOpenWidget
            ? 'bottom-0 w-full md:max-w-[600px] lg:max-w-[520px] lg:right-[620px] sm:ml-2 rounded-t-lg'
            : 'bottom-30 sm:max-w-[520px] max-w-[380px] rounded-l-lg'
        }
         sm:max-h-min md:max-h-[90vh]
        bg-white shadow-lg border border-gray-300 p-6
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto z-1000
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm sm:text-lg font-bold flex items-center gap-2">
          Painel de Navegação por Voz
        </h2>
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

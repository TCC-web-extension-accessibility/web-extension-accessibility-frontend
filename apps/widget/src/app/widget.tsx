import { XIcon } from '@phosphor-icons/react';
import React, { useState } from 'react'; // <<<< --- IMPORTANDO useState!

type WidgetProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export function Widget({ isOpen, onClose }: WidgetProps) {
  // <<<< --- DECLARANDO O ESTADO DO TOOLTIP
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    isOpen && (
      <div>
        {/* Adicionei shadow-lg e um z-index maior para o widget */}
        <div className="fixed bottom-0 right-0 w-full md:w-[600px] h-screen bg-white rounded-l-lg p-4 border border-gray-300 shadow-lg z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Menu acessibilidade</h2>
            {/* <<<< --- INÍCIO DO CÓDIGO DO BOTÃO DE FECHAR COM TOOLTIP --- >>>> */}
            <div className="relative"> {/* Este div é o container para o posicionamento do tooltip */}
            <button 
              onClick={onClose} 
              aria-label="Fechar menu" // <<< Adicionado para leitores de tela
              className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
              onMouseEnter={() => setShowTooltip(true)} // Ao passar o mouse, exibe o tooltip
              onMouseLeave={() => setShowTooltip(false)} // Ao remover o mouse, esconde o tooltip
              >
              <XIcon size={24} /> {/* Adicionando tamanho do ícone 24px */}
            </button>

            {/* <<<< --- O TOOLTIP EM SI --- >>>> */}
              {showTooltip && (
                <div className="
                  absolute right-full top-1/2 -translate-y-1/2 mr-2
                  bg-gray-800 text-white text-sm rounded-md px-2 py-1
                  opacity-0 transition-opacity duration-300
                  group-hover:opacity-100 whitespace-nowrap
                  pointer-events-none
                ">
                  Fechar menu
                  {/* Seta do tooltip */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-800"></div>
                </div>
              )}
            </div>
            {/* <<<< --- FIM DO CÓDIGO DO BOTÃO DE FECHAR COM TOOLTIP --- >>>> */}
          </div>
          <p>This is a simple widget component.</p>
        </div>
      </div>
    )
  );
}
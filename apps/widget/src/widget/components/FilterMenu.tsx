import { Button } from '@web-extension-accessibility-frontend/ui';
import React, { useState } from 'react';
import { suggestFilterWithAI } from '../lib/services/filterService';
import type { ColorFilterType } from '../lib/types/color-filter.types';

type FilterMenuProps = {
  applyFilter: (filter: ColorFilterType) => void;
};

export const FilterMenu: React.FC<FilterMenuProps> = ({ applyFilter }) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const handleApplyFilter = (filter: ColorFilterType) => {
    applyFilter(filter);
    setAiMessage(null);
  };

  const handleAISuggestion = async () => {
    setIsLoadingAI(true);
    setAiMessage('Analisando a página...');
    try {
      const suggestion = await suggestFilterWithAI();
      const suggestedFilterType = suggestion.includes('protanopia')
        ? 'filter-protanopia-assist'
        : 'no-filter';

      applyFilter(suggestedFilterType);

      setAiMessage(
        `IA sugere: ${suggestion}. Clique no botão correspondente para aplicar.`
      );
    } catch (error) {
      console.error('Erro ao obter sugestão da IA:', error);
      setAiMessage('Erro ao obter sugestão. Tente novamente.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2.5 rounded-lg mt-2.5 bg-background">
      <Button
        variant="outline"
        onClick={() => handleApplyFilter('filter-grayscale')}
      >
        Escala de Cinza
      </Button>
      <Button
        variant="outline"
        onClick={() => handleApplyFilter('filter-sepia')}
      >
        Sépia
      </Button>
      <Button
        variant="outline"
        onClick={() => handleApplyFilter('filter-protanopia-assist')}
      >
        Auxiliar Protanopia
      </Button>
      <Button variant="outline" onClick={() => handleApplyFilter('no-filter')}>
        Remover Filtro
      </Button>
      <hr />
      <Button
        variant="outline"
        onClick={handleAISuggestion}
        disabled={isLoadingAI}
      >
        {isLoadingAI ? 'Analisando...' : 'Sugerir Filtro (IA)'}
      </Button>
      {aiMessage && <p className="mt-2 text-xs p-1 rounded-sm">{aiMessage}</p>}
    </div>
  );
};

import React, { useState } from 'react';
import type { ColorFilterType } from '../lib/types/color-filter.types';
import { suggestFilterWithAI } from '../lib/services/filterService';

type FilterMenuProps = {
    applyFilter: (filter: ColorFilterType) => void;
}

const menuStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '10px',
  background: '#f0f0f0',
  borderRadius: '8px',
  marginTop: '10px',
};

const buttonStyles: React.CSSProperties = {
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
};

const aiSuggestionStyles: React.CSSProperties = {
  marginTop: '8px',
  fontSize: '12px',
  color: '#333',
  background: '#e0e0e0',
  padding: '5px',
  borderRadius: '4px',
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
      const suggestedFilterType = suggestion.includes('protanopia') ? 'filter-protanopia-assist' : 'no-filter';

      applyFilter(suggestedFilterType);
      
      setAiMessage(`IA sugere: ${suggestion}. Clique no botão correspondente para aplicar.`);

    } catch (error) {
      console.error('Erro ao obter sugestão da IA:', error);
      setAiMessage('Erro ao obter sugestão. Tente novamente.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div style={menuStyles}>
      <button style={buttonStyles} onClick={() => handleApplyFilter('filter-grayscale')}>Escala de Cinza</button>
      <button style={buttonStyles} onClick={() => handleApplyFilter('filter-sepia')}>Sépia</button>
      <button style={buttonStyles} onClick={() => handleApplyFilter('filter-protanopia-assist')}>Auxiliar Protanopia</button>
      <button style={buttonStyles} onClick={() => handleApplyFilter('no-filter')}>Remover Filtro</button>
      <hr />
      <button style={buttonStyles} onClick={handleAISuggestion} disabled={isLoadingAI}>
        {isLoadingAI ? 'Analisando...' : 'Sugerir Filtro (IA)'}
      </button>
      {aiMessage && <p style={aiSuggestionStyles}>{aiMessage}</p>}
    </div>
  );
};

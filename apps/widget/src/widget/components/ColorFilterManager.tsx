import { useColorFilter } from '../lib/hooks/use-color-filter';

export const ColorFilterManager = () => {
    const {
        suggestedFilterForPage,
        suggestedFilter, // O filtro sugerido e salvo
        isLoading,
        error,
        applyColorFilter,
        resetColorFilter
    } = useColorFilter();

    const handleApplySuggestedFilter = () => {
        if (suggestedFilter) {
            applyColorFilter(suggestedFilter);
        }
    };

    return (
        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <h4>Análise Automática de Filtro</h4>
            
            <p style={{ fontSize: '14px', color: '#555' }}>
                Clique no botão para analisarmos o conteúdo da página e sugerir o melhor filtro para você.
            </p>

            <button onClick={suggestedFilterForPage} disabled={isLoading} style={{ width: '100%', padding: '10px' }}>
                {isLoading ? 'Analisando a página...' : 'Sugerir Filtro para esta Página'}
            </button>

            {error && <p style={{ color: 'red', marginTop: '8px' }}>Erro: {error}</p>}

            {/* Mostra a sugestão e o botão para aplicá-la */}
            {suggestedFilter && !isLoading && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <p>Filtro sugerido: <strong>{suggestedFilter}</strong></p>
                    <button onClick={handleApplySuggestedFilter} style={{ width: '100%', padding: '10px' }}>
                        Aplicar Filtro Sugerido
                    </button>
                </div>
            )}
            
            <div style={{ marginTop: '1.5rem' }}>
                <button onClick={resetColorFilter} style={{ width: '100%' }}>Limpar Filtro</button>
            </div>
        </div>
    );
};
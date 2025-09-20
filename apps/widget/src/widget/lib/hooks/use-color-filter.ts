import { useLayoutEffect, useState } from 'react';
import {
    getStorageValue,
    setStorageValue,
    capturePageAsBlob
} from '../accessibility-utils';

type ColorBlindnessType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

const COLOR_FILTER_STORAGE_KEY = 'accessibility-color-filter';

// Matrizes de transformação para diferentes tipos de daltonismo
const COLOR_MATRICES = {
    none: 'none',
    protanopia: `
    0.567, 0.433, 0,     0, 0,
    0.558, 0.442, 0,     0, 0,
    0,     0.242, 0.758, 0, 0,
    0,     0,     0,     1, 0
  `,
    deuteranopia: `
    0.625, 0.375, 0,   0, 0,
    0.7,   0.3,   0,   0, 0, 
    0,     0.3,   0.7, 0, 0,
    0,     0,     0,   1, 0
  `,
    tritanopia: `
    0.95, 0.05,  0,     0, 0,
    0,    0.433, 0.567, 0, 0,
    0,    0.475, 0.525, 0, 0,
    0,    0,     0,     1, 0
  `,
    achromatopsia: `
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0,     0,     0,     1, 0
  `
};

export const useColorFilter = () => {
    const [currentFilter, setCurrentFilter] = useState<ColorBlindnessType>(() =>
        getStorageValue(COLOR_FILTER_STORAGE_KEY, 'none') as ColorBlindnessType);

    const [suggestedFilter, setSuggestedFilter] = useState<ColorBlindnessType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const applyColorFilter = (filterType: ColorBlindnessType) => {
        const styleId = 'accessibility-color-filter-style';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        if (filterType === 'none') {
            styleElement.textContent = '';
        } else {
            const matrix = COLOR_MATRICES[filterType];
            styleElement.textContent = `
        html:not(#web-extension-accessibility):not(#widget-root) {
          filter: url(#colorblind-filter-${filterType}) !important;
        }
      `;

            createSVGFilter(filterType, matrix);
        }
        setStorageValue(COLOR_FILTER_STORAGE_KEY, filterType);
        setCurrentFilter(filterType);
    }

    const createSVGFilter = (filterType: ColorBlindnessType, matrix: string) => {
        const svgId = `colorblind-svg-${filterType}`;
        const existingSvgElement = document.getElementById(svgId);

        if (!existingSvgElement) {
            const newSvgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

            newSvgElement.id = svgId;
            newSvgElement.style.position = 'absolute';
            newSvgElement.style.width = '0';
            newSvgElement.style.height = '0';

            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            const colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');

            filter.id = `colorblind-filter-${filterType}`;
            colorMatrix.setAttribute('type', 'matrix');
            colorMatrix.setAttribute('values', matrix);

            filter.appendChild(colorMatrix);
            defs.appendChild(filter);
            newSvgElement.appendChild(defs);

            document.body.appendChild(newSvgElement);
        }
    };

    const suggestFilterForPage = async (imageFile: File, colorBlindnessType: ColorBlindnessType) => {
        setIsLoading(true);
        setError(null);
        setSuggestedFilter(null);

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('color_blindness_type', colorBlindnessType);

        try {
            const response = await fetch('/api/analyze-colors/', { // Adjust the URL to your API endpoint
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to analyze image');
            }

            const result = await response.json();
            setSuggestedFilter(result.suggested_filter);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedFilterForPage = async () => {
        setIsLoading(true);
        setError(null);

        const imageBlob = await capturePageAsBlob();
        if (!imageBlob) {
            setError('Não foi possível capturar a imagem da página.');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', imageBlob, 'screenshot.png');

        try {
            const response = await fetch('http://localhost:8000/api/v1/analyze-colors/', {
                method: 'POST',
                body: formData,
            });
            
            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Falha ao analisar a imagem');
            }

            const result = await response.json();
            if(result.suggested_filter && result.suggested_filter !== 'none') {
                setSuggestedFilter(result.suggested_filter as ColorBlindnessType);
            } else {
                setSuggestedFilter(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message: 'Erro');
        } finally {
            setIsLoading(false);
        }
    }

    const cycleColorFilter = () => {
        applyColorFilter('none');
    };

    useLayoutEffect(() => {
        if (currentFilter !== 'none') {
            applyColorFilter(currentFilter);
        }
    }, []);

    const resetColorFilter = () => {
        applyColorFilter('none');
    }

    return {
        currentFilter,
        applyColorFilter,
        cycleColorFilter,
        resetColorFilter,
        suggestedFilterForPage,
        suggestedFilter,
        isLoading,
        error,
        suggestFilterForPage,
        maxFilterStep: 4,
        currentStep: ['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'].indexOf(currentFilter),
    };
};

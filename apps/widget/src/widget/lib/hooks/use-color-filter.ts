import { useState, useEffect, useCallback } from 'react';
import type { ColorFilterType } from '../types/color-filter.types'; 
import { applyColorFilter as applyFilterService } from '../services/filterService';

const LOCAL_STORAGE_KEY = 'accessibility_filter';

export function useColorFilter() {
  const [activeFilter, setActiveFilter] = useState<ColorFilterType>('no-filter');

  useEffect(() => {
    applyFilterService(activeFilter);
    if (activeFilter !== 'no-filter') {
      localStorage.setItem(LOCAL_STORAGE_KEY, activeFilter);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [activeFilter]);

  useEffect(() => {
    const savedFilter = localStorage.getItem(LOCAL_STORAGE_KEY) as ColorFilterType | null;
    if (savedFilter) {
      setActiveFilter(savedFilter);
    }
  }, []);

  const applyFilter = useCallback((filter: ColorFilterType) => {
    setActiveFilter(filter);
  }, []);

  const resetFilter = useCallback(() => {
    setActiveFilter('no-filter');
  }, []);

  return {
    activeFilter,
    applyFilter,
    resetFilter,
  };
}
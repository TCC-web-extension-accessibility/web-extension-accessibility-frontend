import { useCallback, useLayoutEffect, useState } from 'react';

type Language = {
  code: string;
  name: string;
};

export const useSelectLanguage = () => {
  const LANGUAGE_STORAGE_KEY = 'accessibility-language';

  const LANGUAGES: Record<string, Language> = {
    enUS: { code: 'EN', name: 'English (USA)' },
    ptBR: { code: 'BR', name: 'Português (Brazil)' },
    esES: { code: 'ES', name: 'Español (Spanish)' },
  };

  const LANGUAGE_KEYS = Object.keys(LANGUAGES);

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return LANGUAGES.enUS.code;
    }

    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLanguage && LANGUAGE_KEYS.includes(storedLanguage)
      ? storedLanguage
      : LANGUAGES.enUS.code;
  });

  const changeLanguage = useCallback(
    (language: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      }

      setSelectedLanguage(language);
    },
    [LANGUAGES, LANGUAGE_STORAGE_KEY]
  );

  useLayoutEffect(() => {
    changeLanguage(selectedLanguage);
  }, [selectedLanguage, changeLanguage]);

  const selectLanguage = useCallback(
    (language: string) => {
      changeLanguage(language);
    },
    [LANGUAGE_KEYS, changeLanguage]
  );

  return {
    selectLanguage,
    selectedLanguage,
    languages: Object.values(LANGUAGES),
  };
};

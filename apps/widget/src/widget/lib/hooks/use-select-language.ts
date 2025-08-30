import { useCallback, useLayoutEffect, useState } from 'react';
import { LANGUAGES } from '../languages';
import { translatePage } from '../translator';

export const useSelectLanguage = () => {
  const LANGUAGE_STORAGE_KEY = 'accessibility-language';

  const LANGUAGE_KEYS = Object.keys(LANGUAGES);

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return LANGUAGES[LANGUAGE_KEYS[0]].code;
    }

    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const languageKey =
      storedLanguage && LANGUAGE_KEYS.includes(storedLanguage)
        ? storedLanguage
        : LANGUAGE_KEYS[0];
    return LANGUAGES[languageKey].code;
  });

  const changeLanguage = useCallback(
    (language: string) => {
      if (typeof window !== 'undefined') {
        const languageKey =
          Object.keys(LANGUAGES).find(
            (key) => LANGUAGES[key].code === language
          ) || LANGUAGE_KEYS[0];
        localStorage.setItem(LANGUAGE_STORAGE_KEY, languageKey);
      }

      setSelectedLanguage(language);
    },
    [LANGUAGES, LANGUAGE_STORAGE_KEY, LANGUAGE_KEYS]
  );

  useLayoutEffect(() => {
    if (selectedLanguage) {
      translatePage(selectedLanguage);
    }
  }, [selectedLanguage]);

  const selectLanguage = useCallback(
    (language: string) => {
      changeLanguage(language);
    },
    [changeLanguage]
  );

  return {
    selectLanguage,
    selectedLanguage,
    languages: Object.values(LANGUAGES),
  };
};

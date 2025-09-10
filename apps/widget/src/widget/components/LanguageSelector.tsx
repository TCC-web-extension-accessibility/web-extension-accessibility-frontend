import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { TextInput } from '@web-extension-accessibility-frontend/ui';
import { useMemo, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';
import { type Language } from '../lib/languages';

const languageSelectorVariants = tv({
  slots: {
    languageList:
      'divide-y divide-grey-200 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
    languageItem:
      'flex items-center p-3 cursor-pointer hover:bg-grey-100 focus:bg-grey-200 outline-none',
    languageAvatar:
      'w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-4',
    languageName: 'text-foreground',
  },
  variants: {
    isSelected: {
      true: {
        languageItem: 'bg-primary-100',
        languageAvatar: 'bg-primary-500 text-white',
      },
    },
  },
});

type LanguageSelectorProps = {
  languages: Language[];
  selectedLanguage?: string | null;
  onLanguageChange: (language: string) => void;
  isLoading: boolean;
};

export function LanguageSelector({
  languages,
  selectedLanguage,
  onLanguageChange,
  isLoading,
}: LanguageSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const listRef = useRef<(HTMLDivElement | null)[]>([]);

  const filteredLanguages = useMemo(
    () =>
      languages.filter((lang) =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, languages]
  );

  const { languageList, languageItem, languageAvatar, languageName } =
    languageSelectorVariants();

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = (index + 1) % filteredLanguages.length;
      listRef.current[nextIndex]?.focus();
      onLanguageChange(filteredLanguages[nextIndex].code);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex =
        (index - 1 + filteredLanguages.length) % filteredLanguages.length;
      listRef.current[prevIndex]?.focus();
      onLanguageChange(filteredLanguages[prevIndex].code);
    }
  };

  return (
    <div>
      <TextInput
        label
        placeholder="Pesquise o idioma"
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        icon={<MagnifyingGlassIcon />}
        iconPosition="after"
        className="p-1 mb-2"
        aria-label="Pesquisar idioma"
      />
      <div
        className={languageList()}
        role="radiogroup"
        aria-labelledby="language-selector-label"
        data-no-translate="true"
      >
        {filteredLanguages.map((lang, index) => (
          <div
            key={lang.code}
            ref={(el) => {
              listRef.current[index] = el;
            }}
            className={languageItem({
              isSelected: selectedLanguage === lang.code,
            })}
            role="radio"
            aria-checked={selectedLanguage === lang.code}
            aria-label={`Idioma ${lang.name}`}
            tabIndex={selectedLanguage === lang.code ? 0 : -1}
            onClick={() => onLanguageChange(lang.code)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <div
              className={languageAvatar({
                isSelected: selectedLanguage === lang.code,
              })}
            >
              {lang.icon}
            </div>
            <span className={languageName()}>{lang.name}</span>

            {isLoading && selectedLanguage === lang.code && (
              <div className="ml-auto mr-5">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

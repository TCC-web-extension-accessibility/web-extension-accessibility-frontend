import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { TextInput } from '@web-extension-accessibility-frontend/ui';
import { useMemo, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';

const languageSelectorVariants = tv({
  slots: {
    languageList: 'divide-y divide-grey-200',
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
  languages: { code: string; name: string }[];
  selectedLanguage?: string;
  onLanguageChange: (language: string) => void;
};

export function LanguageSelector({
  languages,
  selectedLanguage,
  onLanguageChange,
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
      />
      <div
        className={languageList()}
        role="radiogroup"
        aria-labelledby="language-selector-label"
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
            tabIndex={selectedLanguage === lang.code ? 0 : -1}
            onClick={() => onLanguageChange(lang.code)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <div
              className={languageAvatar({
                isSelected: selectedLanguage === lang.code,
              })}
            >
              {lang.code}
            </div>
            <span className={languageName()}>{lang.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

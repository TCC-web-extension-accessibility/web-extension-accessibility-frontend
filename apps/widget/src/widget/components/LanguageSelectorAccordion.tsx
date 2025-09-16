import { Accordion } from '@web-extension-accessibility-frontend/ui';
import type { Language } from '../lib/languages';
import { LanguageSelector } from './LanguageSelector';

type LanguageSelectorAccordionProps = {
  languages: Language[];
  selectedLanguage: string | null;
  onLanguageChange: (language: string) => void;
  isLoading: boolean;
};

export function LanguageSelectorAccordion({
  languages,
  selectedLanguage,
  onLanguageChange,
  isLoading,
}: LanguageSelectorAccordionProps) {
  return (
    <Accordion title="Idioma">
      <LanguageSelector
        languages={languages}
        onLanguageChange={onLanguageChange}
        selectedLanguage={selectedLanguage}
        isLoading={isLoading}
      />
    </Accordion>
  );
}

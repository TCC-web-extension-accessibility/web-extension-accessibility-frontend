import { Accordion } from '@web-extension-accessibility-frontend/ui';
import { LanguageSelector } from './LanguageSelector';

type LanguageSelectorAccordionProps = {
  languages: { code: string; name: string }[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
};

export function LanguageSelectorAccordion({
  languages,
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorAccordionProps) {
  return (
    <Accordion title="Idioma">
      <LanguageSelector
        languages={languages}
        onLanguageChange={onLanguageChange}
        selectedLanguage={selectedLanguage}
      />
    </Accordion>
  );
}

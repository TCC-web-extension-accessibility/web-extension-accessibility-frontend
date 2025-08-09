import { Accordion } from '@web-extension-accessibility-frontend/ui';
import { useSelectLanguage } from '../lib/hooks/use-select-language';
import { LanguageSelector } from './LanguageSelector';

export function LanguageSelectorAccordion() {
  const { selectLanguage, selectedLanguage, languages } = useSelectLanguage();

  return (
    <Accordion title="Idioma">
      <LanguageSelector
        languages={languages}
        onLanguageChange={selectLanguage}
        selectedLanguage={selectedLanguage}
      />
    </Accordion>
  );
}

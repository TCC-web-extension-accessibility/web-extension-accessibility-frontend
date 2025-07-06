import {
  GearIcon,
  PersonArmsSpreadIcon,
  TextAaIcon,
  TextTIcon,
  XIcon,
} from '@phosphor-icons/react';
import { Button } from '@web-extension-accessibility-frontend/ui';
import { useContext, useEffect, useState } from 'react';
import { WidgetContext } from '../lib/context';
import { useFontFamily } from '../lib/hooks/use-font-family';
import { useFontSize } from '../lib/hooks/use-font-size';
import { WidgetButton } from './WidgetButton';

export function Widget() {
  const { isOpen, setIsOpen } = useContext(WidgetContext);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  const {
    increaseFontSize,
    currentStep: currentFontSizeStep,
    maxFontStep: maxFontSizeStep,
  } = useFontSize();
  const {
    changeFontFamily,
    currentStep: currentFontFamilyStep,
    maxFontStep: maxFontFamilyStep,
  } = useFontFamily();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) {
    return (
      <Button
        className="rounded-full p-5 fixed cursor-pointer bottom-10 right-10"
        icon={<PersonArmsSpreadIcon size={24} />}
        onClick={() => setIsOpen(true)}
      />
    );
  }
  const drawerClasses = `
    fixed bottom-0 right-0 w-full md:w-[600px] h-screen bg-white rounded-l-lg p-6 border border-gray-300
    transform transition-transform duration-300 ease-in-out flex flex-col gap-2
    ${animateIn ? 'translate-x-0' : 'translate-x-full'}
    ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
  `;

  return (
    <div className={drawerClasses}>
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-bold">Menu acessibilidade</h2>
        <div className="flex items-center gap-2">
          <Button
            className="rounded-full p-2 text-2xl"
            variant="simple"
            icon={<GearIcon />}
          />
          <Button
            className="p-2 rounded-full text-2xl"
            onClick={() => setIsOpen(false)}
            icon={<XIcon weight="bold" />}
          />
        </div>
      </div>

      <div className="border-t border-gray-300 mx-5" />

      <div className="flex gap-2.5 flex-wrap">
        <WidgetButton
          text="Tamanho do texto"
          icon={<TextAaIcon weight="bold" />}
          step={currentFontSizeStep}
          maxSteps={maxFontSizeStep}
          onClick={increaseFontSize}
        />
        <WidgetButton
          text="Estilo de fonte"
          icon={<TextTIcon weight="fill" />}
          step={currentFontFamilyStep}
          maxSteps={maxFontFamilyStep}
          onClick={changeFontFamily}
        />
      </div>
    </div>
  );
}

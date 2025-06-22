import { GearIcon, PersonArmsSpreadIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@web-extension-accessibility-frontend/ui';
import { useContext, useEffect, useState } from 'react';
import { WidgetContext } from '../lib/context';

export function Widget() {
  const { isOpen, setIsOpen } = useContext(WidgetContext);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

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
        className="bg-[#595F72] text-white rounded-full p-5 absolute cursor-pointer bottom-10 right-10"
        onClick={() => setIsOpen(true)}
      >
        <PersonArmsSpreadIcon size={24} />
      </Button>
    );
  }
  const drawerClasses = `
    fixed bottom-0 right-0 w-full md:w-[600px] h-screen bg-white rounded-l-lg p-6 border border-gray-300
    transform transition-transform duration-300 ease-in-out
    ${animateIn ? 'translate-x-0' : 'translate-x-full'}
    ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
  `;

  console.log('test');

  return (
    <div className={drawerClasses}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Menu acessibilidade</h2>
        <div className="flex items-center gap-2">
          <Button className="hover:bg-gray-100 text-black p-2 rounded-full">
            <GearIcon size={24} />
          </Button>
          <Button
            className="bg-black text-white p-2 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <XIcon size={24} weight="bold" />
          </Button>
        </div>
      </div>

      <div className="flex-grow border-t border-gray-300 mx-5" />
    </div>
  );
}

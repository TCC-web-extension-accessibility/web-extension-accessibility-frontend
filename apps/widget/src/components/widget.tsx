import { GearIcon, XIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

type WidgetProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export function Widget({ isOpen, onClose }: WidgetProps) {
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

  if (!isVisible && !isOpen) {
    return null;
  }

  const drawerClasses = `
    fixed bottom-0 right-0 w-full md:w-[600px] h-screen bg-white rounded-l-lg p-6 border border-gray-300
    transform transition-transform duration-300 ease-in-out
    ${animateIn ? 'translate-x-0' : 'translate-x-full'}
    ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
  `;

  return (
    <div className={drawerClasses}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Menu acessibilidade</h2>
        <div className="flex items-center gap-2">
          <button className="cursor-pointer hover:bg-gray-100 p-2 rounded-full">
            <GearIcon size={24} />
          </button>
          <button
            className="cursor-pointer bg-black text-white p-2 rounded-full"
            onClick={onClose}
          >
            <XIcon size={24} />
          </button>
        </div>
      </div>

      <div className="flex-grow border-t border-gray-300 mx-5" />
    </div>
  );
}

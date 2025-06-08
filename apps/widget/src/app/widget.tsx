import { XIcon } from '@phosphor-icons/react';

type WidgetProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export function Widget({ isOpen, onClose }: WidgetProps) {
  return (
    isOpen && (
      <div>
        <div className="fixed bottom-0 right-0 w-full md:w-[600px] h-screen bg-white rounded-l-lg p-4 border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Menu acessibilidade</h2>
            <button onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <p>This is a simple widget component.</p>
        </div>
      </div>
    )
  );
}

import { CaretLeftIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@web-extension-accessibility-frontend/ui';
import { useState } from 'react';
import { FeedbackModal } from './FeedbackModal';

type WidgetSettingsProps = {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onResetSettings: () => void;
};

export function WidgetSettings({
  isOpen,
  onClose,
  onBack,
  onResetSettings,
}: WidgetSettingsProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const drawerClasses = `
    fixed bottom-0 right-0 w-full md:w-[600px] h-screen bg-white rounded-l-lg p-6 border border-gray-300
    transform transition-transform duration-300 ease-in-out flex flex-col gap-4 z-50
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
  `;

  return (
    <>
      <div className={drawerClasses}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              className="p-2 rounded-full text-xl"
              variant="simple"
              onClick={onBack}
              icon={<CaretLeftIcon />}
            />
            <h2 className="text-xl font-bold">Configurações</h2>
          </div>
          <Button
            className="p-2 rounded-full text-2xl"
            onClick={onClose}
            icon={<XIcon weight="bold" />}
          />
        </div>

        <div className="border-t border-gray-300 mx-5" />

        <div className="flex flex-col gap-2">
          <Button onClick={() => setShowFeedbackModal(true)}>
            Enviar feedback
          </Button>
          <Button onClick={onResetSettings}>Redefinir configurações</Button>
        </div>
      </div>

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </>
  );
}

import {
  BrainIcon,
  DropHalfIcon,
  EyeIcon,
  PuzzlePieceIcon,
} from '@phosphor-icons/react';
import { Accordion, Radio } from '@web-extension-accessibility-frontend/ui';

type AccessibilityProfileButtonProps = {
  onClick?: () => void;
  name: string;
  icon: React.ReactNode;
};

function AccessibilityProfileLabel({
  name,
  icon,
  onClick,
}: AccessibilityProfileButtonProps) {
  return (
    <span
      className="flex gap-1 items-center justify-center w-full"
      onClick={onClick}
    >
      {icon}
      {name}
    </span>
  );
}

type AccessibilityProfilesAccordionProps = {
  increaseFontSize: (size?: number) => void;
  resetFontSize: () => void;
  resetFontFamily: () => void;
};

export function AccessibilityProfilesAccordion({
  increaseFontSize,
  resetFontSize,
  resetFontFamily,
}: AccessibilityProfilesAccordionProps) {
  const handleProfileClick = (action: () => void) => {
    resetFontSize();
    resetFontFamily();
    action();
  };

  return (
    <Accordion
      children={
        <div className="grid grid-cols-2 gap-2 py-3">
          <Radio
            name="accessibility-profiles"
            variant="button"
            label={
              <AccessibilityProfileLabel
                name="Daltônico"
                icon={<DropHalfIcon size={20} />}
              />
            }
            onClick={() => handleProfileClick(() => {})}
          />
          <Radio
            name="accessibility-profiles"
            variant="button"
            label={
              <AccessibilityProfileLabel
                name="Baixa visão"
                icon={<EyeIcon size={20} />}
              />
            }
            onClick={() => handleProfileClick(() => increaseFontSize(150))}
          />
          <Radio
            name="accessibility-profiles"
            variant="button"
            label={
              <AccessibilityProfileLabel
                name="TDAH"
                icon={<PuzzlePieceIcon size={20} />}
              />
            }
            onClick={() => handleProfileClick(() => {})}
          />
          <Radio
            name="accessibility-profiles"
            variant="button"
            label={
              <AccessibilityProfileLabel
                name="Epilepsia"
                icon={<BrainIcon size={20} />}
              />
            }
            onClick={() => handleProfileClick(() => {})}
          />
        </div>
      }
      title="Perfis de acessibilidade"
    />
  );
}

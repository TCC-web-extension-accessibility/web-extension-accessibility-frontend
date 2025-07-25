import {
  BrainIcon,
  DropHalfIcon,
  EyeIcon,
  PuzzlePieceIcon,
} from '@phosphor-icons/react';
import {
  Accordion,
  ToggleGroup,
  ToggleGroupItem,
} from '@web-extension-accessibility-frontend/ui';

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
  changeFontFamily: (fontName: string) => void;
  toggleDisabledAnimations: (disabled: boolean) => void;
};

export function AccessibilityProfilesAccordion({
  increaseFontSize,
  resetFontSize,
  toggleDisabledAnimations,
  changeFontFamily,
}: AccessibilityProfilesAccordionProps) {
  const handleProfileClick = (action: () => void) => {
    resetFontSize();
    changeFontFamily('default');
    toggleDisabledAnimations(false);
    action();
  };

  return (
    <Accordion
      children={
        <ToggleGroup
          type="single"
          defaultValue="center"
          aria-label="Text alignment"
          className="grid grid-cols-2 gap-2 py-2 px-1"
          onValueChange={(value) => {
            if (value === '') {
              handleProfileClick(() => {});
            }
          }}
        >
          <ToggleGroupItem
            value="Daltônico"
            aria-label="Daltônico"
            onClick={() => handleProfileClick(() => {})}
          >
            <AccessibilityProfileLabel
              name="Daltônico"
              icon={<DropHalfIcon size={20} />}
            />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="Baixa visão"
            aria-label="Baixa visão"
            onClick={() => handleProfileClick(() => increaseFontSize(150))}
          >
            <AccessibilityProfileLabel
              name="Baixa visão"
              icon={<EyeIcon size={20} />}
            />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="TDAH"
            aria-label="TDAH"
            onClick={() =>
              handleProfileClick(() => {
                toggleDisabledAnimations(true);
              })
            }
          >
            <AccessibilityProfileLabel
              name="TDAH"
              icon={<PuzzlePieceIcon size={20} />}
            />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="Epilepsia"
            aria-label="Epilepsia"
            onClick={() =>
              handleProfileClick(() => {
                changeFontFamily('dyslexic');
                toggleDisabledAnimations(true);
              })
            }
          >
            <AccessibilityProfileLabel
              name="Epilepsia"
              icon={<BrainIcon size={20} />}
            />
          </ToggleGroupItem>
        </ToggleGroup>
      }
      title="Perfis de acessibilidade"
    />
  );
}

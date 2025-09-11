import { CaretDownIcon } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { tv } from 'tailwind-variants';

const AccordionVariants = tv({
  slots: {
    header:
      'flex justify-between items-center p-4 cursor-pointer bg-grey-200 hover:bg-grey-100 transition-colors duration-200 rounded-lg',
    title: 'text-base font-bold text-gray-800',
    icon: 'transform transition-transform duration-200',
    contentWrapper: 'overflow-hidden transition-all duration-200 ease-in-out',
  },
  variants: {
    isOpen: {
      true: {
        icon: 'rotate-180',
        contentWrapper: 'max-h-screen opacity-100',
      },
      false: {
        icon: 'rotate-0',
        contentWrapper: 'max-h-0 opacity-0',
      },
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  ariaLabel?: string;
};

const Accordion = ({
  title,
  children,
  defaultOpen = false,
  ariaLabel = `${title}`,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const {
    header,
    title: titleClass,
    icon,
    contentWrapper,
  } = AccordionVariants({ isOpen });

  return (
    <div
      className={`w-full max-w-2xl mx-auto rounded-lg overflow-hidden bg-white`}
    >
      <div className={header()} onClick={toggleOpen} aria-label={ariaLabel}>
        <h3 className={titleClass()}>{title}</h3>
        <CaretDownIcon className={icon()} weight="bold" size={16} />
      </div>
      <div className={contentWrapper()}>{children}</div>
    </div>
  );
};

export { Accordion };

import { useEffect, useState } from 'react';
import { WidgetContext } from '../lib/context';
import { Widget } from './widget';

export function WidgetContainer() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WidgetContext.Provider value={{ isOpen, setIsOpen }}>
      <Widget />
    </WidgetContext.Provider>
  );
}

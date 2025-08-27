import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { WidgetContext } from '../lib/context';
import { Widget } from './Widget';

export function WidgetContainer() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = new QueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WidgetContext.Provider value={{ isOpen, setIsOpen }}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          autoClose={4000}
          hideProgressBar={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Widget />
      </QueryClientProvider>
    </WidgetContext.Provider>
  );
}

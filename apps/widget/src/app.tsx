import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WidgetContainer } from './widget/components/WidgetContainer.tsx';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetContainer />
    </QueryClientProvider>
  );
}

export default App;

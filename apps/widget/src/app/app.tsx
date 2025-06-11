import { useState } from 'react';
import { Widget } from './widget';

export function App() {
  const [isWidgetOpen, setIswidgetOpen] = useState(false);

  return (
    <div>
      <button
        className="bg-black text-white rounded-full p-5 absolute bottom-10 right-10"
        onClick={() => setIswidgetOpen(!isWidgetOpen)}
      >
        {isWidgetOpen ? 'Fechar Widget' : 'Abrir Widget'} {/* Muda o texto */}
      </button>
      <Widget
        isOpen={isWidgetOpen}
        onClose={() => {
          setIswidgetOpen(false);
        }}
      />
    </div>
  );
}

export default App;
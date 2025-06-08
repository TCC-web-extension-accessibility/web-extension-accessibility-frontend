import { useState } from 'react';
import { Widget } from './widget';

export function App() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  return (
    <div>
      <button
        className="bg-black text-white rounded-full p-5 absolute bottom-10 right-10"
        onClick={() => setIsWidgetOpen(!isWidgetOpen)}
      >
        Test
      </button>
      <Widget
        isOpen={isWidgetOpen}
        onClose={() => {
          setIsWidgetOpen(false);
        }}
      />
    </div>
  );
}

export default App;

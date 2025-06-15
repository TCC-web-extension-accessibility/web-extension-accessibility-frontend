import { PersonArmsSpreadIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Widget } from './widget';

export function App() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  return (
    <div>
      <button
        className="bg-[#595F72] text-white rounded-full p-5 absolute cursor-pointer bottom-10 right-10"
        onClick={() => setIsWidgetOpen(!isWidgetOpen)}
      >
        <PersonArmsSpreadIcon size={24} />
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

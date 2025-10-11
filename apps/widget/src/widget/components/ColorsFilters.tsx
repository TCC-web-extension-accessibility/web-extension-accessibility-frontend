import React from 'react';

const ColorsFilters: React.FC = () => (
  <svg id="color-filters" style={{ display: 'none' }} aria-hidden="true">
    <defs>
      <filter id="protanopia-assist">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0.567 0.433 0 0 0
                  0.558 0.442 0 0 0
                  0     0.242 0.758 0 0
                  0     0     0 1 0"
        />
      </filter>
      {}
    </defs>
  </svg>
);

export default ColorsFilters;
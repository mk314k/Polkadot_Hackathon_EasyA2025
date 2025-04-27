import React from 'react';
import './appName.css';
const AppName: React.FC = () => {
  const letters = ['J', 'A', 'M', '', 'S', 'P', 'Y'];

  return (
    <div className="flex gap-4">
      {letters.map((letter, index) => {
        return letter ? (
          <div key={index} className="app-name-loader">
            <svg viewBox="0 0 80 80" className="w-20 h-20">
              <rect
                x="8"
                y="8"
                width="64"
                height="64"
                fill="none"
                stroke="black"
                strokeWidth="2"
              />
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                fill="white"
                fontSize="24"
                fontWeight="bold"
              >
                {letter}
              </text>
            </svg>
          </div>
        ) : (
          <div key={index}></div>
        );
      })}
    </div>
  );
};

export default AppName;

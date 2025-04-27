import React from 'react';
import './vinyl.css';

const Vinyl: React.FC = () => {
  return (
    <div className="vinyl-container ">
      <div className="plate">
        <div className="black">
          <div className="border">
            <div className="white">
              <div className="center"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="player">
        <div className="rect"></div>
        <div className="circ"></div>
      </div>
    </div>
  );
};

export default Vinyl;

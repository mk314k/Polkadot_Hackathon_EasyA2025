import React from 'react';

interface GameContainer {
  children?: React.ReactNode;
}

const GameContainer: React.FC<GameContainer> = ({ children }) => {
  return (
    <div className=" p-24 justify-center bg-[#141e2b] flex w-full h-screen">
      {children}
    </div>
  );
};

export default GameContainer;

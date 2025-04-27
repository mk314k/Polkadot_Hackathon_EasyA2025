import React, { useEffect, useState } from 'react';
import Space from '../space/Space';

interface PlayerViewProps {
  deck: {
    role: string;
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg';
    name: 'Kartikesh';
    points: '1000';
    actions: Array<{
      src: string;
    }>;
  };
}

const PlayerView: React.FC<PlayerViewProps> = ({ deck }) => {
  return (
    <div className="flex justify-around">
      {
        <div
          key={deck.name}
          className="flex flex-col items-center transition-opacity duration-500 opacity-100"
        >
          <h3 className="text-white font-inter font-bold text-[32px] leading-none tracking-[-0.03em] text-center flex items-center justify-center">
            {deck.name}
          </h3>
          <Space top={4} />

          <p className="text-[24px] text-[#FE0D0D] font-bold">
            You are the {`${deck.role}`}
          </p>
          <Space top={8} />
          <img
            width={200}
            src={deck.avatar}
            alt={`Avatar - ${deck.name}`}
            className="rounded-full object-cover"
          />
        </div>
      }
      <Space top={10} />
      {deck.actions.map((item) => {
        return (
          <div
            key={item.src}
            className="flex flex-col items-center transition-opacity duration-500 opacity-100"
          >
            <img
              width={200}
              src={item.src}
              className="transition-transform duration-500 hover:rotate-x-12 hover:rotate-y-12 object-cover cursor-pointer"
            />
          </div>
        );
      })}
    </div>
  );
};

export default PlayerView;

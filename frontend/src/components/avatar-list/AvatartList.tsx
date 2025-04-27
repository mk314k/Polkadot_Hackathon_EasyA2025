import React, { useEffect, useState } from 'react';
import Space from '../space/Space';

interface AvatarListProps {
  isLoading?: boolean;
  players: Array<{
    name: string;
    avatar: string;
    points: number;
  }>;
  showPoints?: boolean;
}

const AvatarList: React.FC<AvatarListProps> = ({
  isLoading,
  players,
  showPoints,
}) => {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (isLoading) {
      setVisibleCount(1);
      players.forEach((_, index) => {
        setTimeout(
          () => {
            setVisibleCount((prev) => Math.min(prev + 1, players.length));
          },
          (index + 1) * 1000,
        );
      });
    } else {
      setVisibleCount(players.length);
    }
  }, [isLoading, players]);

  return (
    <div className="flex justify-around">
      {players.slice(0, visibleCount).map((item, idx) => (
        <div
          key={item.name}
          className="flex flex-col items-center transition-opacity duration-500 opacity-100"
        >
          <h3 className="text-white font-inter font-bold text-[32px] leading-none tracking-[-0.03em] text-center flex items-center justify-center">
            {item.name}
          </h3>
          <Space top={8} />
          <img
            width={200}
            src={item.avatar}
            alt={`Avatar - ${item.name}`}
            className="rounded-full object-cover"
          />
          {showPoints && (
            <>
              <Space top={12} />
              <p className="text-white font-bold text-[25px] leading-none">{`${item.points} points`}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AvatarList;

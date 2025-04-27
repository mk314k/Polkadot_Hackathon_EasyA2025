import { useEffect, useState } from 'react';
import './game.css';
import { WaitingForPlayers } from '../../features/waiting-for-players/WaitingForPlayers';
import GameContainer from '../../components/game-container/GameContainer';
import Space from '../../components/space/Space';
interface GameProps {
  children?: React.ReactNode;
}

export enum GamePhase {
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
  SHOW_ROUND = 'SHOW_ROUND',
  SPY_ACTION = 'SPY_ACTION',
  LISTEN_MUSIC_CLIP = 'LISTEN_MUSIC_CLIP',
  PLAYING = 'PLAYING',
  VOTE_FOR_SPY = 'VOTE_FOR_SPY',
}

export const Game: React.FC<GameProps> = ({ children }) => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.WAITING_FOR_PLAYERS);

  // Mock
  const [_loading, _setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      _setLoading(false); // This will fire after 1.5 seconds
    }, 1500);

    return () => clearTimeout(timer); // Cleanup in case the component unmounts
  }, []);

  return (
    <GameContainer>
      <p
        className="absolute top-0 right-0 m-[32px] 
font-inter font-bold text-[24px] leading-none tracking-[-0.03em] 
text-center text-white flex items-center justify-center w-[100px]"
      >
        Game ID: 09667
      </p>
      {phase === GamePhase.WAITING_FOR_PLAYERS && (
        <WaitingForPlayers isLoading={_loading} />
      )}
      {/* {phase === GamePhase.SHOW_ROUND && <ShowRound />}
      {phase === GamePhase.SPY_ACTION && <SpyAction />}
      {phase === GamePhase.LISTEN_MUSIC_CLIP && <ListenMusicClip />}
      {phase === GamePhase.PLAYING && <Playing />}
      {phase === GamePhase.VOTE_FOR_SPY && <VoteForSpy />} */}

      {children}
      <Space top={10} />
      <p
        className={`${_loading ? 'opacity-50 pointer-events-none' : ' hover:bg-neutral-600 transition'} flex items-center justify-center text-white text-[29px] w-[185px] h-[60px] rounded-[8px] border-[2px] cursor-pointer mt-[24px]`}
      >
        Start
      </p>
    </GameContainer>
  );
};

export default Game;

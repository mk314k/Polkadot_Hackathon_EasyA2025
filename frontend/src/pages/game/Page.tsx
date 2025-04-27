import { useState } from 'react';
import './game.css';
import { WaitingForPlayers } from '../../features/waiting-for-players/WaitingForPlayers';
import GameContainer from '../../components/game-container/GameContainer';
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
  return (
    <GameContainer>
      <p
        className="absolute top-0 right-0 m-[32px] 
font-inter font-bold text-[24px] leading-none tracking-[-0.03em] 
text-center text-white flex items-center justify-center w-[100px]
"
      >
        Game ID: 09667
      </p>
      {phase === GamePhase.WAITING_FOR_PLAYERS && <WaitingForPlayers />}
      {/* {phase === GamePhase.SHOW_ROUND && <ShowRound />}
      {phase === GamePhase.SPY_ACTION && <SpyAction />}
      {phase === GamePhase.LISTEN_MUSIC_CLIP && <ListenMusicClip />}
      {phase === GamePhase.PLAYING && <Playing />}
      {phase === GamePhase.VOTE_FOR_SPY && <VoteForSpy />} */}

      {children}
    </GameContainer>
  );
};

export default Game;

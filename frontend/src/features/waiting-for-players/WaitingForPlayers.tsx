import AvatarList from '../../components/avatar-list/AvatartList';
import Deck from '../../mock/deck.json';
import PlayerView from '../../components/player-view/PlayerView';
import Space from '../../components/space/Space';
import data from '../../mock/players.json';

interface WaitingForPlayersProps {
  isLoading?: boolean;
}

export const WaitingForPlayers: React.FC<WaitingForPlayersProps> = ({
  isLoading,
}) => {
  return (
    <div className="w-[100%]">
      <h1 className="font-inter text-white font-bold text-[46px] leading-none tracking-[-0.03em] text-center flex items-center justify-center">
        Waiting for players to join...
      </h1>
      <Space top={16} />
      {/* <AvatarList players={data.players} isLoading={isLoading} /> */}
      <PlayerView deck={Deck} />
    </div>
  );
};

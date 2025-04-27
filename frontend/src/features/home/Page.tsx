import AppName from '../../components/app-name/AppName';
import PlayButton from '../../components/play-button/PlayButton';
import Space from '../../components/space/Space';
import TopUsers from '../../components/top-users/TopUsers';

export const Home = () => {
  return (
    <>
      <Space top={6} />
      <AppName />
      <Space top={20} />
      <TopUsers />
      <Space top={8} />
      <PlayButton />
    </>
  );
};

export default Home;

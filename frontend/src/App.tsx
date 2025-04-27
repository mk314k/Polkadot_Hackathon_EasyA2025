import ConnectWallet from './components/connect-wallet/ConnectWallet';
import { useEthereum } from './contexts/EthereumContext';
import './app.css';
import PlayButton from './components/play-button/PlayButton';

function App() {
  const { __provider, account, connectWallet } = useEthereum();

  return (
    <main className={`"flex bg-[#212121]" ${account && 'bg-[#212121]'}`}>
      {account ? <PlayButton /> : <ConnectWallet onClick={connectWallet} />}
    </main>
  );
}

export default App;

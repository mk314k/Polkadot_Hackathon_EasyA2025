import ConnectWallet from './components/connect-wallet/ConnectWallet';
import { useEthereum } from './contexts/EthereumContext';
import './app.css';

import Home from './features/home/Page';

function App() {
  const { __provider, account, connectWallet } = useEthereum();

  return (
    <main className={`flex flex-col ${account && 'bg-[#212121]'}`}>
      {account ? <Home /> : <ConnectWallet onClick={connectWallet} />}
    </main>
  );
}

export default App;

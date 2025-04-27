import ConnectWallet from './components/connect-wallet/ConnectWallet';
import { useEthereum } from './contexts/EthereumContext';
import './app.css';

function App() {
  const { __provider, account, connectWallet } = useEthereum();

  return (
    <main className="flex">
      {account ? (
        <>
          {/* <p>Connected account: {account}</p> */}
          <ConnectWallet />
        </>
      ) : (
        <ConnectWallet />
      )}
    </main>
  );
}

export default App;

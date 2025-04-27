
import { useEthereum } from './contexts/EthereumContext';

function App() {

  const { __provider, account, connectWallet } = useEthereum();

  return (
    <div>  {account ? (
      <>
        <p>Connected account: {account}</p>
      </>
    ) : (
      <button onClick={connectWallet}>Connect Wallet</button>
    )}
    </div>
  )
}

export default App

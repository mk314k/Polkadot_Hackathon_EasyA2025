import './app.css';
import Home from './pages/home/Page';
import Game from './pages/game/Page';
import WaitStart from './pages/waitStart';
import CreateContest from './pages/createContest';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useEthereum } from './contexts/EthereumContext';
import { MusicGameContract } from './libs/contracts/musicGamePoints';
import { ContractRunner } from 'ethers';


function App() {
  const { account, connectWallet, contract} = useEthereum();
  return (
    <Router>
      <div className="w-[220px]  flex items-center justify-center">
          {account && (
            <p className="font-inter font-bold text-[12px] leading-none tracking-[-0.03em] text-center text-white account-info">
              Wallet ID: {account}
            </p>
          )}
        </div>
      <main>
          <Routes>
            <Route path="/" element={<Home account={account??''} connectWallet={connectWallet}/>} />
            <Route path="/game" element={<Game/>} />
            <Route path="/createContest" element={<CreateContest contract={contract??new MusicGameContract({} as ContractRunner)} />} />
            <Route path="/waitStart/:contestId" element={<WaitStart account={account??''} contract={contract?? new MusicGameContract({} as ContractRunner)}/>} />
          </Routes>
      </main>
      {/* <footer>
        <div className="footer">
          <p>&copy; 2025 Kartikesh Mishra.</p>
        </div>
      </footer> */}
    </Router>
  );
}

export default App;

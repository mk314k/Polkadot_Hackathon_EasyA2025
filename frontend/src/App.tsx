// src/App.tsx
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useWallet } from './hooks/useWallet';
import Home from './pages/Home';
import CreateContest from './pages/CreateContest';
import JoinContest from './pages/JoinContest';
import PlayContest from './pages/PlayContest';
import ViewNFT from './pages/ViewNFT';

function App() {
  const { address } = useWallet();
  const navigate = useNavigate();

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
        <div>
          <h2 style={{ margin: 0 }}>SoundSpy</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {address && (
            <>
              <button onClick={() => navigate('/create')}>Create Contest</button>
              <span>Wallet: {address.slice(0, 6)}...{address.slice(-4)}</span>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateContest />} />
        <Route path="/join" element={<JoinContest />} />
        <Route path="/play/:contestId" element={<PlayContest />} />
        <Route path="/nft/:tokenId" element={<ViewNFT />} />
      </Routes>
    </div>
  );
}

export default App;

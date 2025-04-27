// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';

// Replace with your real deployed contract address
const MUSIC_GAME_ADDRESS = "0xYourContractAddressHere"; 

const ABI = [
  "function contestCounter() public view returns (uint8)"
];

function Home() {
  const { provider, address, connectWallet } = useWallet();
  const [contestCount, setContestCount] = useState<number>(0);

  useEffect(() => {
    const fetchContests = async () => {
      if (!provider || !address) return;
      const contract = new ethers.Contract(MUSIC_GAME_ADDRESS, ABI, provider);
      const count = await contract.contestCounter();
      setContestCount(count);
    };

    fetchContests();
  }, [provider, address]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      {!address ? (
        <div>
          <h1>SoundSpy</h1>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      ) : (
        <div>
          <h1>Contests Available to Join</h1>
          {contestCount === 0 ? (
            <p>No contests yet. Create one!</p>
          ) : (
            <div style={{ marginTop: '30px' }}>
              {[...Array(contestCount)].map((_, i) => (
                <div key={i} style={{ margin: '10px' }}>
                  Contest #{i + 1}  
                  <a href={`/play/${i + 1}`} style={{ marginLeft: '10px' }}>
                    <button>Join</button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;

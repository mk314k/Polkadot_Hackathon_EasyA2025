// src/features/waitStart/WaitStart.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MusicGameContract } from '../libs/contracts/musicGamePoints';

interface WaitStartProps {
  contract: MusicGameContract;
  account: string;
}

export default function WaitStart({ contract, account }: WaitStartProps) {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<string[]>([]);
  const [creator, setCreator] = useState<string>('');
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch players periodically
  useEffect(() => {
    if (!contestId || !contract) return;

    const interval = setInterval(async () => {
      try {
        const playerList = await contract.getPlayers(Number(contestId));
        setPlayers(playerList);

        const contestCreator = await contract.getContestCreator(Number(contestId));
        setCreator(contestCreator);

        const started = await contract.isContestStarted(Number(contestId));
        setIsStarted(started);

        if (started) {
          clearInterval(interval);
          navigate(`/game/${contestId}`);
        }
      } catch (err) {
        console.error("Error polling contest state:", err);
      }
    }, 2000); // poll every 2 sec

    return () => clearInterval(interval);
  }, [contestId, contract, navigate]);

  const handleStartGame = async () => {
    if (!contestId || !contract) return;
    setLoading(true);
    try {
      await contract.startContest(Number(contestId));
      console.log("Contest started!");
    } catch (err) {
      console.error("Failed to start contest:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white">
      <h1 className="text-3xl mb-6">Waiting for Players...</h1>
      <p className="mb-4">Game ID: {contestId}</p>

      {/* Players list */}
      <div className="flex flex-col gap-2 mb-8">
        {players.map((player, idx) => (
          <div key={idx} className="bg-gray-700 px-4 py-2 rounded">
            {player}
          </div>
        ))}
      </div>

      {/* Start button only for creator */}
      {account === creator && (
        <button
          onClick={handleStartGame}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-white"
        >
          {loading ? "Starting..." : "Start Game"}
        </button>
      )}

      {/* If not creator, just wait */}
      {account !== creator && (
        <p className="text-gray-400">Waiting for creator to start the game...</p>
      )}
    </div>
  );
}

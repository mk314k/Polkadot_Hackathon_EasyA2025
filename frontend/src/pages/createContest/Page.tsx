import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioEditor } from '../../libs/AudioEditor';
import { MusicGameContract } from '../../libs/contracts/musicGamePoints';
import './createContest.css';
interface CreateContestProps {
  contract: MusicGameContract;
}

export default function CreateContest({ contract }: CreateContestProps) {
  const navigate = useNavigate();

  const [audioEditor, setAudioEditor] = useState<AudioEditor | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [maxRounds, setMaxRounds] = useState<number>(5);
  const [maxPlayers, setMaxPlayers] = useState<number>(6);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      const editor = new AudioEditor();
      await editor.loadAudio(url);
      setAudioEditor(editor);

      console.log('Audio loaded for contest:', file.name);
    }
  };

  const handleCreateContest = async () => {
    if (!contract) return;
    if (!audioEditor) {
      alert('Please upload an audio first!');
      return;
    }

    try {
      setLoading(true);
      const contestId = await contract.createContest(maxRounds, maxPlayers);
      console.log('Contest created with ID:', contestId);

      // Navigate to WaitStart page with contestId and audioEditor in state
      navigate(`/waitStart/${contestId}`, {
        state: { audioEditor },
      });
    } catch (err) {
      console.error('Failed to create contest:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 text-white create-contest">
      <h1 className="text-3xl mb-8">Create New Contest 🎶</h1>

      {/* File Upload */}
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {/* Preview Audio */}
      {audioUrl && (
        <audio controls src={audioUrl} className="mb-6 w-full max-w-lg" />
      )}

      {/* Rounds and Players */}
      <div className="flex flex-col gap-4 mb-6">
        <input
          type="number"
          placeholder="Max Rounds"
          value={maxRounds}
          onChange={(e) => setMaxRounds(Number(e.target.value))}
          className="p-2 rounded bg-gray-200 text-black"
        />
        <input
          type="number"
          placeholder="Max Players"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(Number(e.target.value))}
          className="p-2 rounded bg-gray-200 text-black"
        />
      </div>

      {/* Create Button */}
      <button
        onClick={handleCreateContest}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-white"
      >
        {loading ? 'Creating...' : 'Create Contest'}
      </button>
    </div>
  );
}

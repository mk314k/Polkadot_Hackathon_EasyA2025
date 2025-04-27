import { useRef, useState } from 'react';
import { useEthereum } from './contexts/EthereumContext';
import { AudioEditor } from './audio_editor/AudioEditor'; // Your new AudioEditor class
import ConnectWallet from './components/connect-wallet/ConnectWallet';
import './app.css';

function App() {
  const { account, connectWallet, contract } = useEthereum();

  const [audioEditor, setAudioEditor] = useState<AudioEditor | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      const editor = new AudioEditor();
      await editor.loadAudio(url);
      setAudioEditor(editor);

      console.log('Audio loaded:', file.name);
    }
  };

  const applyEffect = async (
    effectType: 'scream' | 'pitch' | 'echo' | 'noise',
  ) => {
    if (!audioEditor) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      let editedBlob: Blob | null = null;

      switch (effectType) {
        case 'scream':
          editedBlob = await audioEditor.addScreamEffect(startTime, endTime);
          break;
        case 'pitch':
          editedBlob = await audioEditor.changePitchSegment(
            startTime,
            endTime,
            2.0,
          ); // pitch up 2x
          break;
        case 'echo':
          editedBlob = await audioEditor.addEchoEffect(startTime, endTime);
          break;
        case 'noise':
          editedBlob = await audioEditor.addNoise(startTime, endTime);
          break;
      }

      if (editedBlob) {
        const editedUrl = URL.createObjectURL(editedBlob);
        setAudioUrl(editedUrl);
      }
    } catch (err) {
      console.error('Failed to apply effect:', err);
    }
  };

  return (
    <main
      className={`flex flex-col min-h-screen p-8 ${account && 'bg-[#212121]'}`}
    >
      {!account ? (
        <ConnectWallet onClick={connectWallet} />
      ) : (
        <>
          <div className="text-white mb-6">Connected as: {account}</div>

          {/* File Upload */}
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-white text-2xl">SoundSpy 🎶 Audio Editor</h1>

            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="mb-4"
            />

            {/* Audio Player */}
            {audioUrl && (
              <>
                <audio
                  ref={audioRef}
                  controls
                  src={audioUrl}
                  style={{ width: '100%' }}
                />

                {/* Time Range Inputs */}
                <div className="flex gap-4 mt-4">
                  <input
                    type="number"
                    placeholder="Start Time (sec)"
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                    className="p-2 rounded bg-gray-200"
                  />
                  <input
                    type="number"
                    placeholder="End Time (sec)"
                    value={endTime}
                    onChange={(e) => setEndTime(Number(e.target.value))}
                    className="p-2 rounded bg-gray-200"
                  />
                </div>

                {/* Effect Buttons */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    onClick={() => applyEffect('scream')}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                  >
                    Strong Scream
                  </button>
                  <button
                    onClick={() => applyEffect('pitch')}
                    className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded text-white"
                  >
                    Pitch Up
                  </button>
                  <button
                    onClick={() => applyEffect('echo')}
                    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black"
                  >
                    Echo
                  </button>
                  <button
                    onClick={() => applyEffect('noise')}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
                  >
                    Add Noise
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default App;

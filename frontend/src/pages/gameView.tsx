import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { AudioEditor } from '../libs/AudioEditor';
import { MusicGameContract } from '../libs/contracts/musicGamePoints';
import { AudioMap } from '../audios/audios'; // AudioMap: id -> url

interface WaitStartProps {
  contract: MusicGameContract;
  account: string;
}

export default function GameView({ contract, account }: WaitStartProps) {
  const { contestId } = useParams<{ contestId: string }>();
  const contestIdNum = contestId ? parseInt(contestId) : undefined;

  const [audioEditor, setAudioEditor] = useState<AudioEditor | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load Audio automatically when contestId is available
  useEffect(() => {
    const loadAudio = async () => {
      if (!contestIdNum || !contract) return;
      try {
        const details = await contract.getContestDetails(contestIdNum);
        const musicId = details.musicID;
        console.log(musicId);
        const url = AudioMap[1]; // Assuming musicId is a number

        if (url) {
          setAudioUrl(url);
          const editor = new AudioEditor();
          await editor.loadAudio(url);
          setAudioEditor(editor);
          console.log("Audio loaded for contest:", musicId);
        } else {
          console.error("No audio file found for musicID:", musicId);
        }
      } catch (err) {
        console.error("Error loading contest audio:", err);
      }
    };

    loadAudio();
  }, [contestIdNum, contract]);

  const applyEffect = async (effectType: "scream" | "pitch" | "echo" | "noise") => {
    if (!audioEditor || !contestIdNum) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      let editedBlob: Blob | null = null;

      switch (effectType) {
        case "scream":
          editedBlob = await audioEditor.addScreamEffect(startTime, endTime);
          break;
        case "pitch":
          editedBlob = await audioEditor.changePitchSegment(startTime, endTime, 2.0);
          break;
        case "echo":
          editedBlob = await audioEditor.addEchoEffect(startTime, endTime);
          break;
        case "noise":
          editedBlob = await audioEditor.addNoise(startTime, endTime);
          break;
      }

      if (editedBlob) {
        const editedUrl = URL.createObjectURL(editedBlob);
        setAudioUrl(editedUrl);

        // 🚀 After editing, call playCard to record move on chain
        // Here cardIndex is just an example: you could design your own card mapping
        const randomCardIndex = Math.floor(Math.random() * 100); // or better, derive from effect type
        await contract.playCard(contestIdNum, 0, randomCardIndex); 
        console.log(`playCard called with index ${randomCardIndex}`);
      }
    } catch (err) {
      console.error("Failed to apply effect or playCard:", err);
    }
  };

  return (
    <main className={`flex flex-col min-h-screen p-8 ${account && 'bg-[#212121]'}`}>
      <>
        {/* <div className="text-white mb-6">Connected as: {account}</div> */}

        <div className="flex flex-col items-center gap-6">
          <h1 className="text-white text-2xl">SoundSpy 🎶 Edit & Submit</h1>

          {audioUrl ? (
            <>
              <audio ref={audioRef} controls src={audioUrl} style={{ width: '100%' }} />

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

              <div className="flex flex-wrap gap-4 mt-6">
                <button onClick={() => applyEffect('scream')} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white">
                  Strong Scream
                </button>
                <button onClick={() => applyEffect('pitch')} className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded text-white">
                  Pitch Up
                </button>
                <button onClick={() => applyEffect('echo')} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black">
                  Echo
                </button>
                <button onClick={() => applyEffect('noise')} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">
                  Add Noise
                </button>
              </div>
            </>
          ) : (
            <div className="text-white">Loading music...</div>
          )}
        </div>
      </>
    </main>
  );
}

// src/pages/PlayContest.tsx
import { useParams } from 'react-router-dom';

function PlayContest() {
  const { contestId } = useParams();
  return <h1>Play Contest {contestId}</h1>;
}
export default PlayContest;

// src/pages/ViewNFT.tsx
import { useParams } from 'react-router-dom';

function ViewNFT() {
  const { tokenId } = useParams();
  return <h1>View NFT #{tokenId}</h1>;
}
export default ViewNFT;

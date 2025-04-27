import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { ethers } from 'ethers';
import { ContractRunner } from 'ethers';
import { MusicGameContract } from '../libs/contracts/musicGamePoints';

interface EthereumContextType {
  provider: ethers.BrowserProvider | null;
  signer: ContractRunner | null;
  account: string | null;
  contract: MusicGameContract | null;
  connectWallet: () => Promise<void>;
}

const EthereumContext = createContext<EthereumContextType | undefined>(
  undefined,
);

export const EthereumProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ContractRunner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<MusicGameContract | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected!');
      return;
    }
    const ethProvider = new ethers.BrowserProvider(window.ethereum);
    await ethProvider.send('eth_requestAccounts', []);
    const ethSigner = await ethProvider.getSigner();
    const address = await ethSigner.getAddress();

    const gameContract = new MusicGameContract(ethSigner);

    setProvider(ethProvider);
    setSigner(ethSigner);
    setAccount(address);
    setContract(gameContract);
  };

  useEffect(() => {
    connectWallet().catch(console.error);
  }, []);

  return (
    <EthereumContext.Provider
      value={{ provider, signer, account, contract, connectWallet }}
    >
      {children}
    </EthereumContext.Provider>
  );
};

export const useEthereum = (): EthereumContextType => {
  const context = useContext(EthereumContext);
  if (!context) {
    throw new Error('useEthereum must be used within an EthereumProvider');
  }
  return context;
};

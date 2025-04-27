import  { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

interface EthereumContextType {
  provider: ethers.BrowserProvider | null;
  account: string | null;
  connectWallet: () => Promise<void>;
}

const EthereumContext = createContext<EthereumContextType | undefined>(undefined);

export const EthereumProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      await ethProvider.send('eth_requestAccounts', []);
      const signer = await ethProvider.getSigner();
      const address = await signer.getAddress();
      setProvider(ethProvider);
      setAccount(address);
    } else {
      console.warn('MetaMask not detected!');
    }
  };



  useEffect(() => {
    connectWallet().catch(console.error);
  }, []);


  return (
    <EthereumContext.Provider value={{ provider, account, connectWallet }}>
      {children}
    </EthereumContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEthereum = (): EthereumContextType => {
  const context = useContext(EthereumContext);
  if (!context) {
    throw new Error('useEthereum must be used within an EthereumProvider');
  }
  return context;
};

// src/hooks/useWallet.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.Signer>();
  const [address, setAddress] = useState<string>("");

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      const newProvider = new ethers.providers.Web3Provider((window as any).ethereum);
      await newProvider.send("eth_requestAccounts", []);
      const newSigner = newProvider.getSigner();
      const newAddress = await newSigner.getAddress();

      setProvider(newProvider);
      setSigner(newSigner);
      setAddress(newAddress);
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    // Optionally, auto-connect if wallet already authorized
  }, []);

  return { provider, signer, address, connectWallet };
}

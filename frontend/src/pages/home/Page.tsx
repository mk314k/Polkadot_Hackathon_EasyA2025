import ConnectWallet from '../../components/connect-wallet/ConnectWallet';
import { useEthereum } from '../../contexts/EthereumContext';

import './home.css';
import { Link } from 'react-router';

interface HomeProps {
  children?: React.ReactNode;
}

export const Home: React.FC<HomeProps> = ({ children }) => {
  const { account, connectWallet } = useEthereum();
  return (
    <main>
      <aside className="menu-bar">
        <div>
          <ul>
            {account ? (
              <>
                <Link to="/game">
                  <li className="flex items-center justify-center text-white text-[29px] w-[185px] h-[60px] rounded-[8px] border-[2px] cursor-pointer mt-[24px] hover:bg-neutral-600 transition">
                    New Game
                  </li>
                </Link>
                <li className="flex items-center justify-center text-white text-[29px] w-[185px] h-[60px] rounded-[8px] border-[2px] cursor-pointer mt-[24px] hover:bg-neutral-600 transition">
                  Join Game
                </li>
                <li className="flex items-center justify-center text-white text-[29px] w-[185px] h-[60px] rounded-[8px] border-[2px] cursor-pointer mt-[24px] hover:bg-neutral-600 transition">
                  Rules
                </li>
                <li className="flex items-center justify-center text-white text-[29px] w-[185px] h-[60px] rounded-[8px] border-[2px] cursor-pointer mt-[24px] hover:bg-neutral-600 transition">
                  Settings
                </li>
              </>
            ) : (
              <li
                onClick={connectWallet}
                className="flex items-center justify-center text-white text-[29px] min-w-[240px] h-[60px] rounded-[8px] border-[2px] cursor-pointer mt-[24px] hover:bg-neutral-600 transition"
              >
                Connect Wallet
              </li>
            )}
          </ul>
        </div>
        <div className="w-[220px]  flex items-center justify-center">
          {account && (
            <p className="font-inter font-bold text-[12px] leading-none tracking-[-0.03em] text-center text-white">
              Wallet ID: 0xB5ce6ee9E5e9d3bE7370378F789905D12CB340D1
            </p>
          )}
        </div>
      </aside>
      {children}
    </main>
  );
};

export default Home;

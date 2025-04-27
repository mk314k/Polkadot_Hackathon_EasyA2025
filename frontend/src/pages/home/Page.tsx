// import ConnectWallet from '../../components/connect-wallet/ConnectWallet';

import './home.css';
import { Link } from 'react-router';

interface HomeProps {
  children?: React.ReactNode;
  account?: string;
  connectWallet?: () => void;
}

export const Home: React.FC<HomeProps> = ({ children, account, connectWallet }) => {
  return (
    <main>
      <aside className="menu-bar">
        <div>
          <ul>
            {account ? (
              <>
                <Link to="/createContest">
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
      </aside>
      {children}
    </main>
  );
};

export default Home;

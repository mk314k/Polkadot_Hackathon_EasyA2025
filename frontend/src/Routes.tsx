import App from './App';
import { basePath, routes } from './constants/routes';
import Game from './pages/game/Page';
import Home from './pages/home/Page';

export const ROUTE_CONFIG = [
  {
    path: basePath,
    element: <App />,
    errorElement: <div>Error Page</div>,
  },
  {
    path: routes.home.path,
    element: <Home />,
    errorElement: <div>Error Page</div>,
  },
  {
    path: routes.game.path,
    element: <Game />,
    errorElement: <div>Error Page</div>,
  },
];

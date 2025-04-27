import { routes, basePath } from './constants/routes';
import Game from './pages/game/Page';

export const ROUTE_CONFIG = [
  {
    path: basePath,
    errorElement: <div>Error Page</div>,
  },
  {
    path: routes.game.path,
    element: <Game />,
    errorElement: <div>Error Page</div>,
  },
];

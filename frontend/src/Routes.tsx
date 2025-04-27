import App from './App';
import { basePath, routes } from './constants/routes';
import Home from './features/home/Page';

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
];

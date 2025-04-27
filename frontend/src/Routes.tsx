import {routes} from './constants/routes'
import Game from './pages/game/Page'
import Home from './pages/Home/Page'

export const ROUTE_CONFIG = [
    {
        path: routes.home.path,
        element: <Home/>,
        errorElement: <div>Error Page</div>,
    },
    {
        path: routes.game.path,
        element: <Game/>,
        errorElement: <div>Error Page</div>,
    }
]
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ROUTE_CONFIG } from './Routes.tsx'
import App from './App.tsx'
import {  createBrowserRouter, RouterProvider } from "react-router";
import { EthereumProvider } from './contexts/EthereumContext.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <EthereumProvider>
      <App />
    </EthereumProvider>
    <RouterProvider router={createBrowserRouter(ROUTE_CONFIG)} />
  </StrictMode>,
)

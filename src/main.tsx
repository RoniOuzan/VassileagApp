import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SocketProvider } from './context/SocketContext.tsx'
import { LigueProvider } from './context/LigueContext.tsx'
import { PlayerListProvider } from './context/PlayerListContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <LigueProvider>
        <PlayerListProvider>
          <App />
        </PlayerListProvider>
      </LigueProvider>
    </SocketProvider>
  </StrictMode>,
)

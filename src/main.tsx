import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SocketProvider } from './context/SocketContext.tsx'
import { LigueProvider } from './context/LigueContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <LigueProvider>
        <App />
      </LigueProvider>
    </SocketProvider>
  </StrictMode>,
)

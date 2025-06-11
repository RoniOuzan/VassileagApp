import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LeagueProvider } from './context/LeagueContext.tsx'
import { AnimationOriginProvider } from './context/AnimationOriginContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnimationOriginProvider>
      <LeagueProvider>
        <App />
      </LeagueProvider>
    </AnimationOriginProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LigueProvider } from './context/LigueContext.tsx'
import { AnimationOriginProvider } from './context/AnimationOriginContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnimationOriginProvider>
      <LigueProvider>
        <App />
      </LigueProvider>
    </AnimationOriginProvider>
  </StrictMode>,
)

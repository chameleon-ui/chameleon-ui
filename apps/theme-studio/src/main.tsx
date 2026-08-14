import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

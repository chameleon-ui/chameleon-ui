import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
import { App } from './App'
import './App.css'

const rootElement = document.querySelector<HTMLDivElement>('#root')

if (!rootElement) {
  throw new Error('Market app cannot start: missing #root mount element in index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@chameleon-ui/tokens/css'
import { App } from './App'
import './styles.css'

const rootElement = document.querySelector<HTMLDivElement>('#root')

if (!rootElement) {
  throw new Error('Ark UI POC cannot start: missing #root mount element in index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

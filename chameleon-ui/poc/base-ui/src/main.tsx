import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
import { App } from './App'
import './styles.css'

const rootElement = document.querySelector<HTMLDivElement>('#root')

if (!rootElement) {
  throw new Error('Base UI POC mount failed: #root was not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

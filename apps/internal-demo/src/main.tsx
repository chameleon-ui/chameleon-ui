import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
import { App } from './App'
import { installThemeStyles } from './theme'

installThemeStyles()

const rootElement = document.querySelector<HTMLDivElement>('#root')

if (!rootElement) {
  throw new Error('Inner demo cannot start: missing #root mount element in index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

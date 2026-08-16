import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@chameleon-ui/react'
import '@chameleon-ui/react/css'
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider locale="zh-CN" theme="linear">
      <App />
    </ThemeProvider>
  </StrictMode>,
)

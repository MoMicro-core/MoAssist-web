import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { WebSocketProvider } from './context/WebSocketContext'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider } from './context/I18nContext'

const root = createRoot(document.getElementById('root'))

root.render(
  <BrowserRouter>
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <WebSocketProvider>
            <App />
            <Analytics />
            <SpeedInsights />
          </WebSocketProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </BrowserRouter>,
)

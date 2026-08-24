import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import App from './App'
import './index.css'
import { loadSiteContent } from './content/site'
import { AuthProvider } from './context/AuthContext'
import { WebSocketProvider } from './context/WebSocketContext'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider } from './context/I18nContext'

const root = createRoot(document.getElementById('root'))

// Preload the locale chunk for the URL we are on before the first paint, so a
// non-English visitor never sees a flash of English copy.
const localeFromPath = window.location.pathname.split('/')[1] || 'en'

loadSiteContent(localeFromPath).finally(() =>
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
  ),
)

import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Loading } from './components/Loading'
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout'
import { ChatbotLayout } from './layouts/ChatbotLayout'
import { Chatbots } from './pages/Chatbots'
import { Login } from './pages/Login'
import { Profile } from './pages/Profile'
import { Support } from './pages/Support'
import { ChatbotDashboard } from './pages/ChatbotDashboard'
import { ChatbotChats } from './pages/ChatbotChats'
import { ChatbotSettings } from './pages/ChatbotSettings'
import { ChatbotPlugin } from './pages/ChatbotPlugin'
import { NotFound } from './pages/NotFound'
import { Chats } from './pages/Chats'
import { Billings } from './pages/Billings'

const RequireAuth = ({ children }) => {
  const { user, ready } = useAuth()
  if (!ready) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <AuthenticatedLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/chatbots" replace />} />
        <Route path="/chatbots" element={<Chatbots />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/billings" element={<Billings />} />
        <Route path="/chatbots/:chatbotId" element={<ChatbotLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ChatbotDashboard />} />
          <Route path="chats" element={<ChatbotChats />} />
          <Route path="settings" element={<ChatbotSettings />} />
          <Route path="plugin" element={<ChatbotPlugin />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

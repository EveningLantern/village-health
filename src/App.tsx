// eveninglantern/village-health/village-health-7c742f2974dcfe894d5504f48754dfa94b0b8035/src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import VillagerDashboard from './components/Dashboards/VillagerDashboard'
import DoctorDashboard from './components/Dashboards/DoctorDashboard'
import AdminDashboard from './components/Dashboards/AdminDashboard'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Chat from './components/Communication/Chat'
// Add new import for LandingPage
import LandingPage from './components/LandingPage'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          {/* Set the root path to the new LandingPage */}
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Original line <Route path="/" element={<Navigate to="/login" replace />} /> is removed/replaced */}
          
          <Route element={<Layout />}>
            <Route 
              path="/chat/:consultationId" 
              element={
                <ProtectedRoute allowedRoles={['villager','doctor']}>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/villager/*" 
              element={
                <ProtectedRoute allowedRoles={['villager']}>
                  <VillagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/*" 
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
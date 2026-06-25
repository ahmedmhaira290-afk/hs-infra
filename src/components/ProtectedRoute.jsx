import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canAccessRoute } from '../config/permissions'

export default function ProtectedRoute({ children, route }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (route && !canAccessRoute(user.role, route)) return <Navigate to="/dashboard" replace />
  return children
}

import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ProtectedRoute({ role }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return <Outlet />
}

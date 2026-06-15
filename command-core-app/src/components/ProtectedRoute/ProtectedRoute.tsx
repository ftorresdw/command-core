import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import styles from './ProtectedRoute.module.css'

export function ProtectedRoute() {
  const { user, isLoading, authRequired } = useAuth()

  if (!authRequired) {
    return <Outlet />
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} aria-hidden="true" />
        <span>Loading…</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

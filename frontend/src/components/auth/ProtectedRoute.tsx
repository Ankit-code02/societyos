import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export function ProtectedRoute() {
  const location = useLocation()

  const {
    user,
    loading,
  } = useAuth()

  const accessToken = localStorage.getItem(
    'societyos_access_token',
  )

  const refreshToken = localStorage.getItem(
    'societyos_refresh_token',
  )

  if (!accessToken && !refreshToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-ivory-100)]">
        <p className="text-sm text-[var(--color-ink-500)]">
          Loading...
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
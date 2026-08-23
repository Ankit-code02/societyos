import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import type { SocietyRole } from '../../types/auth'

interface RoleRouteProps {
  allowedRoles: SocietyRole[]
}

export function RoleRoute({
  allowedRoles,
}: RoleRouteProps) {
  const location = useLocation()
  const { user, loading } = useAuth()

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

  if (!user.role || !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  if (
    user.role === 'SOCIETY_ADMIN' &&
    user.societyVerificationStatus &&
    user.societyVerificationStatus !== 'APPROVED'
  ) {
    return (
      <Navigate
        to="/onboarding/society/pending"
        replace
        state={{
          societyId: user.societyId,
          verificationStatus:
            user.societyVerificationStatus,
        }}
      />
    )
  }

  return <Outlet />
}
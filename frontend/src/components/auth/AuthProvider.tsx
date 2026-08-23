import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import { getAuthContext } from '../../services/api/authApi'
import type { AuthContext } from '../../types/auth'

interface AuthState {
  user: AuthContext | null
  loading: boolean
  refreshAuth: () => Promise<AuthContext | null>
  clearAuth: () => void
}

const AuthContext = createContext<AuthState | undefined>(
  undefined,
)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthContext | null>(null)
  const [loading, setLoading] = useState(true)

  async function refreshAuth(): Promise<AuthContext | null> {
    const accessToken = localStorage.getItem(
      'societyos_access_token',
    )

    const refreshToken = localStorage.getItem(
      'societyos_refresh_token',
    )

    if (!accessToken && !refreshToken) {
      setUser(null)
      setLoading(false)
      return null
    }

    try {
      const context = await getAuthContext()

      setUser(context)

      return context
    } catch {
      setUser(null)

      return null
    } finally {
      setLoading(false)
    }
  }

  function clearAuth() {
    setUser(null)
  }

  useEffect(() => {
    void refreshAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshAuth,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    )
  }

  return context
}
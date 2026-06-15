import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEV_USER, isAuthRequired } from './env'

export type AuthUser = {
  name: string
  email: string
  picture: string
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  authRequired: boolean
  signIn: (credential: string) => void
  signOut: () => void
}

const STORAGE_KEY = 'command-core-auth-user'

const AuthContext = createContext<AuthContextValue | null>(null)

function parseGoogleCredential(credential: string): AuthUser {
  const payload = credential.split('.')[1]
  const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as {
    name?: string
    email?: string
    picture?: string
  }

  return {
    name: decoded.name ?? 'User',
    email: decoded.email ?? '',
    picture: decoded.picture ?? '',
  }
}

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider(props: { children: ReactNode }) {
  const authRequired = isAuthRequired()

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (!authRequired) return DEV_USER
    return readStoredUser()
  })
  const [isLoading, setIsLoading] = useState(authRequired)

  useEffect(() => {
    if (!authRequired) {
      setUser(DEV_USER)
      setIsLoading(false)
      return
    }

    setUser(readStoredUser())
    setIsLoading(false)
  }, [authRequired])

  const signIn = useCallback((credential: string) => {
    const nextUser = parseGoogleCredential(credential)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const signOut = useCallback(() => {
    if (!authRequired) return
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [authRequired])

  const value = useMemo(
    () => ({ user, isLoading, authRequired, signIn, signOut }),
    [user, isLoading, authRequired, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

import type { AuthUser } from './AuthContext'

export const PRODUCTION_HOST = 'core.digitalweave.tech'

export const DEV_USER: AuthUser = {
  name: 'Local Dev',
  email: 'dev@localhost',
  picture: '',
}

export function isLocalDevelopment(): boolean {
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
}

export function isAuthRequired(): boolean {
  return !isLocalDevelopment()
}

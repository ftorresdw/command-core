const CLIENT_ID_PATTERN = /^\d+-[\w-]+\.apps\.googleusercontent\.com$/

export function getGoogleClientId(): string {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim()
}

export function isGoogleClientIdConfigured(clientId = getGoogleClientId()): boolean {
  if (!clientId) return false
  if (clientId.includes('your-google-oauth-client-id')) return false
  return CLIENT_ID_PATTERN.test(clientId)
}

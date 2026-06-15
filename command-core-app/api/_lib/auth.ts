export function getApiSecret(): string {
  return (process.env.LEADS_API_SECRET ?? '').trim()
}

export function isAuthorized(req: { headers: Record<string, string | string[] | undefined> }): boolean {
  const secret = getApiSecret()
  if (!secret) return false

  const apiKey = req.headers['x-api-key']
  if (typeof apiKey === 'string' && apiKey === secret) return true

  const auth = req.headers.authorization
  if (typeof auth === 'string' && auth === `Bearer ${secret}`) return true

  return false
}

const ALLOWED_ORIGINS = [
  'https://core.digitalweave.tech',
  'https://digital-weave.vercel.app',
  'https://digitalweave.tech',
  'https://www.digitalweave.tech',
  'http://localhost:5173',
  'http://localhost:3000',
]

export function applyCors(req: { headers: Record<string, string | string[] | undefined> }, res: { setHeader: (name: string, value: string) => void }) {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : ''
  const allowed = ALLOWED_ORIGINS.includes(origin)

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')
  res.setHeader('Vary', 'Origin')
}

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false
  return ALLOWED_ORIGINS.includes(origin)
}

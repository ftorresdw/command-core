import type { VercelRequest, VercelResponse } from '@vercel/node'

const WEBSITE_ORIGINS = new Set([
  'https://digitalweave.tech',
  'https://www.digitalweave.tech',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

const CRM_ORIGINS = new Set([
  'https://core.digitalweave.tech',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
])

export function getBearerToken(req: VercelRequest): string | null {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length).trim()
}

export function getApiKeyHeader(req: VercelRequest): string | null {
  const header = req.headers['x-api-key']
  if (typeof header === 'string' && header.trim()) return header.trim()
  return getBearerToken(req)
}

export function isWebsiteOrigin(origin: string | undefined): boolean {
  return Boolean(origin && WEBSITE_ORIGINS.has(origin))
}

export function isCrmOrigin(origin: string | undefined): boolean {
  if (!origin) return true
  return CRM_ORIGINS.has(origin)
}

export function setCorsHeaders(
  res: VercelResponse,
  origin: string | undefined,
  allowedOrigins: Set<string>,
): void {
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-api-key')
}

export function json(res: VercelResponse, status: number, body: unknown): void {
  res.status(status).json(body)
}

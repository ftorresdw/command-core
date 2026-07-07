import type { VercelRequest, VercelResponse } from '@vercel/node'
import { leadFromManualInput, leadFromWebsiteInput } from '../_lib/lead.js'
import { appendLead, LeadsStorageError, readLeads } from '../_lib/leadsStore.js'
import {
  getApiKeyHeader,
  isCrmOrigin,
  json,
  setCorsHeaders,
} from '../_lib/http.js'
import { notifyNewWebsiteLead } from '../_lib/notifyLead.js'
import { parseManualLeadInput, parseWebsiteLeadInput } from '../_lib/validate.js'

const WEBSITE_ORIGINS = new Set([
  'https://digital-weave.vercel.app',
  'https://digitalweave.tech',
  'https://www.digitalweave.tech',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

function getApiKey(): string | undefined {
  return process.env.LEADS_API_SECRET ?? process.env.LEADS_API_KEY
}

function authorizeWebsite(req: VercelRequest): boolean {
  const apiKey = getApiKey()
  if (!apiKey) return false
  return getApiKeyHeader(req) === apiKey
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const origin = req.headers.origin

    if (req.method === 'OPTIONS') {
      setCorsHeaders(res, origin, WEBSITE_ORIGINS)
      res.status(204).end()
      return
    }

    if (req.method === 'GET') {
      if (!isCrmOrigin(origin)) {
        json(res, 403, { error: 'Forbidden.' })
        return
      }

      try {
        const leads = await readLeads()
        json(res, 200, { leads })
      } catch (error) {
        const message =
          error instanceof LeadsStorageError ? error.message : 'Failed to load leads.'
        json(res, 503, { error: message })
      }
      return
    }

    if (req.method === 'POST') {
      const channel = typeof req.query.channel === 'string' ? req.query.channel : 'website'

      if (channel === 'manual') {
        if (!isCrmOrigin(origin)) {
          json(res, 403, { error: 'Forbidden.' })
          return
        }

        const parsed = parseManualLeadInput(req.body)
        if (!parsed.ok) {
          json(res, 400, { error: parsed.error })
          return
        }

        try {
          const existing = await readLeads()
          const lead = leadFromManualInput(parsed.value, existing)
          const saved = await appendLead(lead)
          json(res, 201, { lead: saved })
        } catch (error) {
          const message =
            error instanceof LeadsStorageError ? error.message : 'Failed to save lead.'
          json(res, 503, { error: message })
        }
        return
      }

      setCorsHeaders(res, origin, WEBSITE_ORIGINS)

      if (!authorizeWebsite(req)) {
        json(res, 401, { error: 'Unauthorized.' })
        return
      }

      const parsed = parseWebsiteLeadInput(req.body)
      if (!parsed.ok) {
        json(res, 400, { error: parsed.error })
        return
      }

      try {
        const existing = await readLeads()
        const lead = leadFromWebsiteInput(parsed.value, existing)
        const saved = await appendLead(lead)
        void notifyNewWebsiteLead(saved)
        json(res, 201, { lead: { id: saved.id } })
      } catch (error) {
        const message =
          error instanceof LeadsStorageError ? error.message : 'Failed to save lead.'
        json(res, 503, { error: message })
      }
      return
    }

    json(res, 405, { error: 'Method not allowed.' })
  } catch (error) {
    console.error('Unhandled /api/leads error:', error)
    json(res, 500, { error: 'Internal server error.' })
  }
}

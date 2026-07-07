import type { VercelRequest, VercelResponse } from '@vercel/node'
import { LEAD_STATUS_OPTIONS } from './_lib/lead.js'
import { deleteLead, LeadsStorageError, updateLeadStatus } from './_lib/leadsStore.js'
import { isCrmOrigin, json } from './_lib/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const origin = req.headers.origin

    if (!isCrmOrigin(origin)) {
      json(res, 403, { error: 'Forbidden.' })
      return
    }

    const id = typeof req.query.id === 'string' ? req.query.id : ''
    if (!id) {
      json(res, 400, { error: 'Lead id is required.' })
      return
    }

    if (req.method === 'PATCH') {
      const body = req.body as { status?: string }
      const status = typeof body?.status === 'string' ? body.status : ''

      if (!LEAD_STATUS_OPTIONS.includes(status as (typeof LEAD_STATUS_OPTIONS)[number])) {
        json(res, 400, { error: 'status is invalid.' })
        return
      }

      try {
        const lead = await updateLeadStatus(id, status as (typeof LEAD_STATUS_OPTIONS)[number])
        json(res, 200, { lead })
      } catch (error) {
        const message =
          error instanceof LeadsStorageError ? error.message : 'Failed to update lead.'
        json(res, 503, { error: message })
      }
      return
    }

    if (req.method === 'DELETE') {
      try {
        await deleteLead(id)
        json(res, 200, { ok: true })
      } catch (error) {
        const message =
          error instanceof LeadsStorageError ? error.message : 'Failed to delete lead.'
        json(res, 503, { error: message })
      }
      return
    }

    json(res, 405, { error: 'Method not allowed.' })
  } catch (error) {
    console.error('Unhandled /api/leads/[id] error:', error)
    json(res, 500, { error: 'Internal server error.' })
  }
}

import type { ManualLeadInput, WebsiteLeadInput } from '../../lib/lead'
import { LEAD_STATUS_OPTIONS, LEAD_TYPE_OPTIONS } from '../../lib/lead'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function parseWebsiteLeadInput(body: unknown):
  | { ok: true; value: WebsiteLeadInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object.' }
  }

  const record = body as Record<string, unknown>
  const name = typeof record.name === 'string' ? record.name.trim() : ''
  const email = typeof record.email === 'string' ? record.email.trim() : ''
  const message = typeof record.message === 'string' ? record.message.trim() : ''

  if (!name) return { ok: false, error: 'name is required.' }
  if (!email) return { ok: false, error: 'email is required.' }
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: 'email is invalid.' }
  if (!message) return { ok: false, error: 'message is required.' }
  if (typeof record.marketingOptIn !== 'boolean') {
    return { ok: false, error: 'marketingOptIn must be a boolean.' }
  }

  return {
    ok: true,
    value: {
      name,
      email,
      company: typeof record.company === 'string' ? record.company : '',
      service: typeof record.service === 'string' ? record.service : '',
      message,
      marketingOptIn: record.marketingOptIn,
    },
  }
}

export function parseManualLeadInput(body: unknown):
  | { ok: true; value: ManualLeadInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object.' }
  }

  const record = body as Record<string, unknown>
  const name = typeof record.name === 'string' ? record.name.trim() : ''
  const company = typeof record.company === 'string' ? record.company.trim() : ''
  const service = typeof record.service === 'string' ? record.service.trim() : ''
  const status = typeof record.status === 'string' ? record.status : ''
  const leadType = typeof record.leadType === 'string' ? record.leadType : ''
  const email = typeof record.email === 'string' ? record.email.trim() : ''
  const message = typeof record.message === 'string' ? record.message : ''

  if (!name) return { ok: false, error: 'name is required.' }
  if (!company) return { ok: false, error: 'company is required.' }
  if (!service) return { ok: false, error: 'service is required.' }
  if (!LEAD_STATUS_OPTIONS.includes(status as ManualLeadInput['status'])) {
    return { ok: false, error: 'status is invalid.' }
  }
  if (!LEAD_TYPE_OPTIONS.includes(leadType as (typeof LEAD_TYPE_OPTIONS)[number])) {
    return { ok: false, error: 'leadType is invalid.' }
  }
  if (email && !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'email is invalid.' }
  }

  return {
    ok: true,
    value: {
      name,
      email: email || undefined,
      company,
      service,
      message: message || undefined,
      status: status as ManualLeadInput['status'],
      leadType,
      marketingOptIn:
        typeof record.marketingOptIn === 'boolean' ? record.marketingOptIn : false,
    },
  }
}

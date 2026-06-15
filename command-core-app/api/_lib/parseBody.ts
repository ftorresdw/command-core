import type { VercelRequest } from '@vercel/node'

function asString(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

function asBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes'
  }
  return false
}

export type ParsedLeadBody = {
  name: string
  email: string
  company: string
  service: string
  message: string
  marketingOptIn: boolean
  status: string
  projectType: string
  leadType: string
  channel: 'Manual' | 'Website'
}

export async function parseLeadBody(req: VercelRequest): Promise<ParsedLeadBody> {
  const source = (req.body ?? {}) as Record<string, unknown>

  const name = asString(source.name ?? source.contactName ?? source.contact)
  const email = asString(source.email ?? source.contactEmail)
  const company = asString(source.company ?? source.companyName)
  const service = asString(
    source.service ?? source.serviceInterestedIn ?? source.projectType ?? source.project_type,
  )
  const message = asString(source.message)
  const marketingOptIn = asBoolean(source.marketingOptIn ?? source.marketing_opt_in ?? source.updatesOptIn)
  const status = asString(source.status) || 'New'
  const projectType = service || asString(source.projectType ?? source.project_type) || 'Other'
  const leadType = asString(source.leadType ?? source.lead_type) || 'Inbound'
  const channelRaw = asString(source.channel)
  const channel = channelRaw === 'Manual' ? 'Manual' : 'Website'

  return {
    name,
    email,
    company,
    service,
    message,
    marketingOptIn,
    status,
    projectType,
    leadType,
    channel,
  }
}

export function validateWebsiteLead(body: ParsedLeadBody): string | null {
  if (!body.name) return 'name is required'
  if (!body.email) return 'email is required'
  if (!body.message) return 'message is required'
  if (!body.email.includes('@')) return 'email must be valid'
  return null
}

export function validateManualLead(body: ParsedLeadBody): string | null {
  if (!body.name) return 'contact name is required'
  if (!body.company) return 'company is required'
  return null
}

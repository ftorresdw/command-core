export type LeadChannel = 'Manual' | 'Website'

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed'

export type Lead = {
  id: string
  name: string
  email: string
  company: string
  service: string
  message: string
  marketingOptIn: boolean
  status: LeadStatus
  leadType: string
  channel: LeadChannel
  createdAt: string
}

/** Payload from the Digital Weave website contact form. */
export type WebsiteLeadInput = {
  name: string
  email: string
  company?: string
  service?: string
  message: string
  marketingOptIn: boolean
}

/** Payload when staff add a lead manually in Command Core. */
export type ManualLeadInput = {
  name: string
  email?: string
  company: string
  service: string
  message?: string
  status: LeadStatus
  leadType: string
  marketingOptIn?: boolean
}

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal',
  'Closed',
]

export const SERVICE_OPTIONS = [
  'AI Consulting & Implementation',
  'Fractional CTO Services',
  'Technology Consulting',
  'Website Development',
  'Software & App Development',
  'Managed IT Services',
  'Other',
] as const

export const LEAD_TYPE_OPTIONS = ['Inbound', 'Outbound', 'Referral', 'Partner', 'Other'] as const

export function nextLeadId(leads: Lead[]): string {
  const max = leads.reduce((current, lead) => {
    const numeric = Number(lead.id.replace('L-', ''))
    return Number.isFinite(numeric) ? Math.max(current, numeric) : current
  }, 1000)
  return `L-${max + 1}`
}

export function leadFromWebsiteInput(input: WebsiteLeadInput, leads: Lead[]): Lead {
  const now = new Date().toISOString()
  return {
    id: nextLeadId(leads),
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company?.trim() ?? '',
    service: input.service?.trim() ?? '',
    message: input.message.trim(),
    marketingOptIn: Boolean(input.marketingOptIn),
    status: 'New',
    leadType: 'Inbound',
    channel: 'Website',
    createdAt: now,
  }
}

export function leadFromManualInput(input: ManualLeadInput, leads: Lead[]): Lead {
  const now = new Date().toISOString()
  return {
    id: nextLeadId(leads),
    name: input.name.trim(),
    email: input.email?.trim() ?? '',
    company: input.company.trim(),
    service: input.service.trim(),
    message: input.message?.trim() ?? '',
    marketingOptIn: Boolean(input.marketingOptIn),
    status: input.status,
    leadType: input.leadType,
    channel: 'Manual',
    createdAt: now,
  }
}

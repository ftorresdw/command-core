export type LeadChannel = 'Manual' | 'Website'

export type Lead = {
  id: string
  company: string
  contactName: string
  contactEmail: string
  status: string
  projectType: string
  leadType: string
  channel: LeadChannel
  message?: string | null
  marketingOptIn?: boolean
  createdAt?: string
}

export type LeadFormState = {
  company: string
  contact: string
  status: string
  projectType: string
  leadType: string
}

/** Payload from https://digital-weave.vercel.app/contact */
export type WebsiteLeadPayload = {
  name: string
  email: string
  company?: string
  service?: string
  message: string
  marketingOptIn?: boolean
}

export type CreateManualLeadPayload = {
  company: string
  contactName: string
  contactEmail?: string
  status: string
  projectType: string
  leadType: string
}

export const STATUS_OPTIONS = ['New', 'Contacted', 'Negotiation'] as const

export const PROJECT_TYPE_OPTIONS = [
  'AI Consulting & Implementation',
  'Fractional CTO Services',
  'Technology Consulting',
  'Website Development',
  'Software & App Development',
  'Managed IT Services',
  'Website',
  'IT Support',
  'Consulting',
  'Managed Services',
  'Other',
] as const

export const LEAD_TYPE_OPTIONS = ['Inbound', 'Outbound', 'Referral', 'Partner', 'Other'] as const

export const WEBSITE_SERVICE_OPTIONS = [
  'AI Consulting & Implementation',
  'Fractional CTO Services',
  'Technology Consulting',
  'Website Development',
  'Software & App Development',
  'Managed IT Services',
  'Other',
] as const

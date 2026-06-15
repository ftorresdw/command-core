import type { Lead } from '../../lib/lead'
import type { LeadFormState } from '../types/lead'

export async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch('/api/leads')

  const payload = (await response.json()) as { leads?: Lead[]; error?: string }
  if (!response.ok) {
    throw new Error(payload.error ?? `Request failed (${response.status})`)
  }

  return payload.leads ?? []
}

export async function createManualLead(form: LeadFormState): Promise<Lead> {
  const response = await fetch('/api/leads?channel=manual', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: form.contact,
      company: form.company,
      service: form.projectType,
      status: form.status,
      leadType: form.leadType,
      marketingOptIn: false,
    }),
  })

  const payload = (await response.json()) as { lead?: Lead; error?: string }
  if (!response.ok || !payload.lead) {
    throw new Error(payload.error ?? `Request failed (${response.status})`)
  }

  return payload.lead
}

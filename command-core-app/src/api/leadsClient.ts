import type { Lead, LeadFormState } from '../types/lead'

const apiSecret = import.meta.env.VITE_LEADS_API_SECRET ?? ''

function authHeaders(): HeadersInit {
  if (!apiSecret) return {}
  return { 'x-api-key': apiSecret }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { error?: string }
  if (!response.ok) {
    throw new Error(payload.error ?? `Request failed (${response.status})`)
  }
  return payload
}

export async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch('/api/leads', {
    headers: {
      ...authHeaders(),
    },
  })

  const payload = await parseResponse<{ leads: Lead[] }>(response)
  return payload.leads
}

export async function createManualLead(form: LeadFormState): Promise<Lead> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({
      name: form.contact,
      email: '',
      company: form.company,
      status: form.status,
      projectType: form.projectType,
      leadType: form.leadType,
      channel: 'Manual',
    }),
  })

  const payload = await parseResponse<{ lead: Lead }>(response)
  return payload.lead
}

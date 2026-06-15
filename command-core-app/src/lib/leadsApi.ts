import type { Lead, LeadStatus, ManualLeadInput } from '../../lib/lead'

type LeadsResponse = {
  leads: Lead[]
}

type LeadResponse = {
  lead: Lead
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string }
    return body.error ?? `Request failed (${response.status})`
  } catch {
    return `Request failed (${response.status})`
  }
}

export async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch('/api/leads')
  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const body = (await response.json()) as LeadsResponse
  return body.leads
}

export async function createManualLead(input: ManualLeadInput): Promise<Lead> {
  const response = await fetch('/api/leads?channel=manual', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const body = (await response.json()) as LeadResponse
  return body.lead
}

export type { Lead, LeadStatus, ManualLeadInput }

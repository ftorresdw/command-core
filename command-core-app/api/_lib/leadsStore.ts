import { kv } from '@vercel/kv'
import type { Lead } from '../../lib/lead'

const LEADS_KEY = 'command-core:leads'

export async function readLeads(): Promise<Lead[]> {
  const leads = await kv.get<Lead[]>(LEADS_KEY)
  return leads ?? []
}

export async function writeLeads(leads: Lead[]): Promise<void> {
  await kv.set(LEADS_KEY, leads)
}

export async function appendLead(lead: Lead): Promise<Lead> {
  const leads = await readLeads()
  const next = [lead, ...leads]
  await writeLeads(next)
  return lead
}

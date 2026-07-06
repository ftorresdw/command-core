import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Lead } from './lead.js'

type LeadRow = {
  id: string
  name: string
  email: string
  company: string
  service: string
  message: string
  marketing_opt_in: boolean
  status: string
  lead_type: string
  channel: 'Manual' | 'Website'
  created_at: string
}

export class LeadsStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LeadsStorageError'
  }
}

function mapRow(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    service: row.service,
    message: row.message,
    marketingOptIn: row.marketing_opt_in,
    status: row.status as Lead['status'],
    leadType: row.lead_type,
    channel: row.channel,
    createdAt: row.created_at,
  }
}

function mapLead(lead: Lead): LeadRow {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    service: lead.service,
    message: lead.message,
    marketing_opt_in: lead.marketingOptIn,
    status: lead.status,
    lead_type: lead.leadType,
    channel: lead.channel,
    created_at: lead.createdAt,
  }
}

function getSupabaseConfig(): { url: string; key: string } {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim() ?? ''
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_KEY
  )?.trim() ?? ''

  if (!url || !key) {
    const missing = [
      !url ? 'SUPABASE_URL' : null,
      !key ? 'SUPABASE_SERVICE_ROLE_KEY' : null,
    ].filter(Boolean)

    throw new LeadsStorageError(
      `Supabase is not configured. Missing in Vercel: ${missing.join(', ')}. ` +
        'Add them under Settings → Environment Variables (Production), then redeploy.',
    )
  }

  return { url, key }
}

function getSupabase(): SupabaseClient {
  const { url, key } = getSupabaseConfig()

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function readLeads(): Promise<Lead[]> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new LeadsStorageError(error.message)
  }

  return (data as LeadRow[]).map(mapRow)
}

export async function appendLead(lead: Lead): Promise<Lead> {
  const supabase = getSupabase()
  const row = mapLead(lead)

  const { data, error } = await supabase.from('leads').insert(row).select('*').single()

  if (error) {
    throw new LeadsStorageError(error.message)
  }

  return mapRow(data as LeadRow)
}

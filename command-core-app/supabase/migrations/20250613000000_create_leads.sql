create table if not exists public.leads (
  id text primary key,
  company text not null default '',
  contact_name text not null,
  contact_email text not null default '',
  status text not null default 'New',
  project_type text not null default 'Other',
  lead_type text not null default 'Inbound',
  channel text not null default 'Website' check (channel in ('Manual', 'Website')),
  message text,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_channel_idx on public.leads (channel);

alter table public.leads enable row level security;

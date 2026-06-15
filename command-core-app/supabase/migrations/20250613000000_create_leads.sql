create table if not exists public.leads (
  id text primary key,
  name text not null,
  email text not null default '',
  company text not null default '',
  service text not null default 'Other',
  message text not null default '',
  marketing_opt_in boolean not null default false,
  status text not null default 'New',
  lead_type text not null default 'Inbound',
  channel text not null default 'Website' check (channel in ('Manual', 'Website')),
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_channel_idx on public.leads (channel);

alter table public.leads enable row level security;

create extension if not exists pgcrypto;
create table if not exists public.leads (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 full_name text not null check (char_length(full_name) between 1 and 120),
 address text,
 email text,
 phone text,
 working_with_agent text check (working_with_agent in ('Yes','No') or working_with_agent is null),
 current_needs text[] not null default '{}',
 notes text,
 source text not null default 'direct',
 consent_to_contact boolean not null default false,
 user_agent text
);
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant insert on public.leads to anon;
grant select on public.leads to authenticated;
create policy "public may submit leads" on public.leads for insert to anon with check (consent_to_contact = true);
create policy "authorized owner may read leads" on public.leads for select to authenticated using (auth.jwt() ->> 'email' in ('YOUR_EMAIL@example.com'));

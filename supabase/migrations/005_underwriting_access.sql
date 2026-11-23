-- Server-only documents and an atomic login limit shared by serverless instances.
create table if not exists public.underwriting_login_attempts (
  key_hash text primary key,
  attempts integer not null,
  window_started_at timestamptz not null default now()
);
alter table public.underwriting_login_attempts enable row level security;
revoke all on public.underwriting_login_attempts from anon, authenticated;

create or replace function public.consume_underwriting_login_attempt(p_key text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  current_attempt public.underwriting_login_attempts;
begin
  if p_key !~ '^[a-f0-9]{64}$' then raise exception 'Invalid rate limit key'; end if;
  delete from public.underwriting_login_attempts where window_started_at < now() - interval '1 day';
  insert into public.underwriting_login_attempts as existing (key_hash, attempts, window_started_at)
  values (p_key, 1, now())
  on conflict (key_hash) do update set
    attempts = case when existing.window_started_at <= now() - interval '15 minutes' then 1 else least(existing.attempts + 1, 11) end,
    window_started_at = case when existing.window_started_at <= now() - interval '15 minutes' then now() else existing.window_started_at end
  returning * into current_attempt;
  return jsonb_build_object(
    'allowed', current_attempt.attempts <= 10,
    'retry_after', greatest(1, ceil(extract(epoch from current_attempt.window_started_at + interval '15 minutes' - now())))
  );
end;
$$;
revoke all on function public.consume_underwriting_login_attempt(text) from public, anon, authenticated;
grant execute on function public.consume_underwriting_login_attempt(text) to service_role;

alter table public.clinic_onboardings add column if not exists underwriting_dossier jsonb;
drop policy if exists server_managed_underwriting_dossier on public.clinic_onboardings;
create policy server_managed_underwriting_dossier on public.clinic_onboardings as restrictive for insert to anon, authenticated
with check (underwriting_dossier is null);

-- Restrictive SELECT policy also blocks anonymous reads allowed by older permissive policies.
drop policy if exists private_clinic_documents on storage.objects;
create policy private_clinic_documents on storage.objects as restrictive for select to anon, authenticated
using (bucket_id <> 'clinic-documents');

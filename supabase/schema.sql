-- ============================================================================
-- MARVEL TRACKER — tabella dei dati personali su Supabase
-- Da eseguire UNA VOLTA: dashboard Supabase → SQL Editor → New query →
-- incolla tutto questo file → Run.
--
-- Una riga per utente: dentro "data" c'è lo stesso oggetto che l'app salvava
-- nel browser ({ seen, rating, eps }). Le regole RLS (Row Level Security)
-- fanno sì che ogni utente possa leggere e scrivere SOLO la propria riga.
-- ============================================================================

create table if not exists public.progress (
  -- id dell'utente (lo stesso di auth.users); se l'account viene cancellato
  -- spariscono anche i suoi dati
  user_id    uuid primary key references auth.users (id) on delete cascade,
  -- visti, voti ed episodi
  data       jsonb not null default '{"seen":{},"rating":{},"eps":{}}'::jsonb,
  -- ultimo salvataggio (utile per controllare dalla dashboard)
  updated_at timestamptz not null default now()
);

-- Attiva la protezione per riga: senza regole nessuno vede niente
alter table public.progress enable row level security;

-- Permessi sulla tabella: SOLO agli utenti che hanno fatto l'accesso
-- (i visitatori anonimi, ruolo "anon", non possono nemmeno leggerla).
-- Nei progetti Supabase recenti non vengono dati in automatico.
revoke all on public.progress from anon;
grant select, insert, update on public.progress to authenticated;

-- Regole: ogni utente vede, crea e modifica solo la riga con il proprio id.
-- (drop + create così il file si può rieseguire senza errori)
drop policy if exists "leggo i miei dati"    on public.progress;
drop policy if exists "creo i miei dati"     on public.progress;
drop policy if exists "modifico i miei dati" on public.progress;

create policy "leggo i miei dati" on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "creo i miei dati" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "modifico i miei dati" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ============================================================================
-- MARVEL TRACKER — tabella dei dati personali su Supabase
-- Da eseguire UNA VOLTA: dashboard Supabase → SQL Editor → New query →
-- incolla tutto questo file → Run.
--
-- Una riga per utente: dentro "data" c'è lo stesso oggetto che l'app salvava
-- nel browser ({ seen, rating, eps, profile }; profile = avatar, nome, preferiti…
-- è facoltativo e non richiede colonne in più). Le regole RLS (Row Level Security)
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

-- ============================================================================
-- TAG UTENTE (@nome) — serve per la futura community.
-- Una riga per utente; il tag è UNICO tra tutti gli utenti (due persone non
-- possono avere lo stesso). Si può cambiare quando vuoi.
-- Formato: da 3 a 20 caratteri tra lettere minuscole, numeri e "_".
-- Tutti gli utenti collegati possono LEGGERE i tag (serve per vedere se un
-- tag è libero e, in futuro, per trovarsi nella community); ognuno può
-- creare/modificare/cancellare solo il proprio.
-- ============================================================================

create table if not exists public.handles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  handle     text not null unique check (handle ~ '^[a-z0-9_]{3,20}$'),
  updated_at timestamptz not null default now()
);

alter table public.handles enable row level security;

revoke all on public.handles from anon;
grant select, insert, update, delete on public.handles to authenticated;

drop policy if exists "leggo i tag"        on public.handles;
drop policy if exists "creo il mio tag"    on public.handles;
drop policy if exists "modifico il mio tag" on public.handles;
drop policy if exists "cancello il mio tag" on public.handles;

create policy "leggo i tag" on public.handles
  for select to authenticated
  using (true);

create policy "creo il mio tag" on public.handles
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "modifico il mio tag" on public.handles
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "cancello il mio tag" on public.handles
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ============================================================================
-- SCHEDA PUBBLICA (nome e avatar accanto al @tag)
-- Servono per mostrare chi è una persona nella ricerca amici, prima che siate
-- amici. Contengono SOLO nome e avatar (niente visti né voti).
-- ============================================================================
alter table public.handles add column if not exists name   text check (char_length(name) <= 30);
alter table public.handles add column if not exists avatar text check (char_length(avatar) <= 30);

-- ============================================================================
-- AMICIZIE — solo "amici" (niente seguiti/follower): una richiesta che
-- l'altra persona accetta o rifiuta.
-- Una riga per coppia: requester = chi chiede, addressee = chi riceve,
-- status = 'pending' (in attesa) o 'accepted' (amici).
-- - vedo solo le righe in cui ci sono io
-- - posso solo CHIEDERE a nome mio (riga 'pending' con requester = me)
-- - solo chi riceve può ACCETTARE (passare a 'accepted')
-- - tutti e due possono CANCELLARE (rifiutare, ritirare la richiesta, togliere l'amicizia)
-- ============================================================================
create table if not exists public.friendships (
  requester  uuid not null references auth.users (id) on delete cascade,
  addressee  uuid not null references auth.users (id) on delete cascade,
  status     text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  primary key (requester, addressee),
  check (requester <> addressee)
);

-- Una sola riga per coppia, in qualunque direzione (A→B e B→A insieme no)
create unique index if not exists friendships_pair
  on public.friendships (least(requester, addressee), greatest(requester, addressee));

alter table public.friendships enable row level security;

revoke all on public.friendships from anon;
grant select, insert, update, delete on public.friendships to authenticated;

drop policy if exists "vedo le mie amicizie"     on public.friendships;
drop policy if exists "chiedo l'amicizia"        on public.friendships;
drop policy if exists "accetto una richiesta"    on public.friendships;
drop policy if exists "cancello un'amicizia"     on public.friendships;

create policy "vedo le mie amicizie" on public.friendships
  for select to authenticated
  using ((select auth.uid()) in (requester, addressee));

create policy "chiedo l'amicizia" on public.friendships
  for insert to authenticated
  with check ((select auth.uid()) = requester and status = 'pending');

create policy "accetto una richiesta" on public.friendships
  for update to authenticated
  using ((select auth.uid()) = addressee)
  with check ((select auth.uid()) = addressee and status = 'accepted');

create policy "cancello un'amicizia" on public.friendships
  for delete to authenticated
  using ((select auth.uid()) in (requester, addressee));

-- ============================================================================
-- GLI AMICI VEDONO I MIEI DATI (visti, episodi, voti, profilo) in sola lettura.
-- Solo con amicizia ACCETTATA; nessuno può modificare i dati di un altro.
-- ============================================================================
drop policy if exists "leggo i dati degli amici" on public.progress;

create policy "leggo i dati degli amici" on public.progress
  for select to authenticated
  using (exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ((f.requester = (select auth.uid()) and f.addressee = progress.user_id)
        or (f.addressee = (select auth.uid()) and f.requester = progress.user_id))
  ));

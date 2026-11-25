/* ============================================================================
   AMICI — ricerca per @tag, richieste di amicizia, lista degli amici.
   Tabelle su Supabase (vedi supabase/schema.sql):
   - handles: @tag + nome e avatar "pubblici" (per riconoscersi nella ricerca)
   - friendships: una riga per coppia, 'pending' (richiesta) o 'accepted' (amici)
   - progress: i dati di un amico si possono LEGGERE solo se siete amici
   useFriends() dà ai componenti la situazione aggiornata; le funzioni qui
   sotto la modificano e poi la ricaricano.
   ============================================================================ */
import { useSyncExternalStore } from "react";
import { currentUser, onUserChange } from "./auth";
import { supabase } from "./supabase";
import { isSavedData } from "./store";
import type { SavedData } from "./types";

/** Una persona come appare nella ricerca e nella lista */
export interface Person {
  id: string;
  handle: string;
  name: string | null;
  avatar: string | null;
}

/** Rapporto con una persona */
export type Relation = "friend" | "incoming" | "outgoing" | "none";

interface FriendsState {
  loading: boolean;
  missing: boolean;              // tabelle non ancora create (schema.sql da eseguire)
  friends: Person[];             // amicizie accettate
  incoming: Person[];            // richieste ricevute (da accettare)
  outgoing: Person[];            // richieste mandate (in attesa)
}

const EMPTY: FriendsState = { loading: false, missing: false, friends: [], incoming: [], outgoing: [] };
let state: FriendsState = EMPTY;
const listeners = new Set<() => void>();
const setState = (p: Partial<FriendsState>) => { state = { ...state, ...p }; listeners.forEach((l) => l()); };

/** Hook React: amici e richieste dell'utente collegato */
export function useFriends(): FriendsState {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => state);
}

/** true se l'errore dice che una tabella non c'è ancora */
const isMissing = (e: { code?: string; message?: string }) =>
  e.code === "42P01" || e.code === "PGRST205" || e.code === "42703" || /does not exist|schema cache/i.test(e.message || "");

/** Ricarica amici e richieste */
export async function reloadFriends(): Promise<void> {
  const me = currentUser();
  if (!supabase || !me) { setState(EMPTY); return; }
  setState({ loading: true });
  const { data: rows, error } = await supabase.from("friendships").select("requester, addressee, status");
  if (currentUser()?.id !== me.id) return;
  if (error) { setState({ ...EMPTY, missing: isMissing(error) }); return; }
  // Le persone dall'altra parte di ogni riga
  const other = (r: { requester: string; addressee: string }) => (r.requester === me.id ? r.addressee : r.requester);
  const ids = [...new Set((rows ?? []).map(other))];
  const people: Record<string, Person> = {};
  if (ids.length) {
    const { data: cards } = await supabase.from("handles").select("user_id, handle, name, avatar").in("user_id", ids);
    for (const c of cards ?? []) people[c.user_id] = { id: c.user_id, handle: c.handle, name: c.name, avatar: c.avatar };
  }
  // chi ha tolto il proprio tag compare comunque, con un segnaposto
  const person = (id: string): Person => people[id] ?? { id, handle: "?", name: null, avatar: null };
  const byName = (a: Person, b: Person) => (a.name || a.handle).localeCompare(b.name || b.handle);
  setState({
    loading: false, missing: false,
    friends: (rows ?? []).filter((r) => r.status === "accepted").map((r) => person(other(r))).sort(byName),
    incoming: (rows ?? []).filter((r) => r.status === "pending" && r.addressee === me.id).map((r) => person(r.requester)),
    outgoing: (rows ?? []).filter((r) => r.status === "pending" && r.requester === me.id).map((r) => person(r.addressee)),
  });
}

/* All'accesso carico amici e richieste; tornando sulla pagina li ricarico
   (così si vedono le richieste arrivate nel frattempo) */
onUserChange((user) => { setState(EMPTY); if (user) void reloadFriends(); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && currentUser()) void reloadFriends(); });

/** Rapporto con una persona (per il pulsante nella ricerca) */
export function relationOf(id: string): Relation {
  if (state.friends.some((p) => p.id === id)) return "friend";
  if (state.incoming.some((p) => p.id === id)) return "incoming";
  if (state.outgoing.some((p) => p.id === id)) return "outgoing";
  return "none";
}

/** Cerca persone per @tag (inizio del tag, max 10). Me stesso escluso. */
export async function searchPeople(q: string): Promise<Person[] | "missing" | "error"> {
  const me = currentUser();
  const clean = q.toLowerCase().replace(/^@+/, "").replace(/[^a-z0-9_]/g, "");
  if (!supabase || !me || clean.length < 2) return [];
  const { data, error } = await supabase.from("handles").select("user_id, handle, name, avatar")
    .ilike("handle", `${clean}%`).neq("user_id", me.id).order("handle").limit(10);
  if (error) return isMissing(error) ? "missing" : "error";
  return (data ?? []).map((c) => ({ id: c.user_id, handle: c.handle, name: c.name, avatar: c.avatar }));
}

/** Risultato di un'azione: null = ok, altrimenti cosa è andato storto */
type ActErr = "missing" | "error" | null;
const done = async (error: { code?: string; message?: string } | null): Promise<ActErr> => {
  await reloadFriends();
  return error ? (isMissing(error) ? "missing" : "error") : null;
};

/** Manda una richiesta di amicizia. Se l'altra persona me l'aveva già
    mandata, invece la accetto (così non si incrociano due richieste). */
export async function sendRequest(id: string): Promise<ActErr> {
  const me = currentUser();
  if (!supabase || !me) return "error";
  if (relationOf(id) === "incoming") return acceptRequest(id);
  const { error } = await supabase.from("friendships").insert({ requester: me.id, addressee: id });
  return done(error && error.code !== "23505" ? error : null); // 23505 = c'era già: va bene così
}

/** Accetta una richiesta ricevuta */
export async function acceptRequest(id: string): Promise<ActErr> {
  const me = currentUser();
  if (!supabase || !me) return "error";
  const { error } = await supabase.from("friendships").update({ status: "accepted" }).eq("requester", id).eq("addressee", me.id);
  return done(error);
}

/** Rifiuta una richiesta, ritira la propria o toglie un'amicizia:
    in tutti i casi si cancella la riga della coppia */
export async function removeFriendship(id: string): Promise<ActErr> {
  const me = currentUser();
  if (!supabase || !me) return "error";
  const { error } = await supabase.from("friendships").delete()
    .or(`and(requester.eq.${me.id},addressee.eq.${id}),and(requester.eq.${id},addressee.eq.${me.id})`);
  return done(error);
}

/** Dati di un amico (visti, episodi, voti, profilo). null = non siete
    amici, oppure non ha ancora salvato niente */
export async function fetchFriendData(id: string): Promise<SavedData | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("progress").select("data").eq("user_id", id).maybeSingle();
  if (error || !data || !isSavedData(data.data)) return null;
  const d = data.data;
  return { seen: d.seen, rating: d.rating, eps: d.eps || {}, ...(d.profile ? { profile: d.profile } : {}), ...(d.back ? { back: d.back } : {}) };
}

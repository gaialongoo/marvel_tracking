// Amici - ricerca per @tag, richieste di amicizia, lista degli amici.
// Passa tutto dal backend (api.ts → worker/). Dietro, su Supabase
// (vedi supabase/schema.sql):
// - handles: @tag + nome e avatar "pubblici" (per riconoscersi nella ricerca)
// - friendships: una riga per coppia, 'pending' (richiesta) o 'accepted' (amici)
// - progress: i dati di un amico si possono leggere solo se siete amici
// - blocks: le persone che hai bloccato (non possono mandarti richieste)
// - reports: segnalazioni (si possono solo inviare; le legge chi gestisce il sito)
// useFriends() dà ai componenti la situazione aggiornata; le funzioni qui
// sotto la modificano e poi la ricaricano.
import { useSyncExternalStore } from "react";
import { currentUser, onUserChange } from "./auth";
import { api } from "./api";
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
export type Relation = "friend" | "incoming" | "outgoing" | "blocked" | "none";

interface FriendsState {
  loading: boolean;
  missing: boolean;              // tabelle non ancora create (schema.sql da eseguire)
  friends: Person[];             // amicizie accettate
  incoming: Person[];            // richieste ricevute (da accettare)
  outgoing: Person[];            // richieste mandate (in attesa)
  blocked: Person[];             // persone che ho bloccato
}

const EMPTY: FriendsState = { loading: false, missing: false, friends: [], incoming: [], outgoing: [], blocked: [] };
let state: FriendsState = EMPTY;
const listeners = new Set<() => void>();
const setState = (p: Partial<FriendsState>) => { state = { ...state, ...p }; listeners.forEach((l) => l()); };

/** Hook React: amici e richieste dell'utente collegato */
export function useFriends(): FriendsState {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => state);
}

/** Errore del backend → "missing" (tabelle non ancora create) o "error" */
const errOf = (e: string): "missing" | "error" => (e === "missing" ? "missing" : "error");

/** Ricarica amici e richieste (le liste le prepara il backend) */
export async function reloadFriends(): Promise<void> {
  const me = currentUser();
  if (!me) { setState(EMPTY); return; }
  setState({ loading: true });
  const r = await api<{ friends: Person[]; incoming: Person[]; outgoing: Person[]; blocked: Person[] }>("/friends");
  if (currentUser()?.id !== me.id) return;
  if (!r.ok) { setState({ ...EMPTY, missing: r.error === "missing" }); return; }
  const byName = (a: Person, b: Person) => (a.name || a.handle).localeCompare(b.name || b.handle);
  setState({
    loading: false, missing: false,
    friends: [...r.data.friends].sort(byName),
    incoming: r.data.incoming,
    outgoing: r.data.outgoing,
    blocked: [...r.data.blocked].sort(byName),
  });
}

// All'accesso carico amici e richieste; tornando sulla pagina li ricarico
// (così si vedono le richieste arrivate nel frattempo)
onUserChange((user) => { setState(EMPTY); if (user) void reloadFriends(); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && currentUser()) void reloadFriends(); });

/** Rapporto con una persona (per il pulsante nella ricerca) */
export function relationOf(id: string): Relation {
  if (state.blocked.some((p) => p.id === id)) return "blocked";
  if (state.friends.some((p) => p.id === id)) return "friend";
  if (state.incoming.some((p) => p.id === id)) return "incoming";
  if (state.outgoing.some((p) => p.id === id)) return "outgoing";
  return "none";
}

/** Cerca persone per @tag (inizio del tag, max 10). Me stesso escluso. */
export async function searchPeople(q: string): Promise<Person[] | "missing" | "error"> {
  const clean = q.toLowerCase().replace(/^@+/, "").replace(/[^a-z0-9_]/g, "");
  if (!currentUser() || clean.length < 2) return [];
  const r = await api<{ people: Person[] }>(`/search?q=${encodeURIComponent(clean)}`);
  if (!r.ok) return errOf(r.error);
  // le persone che ho bloccato non compaiono nella ricerca
  return r.data.people.filter((c) => !state.blocked.some((b) => b.id === c.id));
}

/** Scheda di una persona dal @tag (null = non esiste) */
export async function findPerson(tag: string): Promise<Person | null> {
  const r = await api<{ person: Person | null }>(`/people/${encodeURIComponent(tag)}`);
  return r.ok ? r.data.person : null;
}

/** Risultato di un'azione: null = ok, altrimenti cosa è andato storto */
type ActErr = "missing" | "error" | null;
/** Dopo un'azione ricarico le liste e traduco l'esito */
const done = async (r: { ok: boolean; error?: string }): Promise<ActErr> => {
  await reloadFriends();
  return r.ok ? null : errOf(r.error || "");
};
/** id nell'indirizzo */
const enc = (id: string) => encodeURIComponent(id);

/**
 * Manda una richiesta di amicizia. Se l'altra persona me l'aveva già
 * mandata, invece la accetto (così non si incrociano due richieste).
 */
export async function sendRequest(id: string): Promise<ActErr> {
  if (!currentUser()) return "error";
  if (relationOf(id) === "incoming") return acceptRequest(id);
  return done(await api(`/friends/${enc(id)}/request`, "POST"));
}

/** Accetta una richiesta ricevuta */
export async function acceptRequest(id: string): Promise<ActErr> {
  if (!currentUser()) return "error";
  return done(await api(`/friends/${enc(id)}/accept`, "POST"));
}

/**
 * Rifiuta una richiesta, ritira la propria o toglie un'amicizia:
 * in tutti i casi si cancella il legame della coppia
 */
export async function removeFriendship(id: string): Promise<ActErr> {
  if (!currentUser()) return "error";
  return done(await api(`/friends/${enc(id)}`, "DELETE"));
}

/**
 * Blocca una persona: toglie l'amicizia (o la richiesta) e la blocca.
 * Da quel momento non può più mandarti richieste.
 */
export async function blockPerson(id: string): Promise<ActErr> {
  if (!currentUser()) return "error";
  return done(await api(`/blocks/${enc(id)}`, "POST"));
}

/** Sblocca una persona */
export async function unblockPerson(id: string): Promise<ActErr> {
  if (!currentUser()) return "error";
  return done(await api(`/blocks/${enc(id)}`, "DELETE"));
}

/** Motivi di una segnalazione (gli stessi accettati dal database) */
export const REPORT_REASONS = ["handle", "name", "bio", "spam", "other"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

/** Segnala una persona a chi gestisce il sito (motivo + nota facoltativa) */
export async function reportPerson(id: string, reason: ReportReason, note: string): Promise<ActErr> {
  if (!currentUser()) return "error";
  const r = await api("/reports", "POST", { id, reason, note: note.trim().slice(0, 300) });
  return r.ok ? null : errOf(r.error);
}

/**
 * Dati di un amico (visti, episodi, voti, profilo). null = non siete
 * amici, oppure non ha ancora salvato niente
 */
export async function fetchFriendData(id: string): Promise<SavedData | null> {
  const r = await api<{ data: unknown }>(`/friends/${enc(id)}/data`);
  if (!r.ok || !isSavedData(r.data.data)) return null;
  const d = r.data.data;
  return { seen: d.seen, rating: d.rating, eps: d.eps || {}, ...(d.profile ? { profile: d.profile } : {}), ...(d.back ? { back: d.back } : {}) };
}

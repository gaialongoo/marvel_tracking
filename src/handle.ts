// Tag utente (@nome) - unico tra tutti gli utenti, per la futura community.
// Passa dal backend (api.ts → worker/); su Supabase sta in una tabella a parte
// ("handles", vedi supabase/schema.sql)
// perché solo il database può garantire che due persone non abbiano lo
// stesso tag. Formato: 3–20 caratteri tra a-z, 0-9 e "_". Si può cambiare.
// - useHandle(): il tag dell'utente collegato (si carica da solo all'accesso)
// - checkHandle(): il tag è libero?
// - saveHandle(): salva o cambia il tag
// - syncCard(): copia nome e avatar accanto al tag (la "scheda pubblica"
//   che vedono gli altri nella ricerca amici; visti e voti restano privati)
import { useSyncExternalStore } from "react";
import { currentUser, onUserChange } from "./auth";
import { api } from "./api";

interface HandleState {
  handle: string | null; // tag attuale (null = non ancora scelto)
  loading: boolean;      // lo sto ancora leggendo
  missing: boolean;      // la tabella non esiste ancora (schema.sql da eseguire)
}

let state: HandleState = { handle: null, loading: false, missing: false };
const listeners = new Set<() => void>();
const setState = (p: Partial<HandleState>) => { state = { ...state, ...p }; listeners.forEach((l) => l()); };

/** Hook React: tag dell'utente collegato */
export function useHandle(): HandleState {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => state);
}

/** Formato valido del tag */
export const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

/** Ripulisce quello che si scrive: minuscole, niente "@" iniziale, solo a-z 0-9 _ */
export const normHandle = (s: string) => s.toLowerCase().replace(/^@+/, "").replace(/[^a-z0-9_]/g, "").slice(0, 20);

// All'accesso (o cambio account) leggo il tag dell'utente
onUserChange(async (user) => {
  setState({ handle: null, loading: !!user, missing: false });
  if (!user) return;
  const r = await api<{ handle: string | null }>("/handle");
  if (currentUser()?.id !== user.id) return; // nel frattempo è cambiato utente
  if (!r.ok) setState({ loading: false, missing: r.error === "missing" });
  else setState({ loading: false, handle: r.data.handle });
});

/** Il tag è libero? "free" | "mine" (è già il tuo) | "taken" | "missing" | "error" */
export async function checkHandle(h: string): Promise<"free" | "mine" | "taken" | "missing" | "error"> {
  if (!currentUser()) return "error";
  const r = await api<{ status: "free" | "mine" | "taken" }>(`/handle/check?h=${encodeURIComponent(h)}`);
  if (!r.ok) return r.error === "missing" ? "missing" : "error";
  return r.data.status;
}

/** Salva il tag. "ok" | "taken" (qualcuno l'ha preso) | "invalid" | "missing" | "error" */
export async function saveHandle(h: string, card?: { name?: string; avatar?: string }): Promise<"ok" | "taken" | "invalid" | "missing" | "error"> {
  if (!HANDLE_RE.test(h)) return "invalid";
  if (!currentUser()) return "error";
  // nome e avatar insieme al tag (vedi syncCard)
  const r = await api("/handle", "PUT", { handle: h, name: card?.name?.slice(0, 30) || null, avatar: card?.avatar || null });
  if (!r.ok) {
    if (r.error === "taken") return "taken";
    if (r.error === "invalid") return "invalid";
    if (r.error === "missing") { setState({ missing: true }); return "missing"; }
    return "error";
  }
  setState({ handle: h, missing: false });
  return "ok";
}

/** Ultima scheda inviata (per non rimandarla uguale) */
let lastCard = "";

/**
 * Copia nome e avatar del profilo nella riga del tag, così gli altri li
 * vedono nella ricerca amici. Solo se il tag c'è già.
 */
export async function syncCard(name: string | undefined, avatar: string | undefined) {
  const me = currentUser();
  if (!me || !state.handle) return;
  const key = `${me.id}|${name ?? ""}|${avatar ?? ""}`;
  if (key === lastCard) return;
  lastCard = key;
  const r = await api("/card", "PUT", { name: name?.slice(0, 30) || null, avatar: avatar || null });
  if (!r.ok) lastCard = ""; // riprova la prossima volta
}

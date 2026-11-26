// Tag utente (@nome) - unico tra tutti gli utenti, per la futura community.
// Sta in una tabella a parte su Supabase ("handles", vedi supabase/schema.sql)
// perché solo il database può garantire che due persone non abbiano lo
// stesso tag. Formato: 3–20 caratteri tra a-z, 0-9 e "_". Si può cambiare.
// - useHandle(): il tag dell'utente collegato (si carica da solo all'accesso)
// - checkHandle(): il tag è libero?
// - saveHandle(): salva o cambia il tag
// - syncCard(): copia nome e avatar accanto al tag (la "scheda pubblica"
//   che vedono gli altri nella ricerca amici; visti e voti restano privati)
import { useSyncExternalStore } from "react";
import { currentUser, onUserChange } from "./auth";
import { supabase } from "./supabase";

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

/** true se l'errore dice che la tabella "handles" non c'è ancora */
const isMissing = (e: { code?: string; message?: string }) =>
  e.code === "42P01" || e.code === "PGRST205" || /does not exist|schema cache/i.test(e.message || "");

// All'accesso (o cambio account) leggo il tag dell'utente
onUserChange(async (user) => {
  setState({ handle: null, loading: !!user && !!supabase, missing: false });
  if (!user || !supabase) return;
  const { data, error } = await supabase.from("handles").select("handle").eq("user_id", user.id).maybeSingle();
  if (currentUser()?.id !== user.id) return; // nel frattempo è cambiato utente
  if (error) setState({ loading: false, missing: isMissing(error) });
  else setState({ loading: false, handle: data?.handle ?? null });
});

/** Il tag è libero? "free" | "mine" (è già il tuo) | "taken" | "missing" | "error" */
export async function checkHandle(h: string): Promise<"free" | "mine" | "taken" | "missing" | "error"> {
  const me = currentUser();
  if (!supabase || !me) return "error";
  const { data, error } = await supabase.from("handles").select("user_id").eq("handle", h).maybeSingle();
  if (error) return isMissing(error) ? "missing" : "error";
  if (!data) return "free";
  return data.user_id === me.id ? "mine" : "taken";
}

/** Salva il tag. "ok" | "taken" (qualcuno l'ha preso) | "invalid" | "missing" | "error" */
export async function saveHandle(h: string, card?: { name?: string; avatar?: string }): Promise<"ok" | "taken" | "invalid" | "missing" | "error"> {
  const me = currentUser();
  if (!HANDLE_RE.test(h)) return "invalid";
  if (!supabase || !me) return "error";
  const { error } = await supabase.from("handles").upsert({
    user_id: me.id, handle: h, updated_at: new Date().toISOString(),
    // nome e avatar insieme al tag (vedi syncCard)
    name: card?.name?.slice(0, 30) || null, avatar: card?.avatar || null,
  });
  if (error) {
    if (error.code === "23505") return "taken"; // violato il vincolo "unico"
    if (isMissing(error)) { setState({ missing: true }); return "missing"; }
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
  if (!supabase || !me || !state.handle) return;
  const key = `${me.id}|${name ?? ""}|${avatar ?? ""}`;
  if (key === lastCard) return;
  lastCard = key;
  const { error } = await supabase.from("handles")
    .update({ name: name?.slice(0, 30) || null, avatar: avatar || null }).eq("user_id", me.id);
  if (error) lastCard = ""; // riprova la prossima volta
}

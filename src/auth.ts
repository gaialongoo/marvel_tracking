/* ============================================================================
   AUTH — chi ha fatto l'accesso.
   - useAuth() dice ai componenti: sto ancora controllando? c'è un utente?
     l'utente è arrivato dal link "nuova password"?
   - Le funzioni qui sotto (accedi, registrati, esci, recupero password)
     chiamano Supabase e restituiscono un codice d'errore da tradurre,
     oppure null se è andato tutto bene.
   ============================================================================ */
import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { redirectUrl, supabase } from "./supabase";

interface AuthState {
  ready: boolean;       // false finché non so se c'è una sessione salvata
  user: User | null;    // utente collegato (null = pagina di accesso)
  recovery: boolean;    // true = arrivato dal link "password dimenticata"
  linkErr: boolean;     // true = il link dell'email non ha funzionato (scaduto,
                        // già usato o aperto in un altro browser)
}

/* Il link dell'email torna con ?code=… (va bene) oppure con un errore
   (?error=… o #error=…, es. link scaduto). Lo guardo PRIMA che Supabase
   pulisca l'indirizzo. */
const hadCode = location.search.includes("code=");
const urlErr = /[?&#]error(_code|_description)?=/.test(location.search + location.hash);
// L'errore nel "#" rovinerebbe la navigazione dell'app (#/…): lo tolgo subito
if (/^#error/.test(location.hash) || /[?&]error/.test(location.search)) history.replaceState(null, "", location.pathname + "#/");

let state: AuthState = { ready: !supabase, user: null, recovery: false, linkErr: urlErr };
const listeners = new Set<() => void>();
const setState = (p: Partial<AuthState>) => { state = { ...state, ...p }; listeners.forEach((l) => l()); };

/** Hook React: stato dell'accesso, si aggiorna da solo */
export function useAuth(): AuthState {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
  );
}

/** Utente attuale fuori dai componenti (usato da store.ts) */
export const currentUser = () => state.user;

/** Avvisa quando cambia l'utente collegato (accesso, uscita, altro account) */
export function onUserChange(cb: (user: User | null) => void) {
  let last: string | null | undefined;
  const check = () => {
    if (!state.ready) return;
    const id = state.user?.id ?? null;
    if (id !== last) { last = id; cb(state.user); }
  };
  listeners.add(check);
  check(); // se la sessione era già nota, parte subito
}

/* Ascolta Supabase: all'avvio arriva INITIAL_SESSION (sessione salvata o
   nessuna), poi SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED… e
   PASSWORD_RECOVERY quando si apre il link per scegliere una nuova password.
   L'utente viene sostituito solo se cambia davvero (il rinnovo del token
   non deve far ricaricare i dati). */
supabase?.auth.onAuthStateChange((event, session) => {
  const user = session?.user ?? null;
  // Dopo un link via email l'indirizzo contiene ?code=…: lo tolgo (resta il #/…)
  if (location.search.includes("code=")) history.replaceState(null, "", location.pathname + location.hash);
  const sameUser = user?.id === state.user?.id;
  setState({
    ready: true,
    user: sameUser ? state.user : user,
    recovery: event === "PASSWORD_RECOVERY" ? true : user ? state.recovery : false,
    // c'era un ?code=… ma all'avvio non è entrato nessuno: il link non ha funzionato
    linkErr: state.linkErr || (event === "INITIAL_SESSION" && hadCode && !user),
  });
});

/** Nasconde l'avviso sul link (quando si chiede un link nuovo o si accede) */
export const clearLinkErr = () => setState({ linkErr: false });

/* ---------------------------------------------------------------------------
   ERRORI — Supabase risponde con codici in inglese; li riduco a poche chiavi
   che i18n.ts traduce (err_…).
   --------------------------------------------------------------------------- */
export type AuthErr = "err_credentials" | "err_notConfirmed" | "err_exists" | "err_weak" | "err_rate" | "err_emailRate"
  | "err_samePw" | "err_network" | "err_generic";

function toErr(e: { code?: string; message?: string; status?: number } | null): AuthErr | null {
  if (!e) return null;
  const c = e.code || "";
  if (c === "invalid_credentials") return "err_credentials";
  if (c === "email_not_confirmed") return "err_notConfirmed";
  if (c === "user_already_exists" || c === "email_exists") return "err_exists";
  if (c === "weak_password") return "err_weak";
  if (c === "same_password") return "err_samePw";                    // nuova password = quella vecchia
  if (c === "over_email_send_rate_limit") return "err_emailRate";    // troppe email in poco tempo
  if (c.startsWith("over_") || e.status === 429) return "err_rate";
  if (!e.status || /fetch|network/i.test(e.message || "")) return "err_network";
  return "err_generic";
}

/** Accedi con email e password */
export async function signIn(email: string, password: string): Promise<AuthErr | null> {
  const { error } = await supabase!.auth.signInWithPassword({ email, password });
  return toErr(error);
}

/** Crea un account. Supabase manda un'email con il link di conferma;
    "needsConfirm" è true finché il link non viene cliccato. */
export async function signUp(email: string, password: string): Promise<{ err: AuthErr | null; needsConfirm: boolean }> {
  const { data, error } = await supabase!.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl() } });
  // Email già registrata e confermata: per privacy Supabase non dà errore
  // ma restituisce un utente senza "identities"
  if (!error && data.user && data.user.identities?.length === 0) return { err: "err_exists", needsConfirm: false };
  return { err: toErr(error), needsConfirm: !error && !data.session };
}

/** Manda l'email con il link per scegliere una nuova password */
export async function sendReset(email: string): Promise<AuthErr | null> {
  const { error } = await supabase!.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl() });
  return toErr(error);
}

/** Salva la nuova password (dopo il link di recupero) */
export async function updatePassword(password: string): Promise<AuthErr | null> {
  const { error } = await supabase!.auth.updateUser({ password });
  if (!error) setState({ recovery: false });
  return toErr(error);
}

/** Elimina l'account e TUTTI i suoi dati (funzione delete_my_account in
    supabase/schema.sql). Poi esce. "missing" = la funzione non c'è ancora
    nel database (schema.sql da rieseguire). */
export async function deleteAccount(): Promise<"ok" | "missing" | "error"> {
  const { error } = await supabase!.rpc("delete_my_account");
  if (error) return error.code === "PGRST202" || /function|schema cache/i.test(error.message) ? "missing" : "error";
  await supabase!.auth.signOut({ scope: "local" });
  return "ok";
}

/** Esci dall'account su questo dispositivo */
export async function signOut() {
  await supabase!.auth.signOut({ scope: "local" });
}

// Auth - chi ha fatto l'accesso.
// - useAuth() dice ai componenti: sto ancora controllando? c'è un utente?
//   l'utente è arrivato dal link "nuova password"?
// - Le funzioni qui sotto (accedi, registrati, esci, recupero password)
//   chiamano il backend (api.ts) e restituiscono un codice d'errore da
//   tradurre, oppure null se è andato tutto bene.
// La sessione la tiene il backend in cookie protetti: qui so solo chi è
// l'utente (id ed email).
import { useSyncExternalStore } from "react";
import { api, setOnExpired } from "./api";

/** Utente collegato: solo quello che serve all'app */
export interface User {
  id: string;
  email: string | null;
}

interface AuthState {
  ready: boolean;       // false finché non so se c'è una sessione
  user: User | null;    // utente collegato (null = pagina di accesso)
  recovery: boolean;    // true = arrivato dal link "password dimenticata"
  linkErr: boolean;     // true = il link dell'email non ha funzionato (scaduto o già usato)
}

let state: AuthState = { ready: false, user: null, recovery: false, linkErr: false };
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

/** Mette l'utente (lo sostituisce solo se è davvero un altro) */
function setUser(u: User | null, extra: Partial<AuthState> = {}) {
  const same = (u?.id ?? null) === (state.user?.id ?? null);
  setState({ ready: true, user: same ? state.user : u, ...(u ? {} : { recovery: false }), ...extra });
}

// Sessione scaduta durante l'uso (es. password cambiata su un altro
// dispositivo): si torna alla pagina di accesso
setOnExpired(() => { if (state.user) setUser(null); });

// ---------------------------------------------------------------------------
// Avvio: link dell'email oppure sessione già aperta
// ---------------------------------------------------------------------------

/**
 * I link delle email (conferma account, nuova password) tornano al sito con
 * ?token_hash=…&type=email|recovery (vedi supabase/email/*.html).
 * Lo tolgo subito dall'indirizzo (resta il #/… della navigazione) e lo
 * mando al backend, che apre la sessione.
 */
async function start() {
  const q = new URLSearchParams(location.search);
  const tokenHash = q.get("token_hash");
  const type = q.get("type");
  // link vecchi (prima del backend) o con errore: avviso che non ha funzionato
  const oldLink = q.has("code") || /[?&#]error(_code|_description)?=/.test(location.search + location.hash);
  if (tokenHash || oldLink) {
    // Se il Site URL di Supabase finisce con "/", il link arriva come
    // "marveltracker.com//?token_hash=…": "//" da solo il browser lo legge
    // come un altro sito e blocca replaceState. Riduco le barre doppie a una.
    const path = location.pathname.replace(/\/{2,}/g, "/");
    try {
      history.replaceState(null, "", path + (/^#error/.test(location.hash) ? "#/" : location.hash));
    } catch { /* non togliere il codice dall'indirizzo non deve bloccare l'accesso */ }
  }

  if (tokenHash) {
    const r = await api<{ user: User; recovery: boolean }>("/verify", "POST", { token_hash: tokenHash, type });
    if (r.ok) { setUser(r.data.user, { recovery: r.data.recovery }); return; }
    // link non valido: si prova comunque con la sessione già aperta
    state = { ...state, linkErr: true };
  } else if (oldLink) {
    state = { ...state, linkErr: true };
  }
  await checkSession();
}

/** Chiede al backend chi è collegato (null = nessuno). Senza rete riprova. */
async function checkSession() {
  const r = await api<{ user: User }>("/me");
  if (r.ok) setUser(r.data.user);
  else if (r.error === "network") { setState({ ready: false }); setTimeout(checkSession, 5000); }
  else setUser(null);
}

// Qualunque errore imprevisto all'avvio: mostro comunque la pagina (accesso
// o app), invece di restare per sempre su "Caricamento…"
start().catch(() => { void checkSession(); });

/** Nasconde l'avviso sul link (quando si chiede un link nuovo o si accede) */
export const clearLinkErr = () => setState({ linkErr: false });

// ---------------------------------------------------------------------------
// Errori - il backend risponde con i codici di Supabase; li riduco a poche
// chiavi che i18n.ts traduce (err_…).
// ---------------------------------------------------------------------------
export type AuthErr = "err_credentials" | "err_notConfirmed" | "err_exists" | "err_weak" | "err_rate" | "err_emailRate"
  | "err_samePw" | "err_network" | "err_captcha" | "err_generic";

function toErr(r: { ok: boolean; status?: number; error?: string }): AuthErr | null {
  if (r.ok) return null;
  const c = r.error || "";
  if (c === "network") return "err_network";
  if (c === "invalid_credentials") return "err_credentials";
  if (c === "captcha_failed") return "err_captcha";                  // controllo anti-bot non passato o scaduto
  if (c === "email_not_confirmed") return "err_notConfirmed";
  if (c === "user_already_exists" || c === "email_exists") return "err_exists";
  if (c === "weak_password") return "err_weak";
  if (c === "same_password") return "err_samePw";                    // nuova password = quella vecchia
  if (c === "over_email_send_rate_limit") return "err_emailRate";    // troppe email in poco tempo
  if (c.startsWith("over_") || r.status === 429) return "err_rate";
  return "err_generic";
}

// captcha = gettone del controllo anti-bot (components/Turnstile.tsx), se attivo

/** Accedi con email e password */
export async function signIn(email: string, password: string, captcha?: string): Promise<AuthErr | null> {
  const r = await api<{ user: User }>("/login", "POST", { email, password, captcha });
  if (r.ok) setUser(r.data.user, { linkErr: false });
  return toErr(r);
}

/**
 * Crea un account. Arriva un'email con il link di conferma;
 * "needsConfirm" è true finché il link non viene cliccato.
 */
export async function signUp(email: string, password: string, captcha?: string): Promise<{ err: AuthErr | null; needsConfirm: boolean }> {
  const r = await api<{ needsConfirm: boolean; user?: User }>("/signup", "POST", { email, password, captcha });
  if (r.ok && r.data.user) setUser(r.data.user);
  return { err: toErr(r), needsConfirm: r.ok && r.data.needsConfirm };
}

/** Manda l'email con il link per scegliere una nuova password */
export async function sendReset(email: string, captcha?: string): Promise<AuthErr | null> {
  return toErr(await api("/reset", "POST", { email, captcha }));
}

/** Salva la nuova password (dopo il link di recupero) */
export async function updatePassword(password: string): Promise<AuthErr | null> {
  const r = await api("/password", "POST", { password });
  if (r.ok) setState({ recovery: false });
  return toErr(r);
}

/**
 * Elimina l'account e tutti i suoi dati (funzione delete_my_account in
 * supabase/schema.sql, chiamata dal backend). Poi esce.
 * "missing" = la funzione non c'è ancora nel database (schema.sql da rieseguire).
 */
export async function deleteAccount(): Promise<"ok" | "missing" | "error"> {
  const r = await api("/account", "DELETE");
  if (!r.ok) return r.error === "missing" ? "missing" : "error";
  setUser(null);
  return "ok";
}

/** Esci dall'account su questo dispositivo */
export async function signOut() {
  await api("/logout", "POST");
  setUser(null);
}

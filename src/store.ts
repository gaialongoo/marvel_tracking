// Store - i dati personali (visti, voti, episodi, profilo) legati all'account.
// Il profilo sta nello stesso oggetto dei visti (campo "profile"), quindi
// finisce nella stessa riga di Supabase e nel backup senza tabelle in più.
// - Dopo l'accesso i dati vengono scaricati dall'account tramite il backend
//   (api.ts → worker/; su Supabase è la tabella "progress", vedi supabase/schema.sql).
// - Ogni modifica si vede subito e viene salvata nell'account poco dopo
//   (le modifiche ravvicinate partono insieme).
// - Una copia resta anche nel browser, per partire in fretta e per non
//   perdere niente se manca la connessione: verrà inviata appena torna.
// - Tornando sull'app (cambio scheda/finestra) i dati vengono riletti
//   dall'account, così si vedono le modifiche fatte da un altro dispositivo.
// - Se in questo browser ci sono dati di prima degli account, l'app chiede
//   cosa farne (tenere quelli del browser, quelli dell'account o unirli).
// - La lingua resta per dispositivo (non va nell'account).
import { useSyncExternalStore } from "react";
import { api } from "./api";
import { onUserChange, signOut, type User } from "./auth";
import { BY_ID, DATA } from "./data/titles";
import type { Lang, Profile, SavedData } from "./types";

const LEGACY_KEY = "marvel-tracker-v1";   // dati salvati nel browser prima degli account
const CACHE_PREFIX = "marvel-tracker-v1:"; // + id utente: copia locale dei dati dell'account
const LANG_KEY = "marvel-tracker-lang";   // lingua scelta su questo dispositivo
const SAVE_DELAY = 700;                   // ms di attesa prima di salvare nell'account

/** Stato del salvataggio, mostrato vicino al pulsante account */
export type SyncState = "loading" | "saved" | "saving" | "error";

interface StoreState {
  data: SavedData;
  lang: Lang;
  loaded: boolean;              // false finché i dati dell'account non sono arrivati
  sync: SyncState;
  browserData: SavedData | null; // dati "vecchi" del browser in attesa di una scelta
}

const EMPTY: SavedData = { seen: {}, rating: {}, eps: {} };

// Lettura/scrittura sicura nel browser
// (try/catch: in alcune modalità private il salvataggio locale è bloccato)
function readJSON(key: string): unknown {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
}
function writeLS(key: string, value: string | null) {
  try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } catch { /* ignoro */ }
}

/** Controlla che un oggetto abbia la forma dei nostri dati */
export function isSavedData(x: unknown): x is SavedData {
  const o = x as SavedData | null;
  return !!o && typeof o.seen === "object" && typeof o.rating === "object";
}
/**
 * Copia pulita dei dati (eps e profile possono mancare nei salvataggi più vecchi;
 * un profilo che non è un oggetto viene scartato)
 */
const clean = (d: SavedData): SavedData => ({
  seen: d.seen, rating: d.rating, eps: d.eps || {},
  ...(d.profile && typeof d.profile === "object" ? { profile: d.profile } : {}),
  ...(typeof d.back === "number" && d.back > 0 ? { back: d.back } : {}),
  ...(cleanWatch(d.watch) ? { watch: cleanWatch(d.watch) } : {}),
});

/** Lista "Da vedere" pulita: solo id -> numero; vuota = assente */
function cleanWatch(w: unknown): Record<string, number> | undefined {
  if (!w || typeof w !== "object") return undefined;
  const out = Object.fromEntries(Object.entries(w as Record<string, unknown>).filter(([, v]) => typeof v === "number")) as Record<string, number>;
  return Object.keys(out).length ? out : undefined;
}

/** true se non c'è niente di segnato (nessun visto, voto o episodio) */
const isEmpty = (d: SavedData) =>
  !Object.values(d.seen).some(Boolean) && !Object.values(d.rating).some((v) => v > 0) && !Object.values(d.eps).some((e) => e.length);

/** Lingua: quella scelta su questo dispositivo, altrimenti quella del browser */
function loadLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "it" || saved === "en") return saved;
  } catch { /* ignoro */ }
  return navigator.language?.toLowerCase().startsWith("it") ? "it" : "en";
}

// Stato + hook
let state: StoreState = { data: EMPTY, lang: loadLang(), loaded: false, sync: "loading", browserData: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const patch = (p: Partial<StoreState>) => { state = { ...state, ...p }; emit(); };

/** Hook React: restituisce lo stato e ridisegna il componente quando cambia */
export function useStore(): StoreState {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
  );
}

// Sincronizzazione con l'account
let user: User | null = null;  // utente collegato
let pending = false;           // ci sono modifiche non ancora salvate nell'account
let timer: number | undefined; // salvataggio programmato
let saving: Promise<void> | null = null;

const cacheKey = () => CACHE_PREFIX + user!.id;

/**
 * Cancella dal browser la copia locale dei dati di un utente
 * (dopo l'eliminazione dell'account non deve restare niente)
 */
export function forgetLocal(userId: string) {
  writeLS(CACHE_PREFIX + userId, null);
}

/** Copia locale: i dati + se sono ancora da inviare all'account */
function writeCache() {
  if (user) writeLS(cacheKey(), JSON.stringify({ data: state.data, pending }));
}
function readCache(): { data: SavedData; pending: boolean } | null {
  if (!user) return null;
  const c = readJSON(cacheKey()) as { data?: unknown; pending?: boolean } | null;
  return c && isSavedData(c.data) ? { data: clean(c.data), pending: !!c.pending } : null;
}

/**
 * Scarica i dati dell'account (null = l'account non ha ancora dati).
 * Lancia un errore se il backend non risponde.
 */
async function fetchRemote(): Promise<SavedData | null> {
  const r = await api<{ data: unknown }>("/data");
  if (!r.ok) throw new Error(r.error);
  return isSavedData(r.data.data) ? clean(r.data.data) : null;
}

/** Invia i dati attuali all'account (crea la riga se non c'è) */
async function pushNow(): Promise<void> {
  if (!user || !pending) return;
  const uid = user.id;
  const sent = state.data;
  patch({ sync: "saving" });
  const r = await api("/data", "PUT", { data: sent });
  if (user?.id !== uid) return; // nel frattempo è cambiato utente
  if (!r.ok) {
    patch({ sync: "error" });
    return;
  }
  // Se durante l'invio è cambiato qualcosa, resta "pending" e riparte il timer
  if (state.data === sent) { pending = false; writeCache(); patch({ sync: "saved" }); }
  else scheduleSave();
}

/** Salva tra poco (le modifiche ravvicinate partono insieme) */
function scheduleSave() {
  clearTimeout(timer);
  timer = window.setTimeout(() => { saving = pushNow().finally(() => { saving = null; }); }, SAVE_DELAY);
}

/**
 * Salva subito quello che manca (usato prima di uscire dall'account).
 * Restituisce true se ora l'account è aggiornato.
 */
export async function flush(): Promise<boolean> {
  clearTimeout(timer);
  if (saving) await saving;
  await pushNow();
  return !pending;
}

/** Cambia i dati: si vedono subito, poi si salvano nell'account */
function setData(data: SavedData) {
  pending = true;
  state = { ...state, data, sync: "saving" };
  writeCache();
  emit();
  scheduleSave();
}

/** Accesso/uscita: carica i dati del nuovo utente (o svuota tutto) */
async function startSession(next: User | null) {
  clearTimeout(timer);
  user = next;
  pending = false;
  if (!user) { patch({ data: EMPTY, loaded: false, sync: "loading", browserData: null }); return; }
  const uid = user.id;

  // 1) Parto subito dalla copia locale, se c'è
  const cache = readCache();
  pending = !!cache?.pending;
  patch({ data: cache?.data ?? EMPTY, loaded: false, sync: "loading", browserData: null });

  // 2) Leggo l'account
  let remote: SavedData | null = null;
  let ok = true;
  try { remote = await fetchRemote(); } catch { ok = false; }
  if (user?.id !== uid) return;

  if (!ok) {
    // Niente connessione: con una copia locale si va avanti lo stesso
    if (cache) { patch({ loaded: true, sync: "error" }); }
    else { patch({ sync: "error" }); setTimeout(() => { if (user?.id === uid && !state.loaded) startSession(user); }, 5000); }
    return;
  }

  // 3) Se c'erano modifiche locali non inviate valgono quelle, altrimenti l'account
  const data = pending && cache ? cache.data : remote ?? EMPTY;
  // 4) Dati di prima degli account rimasti nel browser -> si chiede cosa farne
  const legacy = readJSON(LEGACY_KEY);
  const browserData = isSavedData(legacy) && !isEmpty(clean(legacy)) ? clean(legacy) : null;

  state = { ...state, data, loaded: true, sync: pending ? "saving" : "saved", browserData };
  writeCache();
  emit();
  if (pending) scheduleSave();
}
onUserChange((u) => { void startSession(u); });

/**
 * Rilegge l'account (se non ho modifiche in sospeso): così si vedono le
 * modifiche fatte su un altro dispositivo
 */
async function refresh() {
  if (!user || !state.loaded || pending || state.browserData) {
    if (pending && state.sync === "error") scheduleSave(); // riprovo a salvare
    return;
  }
  const uid = user.id;
  try {
    const remote = await fetchRemote();
    if (user?.id !== uid || pending) return;
    if (remote && JSON.stringify(remote) !== JSON.stringify(state.data)) {
      state = { ...state, data: remote, sync: "saved" };
      writeCache();
      emit();
    } else if (state.sync === "error") patch({ sync: "saved" });
  } catch { /* offline: riprovo al prossimo ritorno */ }
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") void refresh(); });
window.addEventListener("focus", () => void refresh());
window.addEventListener("online", () => { if (pending) scheduleSave(); else void refresh(); });

// Allinea le schede aperte nello stesso browser
window.addEventListener("storage", (e) => {
  if (user && e.key === cacheKey()) {
    const c = readCache();
    if (c) { pending = c.pending; patch({ data: c.data }); }
  }
  if (e.key === LANG_KEY) patch({ lang: loadLang() });
});

// Chiudendo la pagina con modifiche non salvate il browser chiede conferma
// (la copia locale le conserva comunque: partiranno alla prossima apertura)
window.addEventListener("beforeunload", (e) => { if (pending) e.preventDefault(); });

// Dati del browser di prima degli account

/**
 * Unisce due salvataggi: visti ed episodi si sommano; se un titolo ha due
 * voti diversi vince quello dell'account. Una serie con tutti gli episodi
 * risulta vista. Il profilo resta quello dell'account (i dati di prima
 * degli account non ne avevano uno).
 */
function mergeData(account: SavedData, browser: SavedData): SavedData {
  const seen: Record<string, boolean> = { ...account.seen };
  for (const [id, v] of Object.entries(browser.seen)) if (v) seen[id] = true;
  const rating: Record<string, number> = { ...browser.rating };
  for (const [id, v] of Object.entries(account.rating)) if (v > 0) rating[id] = v;
  const eps: Record<string, number[]> = { ...account.eps };
  for (const [id, list] of Object.entries(browser.eps)) {
    eps[id] = [...new Set([...(eps[id] || []), ...list])].sort((a, b) => a - b);
    if (epsOf(id) && eps[id].length >= epsOf(id)) seen[id] = true;
  }
  const back = Math.max(account.back ?? 0, browser.back ?? 0); // il conteggio più alto dei due
  const watch = { ...browser.watch, ...account.watch };          // le due liste "Da vedere" insieme
  return { seen, rating, eps, ...(account.profile ? { profile: account.profile } : {}), ...(back ? { back } : {}),
    ...(Object.keys(watch).length ? { watch } : {}) };
}

/**
 * Risposta alla domanda sui dati del browser. Dopo la scelta i dati del
 * browser vengono cancellati, così la domanda non torna più.
 */
export function resolveBrowserData(choice: "browser" | "account" | "merge") {
  const b = state.browserData;
  if (!b) return;
  state = { ...state, browserData: null };
  if (choice === "browser") setData(b);
  else if (choice === "merge") setData(mergeData(state.data, b));
  else emit();
  writeLS(LEGACY_KEY, null);
}

// Azioni - le uniche funzioni che modificano i dati

/** Numero totale di episodi di un titolo (0 per i film) */
const epsOf = (id: string) => (BY_ID[id]?.type !== "film" ? BY_ID[id]?.eps ?? 0 : 0);

/** Posizione di ogni titolo nell'ordine di uscita (DATA è già in quell'ordine) */
const RELEASE_POS: Record<string, number> = Object.fromEntries(DATA.map((d, i) => [d.id, i]));

/**
 * Nuovo valore del contatore "Ritorno al passato": +1 se il titolo che diventa
 * visto è uscito prima dell'ultimo titolo che avevi già visto (cioè l'avevi saltato)
 */
function backAfter(d: SavedData, id: string): number | undefined {
  const last = Math.max(-1, ...Object.keys(d.seen).filter((k) => d.seen[k]).map((k) => RELEASE_POS[k] ?? -1));
  const was = d.back ?? 0;
  const now = RELEASE_POS[id] < last ? was + 1 : was;
  return now || undefined;
}

/** Segna/toglie "visto". Per le serie spunta (o azzera) tutti gli episodi. */
export function setSeen(id: string, on: boolean) {
  const d = state.data;
  const n = epsOf(id);
  setData({
    ...d,
    // conta i recuperi solo quando il titolo passa da non visto a visto
    back: on && !d.seen[id] ? backAfter(d, id) : d.back,
    seen: { ...d.seen, [id]: on },
    eps: n ? { ...d.eps, [id]: on ? Array.from({ length: n }, (_, i) => i + 1) : [] } : d.eps,
    // visto -> esce dalla lista "Da vedere"
    watch: on ? withoutWatch(d.watch, id) : d.watch,
  });
}

/** La lista "Da vedere" senza un titolo (undefined se resta vuota) */
function withoutWatch(w: Record<string, number> | undefined, id: string) {
  if (!w?.[id]) return w;
  const rest = { ...w };
  delete rest[id];
  return Object.keys(rest).length ? rest : undefined;
}

/** Aggiunge/toglie un titolo dalla lista "Da vedere" */
export function toggleWatch(id: string) {
  const d = state.data;
  setData({ ...d, watch: d.watch?.[id] ? withoutWatch(d.watch, id) : { ...d.watch, [id]: Date.now() } });
}
export const toggleSeen = (id: string) => setSeen(id, !state.data.seen[id]);

/** Spunta/toglie un episodio. La serie è "vista" solo con tutti gli episodi. */
export function toggleEp(id: string, ep: number) {
  const d = state.data;
  const set = new Set(d.eps[id] || []);
  if (set.has(ep)) set.delete(ep); else set.add(ep);
  setData({
    ...d,
    eps: { ...d.eps, [id]: [...set].sort((a, b) => a - b) },
    seen: { ...d.seen, [id]: set.size === epsOf(id) },
    back: set.size === epsOf(id) && !d.seen[id] ? backAfter(d, id) : d.back,
  });
}

/**
 * Voto 1–6. Ripetere lo stesso voto lo azzera.
 * Votare un FILM lo segna anche come visto (una serie no: magari sei a metà).
 */
export function rate(id: string, n: number) {
  const d = state.data;
  const value = d.rating[id] === n ? 0 : n;
  const markSeen = value > 0 && !epsOf(id) && !d.seen[id];
  setData({ ...d, rating: { ...d.rating, [id]: value }, seen: markSeen ? { ...d.seen, [id]: true } : d.seen });
}

/** Aggiorna il profilo (solo i campi passati; stringa vuota = campo tolto) */
export function setProfile(p: Partial<Profile>) {
  const d = state.data;
  const next: Profile = { ...d.profile, ...p };
  for (const k of Object.keys(next) as (keyof Profile)[]) if (next[k] === "" || next[k] === undefined) delete next[k];
  setData({ ...d, profile: next });
}

/** Cambia lingua (solo su questo dispositivo) */
export function setLang(lang: Lang) {
  writeLS(LANG_KEY, lang);
  patch({ lang });
}

/** Sostituisce tutti i dati (usato dall'importazione del backup) */
export const replaceData = (data: SavedData) => setData(clean(data));

/** Dati attuali (per l'esportazione del backup, fuori dai componenti) */
export const getData = () => state.data;

/**
 * Prima di uscire dall'account: cancella la copia locale (su un PC
 * condiviso non resta niente). Se c'erano modifiche non salvate e non
 * partono, la copia resta e verranno inviate al prossimo accesso.
 */
/**
 * Esci dall'account: prima salva; se il salvataggio non parte (niente
 * connessione) chiede conferma con il messaggio dato. Usato dal menu
 * dell'avatar e dal Profilo.
 */
export async function logout(confirmMsg: string) {
  const ok = await clearLocalCopy();
  if (!ok && !confirm(confirmMsg)) return;
  await signOut();
}

export async function clearLocalCopy(): Promise<boolean> {
  const ok = await flush();
  if (ok && user) writeLS(cacheKey(), null);
  return ok;
}

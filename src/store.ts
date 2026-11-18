/* ============================================================================
   STORE — i dati personali salvati su QUESTO PC (localStorage del browser).
   - Ogni modifica (visto, voto, episodio) viene salvata subito, in automatico.
   - Se l'app è aperta in due schede, restano allineate (evento "storage").
   - I componenti leggono i dati con useStore() e si aggiornano da soli.
   ============================================================================ */
import { useSyncExternalStore } from "react";
import { BY_ID } from "./data/titles";
import type { Lang, SavedData } from "./types";

const KEY = "marvel-tracker-v1";        // dati personali
const LANG_KEY = "marvel-tracker-lang"; // lingua scelta

interface StoreState {
  data: SavedData;
  lang: Lang;
}

const EMPTY: SavedData = { seen: {}, rating: {}, eps: {} };

/** Legge i dati salvati; se mancano o sono rovinati riparte da vuoto.
    (try/catch: in alcune modalità private il salvataggio è bloccato) */
function load(): StoreState {
  let data = EMPTY;
  let lang: Lang = "it";
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (isSavedData(raw)) data = { seen: raw.seen, rating: raw.rating, eps: raw.eps || {} };
    if (localStorage.getItem(LANG_KEY) === "en") lang = "en";
  } catch {
    /* nessun dato utilizzabile: si parte da vuoto */
  }
  return { data, lang };
}

/** Controlla che un oggetto abbia la forma dei nostri dati */
export function isSavedData(x: unknown): x is SavedData {
  const o = x as SavedData | null;
  return !!o && typeof o.seen === "object" && typeof o.rating === "object";
}

let state: StoreState = load();
const listeners = new Set<() => void>();

/** Sostituisce lo stato, lo salva e avvisa i componenti */
function setState(next: StoreState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state.data));
    localStorage.setItem(LANG_KEY, state.lang);
  } catch {
    /* salvataggio non disponibile: l'app funziona lo stesso */
  }
  listeners.forEach((l) => l());
}
const setData = (data: SavedData) => setState({ ...state, data });

/** Hook React: restituisce lo stato e ridisegna il componente quando cambia */
export function useStore(): StoreState {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
  );
}

/* Allinea le schede aperte: se un'altra scheda salva, rileggo */
window.addEventListener("storage", (e) => {
  if (e.key === KEY || e.key === LANG_KEY) {
    state = load();
    listeners.forEach((l) => l());
  }
});

/* ============================================================================
   AZIONI — le uniche funzioni che modificano i dati
   ============================================================================ */

/** Numero totale di episodi di un titolo (0 per i film) */
const epsOf = (id: string) => (BY_ID[id]?.type !== "film" ? BY_ID[id]?.eps ?? 0 : 0);

/** Segna/toglie "visto". Per le serie spunta (o azzera) tutti gli episodi. */
export function setSeen(id: string, on: boolean) {
  const d = state.data;
  const n = epsOf(id);
  setData({
    ...d,
    seen: { ...d.seen, [id]: on },
    eps: n ? { ...d.eps, [id]: on ? Array.from({ length: n }, (_, i) => i + 1) : [] } : d.eps,
  });
}
export const toggleSeen = (id: string) => setSeen(id, !state.data.seen[id]);

/** Spunta/toglie un episodio. La serie è "vista" solo con TUTTI gli episodi. */
export function toggleEp(id: string, ep: number) {
  const d = state.data;
  const set = new Set(d.eps[id] || []);
  if (set.has(ep)) set.delete(ep); else set.add(ep);
  setData({
    ...d,
    eps: { ...d.eps, [id]: [...set].sort((a, b) => a - b) },
    seen: { ...d.seen, [id]: set.size === epsOf(id) },
  });
}

/** Voto 1–6. Ripetere lo stesso voto lo azzera.
    Votare un FILM lo segna anche come visto (una serie no: magari sei a metà). */
export function rate(id: string, n: number) {
  const d = state.data;
  const value = d.rating[id] === n ? 0 : n;
  const markSeen = value > 0 && !epsOf(id) && !d.seen[id];
  setData({ ...d, rating: { ...d.rating, [id]: value }, seen: markSeen ? { ...d.seen, [id]: true } : d.seen });
}

/** Cambia lingua */
export const setLang = (lang: Lang) => setState({ ...state, lang });

/** Sostituisce tutti i dati (usato dall'importazione del backup) */
export const replaceData = (data: SavedData) => setData({ seen: data.seen, rating: data.rating, eps: data.eps || {} });

/** Dati attuali (per l'esportazione del backup, fuori dai componenti) */
export const getData = () => state.data;

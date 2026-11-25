/* ============================================================================
   SCELTE DEL CATALOGO (universo, ordine, percorso, tipi…) e costruzione
   dei gruppi dell'elenco.
   - Le scelte sono tenute in App, così restano uguali quando torni da una scheda.
   - All'avvio partono dalle "preferenze di visione" del profilo.
   - buildGroups è usata dal Catalogo e dalla bacheca (per il "prossimo titolo").
   ============================================================================ */
import { DATA } from "./data/titles";
import { PATHS, UNIVERSES } from "./data/meta";
import type { Lang, Order, Profile, Title, TitleType } from "./types";

/** Tutti i tipi, nell'ordine dei filtri */
export const ALL_TYPES: TitleType[] = ["film", "serie", "anim", "special", "short"];

/** Tutti gli ordini, nell'ordine dei pulsanti */
export const ORDERS: Order[] = ["release", "chrono", "phase", "paths"];

export interface HomeState {
  uni: string;            // "all" | "mcu" | "xmen"… (vedi UNIVERSES)
  order: Order;
  path: string;           // percorso scelto (order = "paths")
  types: TitleType[];     // tipi mostrati (scelta multipla; vuoto = tutti)
}

export const defaultHome: HomeState = { uni: "all", order: "release", path: "ironman", types: [] };

/** Scelte "pulite": valori non validi (es. da una versione precedente
    dell'app o da un profilo vecchio) tornano ai predefiniti, altrimenti
    l'elenco resterebbe vuoto. */
export function sanitize(raw: Partial<HomeState>): HomeState {
  return {
    uni: UNIVERSES.some((u) => u.k === raw.uni) ? raw.uni! : defaultHome.uni,
    order: ORDERS.includes(raw.order as Order) ? raw.order! : defaultHome.order,
    path: PATHS.some((p) => p.key === raw.path) ? raw.path! : defaultHome.path,
    // solo tipi validi; se sono accesi tutti equivale a "Tutti" (lista vuota)
    types: cleanTypes(raw.types),
  };
}

/** Tipi validi e senza doppioni; tutti accesi (o nessuno) = [] cioè "Tutti" */
function cleanTypes(raw: unknown): TitleType[] {
  if (!Array.isArray(raw)) return [];
  const ok = ALL_TYPES.filter((ty) => raw.includes(ty));
  return ok.length === ALL_TYPES.length ? [] : ok;
}

/** Le preferenze di visione del profilo, come scelte del Catalogo */
export const prefsToHome = (p?: Profile): HomeState =>
  sanitize({ uni: p?.prefUni, order: p?.prefOrder, path: p?.prefPath, types: p?.prefTypes });

/** Il "prossimo da guardare" secondo le preferenze di visione:
    il primo titolo non visto che viene DOPO quello visto più in fondo
    alla lista. I titoli saltati più indietro non contano (se li hai
    lasciati indietro è una scelta tua). Le serie iniziate contano come
    "arrivato fin qui", ma non vengono proposte: stanno già in
    "Continua a guardare". Se la lista è finita non c'è un prossimo.
    n = quanti titoli restituire (il prossimo e quelli che vengono dopo). */
export function nextUp(list: Title[], isSeen: (d: Title) => boolean, isStarted: (d: Title) => boolean, n = 1): Title[] {
  let last = -1; // posizione dell'ultimo titolo visto (o iniziato)
  list.forEach((d, i) => { if (isSeen(d) || isStarted(d)) last = i; });
  return list.slice(last + 1).filter((d) => !isSeen(d) && !isStarted(d)).slice(0, n);
}

export interface Group { h: string | null; items: Title[] }

/** Testi che servono per le intestazioni dei gruppi */
type GroupT = (k: "phaseN" | "inf" | "multi" | "noPhase") => string;

/* ---------------------------------------------------------------------------
   Costruisce i gruppi dell'elenco secondo universo, tipo e ordine.
   - Uscita: una lista per anno
   - Cronologico: dentro ogni universo (con "Tutto" un gruppo per universo)
   - Fase: Fasi per l'MCU, un gruppo per ciascun altro universo
   - Percorsi: titoli del percorso; se attraversa più universi, per anno
   --------------------------------------------------------------------------- */
export function buildGroups(s: HomeState, lang: Lang, t: GroupT): Group[] {
  const items = DATA.filter((d) => (s.uni === "all" || d.uni === s.uni) && (s.types.length === 0 || s.types.includes(d.type)));
  const unis = UNIVERSES.filter((u) => u.k !== "all" && items.some((d) => d.uni === u.k));
  const byChrono = (arr: Title[]) => [...arr].sort((a, b) => a.chrono - b.chrono);

  if (s.order === "release") return [{ h: null, items }];

  if (s.order === "chrono") {
    if (unis.length <= 1) return [{ h: null, items: byChrono(items) }];
    return unis.map((u) => ({ h: u[lang], items: byChrono(items.filter((d) => d.uni === u.k)) }));
  }

  if (s.order === "phase") {
    const mcu = items.filter((d) => d.uni === "mcu");
    // Fasi numerate in ordine; i titoli senza Fase (serie Netflix) in un gruppo a parte in fondo
    const phases = [...new Set(mcu.map((d) => d.phase))].sort((a, b) => (a ?? 99) - (b ?? 99));
    return [
      ...phases.map((p) => {
        const its = mcu.filter((d) => d.phase === p);
        if (p === undefined) return { h: t("noPhase"), items: its };
        return { h: `${t("phaseN")} ${p} · ${its[0].saga ? t(its[0].saga) : ""}`, items: its };
      }),
      ...unis.filter((u) => u.k !== "mcu").map((u) => ({ h: u[lang], items: items.filter((d) => d.uni === u.k) })),
    ];
  }

  const p = PATHS.find((x) => x.key === s.path) ?? PATHS[0];
  const its = items.filter((d) => d[p.kind].includes(p.key));
  const multiUni = new Set(its.map((d) => d.uni)).size > 1;
  return [{ h: p[lang], items: multiUni ? its : byChrono(its) }];
}

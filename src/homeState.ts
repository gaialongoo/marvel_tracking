/* ============================================================================
   SCELTE DELL'ELENCO IN HOME (collezione, versione, ordine, percorso, tipi…)
   Tenute in App, così restano uguali quando torni da una scheda.
   ============================================================================ */
import type { TitleType } from "./types";

/** Tutti i tipi, nell'ordine dei filtri */
export const ALL_TYPES: TitleType[] = ["film", "serie", "anim", "special", "short"];

export interface HomeState {
  coll: string;                                           // "all" | chiave di una collezione Disney+ (vedi COLLECTIONS)
  full: boolean;                                          // false = lista come su Disney+, true = completa
  order: "dplus" | "release" | "chrono" | "phase" | "paths"; // "dplus" = ordine della collezione
  path: string;                                           // percorso scelto (order = "paths")
  types: TitleType[];                                     // tipi mostrati (scelta multipla; vuoto = tutti)
  statsOpen: boolean;                                     // statistiche dettagliate aperte
}

export const defaultHome: HomeState = { coll: "all", full: false, order: "release", path: "ironman", types: [], statsOpen: false };

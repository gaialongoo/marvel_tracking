/* ============================================================================
   SCELTE DELL'ELENCO IN HOME (universo, ordine, percorso, tipo…)
   Tenute in App, così restano uguali quando torni da una scheda.
   ============================================================================ */
import type { TitleType } from "./types";

export interface HomeState {
  uni: string;                                   // "all" | "mcu" | "xmen"…
  order: "release" | "chrono" | "phase" | "paths";
  path: string;                                  // percorso scelto (order = "paths")
  type: "all" | TitleType;                       // filtro tipo
  statsOpen: boolean;                            // statistiche dettagliate aperte
}

export const defaultHome: HomeState = { uni: "all", order: "release", path: "ironman", type: "all", statsOpen: false };

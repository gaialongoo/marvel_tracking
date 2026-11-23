/* ============================================================================
   TIPI DI DATI — descrivono la forma di titoli, collegamenti e dati salvati.
   ============================================================================ */

/** Lingue dell'interfaccia */
export type Lang = "it" | "en";

/** Testo nelle due lingue */
export interface I18nText {
  it: string;
  en: string;
}

/** Tipo di titolo: film, serie live-action, animazione, speciale, corto (One-Shot) */
export type TitleType = "film" | "serie" | "anim" | "special" | "short";

/** Campi di un titolo che possono essere verificati sulle fonti ufficiali */
export type Field = "it" | "y" | "min" | "eps" | "phase" | "chrono" | "pc";

/** Collegamento verso un altro titolo, con il motivo */
export interface Link {
  id: string;
  why: I18nText;
}

/** Un titolo del catalogo (film, serie o animazione) */
export interface Title {
  id: string;            // identificativo unico (usato nell'indirizzo #/t/<id>)
  uni: string;           // universo: "mcu", "xmen", "spider"… (vedi UNIVERSES)
  type: TitleType;
  t: I18nText;           // titolo ufficiale italiano / originale
  y: number;             // anno di uscita
  min: number;           // durata in minuti (serie: totale approssimativo)
  eps?: number;          // numero di episodi (solo serie/animazione)
  phase?: number;        // Fase MCU (assente per le serie Netflix)
  saga?: "inf" | "multi";// Saga MCU
  chrono: number;        // posizione nella linea temporale DEL SUO universo
  c: string;             // colore della miniatura generata
  abbr: string;          // sigla nella miniatura
  poster: string | null; // in futuro: URL della locandina
  chars: string[];       // personaggi (per i percorsi)
  themes: string[];      // temi (per i percorsi tematici)
  before: Link[];        // da vedere prima
  after: Link[];         // cosa viene dopo
  pc: number;            // numero di scene post-credits
  officialUrl?: string;  // pagina ufficiale (marvel.com / Disney+)
  unverified: Field[];   // campi NON ancora confermati da una fonte ufficiale (vuoto = tutto verificato)
}

/** Ordini di visione del Catalogo */
export type Order = "release" | "chrono" | "phase" | "paths";

/** Profilo dell'utente (pagina Profilo). Tutti i campi sono facoltativi:
    se mancano si usano i valori predefiniti (nome = parte dell'email prima di "@"). */
export interface Profile {
  name?: string;      // nome mostrato nella bacheca e nel menu
  avatar?: string;    // chiave dell'avatar (vedi components/Avatar.tsx)
  favChar?: string;   // personaggio preferito (stessa lista degli avatar)
  favTitle?: string;  // id del titolo preferito (scelto a mano)
  bio?: string;       // frase breve
  prefUni?: string;   // preferenze di visione: universo con cui si apre il Catalogo
  prefOrder?: Order;  //   … ordine
  prefPath?: string;  //   … percorso (se l'ordine è "paths")
}

/** Dati personali salvati nell'account (e in copia nel browser) */
export interface SavedData {
  seen: Record<string, boolean>;   // titoli visti
  rating: Record<string, number>;  // voto 1–6 (Gemme)
  eps: Record<string, number[]>;   // episodi visti per serie
  profile?: Profile;               // profilo (assente nei salvataggi più vecchi)
}

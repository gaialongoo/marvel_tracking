/* ============================================================================
   TESTI DEI TITOLI — sinossi senza spoiler, riassunto completo, scene dopo i titoli
   ----------------------------------------------------------------------------
   Scritti da Claude (IT + EN), a blocchi, un file per blocco.
   - syn:  sinossi SENZA spoiler (solo la premessa)
   - full: riassunto completo CON spoiler (trama, finale, rivelazioni)
   - pc:   una descrizione per ogni scena dopo i titoli (nell'ordine in cui compaiono)
   Fonti: pagine ufficiali (Disney+, marvel.com) per la premessa; per la trama
   completa anche fonti secondarie affidabili (Wikipedia).
   Per non riprodurre testi protetti, le sinossi ufficiali NON sono copiate:
   la scheda rimanda alla pagina ufficiale Disney+.
   ============================================================================ */
import { MCU1 } from "./mcu1";
import type { TitleTexts } from "./types";

export type { TitleTexts };

/** Tutti i testi, per id del titolo */
export const TEXTS: Record<string, TitleTexts> = { ...MCU1 };

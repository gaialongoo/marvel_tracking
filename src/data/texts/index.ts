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
import { MCU2 } from "./mcu2";
import { MCU3 } from "./mcu3";
import { MCU4 } from "./mcu4";
import { NETFLIX } from "./netflix";
import { FOX } from "./fox";
import { FILMS } from "./films";
import { TV } from "./tv";
import { ANIM } from "./anim";
import type { TitleTexts } from "./types";

export type { TitleTexts };

/** Tutti i testi, per id del titolo */
export const TEXTS: Record<string, TitleTexts> = { ...MCU1, ...MCU2, ...MCU3, ...MCU4, ...NETFLIX, ...FOX, ...FILMS, ...TV, ...ANIM };

/* Forma dei testi di un titolo (vedi texts/index.ts) */
import type { I18nText } from "../../types";

export interface TitleTexts {
  syn?: I18nText;   // sinossi senza spoiler
  full?: I18nText;  // riassunto completo con spoiler
  pc?: I18nText[];  // scene dopo i titoli, in ordine
}

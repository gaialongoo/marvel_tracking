/* ============================================================================
   FILTRO DELLE PAROLE OFFENSIVE — per @tag, nome e frase del profilo.
   Controllo fatto dall'app (non dal database): ferma gli insulti più comuni
   in italiano e inglese; per il resto ci sono "Segnala" e "Blocca".
   Il testo viene "normalizzato" prima del controllo: minuscole, niente
   accenti, numeri usati come lettere (c4zz0 → cazzo), lettere ripetute.
   ============================================================================ */

/** Parole vietate ANCHE dentro altre parole (es. "superstronzo"):
    abbastanza lunghe e specifiche da non dare falsi allarmi */
const INSIDE = [
  // italiano
  "cazz", "stronz", "puttan", "vaffanc", "coglion", "froci", "ricchion", "bocchin",
  "diocan", "dioporc", "porcodio", "porcamadonn", "merdos", "ritardat",
  // inglese
  "fuck", "bitch", "nigga", "nigge", "faggot", "whore", "motherf", "asshole", "dickhead",
  // odio
  "hitler", "nazis",
];

/** Parole vietate solo se sono una parola intera: dentro altre parole
    sarebbero innocue (es. "negroni", "grape", "culotte", "Dick Grayson" no:
    "dick" da solo sì) */
const WHOLE = [
  "merda", "troia", "negro", "negri", "nazi", "culo", "pirla", "frocio",
  "shit", "rape", "slut", "retard", "cunt", "cock", "porn", "porno", "nude", "kkk",
];

/** Numeri e simboli usati come lettere */
const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "@": "a", "$": "s" };

/** Normalizza: minuscole, senza accenti, leet → lettere, e tre o più
    lettere uguali di fila diventano due (cazzzzo → cazzo, fuuuck → fuuck) */
function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[0134578@$]/g, (c) => LEET[c])
    .replace(/(.)\1{2,}/g, "$1$1");
}

/** true se il testo contiene una parola vietata */
export function isOffensive(text: string): boolean {
  const n = norm(text);
  const flat = n.replace(/[^a-z]/g, "");             // tutto attaccato (tag tipo "mario_cazz0")
  // con le doppie ridotte (fuuck → fuck), ma solo per le parole che non hanno
  // doppie (altrimenti "nigge" → "nige" darebbe allarme su "Nigel")
  const flat1 = flat.replace(/(.)\1+/g, "$1");
  const double = /(.)\1/;
  if (INSIDE.some((w) => flat.includes(w) || (!double.test(w) && flat1.includes(w)))) return true;
  return n.split(/[^a-z]+/).some((w) => WHOLE.includes(w));
}

/* ============================================================================
   AVATAR (dati) — i personaggi del profilo in stile "si affacciano dal bordo":
   testa larga e tonda, contorno nero spesso, colori piatti, occhi a puntino,
   due manine appoggiate a una linea in basso e un dettaglio del personaggio
   che spunta (scudo, Mjolnir, artigli, guanto…).
   - Disegni SVG originali, fatti da noi (viewBox 100x100).
   - Effetto "disegnato a mano": un filtro SVG fa ondeggiare leggermente
     tutte le linee, come un tratto a pennarello (vedi HAND più sotto).
   - La stessa lista serve per scegliere il "personaggio preferito".
   - path = percorso del Catalogo legato al personaggio (se esiste):
     cliccando il preferito nel Profilo si apre quel percorso.
   Il componente che li mostra è in components/Avatar.tsx.
   ============================================================================ */
import type { I18nText } from "../types";

export interface AvatarDef extends I18nText {
  key: string;
  villain?: boolean;  // true = cattivo (mostrato in un gruppo a parte)
  bg: string;         // colore del personaggio (per ora non usato: il cerchio ha un grigio unico)
  path?: string;      // chiave del percorso in data/meta.ts (PATHS)
  svg: string;        // disegno (stringa costante scritta da noi)
}

/* ---------------------------------------------------------------------------
   PEZZI COMUNI
   La testa è un'ellisse larga (centro 50,52 · raggi 35 e 30) che poggia
   sulla linea del bordo a y = 82.
   --------------------------------------------------------------------------- */
const INK = "#1a1a1a";
const SKIN = "#f7caa6";
const PALE = "#f6e6da";
const SILVER = "#c9cdd4";
const GOLD = "#f5c43c";
/** Contorno nero spesso, uguale per tutti i pezzi */
const OL = `stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"`;
/** Forma con contorno (extra = attributi in più, es. uno spessore diverso) */
const f = (d: string, c: string, extra = "") => `<path d="${d}" fill="${c}" ${OL} ${extra}/>`;
/** Linea senza riempimento */
const line = (d: string, c = INK, w = 2.6) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
/** Cerchio con contorno */
const circ = (x: number, y: number, r: number, c: string, extra = "") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${OL} ${extra}/>`;
/** Specchia un tracciato rispetto all'asse verticale x = 50
    (solo comandi a coppie di numeri M, L, Q: niente archi A né H/V da soli) */
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${+(100 - Number(x)).toFixed(2)} ${y}`);
/** Forma + la sua copia speculare */
const pair = (d: string, c: string, extra = "") => f(d, c, extra) + f(mirror(d), c, extra);

/** Testa e ripasso del suo contorno (da mettere sopra i dettagli, per bordi puliti) */
const head = (c: string) => `<ellipse cx="50" cy="52" rx="35" ry="30" fill="${c}" ${OL}/>`;
const RIM = `<ellipse cx="50" cy="52" rx="35" ry="30" fill="none" ${OL}/>`;
/** Linea del bordo su cui si appoggiano le mani (nera: risalta sul
    fondo grigio chiaro del cerchio, vedi .avatar in styles.css) */
const LEDGE = line("M3 82 H97", INK, 3.2);
/** Una manina: ovale + due righe per le dita */
const hand = (x: number, c: string, fingers = INK) =>
  `<ellipse cx="${x}" cy="82" rx="9.5" ry="6.8" fill="${c}" ${OL}/>` + line(`M${x - 3} 78.5 V83 M${x + 3} 78.5 V83`, fingers, 1.8);
const hands = (c: string, fingers = INK) => hand(27, c, fingers) + hand(73, c, fingers);
/** Occhi a puntino nero */
const eyes = (y = 61, rx = 3.3, ry = 4) => `<ellipse cx="40" cy="${y}" rx="${rx}" ry="${ry}" fill="${INK}"/><ellipse cx="60" cy="${y}" rx="${rx}" ry="${ry}" fill="${INK}"/>`;
/** Sorriso, sorriso furbo, bocca seria, broncio */
const smile = (y = 71) => line(`M45 ${y} Q50 ${y + 4} 55 ${y}`, INK, 2.4);
const smirk = (y = 71) => line(`M44.5 ${y + 1} Q51 ${y + 4} 56 ${y - 1.5}`, INK, 2.4);
const flat = (y = 72) => line(`M45 ${y} H55`, INK, 2.4);
const frown = (y = 73) => line(`M45 ${y} Q50 ${y - 3.5} 55 ${y}`, INK, 2.4);
/** Sopracciglia (angry = inclinate verso il centro) */
const brows = (c = INK, y = 54, angry = false) =>
  angry ? line(`M33 ${y - 1} L45 ${y + 2.5} M67 ${y - 1} L55 ${y + 2.5}`, c, 3.2) : line(`M35 ${y} Q39.5 ${y - 1.8} 44 ${y} M56 ${y} Q60.5 ${y - 1.8} 65 ${y}`, c, 2.4);

/** Capelli sulla testa con la frangia (calotta) */
const capHair = (c: string) => f("M15.5 56 Q14 25 50 22 Q86 25 84.5 56 Q80 44 70 43 Q60 38 50 42 Q40 38 30 43 Q20 44 15.5 56Z", c);
/** Capelli lunghi ai lati (da disegnare PRIMA della testa) */
const sideHair = (c: string) => pair("M17.5 54 Q12 70 15.5 82 L28 82 L28.5 58Z", c);
/** Orecchie (da disegnare prima della testa) */
const ears = (c: string) => pair("M17 60 Q9 60 10 67 Q11 73 19 71Z", c);
/** Stella a 5 punte */
function star(x: number, y: number, r: number, c: string, outline = true) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return `<polygon points="${pts}" fill="${c}" ${outline ? `${OL} stroke-width="2"` : ""}/>`;
}

/** Ragnatela: fili dal centro (50, 56) fino al bordo della testa + 3 anelli ad arco */
function web() {
  const N = 14, cy = 56, RX = 35, RY = 30, E: [number, number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2, dx = Math.cos(a), dy = Math.sin(a);
    // distanza dal centro della ragnatela al bordo dell'ellisse lungo questa direzione
    const A = dx * dx / (RX * RX) + dy * dy / (RY * RY), B = 2 * (cy - 52) * dy / (RY * RY), C = (cy - 52) ** 2 / (RY * RY) - 1;
    E.push([dx, dy, (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A)]);
  }
  const P = (i: number, r: number) => `${(50 + E[i % N][0] * E[i % N][2] * r).toFixed(1)} ${(cy + E[i % N][1] * E[i % N][2] * r).toFixed(1)}`;
  let d = E.map((_, i) => `M50 ${cy} L${P(i, 1)}`).join(" ");
  for (const r of [0.3, 0.58, 0.84]) {
    d += ` M${P(0, r)}`;
    for (let i = 1; i <= N; i++) {
      // punto di controllo a metà fra due fili, un po' verso il centro: archi "a festone"
      const a = (Math.PI * 2 * (i - 0.5)) / N - Math.PI / 2, tm = (E[i - 1][2] + E[i % N][2]) / 2 * r * 0.86;
      d += ` Q${(50 + Math.cos(a) * tm).toFixed(1)} ${(cy + Math.sin(a) * tm).toFixed(1)} ${P(i, r)}`;
    }
  }
  return line(d, INK, 1.2);
}

/** Artigli di Wolverine: tre lame da ogni mano, dietro la testa */
const CLAWS = "M19 76 L6 50 M25 74 L15 45 M31 75 L25 47 M81 76 L94 50 M75 74 L85 45 M69 75 L75 47";
/** Impugnatura di una katana che spunta da dietro la testa (x, y = elsa; deg = inclinazione) */
const katana = (x: number, y: number, deg: number) =>
  `<g transform="translate(${x} ${y}) rotate(${deg})">`
  + `<rect x="-3" y="-21" width="6" height="19" rx="1.5" fill="#3a3a3a" ${OL} stroke-width="2.4"/>`
  + line("M-3 -17 L3 -13 M3 -17 L-3 -13 M-3 -11 L3 -7 M3 -11 L-3 -7", "#8a8f98", 1.2)
  + `<rect x="-6.5" y="-3" width="13" height="4" rx="1.2" fill="#c9a24b" ${OL} stroke-width="2.2"/></g>`;

/* ---------------------------------------------------------------------------
   I PERSONAGGI — 16 eroi principali, poi i cattivi
   (ordine dei pezzi = ordine di disegno: prima il dietro, poi il davanti)
   --------------------------------------------------------------------------- */
const LIST: AvatarDef[] = [
  {
    key: "spidey", it: "Spider-Man", en: "Spider-Man", bg: "#dfe9ff", path: "spidey",
    // maschera rossa con la ragnatela, grandi occhi bianchi bordati di nero
    svg: head("#e1262d") + web()
      + f("M47.5 61.5 Q45.5 43.5 24.5 44.5 Q20.5 57 28.5 64.5 Q39 70 47.5 61.5Z", "#fff", 'stroke-width="5"')
      + f("M52.5 61.5 Q54.5 43.5 75.5 44.5 Q79.5 57 71.5 64.5 Q61 70 52.5 61.5Z", "#fff", 'stroke-width="5"')
      + RIM + LEDGE + hands("#e1262d"),
  },
  {
    key: "ironman", it: "Iron Man", en: "Iron Man", bg: "#fff1d6", path: "ironman",
    // casco rosso con le "orecchie" tonde, maschera dorata col rosso che scende a punta fra gli occhi
    svg: circ(15, 58, 7.5, "#d8262f") + circ(85, 58, 7.5, "#d8262f") + head("#d8262f")
      + f("M23 46 Q26 37 37 36 L44 48 H56 L63 36 Q74 37 77 46 L77 66 Q74 79 64 82 H36 Q26 79 23 66Z", GOLD)
      + f("M30 55 L45 58 L44 62.5 L31 60Z", "#fff", 'stroke-width="2.6"') + f("M70 55 L55 58 L56 62.5 L69 60Z", "#fff", 'stroke-width="2.6"')
      + line("M42 74 H58", INK, 2.4) + line("M32 66 L37 78 M68 66 L63 78", INK, 1.8)
      + RIM + LEDGE + hands("#d8262f"),
  },
  {
    key: "cap", it: "Captain America", en: "Captain America", bg: "#ffe3e3", path: "cap",
    // cappuccio blu con la "A" e le ali, viso scoperto; lo scudo spunta al posto della mano destra
    svg: pair("M18 48 Q9 43 7.5 31 L11.5 35 L12 28.5 L15.5 34 L17.5 28 L19.5 35.5 L23 46Z", "#fff", 'stroke-width="2.4"')
      + head("#2e5fae")
      + f("M25 82 L25 64 Q25 53 33 52 Q41 51 46 57 H54 Q59 51 67 52 Q75 53 75 64 L75 82Z", SKIN)
      + eyes()
      + f("M40.5 47.5 L50 24.5 L59.5 47.5 H54.2 L52.5 42.8 H47.5 L45.8 47.5Z M48.7 38.6 H51.3 L50 34.6Z", "#fff", 'stroke-width="2" fill-rule="evenodd"')
      + smile() + RIM + LEDGE + hand(27, "#d8262f")
      + circ(70, 83, 12, "#d8262f") + `<circle cx="70" cy="83" r="8.6" fill="#fff"/><circle cx="70" cy="83" r="5.4" fill="#d8262f"/><circle cx="70" cy="83" r="3.6" fill="#2e5fae"/>`
      + star(70, 83, 2.6, "#fff", false),
  },
  {
    key: "hulk", it: "Hulk", en: "Hulk", bg: "#efe3ff", path: "hulk",
    // pelle verde, capelli verde scuro spettinati, sopracciglia aggrottate
    svg: ears("#6bb34a") + head("#6bb34a")
      + f("M15.5 55 Q14 33 23.5 26 L28.5 30 L31 20.5 L38 26.5 L43.5 17 L50 24.5 L56.5 17 L62 26.5 L69 20.5 L71.5 30 L76.5 26 Q86 33 84.5 55 Q80 45 74 47 Q71 40 64 42 Q59 36 52 40 Q46 35 40 41 Q33 37 28 45 Q20 43 15.5 55Z", "#2f5a2a")
      + brows(INK, 54, true) + eyes(62) + smile() + RIM + LEDGE + hands("#6bb34a"),
  },
  {
    key: "thor", it: "Thor", en: "Thor", bg: "#e3eeff", path: "thor",
    // elmo d'argento con le ali, capelli biondi ai lati; Mjolnir spunta a destra
    svg: pair("M20 52 Q8 38 10 16 Q18 26 26 38Z", SILVER)
      + line("M13 24 Q17 33 22 41 M15 35 Q18 40 22 45 M87 24 Q83 33 78 41 M85 35 Q82 40 78 45", "#8d939c", 1.6)
      + sideHair("#f2c14e") + head(SKIN)
      + f("M15.5 55 Q15 26 50 22 Q85 26 84.5 55 Q76 47 62 47 L58 51 H42 L38 47 Q24 47 15.5 55Z", SILVER)
      + f("M45 23.5 L50 13 L55 23.5Z", SILVER, 'stroke-width="2.6"') + line("M30 39 H70", "#8d939c", 1.6)
      + brows("#c79a2a", 56) + eyes(62) + smile() + RIM + LEDGE
      + `<rect x="80.5" y="60" width="4" height="18" rx="1.5" fill="#8a5a33" ${OL} stroke-width="2.2"/><rect x="73" y="48" width="19" height="13" rx="2" fill="#9aa0a8" ${OL}/>`
      + hands(SKIN),
  },
  {
    key: "blackwidow", it: "Black Widow", en: "Black Widow", bg: "#ffe6e0", path: "blackwidow",
    // capelli rossi con il ciuffo di lato, guanti neri; la clessidra rossa sul bordo
    svg: sideHair("#d8452e") + head(SKIN)
      + f("M15.5 56 Q14 25 50 22 Q86 25 84.5 56 Q78 40 62 40 Q46 38 36 46 Q26 50 15.5 56Z", "#d8452e")
      + eyes() + smile() + RIM + LEDGE
      + f("M44 85 L56 85 L50 91 L56 97 L44 97 L50 91Z", "#d8262f", 'stroke-width="2.2"')
      + hands("#2a2a30", "#6b6b75"),
  },
  {
    key: "hawkeye", it: "Occhio di Falco", en: "Hawkeye", bg: "#efe3ff", path: "hawkeye",
    // capelli castani corti, occhiali viola; una freccia spunta a destra
    svg: ears(SKIN) + head(SKIN) + capHair("#6b4428")
      + f("M28 56 L46 56 Q48 56 47.5 59.5 Q46.5 66 38.5 66 Q30 66 28.5 60Z", "#5b3a8c", 'stroke-width="2.6"')
      + f("M72 56 L54 56 Q52 56 52.5 59.5 Q53.5 66 61.5 66 Q70 66 71.5 60Z", "#5b3a8c", 'stroke-width="2.6"')
      + line("M47 58 H53", INK, 2.4) + smirk(72) + RIM + LEDGE
      + line("M78 80 L92 52", "#8a5a33", 2.6) + f("M92 52 L90 46 L96 49Z", "#9aa0a8", 'stroke-width="2"')
      + f("M78.5 79 L74 76 L76.5 82Z M80 76 L76 72.5 L77.5 78Z", "#5b3a8c", 'stroke-width="1.8"')
      + hands("#5b3a8c", "#2a1a40"),
  },
  {
    key: "strange", it: "Doctor Strange", en: "Doctor Strange", bg: "#e0ecff", path: "strange",
    // colletto rosso del mantello, capelli neri con le tempie grigie, pizzetto; un cerchio magico arancione
    svg: pair("M17 76 L8 34 Q20 46 27 66Z", "#c62a30") + head(SKIN)
      + capHair("#2a2a2a") + pair("M16.5 54 Q17 45 21 41 L24 50Z", "#d5dae2", 'stroke-width="1.8"')
      + brows(INK, 55) + eyes(62)
      + line("M43 71 Q50 68 57 71", "#2a2a2a", 2.8) + f("M47 74 Q50 80 53 74Z", "#2a2a2a", 'stroke-width="2"')
      + RIM + LEDGE
      + `<circle cx="80" cy="66" r="11" fill="none" stroke="#f59a23" stroke-width="2.4" stroke-dasharray="3 2.2"/><circle cx="80" cy="66" r="6.5" fill="none" stroke="#f59a23" stroke-width="1.8"/>`
      + hands(SKIN),
  },
  {
    key: "blackpanther", it: "Black Panther", en: "Black Panther", bg: "#ece4ff", path: "blackpanther",
    // maschera nera con le orecchie, decorazione d'argento, occhi bianchi; artigli d'argento
    svg: pair("M24 36 L22 20 L37 28Z", "#22222a") + head("#22222a")
      + line("M31 43 L50 53 L69 43 M50 24 V53 M39 28 L44 46 M61 28 L56 46", "#a9a3c9", 1.6)
      + `<path d="M29 55 L46 59 L44.5 64 L31 61Z M71 55 L54 59 L55.5 64 L69 61Z" fill="#fff" stroke="#a9a3c9" stroke-width="1.6" stroke-linejoin="round"/>`
      + line("M40 74 Q50 79 60 74", "#9b7bff", 2.2) + RIM + LEDGE
      + hands("#22222a", "#a9a3c9")
      + line("M22 76 L21 71 M27 75 V69.5 M32 76 L33 71 M68 76 L67 71 M73 75 V69.5 M78 76 L79 71", "#e8e8f0", 1.8),
  },
  {
    key: "captainmarvel", it: "Captain Marvel", en: "Captain Marvel", bg: "#ffeacc", path: "captainmarvel",
    // capelli biondi, guanti rossi, la stella dorata della tuta sul bordo
    svg: sideHair("#f2c14e") + head(SKIN)
      + f("M15.5 56 Q16 24 54 22 Q84 25 84.5 54 Q76 41 60 41 Q44 40 36 45 Q26 48 15.5 56Z", "#f2c14e")
      + brows("#c79a2a", 55) + eyes(62) + smirk(72) + RIM + LEDGE
      + circ(50, 88, 9, "#2e4a9e") + star(50, 88, 6.2, GOLD)
      + hands("#c62a30"),
  },
  {
    key: "wanda", it: "Scarlet Witch", en: "Scarlet Witch", bg: "#ffe0e6", path: "wanda",
    // capelli ramati, corona rossa a punte; scie di magia rossa
    svg: sideHair("#a8432f") + head(SKIN)
      + f("M15.5 57 Q16 32 50 31 Q84 32 84.5 57 Q76 45 50 45 Q24 45 15.5 57Z", "#a8432f")
      + f("M26 42 L28 22 L38 32 L50 9 L62 32 L72 22 L74 42 Q50 34 26 42Z", "#d8262f")
      + eyes(63) + smile(73) + RIM + LEDGE
      + line("M82 74 Q90 66 84 60 Q78 56 82 50 M86 64 Q93 60 92 53", "#e0262f", 2.4)
      + hands("#b3202a"),
  },
  {
    key: "loki", it: "Loki", en: "Loki", bg: "#dff3e6", path: "loki",
    // capelli neri lunghi, elmo dorato con le corna, sorriso furbo
    svg: sideHair("#222") + pair("M33 34 Q25 20 14 12 Q28 13 42 27Z", GOLD)
      + head(PALE)
      + f("M15.5 56 Q16 27 50 23 Q84 27 84.5 56 Q76 46 62 45 L56 52 H44 L38 45 Q24 46 15.5 56Z", GOLD)
      + brows(INK, 57) + eyes(63) + smirk(73) + RIM + LEDGE + hands("#2f7a46"),
  },
  {
    key: "wolverine", it: "Wolverine", en: "Wolverine", bg: "#fff3c8", path: "wolverine",
    // maschera gialla con le "pinne" nere, basette; tre artigli da ogni mano
    svg: line(CLAWS, INK, 4.6) + line(CLAWS, "#dfe3ea", 2.2)
      + head("#f7cb2f")
      + f("M21 62 Q20 50 27 44 L12 13 Q32 24 41.5 39 Q50 36.5 58.5 39 Q68 24 88 13 L73 44 Q80 50 79 62 Q66 65 57 60 Q50 57 43 60 Q34 65 21 62Z", "#262626")
      + `<path d="M30 52 L45.5 56 L44 60.5 L32 58Z M70 52 L54.5 56 L56 60.5 L68 58Z" fill="#fff"/>`
      + f("M24 82 L24.5 66 Q35 67.5 43 63 Q50 61 57 63 Q65 67.5 75.5 66 L76 82Z", SKIN)
      + pair("M24.5 66 Q24 78 33 82 Q34 75 38 70 Q33 68.5 30 67Z", "#5a3a22", 'stroke-width="2"')
      + frown(76) + RIM + LEDGE + hands("#2f5bb8"),
  },
  {
    key: "deadpool", it: "Deadpool", en: "Deadpool", bg: "#ffe3e3", path: "deadpool",
    // maschera rossa con le macchie nere; due katane spuntano dietro la testa
    svg: katana(26, 27, -32) + katana(74, 27, 32)
      + head("#d42a2f")
      + pair("M19 49 Q33 40 47 54 Q46 69 31.5 69 Q17.5 65 19 49Z", "#262626", 'stroke-width="2.4"')
      + `<ellipse cx="34" cy="57" rx="6.4" ry="3.8" fill="#fff" transform="rotate(12 34 57)"/><ellipse cx="66" cy="57" rx="6.4" ry="3.8" fill="#fff" transform="rotate(-12 66 57)"/>`
      + line("M50 22.5 V42", "#8a1a20", 1.6) + RIM + LEDGE + hands("#d42a2f"),
  },
  {
    key: "daredevil", it: "Daredevil", en: "Daredevil", bg: "#ffe0e0", path: "daredevil",
    // maschera rossa con le cornette, lenti rosso scuro, bocca e mento scoperti
    svg: pair("M32 28 Q25 17 27.5 6 Q35 15.5 43 23Z", "#c4202a") + head("#c4202a")
      + line("M37 27 Q39.5 40 43.5 49 M63 27 Q60.5 40 56.5 49", "#8a1a20", 1.6)
      + f("M28 55 Q37.5 48 46.5 57.5 Q38 63 28 55Z", "#5a0a0e", 'stroke-width="2.6"')
      + f("M72 55 Q62.5 48 53.5 57.5 Q62 63 72 55Z", "#5a0a0e", 'stroke-width="2.6"')
      + f("M24 82 L24.5 69 Q38 64 50 71 Q62 64 75.5 69 L76 82Z", SKIN)
      + smirk(75) + RIM + LEDGE + hands("#c4202a"),
  },
  {
    key: "starlord", it: "Star-Lord", en: "Star-Lord", bg: "#ffe7d6", path: "gotg",
    // maschera di metallo con le grandi lenti rosse; le cuffie ai lati
    svg: circ(14, 57, 8, "#9aa0a8") + circ(86, 57, 8, "#9aa0a8") + line("M14 49 Q18 20 50 18 Q82 20 86 49", INK, 3.2)
      + head("#5c4a4a")
      + line("M50 22.5 V82", "#9aa0a8", 3.4)
      + f("M24 50 Q36 42 46 53 L44.5 66 Q31 69 24.5 60Z", "#ff4a32") + f("M76 50 Q64 42 54 53 L55.5 66 Q69 69 75.5 60Z", "#ff4a32")
      + line("M38 74 H62 M41 78.5 H59", "#9aa0a8", 2.2) + RIM + LEDGE + hands("#8a3a28"),
  },
  // ---------------- CATTIVI ----------------
  {
    key: "thanos", it: "Thanos", en: "Thanos", bg: "#fff1c4", villain: true,
    // pelle viola, mento a righe, elmo dorato; il Guanto dell'Infinito al posto della mano destra
    svg: head("#9d7cc4")
      + f("M15.5 55 Q15 25 50 22 Q85 25 84.5 55 Q76 46 66 46 Q58 42 50 45 Q42 42 34 46 Q24 46 15.5 55Z", "#e8b23a")
      + brows("#4e3570", 54, true) + eyes(61) + flat(70)
      + line("M38 74 V80 M44 75.5 V81.5 M50 76 V82 M56 75.5 V81.5 M62 74 V80", "#6a4c8a", 2.2) + RIM + LEDGE
      + hand(27, "#9d7cc4")
      + f("M62 88 L62 74 Q62 70 66 70 L80 70 Q84 70 84 74 L84 88Z", "#e8b23a")
      + `<circle cx="66.5" cy="75" r="2" fill="#3e7bfa"/><circle cx="71" cy="75" r="2" fill="#f2c230"/><circle cx="75.5" cy="75" r="2" fill="#d8323f"/><circle cx="80" cy="75" r="2" fill="#9b51e0"/><circle cx="73" cy="82" r="2.6" fill="#f07c22"/><circle cx="79" cy="82" r="2" fill="#2fbf71"/>`,
  },
  {
    key: "ultron", it: "Ultron", en: "Ultron", bg: "#ffe0e0", villain: true,
    // testa d'argento, occhi e bocca rossi luminosi
    svg: head(SILVER)
      + line("M50 22.5 V40 M28 40 L37 47 M72 40 L63 47", "#8a919c", 1.8)
      + f("M28 55 L46 59 L44.5 64 L30 60Z", "#ff3b3b", 'stroke-width="2.2"') + f("M72 55 L54 59 L55.5 64 L70 60Z", "#ff3b3b", 'stroke-width="2.2"')
      + f("M36 70 Q50 81 64 70 Q50 74.5 36 70Z", "#ff3b3b", 'stroke-width="2.2"')
      + RIM + LEDGE + hands("#9aa0a8"),
  },
  {
    key: "magneto", it: "Magneto", en: "Magneto", bg: "#ece0ff", villain: true,
    // elmo rosso con l'apertura per il viso, mantello viola ai lati
    svg: pair("M10 82 L13 56 L27 78Z", "#6b3fa0") + head("#c4202a")
      + f("M29 50 Q29 43 38 43 L62 43 Q71 43 71 50 L71 61 Q69 67 73 73 Q66 82 50 82 Q34 82 27 73 Q31 67 29 61Z", SKIN)
      + f("M40.5 42.5 L50 52 L59.5 42.5Z", "#c4202a") + line("M50 22.5 V42", "#8a1a20", 3.4)
      + eyes(62) + flat(73) + RIM + LEDGE + hands("#6b3fa0"),
  },
  {
    key: "venom", it: "Venom", en: "Venom", bg: "#dcebff", villain: true, path: "venom",
    // testa nera, occhioni bianchi, sorriso con i denti e la lingua
    svg: head("#1b1b22")
      + `<path d="M20 40 Q36 44 46 59 Q31 63 20 51Z M80 40 Q64 44 54 59 Q69 63 80 51Z" fill="#fff"/>`
      + `<path d="M27 66 Q50 92 73 66 Q50 77 27 66Z" fill="#fff"/>`
      + line("M34 69.5 L36 76 M42 72 L43 80 M50 73 V82 M58 72 L57 80 M66 69.5 L64 76", "#1b1b22", 1.6)
      + line("M50 81 Q53 91 60 87", "#ff6b8a", 4) + RIM + LEDGE + hands("#1b1b22", "#fff"),
  },
  {
    key: "doom", it: "Dottor Destino", en: "Doctor Doom", bg: "#e2f3dc", villain: true,
    // maschera di metallo e cappuccio verde
    svg: f("M12 82 Q8 20 50 17 Q92 20 88 82Z", "#2f7a3e")
      + `<ellipse cx="50" cy="60" rx="25" ry="22" fill="${SILVER}" ${OL}/>`
      + line("M36 57 H46 M54 57 H64", INK, 3.8) + line("M50 54 V66", "#8a919c", 2)
      + line("M41 72 H59 M43 76 H57", "#5a5f66", 2)
      + f("M12 82 Q8 20 50 17 Q92 20 88 82 L76 82 Q78 52 70 44 Q50 32 30 44 Q22 52 24 82Z", "#2f7a3e")
      + LEDGE + hands(SILVER),
  },
  {
    key: "hela", it: "Hela", en: "Hela", bg: "#d9f5e4", villain: true,
    // copricapo nero con le corna a ramo, viso pallido
    svg: pair("M30 38 L16 8 L27 15 L25 4 L41 29Z", "#1b1b22", 'stroke-width="2"') + pair("M43 29 L39 10 L48 24Z", "#1b1b22", 'stroke-width="2"')
      + head(PALE)
      + f("M15.5 57 Q15 25 50 22 Q85 25 84.5 57 Q76 43 50 43 Q24 43 15.5 57Z", "#1b1b22")
      + line("M50 24 V42", "#2fbf71", 2.2)
      + eyes(63) + line("M34 58.5 Q40 54.5 46 58.5 M54 58.5 Q60 54.5 66 58.5", INK, 2.4)
      + line("M46 73 Q50 75 54 73", "#3a2a3a", 2.8) + RIM + LEDGE + hands("#1f3a2a", "#2fbf71"),
  },
];

/* ---------------------------------------------------------------------------
   EFFETTO "DISEGNATO A MANO" — un rumore (feTurbulence) sposta di pochissimo
   ogni punto del disegno (feDisplacementMap): le linee non sono più
   perfette ma tremano appena, come fatte a pennarello.
   Il filtro è dentro ogni disegno (stesso id, stesso contenuto: si può
   ripetere più volte nella pagina senza problemi).
   --------------------------------------------------------------------------- */
const HAND = `<defs><filter id="av-hand" x="-5%" y="-5%" width="110%" height="110%">`
  + `<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7"/>`
  + `<feDisplacementMap in="SourceGraphic" scale="1.3" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;

export const AVATARS: AvatarDef[] = LIST.map((a) => ({ ...a, svg: `${HAND}<g filter="url(#av-hand)">${a.svg}</g>` }));

/** Avatar per chiave */
export const AVATAR_BY_KEY: Record<string, AvatarDef> = Object.fromEntries(AVATARS.map((a) => [a.key, a]));

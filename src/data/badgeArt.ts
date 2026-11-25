/* ============================================================================
   DISEGNI DEI BADGE — piccole icone kawaii (viewBox 100x100) nello stesso
   stile degli avatar: contorno nero spesso, colori piatti, faccine.
   Sono stringhe SVG costanti scritte da noi: si inseriscono con
   dangerouslySetInnerHTML senza rischi (nessun testo dell'utente).
   ============================================================================ */

const INK = "#1a1a1a";
/** Contorno standard */
const OL = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;
/** Forma piena con contorno */
const f = (d: string, c: string, x = "") => `<path d="${d}" fill="${c}" ${OL} ${x}/>`;
/** Linea senza riempimento */
const line = (d: string, c = INK, w = 3) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
/** Cerchio pieno con contorno */
const circ = (cx: number, cy: number, r: number, c: string, x = "") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" ${OL} ${x}/>`;
/** Faccina: due occhi a puntino + sorriso, centrata in (x, y) */
const face = (x: number, y: number, k = 1) =>
  `<circle cx="${x - 6 * k}" cy="${y}" r="${2.4 * k}" fill="${INK}"/><circle cx="${x + 6 * k}" cy="${y}" r="${2.4 * k}" fill="${INK}"/>`
  + line(`M${x - 3.5 * k} ${y + 5 * k} Q${x} ${y + 8 * k} ${x + 3.5 * k} ${y + 5 * k}`, INK, 2.4);
/** Guance rosa */
const blush = (x: number, y: number, dx = 11) =>
  `<ellipse cx="${x - dx}" cy="${y}" rx="3.2" ry="2" fill="#ff8fa3" opacity=".8"/><ellipse cx="${x + dx}" cy="${y}" rx="3.2" ry="2" fill="#ff8fa3" opacity=".8"/>`;

/** Stella a 5 punte centrata in (cx, cy) con raggio r */
function star(cx: number, cy: number, r: number, c: string, x = "") {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.42 : r, a = -Math.PI / 2 + (i * Math.PI) / 5;
    p.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<path d="M${p.join(" L")}Z" fill="${c}" ${x}/>`;
}

/** Gemma sfaccettata (per Fasi, Critico, Sei Gemme) centrata in (cx, cy), scala k */
function gem(cx: number, cy: number, k: number, c: string, withFace = false) {
  const P = (x: number, y: number) => `${(cx + x * k).toFixed(1)} ${(cy + y * k).toFixed(1)}`;
  return f(`M${P(-20, -20)} H${P(20, -20).split(" ")[0]} L${P(34, -4)} L${P(0, 38)} L${P(-34, -4)}Z`, c)
    + line(`M${P(-34, -4)} H${P(34, -4).split(" ")[0]} M${P(-10, -4)} L${P(0, 38)} L${P(10, -4)} M${P(-20, -20)} L${P(-10, -4)} M${P(20, -20)} L${P(10, -4)}`, "rgba(255,255,255,.55)", 2 * Math.min(1, k + 0.2))
    + (withFace ? face(cx, cy + 8 * k, k) : "");
}

/** Colori delle sei Gemme dell'Infinito (Spazio, Mente, Realtà, Anima, Tempo, Potere) */
export const STONES = ["#3d7ae0", "#f5c43c", "#e1262d", "#f08a24", "#3fae5a", "#8a4fd0"];

export const BADGE_ART: Record<string, string> = {
  // Primo passo: secchiello di popcorn sorridente
  popcorn:
    circ(32, 40, 9, "#fff3c4") + circ(68, 40, 9, "#fff3c4") + circ(44, 32, 10, "#fff3c4") + circ(56, 32, 10, "#fff3c4") + circ(50, 24, 9, "#fff3c4")
    + f("M26 44 H74 L67 90 H33Z", "#fff")
    + `<path d="M36 46 H45 L44.5 88 H38Z M55 46 H64 L62 88 H55.5Z" fill="#e1262d"/>`
    + f("M26 44 H74 L67 90 H33Z", "none") + face(50, 64) + blush(50, 70, 12),

  // Maratoneta: scarpa da corsa con le righe della velocità
  sneaker:
    line("M4 50 H18 M2 60 H14 M6 70 H16", "#9aa0a8", 3)
    + f("M20 72 Q19 56 32 53 L46 48 Q54 61 68 61 L82 63 Q91 65 89 76 L20 76Z", "#e1262d")
    + f("M17 76 H91 Q91 85 82 85 H24 Q17 85 17 76Z", "#fff")
    + line("M37 55 L41 62 M44 52 L48 59", "#fff", 3) + `<circle cx="74" cy="69" r="2.4" fill="#fff"/>`,

  // Ore di volo: clessidra
  hourglass:
    f("M33 22 Q33 40 50 50 Q33 60 33 78 H67 Q67 60 50 50 Q67 40 67 22Z", "#dff3ff")
    + `<path d="M39 31 Q45 42 50 45 Q55 42 61 31Z M37 76 Q42 65 50 63 Q58 65 63 76Z" fill="#f5c43c"/>`
    + line("M50 47 V62", "#f5c43c", 2)
    + f("M24 14 H76 V22 H24Z", "#8a5a33", 'rx="3"') + f("M24 78 H76 V86 H24Z", "#8a5a33"),

  // Divoratore di episodi: televisore felice
  tvface:
    line("M40 30 L30 14 M60 30 L70 14") + circ(30, 13, 3.5, "#f5c43c") + circ(70, 13, 3.5, "#f5c43c")
    + f("M26 30 H74 Q84 30 84 40 V72 Q84 82 74 82 H26 Q16 82 16 72 V40 Q16 30 26 30Z", "#6bb3e0")
    + f("M31 38 H69 Q76 38 76 45 V67 Q76 74 69 74 H31 Q24 74 24 67 V45 Q24 38 31 38Z", "#fff")
    + face(50, 54) + blush(50, 61, 13),

  // Saga dell'Infinito: guanto dorato con le Gemme
  gauntlet:
    f("M30 92 V56 Q30 48 36 48 V30 Q36 24 41 24 Q46 24 46 30 V22 Q46 16 51 16 Q56 16 56 22 V26 Q56 20 61 20 Q66 20 66 26 V34 Q66 29 70.5 29 Q75 29 75 34 V64 Q75 80 66 92Z", "#f5c43c")
    + line("M46 30 V46 M56 26 V46 M66 34 V48", INK, 2.6)
    + `<circle cx="41" cy="32" r="3.4" fill="${STONES[0]}"/><circle cx="51" cy="25" r="3.4" fill="${STONES[2]}"/><circle cx="61" cy="28" r="3.4" fill="${STONES[5]}"/><circle cx="70.5" cy="37" r="3.2" fill="${STONES[3]}"/>`
    + circ(52, 68, 6, STONES[1], 'stroke-width="2.6"') + `<circle cx="34" cy="60" r="3.4" fill="${STONES[4]}"/>`,

  // Saga del Multiverso: portale arancione di Doctor Strange
  portal:
    circ(50, 50, 38, "#2a1a40")
    + `<circle cx="50" cy="50" r="33" fill="none" stroke="#f59a23" stroke-width="6"/>`
    + `<circle cx="50" cy="50" r="24" fill="none" stroke="#ffc24a" stroke-width="3" stroke-dasharray="7 5"/>`
    + line("M50 6 V12 M50 88 V94 M6 50 H12 M88 50 H94 M19 19 L23 23 M77 77 L81 81 M81 19 L77 23 M23 77 L19 81", "#ffc24a", 3)
    + star(50, 50, 10, "#fff"),

  // Avengers Assemble: lo scudo di Captain America
  shield:
    circ(50, 50, 40, "#d8262f") + `<circle cx="50" cy="50" r="30" fill="#fff"/><circle cx="50" cy="50" r="21" fill="#d8262f"/><circle cx="50" cy="50" r="13" fill="#2e5fae"/>`
    + star(50, 50, 12, "#fff") + `<circle cx="50" cy="50" r="40" fill="none" ${OL}/>`,

  // Esploratore del Multiverso: pianeta con l'anello
  planet:
    `<ellipse cx="50" cy="52" rx="45" ry="13" fill="none" stroke="#f5c43c" stroke-width="5" transform="rotate(-18 50 52)"/>`
    + circ(50, 50, 30, "#6bb3e0")
    + `<path d="M30 40 Q36 34 44 38 Q46 46 38 48 Q31 48 30 40Z M56 58 Q64 54 70 60 Q66 70 58 68Z" fill="#3fae5a"/>`
    + face(50, 50, 0.9)
    + `<path d="M5 66 Q50 80 95 38" fill="none" stroke="#f5c43c" stroke-width="5" stroke-linecap="round" transform="rotate(0)"/>`
    + `<path d="M5 66 Q50 80 95 38" fill="none" ${OL} stroke-width="1.6"/>`,

  // Strade di New York: palazzi di notte con la luna
  skyline:
    circ(74, 22, 9, "#fff3c4")
    + f("M10 90 V48 H26 V90Z", "#3a3f6b") + f("M26 90 V30 H44 V90Z", "#4b5288") + f("M44 90 V56 H58 V90Z", "#3a3f6b") + f("M58 90 V40 H76 V90Z", "#4b5288") + f("M76 90 V62 H90 V90Z", "#3a3f6b")
    + `<path d="M30 38 h4 v4 h-4z M37 38 h4 v4 h-4z M30 50 h4 v4 h-4z M37 62 h4 v4 h-4z M62 48 h4 v4 h-4z M69 60 h4 v4 h-4z M62 72 h4 v4 h-4z M14 56 h4 v4 h-4z M48 64 h4 v4 h-4z" fill="#f5c43c"/>`
    + line("M6 90 H94", INK, 3.5),

  // Cronologista: orologio arancione (come quelli della TVA)
  clock:
    circ(50, 52, 38, "#f08a24") + circ(50, 52, 29, "#fff")
    + line("M50 27 V32 M50 72 V77 M25 52 H30 M70 52 H75", INK, 3)
    + line("M50 52 V36 M50 52 L62 58", INK, 4) + `<circle cx="50" cy="52" r="3.5" fill="${INK}"/>`
    + f("M38 12 H62 V18 H38Z", "#f08a24"),

  // Resta fino alla fine: lo shawarma (la scena dopo i titoli più famosa)
  shawarma:
    f("M28 30 Q50 18 72 30 L55 88 Q50 93 45 88Z", "#f3d39b")
    + `<path d="M28 30 Q34 22 40 28 Q46 20 52 27 Q58 20 64 27 Q69 22 72 30 Q50 38 28 30Z" fill="#6cc04a" ${OL} stroke-width="2.6"/>`
    + `<circle cx="42" cy="29" r="3" fill="#e1262d"/><circle cx="58" cy="28" r="3" fill="#e1262d"/>`
    + line("M36 46 Q50 52 64 46 M41 66 Q50 70 59 66", "#c99a5a", 2.4)
    + face(50, 54, 0.9) + blush(50, 60, 10),

  // Critico: gemma viola con la faccina
  critic: gem(50, 46, 1.15, "#b06be0", true),

  // Sei Gemme: le sei Gemme in cerchio
  sixgems: STONES.map((c, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 3;
    return gem(50 + Math.cos(a) * 26, 50 + Math.sin(a) * 26, 0.42, c);
  }).join("") + star(50, 50, 9, "#f5c43c"),

  // Archeologo: videocassetta VHS
  vhs:
    f("M18 28 H82 Q88 28 88 34 V70 Q88 76 82 76 H18 Q12 76 12 70 V34 Q12 28 18 28Z", "#2b2b31")
    + f("M24 34 H76 V48 H24Z", "#fff", 'stroke-width="2.4"') + line("M30 41 H58", "#e1262d", 3)
    + f("M32 54 H68 Q72 54 72 58 V66 Q72 70 68 70 H32 Q28 70 28 66 V58 Q28 54 32 54Z", "#6b7280", 'stroke-width="2.4"')
    + circ(39, 62, 5, "#fff", 'stroke-width="2.4"') + circ(61, 62, 5, "#fff", 'stroke-width="2.4"'),

  // Fan delle serie: divano rosso con il telecomando
  couch:
    f("M20 40 Q20 30 30 30 H70 Q80 30 80 40 V56 H20Z", "#e14b5a")
    + f("M10 54 Q10 46 18 46 Q26 46 26 54 V64 H74 V54 Q74 46 82 46 Q90 46 90 54 V76 H10Z", "#c8323f")
    + f("M26 60 H74 V68 H26Z", "#e14b5a", 'stroke-width="2.6"')
    + line("M16 76 V84 M84 76 V84", INK, 4)
    + face(50, 42, 0.9),

  // Cartoni del sabato: ciotola di cereali
  cereal:
    `<circle cx="34" cy="48" r="6" fill="#f5c43c" ${OL} stroke-width="2.4"/><circle cx="48" cy="44" r="6" fill="#e1262d" ${OL} stroke-width="2.4"/><circle cx="62" cy="47" r="6" fill="#3fae5a" ${OL} stroke-width="2.4"/><circle cx="42" cy="54" r="5" fill="#3d7ae0" ${OL} stroke-width="2.4"/><circle cx="56" cy="54" r="5" fill="#f08a24" ${OL} stroke-width="2.4"/>`
    + f("M76 52 L92 24", "none", 'stroke-width="5"') + line("M76 52 L92 24", "#c9cdd4", 3)
    + f("M14 54 H86 Q84 86 50 88 Q16 86 14 54Z", "#6bb3e0")
    + face(50, 68) + blush(50, 74, 13),

  // Ritorno al passato: tasto "riavvolgi"
  rewind:
    circ(50, 50, 38, "#3fae5a")
    + f("M50 32 L28 50 L50 68Z", "#fff", 'stroke-width="3"') + f("M72 32 L50 50 L72 68Z", "#fff", 'stroke-width="3"'),

  // Il preferito: cuore con la faccina
  heart:
    f("M50 86 Q14 62 14 38 Q14 20 32 20 Q44 20 50 32 Q56 20 68 20 Q86 20 86 38 Q86 62 50 86Z", "#e1262d")
    + `<path d="M26 32 Q28 26 34 26" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`
    + face(50, 46) + blush(50, 53, 14),

  // Cattivo dentro: faccina viola con le corna e il ghigno
  villain:
    f("M26 34 L18 10 L38 24Z", "#e1262d") + f("M74 34 L82 10 L62 24Z", "#e1262d")
    + circ(50, 54, 32, "#8a4fd0")
    + line("M34 42 L44 47 M66 42 L56 47", INK, 3.5)
    + `<circle cx="40" cy="52" r="3" fill="${INK}"/><circle cx="60" cy="52" r="3" fill="${INK}"/>`
    + f("M36 64 Q50 76 64 64 Q50 70 36 64Z", "#fff", 'stroke-width="2.6"'),

  // Percorso di un personaggio senza avatar: mascherina da supereroe
  mask:
    f("M14 46 Q28 32 50 42 Q72 32 86 46 Q88 64 70 66 Q58 66 50 56 Q42 66 30 66 Q12 64 14 46Z", "var(--mk,#2e5fae)")
    + f("M26 50 Q34 44 42 52 Q34 58 26 50Z", "#fff", 'stroke-width="2.6"') + f("M74 50 Q66 44 58 52 Q66 58 74 50Z", "#fff", 'stroke-width="2.6"'),

  // Badge segreto non ancora conquistato
  secret:
    circ(50, 50, 36, "#4a505a")
    + `<text x="50" y="66" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="46" fill="#c9cdd4">?</text>`,
};

/** Gemma numerata per il badge di una Fase (1–6), con il colore di una Gemma */
export const phaseArt = (n: number) =>
  gem(50, 44, 1.2, STONES[(n - 1) % 6])
  + `<text x="50" y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="30" fill="#fff" stroke="${INK}" stroke-width="3" paint-order="stroke">${n}</text>`;

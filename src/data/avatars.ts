/* ============================================================================
   AVATAR (dati) — personaggini stilizzati per il profilo (stile "icone profilo"
   delle piattaforme di streaming): busto del personaggio su un riquadro
   colorato con angoli arrotondati.
   - Disegni SVG originali, fatti da noi con forme semplici (viewBox 100x100).
   - La stessa lista serve per scegliere il "personaggio preferito".
   - path = percorso del Catalogo legato al personaggio (se esiste):
     cliccando il preferito nel Profilo si apre quel percorso.
   ============================================================================ */
import type { I18nText } from "../types";
/* Il componente che li mostra è in components/Avatar.tsx */

export interface AvatarDef extends I18nText {
  key: string;
  villain?: boolean;  // true = cattivo (mostrato in un gruppo a parte)
  bg: string;         // colore del riquadro
  path?: string;      // chiave del percorso in data/meta.ts (PATHS)
  svg: string;        // disegno (stringa costante scritta da noi)
}

/* ---------------------------------------------------------------------------
   PEZZI COMUNI DEI DISEGNI
   --------------------------------------------------------------------------- */
const SKIN = "#e9b48f";
const PALE = "#efd6c2";
/** Spalle / busto */
const sh = (c: string) => `<path d="M8 100 C12 80 28 72 50 72 C72 72 88 80 92 100Z" fill="${c}"/>`;
/** Collo */
const neck = (c = "#d9a07c") => `<rect x="43" y="58" width="14" height="18" fill="${c}"/>`;
/** Testa (ovale) */
const head = (c = SKIN, rx = 18, ry = 22) => `<ellipse cx="50" cy="44" rx="${rx}" ry="${ry}" fill="${c}"/>`;
/** Occhi semplici */
const eyes = (c = "#222") => `<circle cx="43" cy="45" r="1.9" fill="${c}"/><circle cx="57" cy="45" r="1.9" fill="${c}"/>`;
/** Bocca: sorriso leggero */
const smile = (c = "#8a4a3a") => `<path d="M45 57 Q50 60.5 55 57" stroke="${c}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
/** Bocca: linea dritta / seria */
const flat = (c = "#8a4a3a") => `<path d="M45.5 58 H54.5" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`;
/** Stella a 5 punte centrata in (x, y) con raggio r */
function star(x: number, y: number, r: number, c: string) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.42 : r;
    return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return `<polygon points="${pts}" fill="${c}"/>`;
}

/* ---------------------------------------------------------------------------
   I PERSONAGGI — 16 eroi principali, poi i cattivi
   (ordine dei pezzi = ordine di disegno: prima lo sfondo, poi il davanti)
   --------------------------------------------------------------------------- */
export const AVATARS: AvatarDef[] = [
  {
    key: "ironman", it: "Iron Man", en: "Iron Man", bg: "#5c1418", path: "ironman",
    // armatura rossa, maschera dorata, reattore arc sul petto
    svg: sh("#b3202a") + `<circle cx="50" cy="89" r="8" fill="none" stroke="#e0b54a" stroke-width="2"/><circle cx="50" cy="89" r="5" fill="#bdf3ff"/>`
      + neck("#7a1418")
      + `<path d="M30 40 Q30 18 50 18 Q70 18 70 40 L68 62 Q60 72 50 72 Q40 72 32 62Z" fill="#b3202a"/>`
      + `<path d="M36 37 Q50 33 64 37 L62 60 Q56 68 50 68 Q44 68 38 60Z" fill="#e0b54a"/>`
      + `<path d="M39 43 L47 45.5 L46 48 L39 46.5Z M61 43 L53 45.5 L54 48 L61 46.5Z" fill="#e8fbff"/>`
      + `<path d="M44 60 H56" stroke="#8a6a20" stroke-width="1.5"/>`,
  },
  {
    key: "cap", it: "Captain America", en: "Captain America", bg: "#173163", path: "cap",
    // casco blu con la "A" e le ali, stella bianca sul petto
    svg: sh("#2b4f9e") + star(50, 88, 7, "#f2f2f2") + neck() + head()
      + `<path d="M29 44 Q29 18 50 18 Q71 18 71 44 L71 51 Q60 47 50 47 Q40 47 29 51Z" fill="#2b4f9e"/>`
      + `<ellipse cx="43" cy="43" rx="4.5" ry="3.2" fill="${SKIN}"/><ellipse cx="57" cy="43" rx="4.5" ry="3.2" fill="${SKIN}"/>`
      + `<circle cx="43" cy="43.5" r="1.8" fill="#222"/><circle cx="57" cy="43.5" r="1.8" fill="#222"/>`
      + `<path d="M45.5 34 L50 23 L54.5 34 M47.3 30 H52.7" stroke="#fff" stroke-width="2.2" fill="none" stroke-linejoin="round"/>`
      + `<path d="M31 36 L23 31 L25 35 L22 36 L31 41Z M69 36 L77 31 L75 35 L78 36 L69 41Z" fill="#f2f2f2"/>`
      + smile(),
  },
  {
    key: "thor", it: "Thor", en: "Thor", bg: "#2e3440", path: "thor",
    // capelli biondi lunghi, barba, mantello rosso, dischi d'argento
    svg: `<path d="M28 44 Q26 15 50 15 Q74 15 72 44 L76 76 L62 70 L60 50 L40 50 L38 70 L24 76Z" fill="#d9b25a"/>`
      + sh("#5d626c")
      + `<path d="M8 100 C10 84 18 76 30 73 L34 100Z M92 100 C90 84 82 76 70 73 L66 100Z" fill="#a61e24"/>`
      + `<circle cx="39" cy="87" r="4" fill="#c9ced6"/><circle cx="61" cy="87" r="4" fill="#c9ced6"/>`
      + neck() + head()
      + `<path d="M32 36 Q38 22 52 22 Q64 22 68 34 Q58 27 46 29 Q38 31 32 36Z" fill="#d9b25a"/>`
      + eyes()
      + `<path d="M32 47 Q34 68 50 70 Q66 68 68 47 Q64 59 50 60 Q36 59 32 47Z" fill="#c49a45"/>`
      + flat("#7a5a2a"),
  },
  {
    key: "hulk", it: "Hulk", en: "Hulk", bg: "#35264a", path: "hulk",
    // pelle verde, capelli neri spettinati, sopracciglia arrabbiate
    svg: sh("#6a3f8f") + `<path d="M30 100 L34 92 L38 100 M62 100 L66 92 L70 100" fill="#35264a"/>`
      + neck("#5e9a3a") + head("#6fae45", 20, 23)
      + `<path d="M30 40 Q28 17 50 17 Q72 17 70 40 Q66 30 60 32 Q56 25 50 30 Q44 25 40 32 Q34 30 30 40Z" fill="#1d1f1a"/>`
      + `<path d="M37 39 L47 42.5 M63 39 L53 42.5" stroke="#24331a" stroke-width="2.6" stroke-linecap="round"/>`
      + eyes("#1c2a14")
      + `<path d="M43 59 Q50 55 57 59" stroke="#24331a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  },
  {
    key: "blackwidow", it: "Black Widow", en: "Black Widow", bg: "#2b2b31", path: "blackwidow",
    // capelli rossi, tuta nera, clessidra rossa sulla cintura
    svg: `<path d="M28 46 Q26 18 50 18 Q74 18 72 46 L74 66 Q66 62 64 52 L36 52 Q34 62 26 66Z" fill="#b8402a"/>`
      + sh("#17181c") + `<path d="M45 85 L55 85 L50 90.5 L55 96 L45 96 L50 90.5Z" fill="#c0313f"/>`
      + neck() + head()
      + `<path d="M31 40 Q36 22 54 23 Q66 25 69 40 Q60 30 47 31 Q37 32 31 40Z" fill="#b8402a"/>`
      + eyes() + `<path d="M46 57.5 Q50 59.5 54 57.5" stroke="#b02a32" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  },
  {
    key: "hawkeye", it: "Occhio di Falco", en: "Hawkeye", bg: "#3e2752", path: "hawkeye",
    // tuta viola con bretella nera, capelli corti castani
    svg: sh("#5b3a7a") + `<path d="M30 74 L70 100 L61 100 L25 78Z" fill="#17181c"/>`
      + neck() + head()
      + `<path d="M31 38 Q30 19 50 19 Q70 19 69 38 Q62 27 50 28 Q38 27 31 38Z" fill="#5a3f2a"/>`
      + `<path d="M38 40 L46 40.5 M54 40.5 L62 40" stroke="#5a3f2a" stroke-width="1.6" stroke-linecap="round"/>`
      + eyes() + flat(),
  },
  {
    key: "spidey", it: "Spider-Man", en: "Spider-Man", bg: "#183673", path: "spidey",
    // maschera rossa con ragnatela e grandi occhi bianchi, ragno sul petto
    svg: sh("#c62a30")
      + `<path d="M8 100 C12 80 22 74 30 73 L34 100Z M92 100 C88 80 78 74 70 73 L66 100Z" fill="#244ea8"/>`
      + `<path d="M50 81 V95 M43 83 L57 93 M57 83 L43 93" stroke="#111" stroke-width="1.6"/><ellipse cx="50" cy="88" rx="2.6" ry="4.2" fill="#111"/>`
      + neck("#a8222a") + head("#c62a30", 19, 23)
      + `<path d="M50 21 V67 M31 44 H69 M37 28 L63 60 M63 28 L37 60" stroke="#7a1418" stroke-width=".8" fill="none"/>`
      + `<ellipse cx="50" cy="44" rx="10" ry="12" fill="none" stroke="#7a1418" stroke-width=".8"/><ellipse cx="50" cy="44" rx="15" ry="18" fill="none" stroke="#7a1418" stroke-width=".8"/>`
      + `<path d="M35 39 Q42 33 47 44 Q42 50 35 39Z M65 39 Q58 33 53 44 Q58 50 65 39Z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/>`,
  },
  {
    key: "strange", it: "Doctor Strange", en: "Doctor Strange", bg: "#1d2a38", path: "strange",
    // colletto rosso del mantello, tunica blu, Occhio di Agamotto, tempie grigie
    svg: `<path d="M24 78 L21 38 Q30 50 35 68Z M76 78 L79 38 Q70 50 65 68Z" fill="#b3202a"/>`
      + sh("#1f3f7a") + `<circle cx="50" cy="85" r="5.5" fill="#c9a24b"/><circle cx="50" cy="85" r="2.6" fill="#2fbf71"/>`
      + neck() + head()
      + `<path d="M31 40 Q30 18 50 18 Q70 18 69 40 Q64 26 50 27 Q36 26 31 40Z" fill="#222"/>`
      + `<path d="M31 40 Q31 33 34 30 L35.5 40Z M69 40 Q69 33 66 30 L64.5 40Z" fill="#b8bcc6"/>`
      + eyes()
      + `<path d="M42.5 56 Q50 53.5 57.5 56" stroke="#333" stroke-width="2" fill="none"/><path d="M47 59.5 Q50 69 53 59.5Z" fill="#333"/>`,
  },
  {
    key: "blackpanther", it: "Black Panther", en: "Black Panther", bg: "#271f3b", path: "blackpanther",
    // maschera nera con orecchie a punta, collana d'argento, occhi bianchi
    svg: sh("#1a1a22") + `<path d="M33 76 Q50 92 67 76" stroke="#b9b3d6" stroke-width="2.2" fill="none"/><path d="M38 84 L50 96 L62 84" stroke="#8a7fd0" stroke-width="1.2" fill="none"/>`
      + neck("#1d1d24") + head("#1d1d24")
      + `<path d="M33 31 L31 16 L42 24Z M67 31 L69 16 L58 24Z" fill="#1d1d24"/>`
      + `<path d="M50 22 V39 M40 29 L46 38 M60 29 L54 38" stroke="#6e6a8a" stroke-width="1"/>`
      + `<path d="M37 42 L47 44.5 L45 47.5 L38 45Z M63 42 L53 44.5 L55 47.5 L62 45Z" fill="#f2f2f2"/>`,
  },
  {
    key: "captainmarvel", it: "Captain Marvel", en: "Captain Marvel", bg: "#172552", path: "captainmarvel",
    // capelli biondi, tuta blu e rossa con stella dorata
    svg: `<path d="M28 46 Q26 18 50 18 Q74 18 72 46 L74 70 L64 64 L62 50 L38 50 L36 64 L26 70Z" fill="#e0b45a"/>`
      + sh("#24407a") + `<path d="M36 73 Q50 77 64 73 L60 100 L40 100Z" fill="#c0313f"/>` + star(50, 88, 7, "#e0b54a")
      + neck() + head()
      + `<path d="M31 38 Q34 21 52 21 Q66 22 69 36 Q60 28 50 30 Q40 30 31 38Z" fill="#e0b45a"/>`
      + eyes() + smile(),
  },
  {
    key: "wanda", it: "Scarlet Witch", en: "Scarlet Witch", bg: "#4a0d1a", path: "wanda",
    // capelli ramati lunghi, corona rossa appuntita
    svg: `<path d="M27 46 Q25 18 50 18 Q75 18 73 46 L77 80 L63 70 L61 50 L39 50 L37 70 L23 80Z" fill="#7a2a24"/>`
      + sh("#8a1424") + neck() + head()
      + eyes()
      + `<path d="M31 35 L35 22 L42 30 L50 12 L58 30 L65 22 L69 35 Q50 28 31 35Z" fill="#c0313f"/>`
      + `<path d="M46 57.5 Q50 59.5 54 57.5" stroke="#a02030" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  },
  {
    key: "loki", it: "Loki", en: "Loki", bg: "#173323", path: "loki",
    // capelli neri lunghi, elmo dorato con corna, mantello verde
    svg: `<path d="M29 44 Q27 22 50 22 Q73 22 71 44 L74 74 L62 68 L60 50 L40 50 L38 68 L26 74Z" fill="#141414"/>`
      + sh("#1f5a36") + `<path d="M34 74 L50 85 L66 74" stroke="#c9a24b" stroke-width="3" fill="none"/>`
      + neck("#dcbca6") + head(PALE)
      + `<path d="M38 28 Q30 12 21 3 Q34 8 45 25Z M62 28 Q70 12 79 3 Q66 8 55 25Z" fill="#c9a24b"/>`
      + `<path d="M31 37 Q50 21 69 37 L67 42 Q50 31 33 42Z" fill="#c9a24b"/>`
      + eyes() + `<path d="M45 57.5 Q51 59.5 55.5 55.5" stroke="#8a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  },
  {
    key: "wolverine", it: "Wolverine", en: "Wolverine", bg: "#22263a", path: "wolverine",
    // maschera gialla con la parte nera a punta, tuta gialla e blu
    svg: sh("#e2b72e") + `<path d="M8 100 C12 80 22 74 30 73 L38 100Z M92 100 C88 80 78 74 70 73 L62 100Z" fill="#2b4f9e"/>`
      + neck("#c99a22") + head("#e2b72e")
      + `<path d="M30 47 L20 12 L40 33 Q50 29 60 33 L80 12 L70 47 Q60 51 50 45 Q40 51 30 47Z" fill="#17181c"/>`
      + `<path d="M37 41 L46 43.5 L44 46.5 L38 44.5Z M63 41 L54 43.5 L56 46.5 L62 44.5Z" fill="#fff"/>`
      + `<path d="M34 51 Q50 47 66 51 Q65 64 50 66.5 Q35 64 34 51Z" fill="${SKIN}"/>`
      + `<path d="M34 51 Q36 60 40 62 L40 53Z M66 51 Q64 60 60 62 L60 53Z" fill="#3a2a1a"/>` + flat(),
  },
  {
    key: "deadpool", it: "Deadpool", en: "Deadpool", bg: "#1f1f24", path: "deadpool",
    // maschera rossa con le macchie nere e gli occhi bianchi, cinghie nere
    svg: sh("#a3151d") + `<path d="M28 76 L72 100 M72 76 L28 100" stroke="#17181c" stroke-width="5"/>`
      + neck("#8a1218") + head("#b3202a")
      + `<path d="M32 36 Q42 33 47.5 42 Q45 53 34 50.5 Q29.5 44 32 36Z M68 36 Q58 33 52.5 42 Q55 53 66 50.5 Q70.5 44 68 36Z" fill="#111"/>`
      + `<ellipse cx="41" cy="43.5" rx="3.6" ry="2.1" fill="#fff"/><ellipse cx="59" cy="43.5" rx="3.6" ry="2.1" fill="#fff"/>`
      + `<path d="M50 23 V36" stroke="#7a1418" stroke-width="1"/>`,
  },
  {
    key: "daredevil", it: "Daredevil", en: "Daredevil", bg: "#2a0b0e", path: "daredevil",
    // maschera rossa con le piccole corna, lenti rosso scuro
    svg: sh("#8a1418") + neck() + head()
      + `<path d="M29 50 Q28 18 50 18 Q72 18 71 50 Q60 51 50 54 Q40 51 29 50Z" fill="#b3202a"/>`
      + `<path d="M38 22 L33 9 L44 19Z M62 22 L67 9 L56 19Z" fill="#b3202a"/>`
      + `<path d="M36.5 40 Q42 35.5 47.5 41 Q42 45.5 36.5 40Z M63.5 40 Q58 35.5 52.5 41 Q58 45.5 63.5 40Z" fill="#4a0a0c"/>`
      + flat("#6a2a24"),
  },
  {
    key: "starlord", it: "Star-Lord", en: "Star-Lord", bg: "#2e1f1a", path: "gotg",
    // casco grigio con le lenti rosse, giacca rossiccia
    svg: sh("#7a2a1e") + `<path d="M36 73 L50 86 L64 73 L58 100 L42 100Z" fill="#3a3f48"/>`
      + neck("#2c3038") + head("#3a3f48")
      + `<circle cx="31" cy="46" r="4.5" fill="#8a919c"/><circle cx="69" cy="46" r="4.5" fill="#8a919c"/>`
      + `<path d="M50 22 V66 M40 57 H60 M40 61 H60" stroke="#8a919c" stroke-width="1.8"/>`
      + `<path d="M34 34 Q42 30 48 38 L46 48 Q38 50 34 44Z M66 34 Q58 30 52 38 L54 48 Q62 50 66 44Z" fill="#d23a2a"/>`,
  },
  // ---------------- CATTIVI ----------------
  {
    key: "thanos", it: "Thanos", en: "Thanos", bg: "#3a2a14", villain: true,
    // pelle viola, mento a righe, armatura blu e oro
    svg: sh("#2c4a8a") + `<path d="M8 100 C12 82 22 76 32 74 L38 88Z M92 100 C88 82 78 76 68 74 L62 88Z" fill="#c9a24b"/>`
      + neck("#7a5a96") + head("#8b6aa6", 21, 24)
      + `<path d="M40 58 V66 M45 60 V68.5 M50 60.5 V69.5 M55 60 V68.5 M60 58 V66" stroke="#5e4478" stroke-width="1.6" stroke-linecap="round"/>`
      + `<path d="M36 39 L47 41 M64 39 L53 41" stroke="#5e4478" stroke-width="2.6" stroke-linecap="round"/>`
      + eyes("#1d1430") + `<path d="M44 56 H56" stroke="#3e2a52" stroke-width="1.8" stroke-linecap="round"/>`,
  },
  {
    key: "ultron", it: "Ultron", en: "Ultron", bg: "#36090d", villain: true,
    // testa d'argento spigolosa, occhi e bocca rossi luminosi
    svg: sh("#8a919c") + `<path d="M50 74 V100 M36 78 L44 100 M64 78 L56 100" stroke="#6a717c" stroke-width="1.5"/>`
      + neck("#6a717c")
      + `<path d="M31 32 Q50 13 69 32 L67 58 Q58 70 50 70 Q42 70 33 58Z" fill="#b8bec7"/>`
      + `<path d="M50 17 V30 M36 52 L42 64 M64 52 L58 64" stroke="#8a919c" stroke-width="1.4"/>`
      + `<path d="M37 40 L47 43 L46 46.5 L38 44Z M63 40 L53 43 L54 46.5 L62 44Z" fill="#ff3b3b"/>`
      + `<path d="M39 55 Q50 63 61 55 Q50 58.5 39 55Z" fill="#ff3b3b"/>`,
  },
  {
    key: "magneto", it: "Magneto", en: "Magneto", bg: "#2e1940", villain: true,
    // elmo rosso, mantello viola
    svg: `<path d="M8 100 C10 82 20 74 32 72 L30 100Z M92 100 C90 82 80 74 68 72 L70 100Z" fill="#5a2a7a"/>`
      + sh("#9a1c26") + neck() + head()
      + eyes() + flat()
      + `<path d="M28 52 Q26 15 50 15 Q74 15 72 52 L66 57 L64 40 Q50 33 36 40 L34 57Z" fill="#b3202a"/>`
      + `<path d="M50 15 V34" stroke="#7a1418" stroke-width="3"/><path d="M36 40 Q50 33 64 40" stroke="#7a1418" stroke-width="1.5" fill="none"/>`,
  },
  {
    key: "venom", it: "Venom", en: "Venom", bg: "#2c3746", villain: true, path: "venom",
    // testa nera, grandi occhi bianchi, bocca con i denti, ragno bianco sul petto
    svg: sh("#141418") + `<path d="M50 76 V100 M37 80 L63 97 M63 80 L37 97" stroke="#f2f2f2" stroke-width="4" stroke-linecap="round"/>`
      + neck("#141418") + head("#141418", 20, 24)
      + `<path d="M32 30 Q42 34 47.5 46 Q38 47 31 38Z M68 30 Q58 34 52.5 46 Q62 47 69 38Z" fill="#fff"/>`
      + `<path d="M35 53 Q50 72 65 53 Q50 60 35 53Z" fill="#fff"/>`
      + `<path d="M40 56 L42 61 M45 58 L46.5 64 M50 58.5 V65 M55 58 L53.5 64 M60 56 L58 61" stroke="#141418" stroke-width="1.3"/>`,
  },
  {
    key: "doom", it: "Dottor Destino", en: "Doctor Doom", bg: "#16301d", villain: true,
    // cappuccio verde, maschera di metallo con le fessure
    svg: sh("#2f6b3a") + `<path d="M50 76 V100" stroke="#245530" stroke-width="2"/>`
      + neck("#6a717c") + head("#9aa1ab")
      + `<path d="M38 43 H47 M53 43 H62" stroke="#17181c" stroke-width="3" stroke-linecap="round"/>`
      + `<path d="M50 40 V52" stroke="#7a818b" stroke-width="2"/>`
      + `<path d="M42 57 H58 M42 60.5 H58 M44 64 H56" stroke="#4a4f57" stroke-width="1.4"/>`
      + `<path d="M22 74 Q19 16 50 13 Q81 16 78 74 Q70 62 68 44 Q50 31 32 44 Q30 62 22 74Z" fill="#2f6b3a"/>`,
  },
  {
    key: "hela", it: "Hela", en: "Hela", bg: "#0f2016", villain: true,
    // copricapo nero con le corna a ramo, viso pallido, trucco scuro
    svg: sh("#15241b") + `<path d="M34 74 L50 90 L66 74" stroke="#2fbf71" stroke-width="1.6" fill="none"/>`
      + neck("#d4c6b8") + head("#e8dccf")
      + `<path d="M30 48 Q28 24 50 22 Q72 24 70 48 Q63 34 50 33 Q37 34 30 48Z" fill="#111"/>`
      + `<path d="M34 29 L19 3 L29 10 L27 0 L41 23Z M66 29 L81 3 L71 10 L73 0 L59 23Z M44 23 L40 5 L48 18Z M56 23 L60 5 L52 18Z" fill="#111"/>`
      + `<path d="M50 23 L50 33" stroke="#2fbf71" stroke-width="1.2"/>`
      + `<path d="M38 44 H47.5 M52.5 44 H62" stroke="#111" stroke-width="3" stroke-linecap="round"/>`
      + `<path d="M46 57.5 Q50 59 54 57.5" stroke="#2a2a2a" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  },
];

/** Avatar per chiave */
export const AVATAR_BY_KEY: Record<string, AvatarDef> = Object.fromEntries(AVATARS.map((a) => [a.key, a]));

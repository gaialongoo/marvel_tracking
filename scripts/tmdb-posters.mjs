/* ============================================================================
   COPERTINE DA TMDB — script da lanciare a mano sul PC (non fa parte del sito)
   ----------------------------------------------------------------------------
   Uso:   node scripts/tmdb-posters.mjs
   Serve: il file .env.local con la riga  TMDB_TOKEN=eyJ...  (token "API Read
          Access Token" di themoviedb.org). Il file NON va su GitHub (.gitignore)
          e il token non finisce mai nel sito: lo usa solo questo script.

   Cosa fa:
   1. legge l'elenco dei titoli (scripts/titles.json, generato dallo script
      stesso a partire da src/data/titles.ts);
   2. per ognuno cerca su TMDB il film o la serie (titolo originale + anno);
      per le stagioni "(Season N)" prende la locandina della stagione;
   3. scrive src/data/posters.ts: per ogni id del catalogo il percorso della
      locandina in italiano e in inglese (es. "/abc123.jpg"). Le immagini si
      caricano poi dal server di TMDB (image.tmdb.org), noi non le ospitiamo.
   4. stampa un resoconto: i titoli senza copertina e gli abbinamenti dubbi
      (titolo diverso da quello cercato) da ricontrollare a occhio.

   Abbinamenti sbagliati o mancanti si correggono in FORCE qui sotto.
   Condizioni TMDB: uso non commerciale, citazione di TMDB, dati tenuti al
   massimo 6 mesi → rilanciare lo script almeno ogni 6 mesi.
   ============================================================================ */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

/* ---------- token (da .env.local) ---------- */
const env = readFileSync(".env.local", "utf8");
const TOKEN = /^TMDB_TOKEN=(.+)$/m.exec(env)?.[1]?.trim();
if (!TOKEN) throw new Error("Manca TMDB_TOKEN in .env.local");

/* ---------- elenco dei titoli dal catalogo dell'app ---------- */
// impacchetto titles.ts al volo con esbuild (già installato con Vite) e stampo i campi utili
writeFileSync("scripts/.dump.ts",
  'import { DATA } from "../src/data/titles";\n' +
  "console.log(JSON.stringify(DATA.map(d => ({ id: d.id, type: d.type, en: d.t.en, y: d.y }))));\n");
const titles = JSON.parse(execSync(
  "npx esbuild scripts/.dump.ts --bundle --platform=node --log-level=error | node", { encoding: "utf8" }));
execSync(process.platform === "win32" ? "del scripts\\.dump.ts" : "rm scripts/.dump.ts");

/* ---------- correzioni a mano ----------
   id del catalogo → { kind: "movie" | "tv", tmdb: id TMDB, season?: numero }
   (l'id TMDB è il numero nell'indirizzo della pagina, es. themoviedb.org/tv/1403) */
const FORCE = {
  ultavengers: { kind: "movie", tmdb: 14609 },   // trovava il 2
  invincibleim: { kind: "movie", tmdb: 13647 },  // è un film, non la serie del 1966
  hulkvs: { kind: "movie", tmdb: 394355 },
  "anime-blade": { kind: "tv", tmdb: 62798 },
  ghostrider2: { kind: "movie", tmdb: 71676 },   // trovava il dietro le quinte
  dd1: { kind: "tv", tmdb: 61889, season: 1 },   // Daredevil Netflix, non Born Again
  dd2: { kind: "tv", tmdb: 61889, season: 2 },
  dd3: { kind: "tv", tmdb: 61889, season: 3 },
  pun1: { kind: "tv", tmdb: 67178, season: 1 },  // The Punisher Netflix
  pun2: { kind: "tv", tmdb: 67178, season: 2 },
};
/** Titoli che su TMDB non ci sono: restano con la miniatura colorata */
const SKIP = new Set(["smshorts", "jeff"]);

/* ---------- chiamate a TMDB ---------- */
async function api(path, params = {}) {
  const url = new URL("https://api.themoviedb.org/3" + path);
  for (const [k, v] of Object.entries(params)) if (v !== undefined) url.searchParams.set(k, String(v));
  const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}`, accept: "application/json" } });
  if (!r.ok) throw new Error(`${r.status} ${path}`);
  return r.json();
}

/** Titolo "pulito" per confrontare (minuscolo, senza punteggiatura) */
// ("Marvel's" e "Marvel One-Shot:" davanti non contano: TMDB a volte li aggiunge)
const norm = (s) => s.toLowerCase().replace(/^marvel('s| one-shot:) /, "").normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();

/** Cerca film o serie; preferisce il titolo identico, poi il primo risultato */
async function search(kind, query, year) {
  const yearKey = kind === "movie" ? "primary_release_year" : "first_air_date_year";
  for (const y of [year, year - 1, year + 1, undefined]) {
    const res = (await api(`/search/${kind}`, { query, [yearKey]: y, include_adult: false })).results;
    if (!res.length) continue;
    const exact = res.find((r) => norm(r.title ?? r.name) === norm(query) || norm(r.original_title ?? r.original_name ?? "") === norm(query));
    return { hit: exact ?? res[0], exact: !!exact };
  }
  return null;
}

/** Locandina in una lingua: per film/serie da /images, per le stagioni dalla stagione */
async function posters(kind, id, season) {
  const path = season ? `/tv/${id}/season/${season}/images` : `/${kind}/${id}/images`;
  const imgs = (await api(path, { include_image_language: "it,en,null" })).posters ?? [];
  // la più votata per lingua; senza lingua (solo grafica) va bene per entrambe
  const best = (lang) => imgs.filter((p) => p.iso_639_1 === lang).sort((a, b) => b.vote_average - a.vote_average || b.vote_count - a.vote_count)[0]?.file_path;
  const none = best(null);
  const en = best("en") ?? none;
  const it = best("it") ?? en;
  return { it, en };
}

/* ---------- giro su tutti i titoli ---------- */
const out = {};
const report = [];
for (const d of titles) {
  if (SKIP.has(d.id)) { report.push(`SALTATO           ${d.id}  (non su TMDB)`); continue; }
  try {
    let kind, tmdb, season, found, exact = true;
    if (FORCE[d.id]) ({ kind, tmdb, season } = FORCE[d.id]);
    else {
      const m = /^(.*) \(Season (\d+)\)$/.exec(d.en);
      const query = (m ? m[1] : d.en).replace(/^Marvel One-Shot: /, "").replace("…", "");
      season = m ? Number(m[2]) : undefined;
      // ordine di ricerca: film → movie poi tv; serie/animazione → tv poi movie
      const order = d.type === "film" || d.type === "short" || d.type === "special" ? ["movie", "tv"] : ["tv", "movie"];
      // per le stagioni non filtro per anno (la serie è iniziata prima)
      for (const k of season ? ["tv"] : order) {
        const r = await search(k, query, season ? undefined : d.y);
        if (r) { kind = k; tmdb = r.hit.id; found = r.hit.title ?? r.hit.name; exact = r.exact; break; }
      }
    }
    if (!tmdb) { report.push(`NESSUN RISULTATO  ${d.id}  "${d.en}" ${d.y}`); continue; }
    const p = await posters(kind, tmdb, season);
    if (!p.it && !p.en) { report.push(`SENZA LOCANDINA   ${d.id}  ${kind}/${tmdb}`); continue; }
    out[d.id] = p;
    if (!exact) report.push(`DA CONTROLLARE    ${d.id}  "${d.en}" ${d.y}  →  ${kind}/${tmdb} "${found}"`);
    report.push(`ok ${d.id.padEnd(14)} ${kind}/${tmdb}${season ? " S" + season : ""}  ${found ?? "(forzato)"}`);
  } catch (e) {
    report.push(`ERRORE ${d.id}: ${e.message}`);
  }
}

/* ---------- scrivo il file per l'app ---------- */
const today = new Date().toISOString().slice(0, 10);
writeFileSync("src/data/posters.ts",
`/* ============================================================================
   LOCANDINE — generato da scripts/tmdb-posters.mjs il ${today}. NON modificare a mano.
   Per ogni titolo il percorso dell'immagine su TMDB in italiano e in inglese.
   L'indirizzo completo si compone in components/Thumb.tsx (image.tmdb.org).
   Fonte: The Movie Database (TMDB). Le locandine appartengono ai rispettivi
   proprietari. Rilanciare lo script almeno ogni 6 mesi (condizioni TMDB).
   ============================================================================ */
export const POSTERS: Record<string, { it?: string; en?: string }> = ${JSON.stringify(out, null, 1)};
`);
writeFileSync("scripts/tmdb-report.txt", report.join("\n") + "\n");
console.log(report.filter((r) => !r.startsWith("ok")).join("\n"));
console.log(`\n${Object.keys(out).length}/${titles.length} titoli con locandina. Resoconto completo: scripts/tmdb-report.txt`);

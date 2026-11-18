/* ============================================================================
   TRADUZIONI — tutti i testi dell'interfaccia in italiano e inglese.
   Uso nei componenti:  const { t, lang } = useT();  t("home")
   ============================================================================ */
import { useStore } from "./store";

const it = {
  home: "Home", list: "Elenco", prep: "Preparazione",
  searchPh: "Cerca un titolo…", noResults: "Nessun risultato", moreStats: "Statistiche dettagliate",
  universe: "Universo", byUni: "Per universo", episodes: "Episodi", epN: "Episodio", allEps: "Tutti", noEps: "Nessuno",
  backup: "I tuoi dati",
  backupSub: "Visti, voti ed episodi sono salvati automaticamente in questo browser, su questo PC. Puoi anche scaricarne una copia di sicurezza.",
  exportB: "Esporta backup", importB: "Importa backup", exported: "Backup scaricato", imported: "Backup importato",
  importError: "File non valido: non è un backup di Marvel Tracker", importConfirm: "Sostituire i dati attuali con quelli del backup?",
  listSub: "Tutto l'universo Marvel", titles: "titoli",
  release: "Uscita", chrono: "Cronologico", phase: "Fase", paths: "Percorsi",
  all: "Tutti", film: "Film", serie: "Serie", anim: "Animazione", special: "Speciale", short: "Corto",
  noPhase: "Marvel Television · Netflix",
  phaseN: "Fase", inf: "Saga dell'Infinito", multi: "Saga del Multiverso",
  markSeen: "Segna come visto", isSeen: "Visto", official: "Pagina ufficiale",
  rating: "Il tuo voto", gauntlet: "GUANTO COMPLETO",
  synopsis: "Sinossi · senza spoiler", full: "Riassunto completo", unlock: "Mostra spoiler",
  synText: "[Sinossi ufficiale da inserire, con citazione della fonte.]",
  synSrc: "FONTE: MARVEL.COM / DISNEY+ · DA INSERIRE",
  fullText: "[Riassunto completo con spoiler, scritto da Claude, da inserire. Racconterà tutta la trama, il finale e le rivelazioni principali.]",
  fullSrc: "SCRITTO DA CLAUDE · FONTI SECONDARIE",
  postcredits: "Scene post-credits", noPc: "Nessuna scena post-credits.", pcText: "[Descrizione della scena e a cosa si collega — da inserire.]",
  links: "Collegamenti", before: "Da vedere prima", after: "Cosa viene dopo", none: "Nessuno", map: "Mappa dei collegamenti",
  mapBefore: "Prima", mapNow: "Questo titolo", mapAfter: "Dopo", legSeen: "già visto", legTodo: "da vedere",
  back: "← Home", min: "min", eps: "ep.", year: "Anno", duration: "Durata",
  prepSub: "Cosa vedere prima delle prossime uscite", next: "Prossima uscita", dateNote: "Data ufficiale (Marvel / Disney)", dateApprox: "Giorno esatto non ancora annunciato",
  d: "giorni", h: "ore", m: "min", s: "sec", minList: "Lista minima", extList: "Lista estesa",
  progress: "Avanzamento", left: "Ti mancano", recap: "Ripasso veloce", recapSub: "Se non hai tempo di rivedere tutto",
  done: "Completato", hours: "Ore viste", avg: "Media voto", fav: "Preferito",
  byPhase: "Per Fase", byRating: "Distribuzione voti", byType: "Per tipo",
  sample: "Da verificare",
  // nomi dei campi "da verificare"
  f_it: "titolo italiano", f_y: "anno", f_min: "durata", f_eps: "episodi", f_phase: "Fase", f_chrono: "posizione cronologica", f_pc: "post-credits",
  notFound: "Titolo non trovato",
};

/** Stesse chiavi dell'italiano: TypeScript segnala se ne manca una */
const en: Record<keyof typeof it, string> = {
  home: "Home", list: "List", prep: "Prep",
  searchPh: "Search a title…", noResults: "No results", moreStats: "Detailed stats",
  universe: "Universe", byUni: "By universe", episodes: "Episodes", epN: "Episode", allEps: "All", noEps: "None",
  backup: "Your data",
  backupSub: "Seen titles, ratings and episodes are saved automatically in this browser, on this PC. You can also download a safety copy.",
  exportB: "Export backup", importB: "Import backup", exported: "Backup downloaded", imported: "Backup imported",
  importError: "Invalid file: not a Marvel Tracker backup", importConfirm: "Replace your current data with the backup?",
  listSub: "The whole Marvel universe", titles: "titles",
  release: "Release", chrono: "Chronological", phase: "Phase", paths: "Paths",
  all: "All", film: "Movies", serie: "Series", anim: "Animation", special: "Special", short: "Short",
  noPhase: "Marvel Television · Netflix",
  phaseN: "Phase", inf: "Infinity Saga", multi: "Multiverse Saga",
  markSeen: "Mark as seen", isSeen: "Seen", official: "Official page",
  rating: "Your rating", gauntlet: "GAUNTLET COMPLETE",
  synopsis: "Synopsis · no spoilers", full: "Full recap", unlock: "Show spoilers",
  synText: "[Official synopsis to add, with source quoted.]",
  synSrc: "SOURCE: MARVEL.COM / DISNEY+ · TO ADD",
  fullText: "[Full spoiler recap written by Claude, to add. It will cover the whole plot, the ending and key reveals.]",
  fullSrc: "WRITTEN BY CLAUDE · SECONDARY SOURCES",
  postcredits: "Post-credits scenes", noPc: "No post-credits scenes.", pcText: "[Scene description and what it connects to — to add.]",
  links: "Connections", before: "Watch before", after: "What comes next", none: "None", map: "Connection map",
  mapBefore: "Before", mapNow: "This title", mapAfter: "After", legSeen: "seen", legTodo: "to watch",
  back: "← Home", min: "min", eps: "ep.", year: "Year", duration: "Runtime",
  prepSub: "What to watch before upcoming releases", next: "Next release", dateNote: "Official date (Marvel / Disney)", dateApprox: "Exact day not yet announced",
  d: "days", h: "hours", m: "min", s: "sec", minList: "Essential list", extList: "Extended list",
  progress: "Progress", left: "Left to watch", recap: "Quick recap", recapSub: "If you don't have time to rewatch",
  done: "Completed", hours: "Hours watched", avg: "Avg rating", fav: "Favourite",
  byPhase: "By Phase", byRating: "Rating distribution", byType: "By type",
  sample: "To verify",
  f_it: "Italian title", f_y: "year", f_min: "runtime", f_eps: "episodes", f_phase: "Phase", f_chrono: "timeline position", f_pc: "post-credits",
  notFound: "Title not found",
};

export type StrKey = keyof typeof it;
const STR = { it, en };

/** Hook: restituisce la funzione di traduzione e la lingua attiva */
export function useT() {
  const { lang } = useStore();
  return { lang, t: (k: StrKey) => STR[lang][k] };
}

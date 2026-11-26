// Navigazione - basata sull'indirizzo dopo il "#" (funziona anche su
// GitHub Pages senza configurazioni). Pagine:
//   #/          -> Home (bacheca personale)
//   #/catalog   -> Catalogo (elenco completo con universi e ordini)
//   #/prep      -> Preparazione
//   #/profile   -> Profilo (dati, avatar, statistiche, backup)
//   #/t/<id>    -> Scheda del titolo
//   #/u/<tag>   -> Pagina di un amico (dal suo @tag; è anche il link di invito)
//   #/privacy   -> Privacy e condizioni d'uso (si apre anche senza accesso)
// Così i pulsanti Avanti/Indietro del browser funzionano.
import { useSyncExternalStore } from "react";

export type Route =
  | { page: "home" } | { page: "catalog" } | { page: "prep" } | { page: "profile" } | { page: "privacy" }
  | { page: "title"; id: string } | { page: "friend"; tag: string };

/** Pagine senza parametri e il loro indirizzo */
const SIMPLE = { catalog: "/catalog", prep: "/prep", profile: "/profile", privacy: "/privacy" } as const;

/** Trasforma l'indirizzo in una pagina */
function parse(hash: string): Route {
  const h = hash.replace(/^#\/?/, "");
  if (h === "catalog" || h === "prep" || h === "profile" || h === "privacy") return { page: h };
  if (h.startsWith("t/")) return { page: "title", id: decodeURIComponent(h.slice(2)) };
  if (h.startsWith("u/")) return { page: "friend", tag: decodeURIComponent(h.slice(2)) };
  return { page: "home" };
}

/** Quante volte si è cambiata pagina dentro l'app (serve a goBack) */
let inside = 0;
window.addEventListener("hashchange", () => { inside++; });

/** Hook: la pagina attuale, aggiornata quando cambia l'indirizzo */
export function useRoute(): Route {
  const hash = useSyncExternalStore(
    (cb) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); },
    () => location.hash,
  );
  return parse(hash);
}

/** Vai a una pagina */
export function go(r: Route) {
  location.hash = r.page === "home" ? "/"
    : r.page === "title" ? `/t/${encodeURIComponent(r.id)}`
    : r.page === "friend" ? `/u/${encodeURIComponent(r.tag)}`
    : SIMPLE[r.page];
}

/**
 * Torna alla pagina precedente (Catalogo, Home, Preparazione…).
 * Se la scheda è stata aperta direttamente da un link, non c'è una pagina
 * precedente dell'app: si va alla Home invece di uscire dal sito.
 */
export function goBack() {
  if (inside > 0) history.back();
  else go({ page: "home" });
}

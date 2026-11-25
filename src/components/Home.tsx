/* ============================================================================
   HOME — la prima pagina dopo l'accesso:
   1. Intestazione: avatar, nome, frase e quanto hai visto in tutto;
      a destra la prossima uscita con il conto alla rovescia
   2. Le "porte" degli universi: un riquadro con immagine per ogni universo,
      con la sua avanzata; cliccando si apre il Catalogo su quell'universo
   3. Continua a guardare: serie iniziate e non finite + il prossimo titolo
      secondo le preferenze di visione del Profilo (universo, ordine, tipi):
      quello dopo l'ultimo visto della lista, senza tornare ai saltati
   Ogni porta ha il colore del suo universo e un grande simbolo in filigrana
   (disegni SVG nostri, vedi DOOR_SYMBOL).
   ============================================================================ */
import { DATA, BY_ID } from "../data/titles";
import { PATHS, UNIVERSES, UPCOMING } from "../data/meta";
import { useDisplayName } from "../hooks";
import { buildGroups, nextUp, prefsToHome } from "../homeState";
import { useT } from "../i18n";
import { go } from "../router";
import { useStore } from "../store";
import type { Title } from "../types";
import { epsSeen, fmtMin, hasEps, watchedMin } from "../utils";
import { Avatar } from "./Avatar";
import { Thumb } from "./Thumb";

/** Colore di sfondo di ogni porta: una tinta diversa per ciascun universo,
    così si riconoscono a colpo d'occhio */
const DOOR_COLOR: Record<string, string> = {
  mcu: "#8a1c1c",       // rosso
  xmen: "#1f3f8a",      // blu
  f4fox: "#0f6a6e",     // verde acqua
  sony: "#7a1a55",      // magenta
  other: "#8a5212",     // arancio
  tv: "#2f6a2c",        // verde
  animation: "#53318f", // viola
};

/** Simbolo in filigrana di ogni porta (viewBox 100x100, linee bianche).
    Disegni nostri: richiamano l'universo con un oggetto, un personaggio
    o il suo segno più noto (la X degli X-Men, la scritta MARVEL). */
const DOOR_SYMBOL: Record<string, string> = {
  // MCU: lo scudo di Captain America (anelli + stella piena)
  mcu: `<circle cx="50" cy="50" r="43"/><circle cx="50" cy="50" r="31"/><circle cx="50" cy="50" r="19"/>`
    + `<path d="M50.0 33.0 L54.1 44.3 L66.2 44.7 L56.7 52.2 L60.0 63.8 L50.0 57.0 L40.0 63.8 L43.3 52.2 L33.8 44.7 L45.9 44.3Z" fill="#fff" stroke-width="2"/>`,
  // X-Men: la "X" con le punte allargate dentro il cerchio
  xmen: `<circle cx="50" cy="50" r="43"/><path d="M24 20 H40 L50 38 L60 20 H76 L58 50 L76 80 H60 L50 62 L40 80 H24 L42 50Z"/>`,
  // Fantastici 4: un "4" pieno e squadrato, con il buco a triangolo
  f4fox: `<path d="M56 10 H71 V56 H82 V70 H71 V90 H56 V70 H16 V57Z M56 33 L33 56 H56Z" fill-rule="evenodd"/>`,
  // Spider-Man: ragno con testa, addome a goccia e otto zampe piegate
  sony: `<ellipse cx="50" cy="36" rx="6" ry="7"/><path d="M50 45 Q60 49 58 65 Q55 82 50 87 Q45 82 42 65 Q40 49 50 45Z"/>`
    + `<path d="M45 38 L31 25 L27 6 M44 45 L24 39 L11 24 M44 55 L24 61 L11 77 M46 63 L32 77 L28 95`
    + ` M55 38 L69 25 L73 6 M56 45 L76 39 L89 24 M56 55 L76 61 L89 77 M54 63 L68 77 L72 95"/>`,
  // Altri film: la scritta MARVEL nel riquadro (testo pieno, senza contorno)
  other: `<rect x="5" y="31" width="90" height="38" rx="3"/>`
    + `<text x="50" y="60" text-anchor="middle" textLength="78" lengthAdjust="spacingAndGlyphs" fill="#fff" stroke="none"`
    + ` font-family="Impact, 'Arial Black', sans-serif" font-weight="900" font-size="30">MARVEL</text>`,
  // Serie TV: vecchio televisore con le antenne
  tv: `<rect x="12" y="30" width="76" height="54" rx="10"/><rect x="21" y="39" width="45" height="36" rx="6"/>`
    + `<circle cx="77" cy="47" r="3.5"/><circle cx="77" cy="62" r="3.5"/><path d="M44 30 L30 10 M56 30 L70 10 M28 84 V92 M72 84 V92"/>`,
  // Animazione: striscia di pellicola con la pallina che rimbalza (il primo esercizio di ogni animatore)
  animation: `<rect x="28" y="4" width="44" height="92" rx="4"/><rect x="37" y="10" width="26" height="24" rx="2" stroke-width="3"/>`
    + `<rect x="37" y="38" width="26" height="24" rx="2" stroke-width="3"/><rect x="37" y="66" width="26" height="24" rx="2" stroke-width="3"/>`
    + `<circle cx="50" cy="18" r="5" fill="#fff"/><circle cx="50" cy="47" r="5" fill="#fff"/><ellipse cx="50" cy="85" rx="7" ry="3.5" fill="#fff"/>`
    + `<path d="M32.5 12 V16 M32.5 26 V30 M32.5 40 V44 M32.5 54 V58 M32.5 68 V72 M32.5 82 V86 M67.5 12 V16 M67.5 26 V30 M67.5 40 V44 M67.5 54 V58 M67.5 68 V72 M67.5 82 V86" stroke-width="3.5"/>`,
};

/** openUni = apre il Catalogo su un universo (da App) */
export function Home({ openUni }: { openUni: (uni: string) => void }) {
  const { t, lang } = useT();
  const { data } = useStore();
  const name = useDisplayName();
  const p = data.profile ?? {};

  // --- 1. quanto ho visto in tutto ---
  const seenN = DATA.filter((d) => data.seen[d.id]).length;
  const minutes = DATA.reduce((a, d) => a + watchedMin(d, data), 0);

  // --- 3. continua a guardare ---
  const started = DATA.filter((d) => hasEps(d) && !data.seen[d.id] && epsSeen(data, d.id) > 0);
  const prefs = prefsToHome(p);
  // prossimo = il primo non visto DOPO l'ultimo visto della lista (vedi nextUp)
  const next = nextUp(buildGroups(prefs, lang, t).flatMap((g) => g.items), (d) => !!data.seen[d.id], (d) => started.includes(d));
  const uni = UNIVERSES.find((u) => u.k === prefs.uni);
  // Ordine usato per il "prossimo", es. "Cronologico · MCU" o "Percorsi · Iron Man"
  const orderLabel = prefs.order === "paths"
    ? `${t("paths")} · ${PATHS.find((x) => x.key === prefs.path)?.[lang] ?? ""}`
    : `${t(prefs.order)}${prefs.uni !== "all" && uni ? ` · ${uni.short || uni[lang]}` : ""}`;

  // --- prossima uscita: la prima con data futura ---
  const today = new Date().toISOString().slice(0, 10);
  const up = UPCOMING.find((u) => u.date > today);
  const days = up ? Math.ceil((new Date(up.date + "T00:00:00").getTime() - Date.now()) / 86400000) : 0;
  const upItems = up ? up.list.map((id) => BY_ID[id]).filter(Boolean) : [];
  const upDone = upItems.filter((d) => data.seen[d.id]).length;

  return (
    <div className="page page-enter home">
      {/* 1. INTESTAZIONE */}
      <header className="home-head">
        <button className="home-av" onClick={() => go({ page: "profile" })} aria-label={t("profile")}>
          <Avatar k={p.avatar} size={64} fallback={name} />
        </button>
        <div className="home-who">
          <h1>{name}</h1>
          <p>
            {p.bio ? <>{p.bio} · </> : null}
            <span className="mono">{seenN}/{DATA.length}</span> {t("titles")} · <span className="mono">{fmtMin(minutes)}</span>
          </p>
        </div>
        {up && (
          <button className="home-next" onClick={() => go({ page: "prep" })}>
            <small>{up.t}</small>
            <b className="mono">{up.approx ? "~" : ""}{days} <span>{t("d")}</span></b>
            {upItems.length > 0 && <small>{t("officialList")} {upDone}/{upItems.length} →</small>}
          </button>
        )}
      </header>

      {/* 2. PORTE DEGLI UNIVERSI (la prima, l'MCU, è più grande) */}
      <section className="doors">
        {UNIVERSES.filter((u) => u.k !== "all").map((u) => {
          const items = DATA.filter((d) => d.uni === u.k);
          const seen = items.filter((d) => data.seen[d.id]).length;
          return (
            <Door key={u.k} k={u.k} title={u.short || u[lang]} sub={u.short ? u[lang] : ""}
              seen={seen} total={items.length} onClick={() => openUni(u.k)} />
          );
        })}
      </section>

      {/* 3. CONTINUA A GUARDARE */}
      {(started.length > 0 || next) && (
        <section className="block">
          <h2 className="home-h2">{t("continue")}</h2>
          <div className="cw-row">
            {started.map((d) => <ContinueCard key={d.id} d={d} />)}
            {next && <ContinueCard d={next} tag={`${t("nextUp")} · ${orderLabel}`} />}
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   PORTA di un universo: colore, simbolo in filigrana, nome, visti e barra.
   --------------------------------------------------------------------------- */
function Door({ k, title, sub, seen, total, onClick }: { k: string; title: string; sub: string; seen: number; total: number; onClick: () => void }) {
  const pct = total ? (seen / total) * 100 : 0;
  return (
    <button className={`door door-${k}`} onClick={onClick} style={{ "--c": DOOR_COLOR[k] ?? "#333" } as React.CSSProperties}>
      {/* Disegno costante scritto da noi: sicuro da inserire così */}
      <svg className="door-sym" viewBox="0 0 100 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: DOOR_SYMBOL[k] ?? "" }} />
      <div className="door-txt">
        <b>{title}</b>
        {sub && <small>{sub}</small>}
        <div className="door-prog">
          <span className="mono">{seen}/{total}</span>
          <div className="progress" style={{ "--w": `${pct}%` } as React.CSSProperties}><i /></div>
        </div>
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------------------
   Riquadro di "Continua a guardare": miniatura, titolo, episodi visti.
   tag = etichetta in alto (per il "prossimo titolo")
   --------------------------------------------------------------------------- */
function ContinueCard({ d, tag }: { d: Title; tag?: string }) {
  const { t, lang } = useT();
  const { data } = useStore();
  const n = epsSeen(data, d.id);
  const isSeries = hasEps(d) && n > 0;
  return (
    <button className={`cw-card${tag ? " is-next" : ""}`} onClick={() => go({ page: "title", id: d.id })}>
      <Thumb d={d} />
      <div className="cw-txt">
        {tag && <span className="cw-tag">{tag}</span>}
        <b>{d.t[lang]}</b>
        <small>
          {isSeries ? `${n}/${d.eps} ${t("eps")}` : `${d.y} · ${t(d.type)}${hasEps(d) ? ` · ${d.eps} ${t("eps")}` : ` · ${d.min} ${t("min")}`}`}
        </small>
        {isSeries && <div className="progress" style={{ "--w": `${(n / (d.eps as number)) * 100}%`, marginTop: 8 } as React.CSSProperties}><i /></div>}
      </div>
    </button>
  );
}

/* ============================================================================
   HOME — statistiche rapide, elenco (universo + ordine + tipo),
   statistiche dettagliate e backup.
   Le scelte (universo, ordine…) arrivano da App, così restano uguali quando
   torni dalla scheda di un titolo.
   ============================================================================ */
import { useLayoutEffect } from "react";
import { DATA } from "../data/titles";
import { PATHS, UNIVERSES } from "../data/meta";
import { useT } from "../i18n";
import { useStore } from "../store";
import { ALL_TYPES, type HomeState } from "../homeState";
import type { Title } from "../types";
import { Backup } from "./Backup";
import { Kpis, StatsDetail } from "./Stats";
import { TitleRow } from "./TitleRow";

/** Posizione di scorrimento della Home, ricordata quando apri una scheda */
let savedScroll = 0;

interface Group { h: string | null; items: Title[] }

export function Home({ s, set }: { s: HomeState; set: (p: Partial<HomeState>) => void }) {
  const { t, lang } = useT();
  const { data } = useStore();

  // Ripristina lo scorrimento al ritorno, lo salva all'uscita
  useLayoutEffect(() => {
    window.scrollTo(0, savedScroll);
    return () => { savedScroll = window.scrollY; };
  }, []);

  const groups = buildGroups(s, lang, t);
  let n = 0; // numerazione continua tra i gruppi

  return (
    <div className="page page-enter">
      <Kpis />

      <div className="list-head">
        <h1>{t("list")}</h1>
        <div className="sub">{t("listSub")} · {DATA.length} {t("titles")}</div>

        {/* Universo (come le collezioni di Disney+): si combina con ogni ordine */}
        <div className="uni-tabs" role="tablist" aria-label={t("universe")}>
          {UNIVERSES.map((u) => (
            <button key={u.k} className={s.uni === u.k ? "on" : ""} onClick={() => set({ uni: u.k })}>
              {u.short || u[lang]}
              <small>{u.k === "all" ? DATA.length : DATA.filter((d) => d.uni === u.k).length}</small>
            </button>
          ))}
        </div>

        <div className="controls">
          <div className="tabs-seg">
            {(["release", "chrono", "phase", "paths"] as const).map((o) => (
              <button key={o} className={s.order === o ? "on" : ""} onClick={() => set({ order: o })}>{t(o)}</button>
            ))}
          </div>
          {s.order === "paths" && (
            <select className="input" value={s.path} onChange={(e) => set({ path: e.target.value })}>
              {PATHS.map((p) => <option key={p.key} value={p.key}>{p[lang]}</option>)}
            </select>
          )}
          <div className="chips" style={{ marginLeft: "auto" }}>
            {/* Filtri tipo a scelta multipla: "Tutti" azzera, gli altri si accendono/spengono */}
            <button className={`chip${s.types.length === 0 ? " on" : ""}`} onClick={() => set({ types: [] })}>{t("all")}</button>
            {ALL_TYPES.map((ty) => (
              <button key={ty} className={`chip${s.types.includes(ty) ? " on" : ""}`} aria-pressed={s.types.includes(ty)}
                onClick={() => {
                  const next = s.types.includes(ty) ? s.types.filter((x) => x !== ty) : [...s.types, ty];
                  set({ types: next.length === ALL_TYPES.length ? [] : next }); // tutti accesi = "Tutti"
                }}>{t(ty)}</button>
            ))}
          </div>
        </div>
      </div>

      {groups.map((g, gi) => (
        <div key={gi}>
          {g.h && (
            <div className="group" style={{ padding: "20px 2px 0" }}>
              <h2>{g.h}</h2>
              <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                {g.items.filter((d) => data.seen[d.id]).length}/{g.items.length}
              </span>
            </div>
          )}
          <div className="list-wrap">
            {g.items.length
              ? g.items.map((d) => <TitleRow key={d.id} d={d} n={++n} />)
              : <div className="empty" style={{ padding: "16px 20px" }}>{t("none")}</div>}
          </div>
        </div>
      ))}

      <details className="block" open={s.statsOpen} onToggle={(e) => set({ statsOpen: (e.target as HTMLDetailsElement).open })}>
        <summary className="eyebrow" style={{ cursor: "pointer" }}>{t("moreStats")}</summary>
        <StatsDetail />
      </details>

      <Backup />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Costruisce i gruppi dell'elenco secondo universo, tipo e ordine.
   - Uscita: una lista per anno
   - Cronologico: dentro ogni universo (con "Tutto" un gruppo per universo)
   - Fase: Fasi per l'MCU, un gruppo per ciascun altro universo
   - Percorsi: titoli del percorso; se attraversa più universi, per anno
   --------------------------------------------------------------------------- */
function buildGroups(s: HomeState, lang: "it" | "en", t: (k: "phaseN" | "inf" | "multi" | "noPhase") => string): Group[] {
  const items = DATA.filter((d) => (s.uni === "all" || d.uni === s.uni) && (s.types.length === 0 || s.types.includes(d.type)));
  const unis = UNIVERSES.filter((u) => u.k !== "all" && items.some((d) => d.uni === u.k));
  const byChrono = (arr: Title[]) => [...arr].sort((a, b) => a.chrono - b.chrono);

  if (s.order === "release") return [{ h: null, items }];

  if (s.order === "chrono") {
    if (unis.length <= 1) return [{ h: null, items: byChrono(items) }];
    return unis.map((u) => ({ h: u[lang], items: byChrono(items.filter((d) => d.uni === u.k)) }));
  }

  if (s.order === "phase") {
    const mcu = items.filter((d) => d.uni === "mcu");
    // Fasi numerate in ordine; i titoli senza Fase (serie Netflix) in un gruppo a parte in fondo
    const phases = [...new Set(mcu.map((d) => d.phase))].sort((a, b) => (a ?? 99) - (b ?? 99));
    return [
      ...phases.map((p) => {
        const its = mcu.filter((d) => d.phase === p);
        if (p === undefined) return { h: t("noPhase"), items: its };
        return { h: `${t("phaseN")} ${p} · ${its[0].saga ? t(its[0].saga) : ""}`, items: its };
      }),
      ...unis.filter((u) => u.k !== "mcu").map((u) => ({ h: u[lang], items: items.filter((d) => d.uni === u.k) })),
    ];
  }

  const p = PATHS.find((x) => x.key === s.path) ?? PATHS[0];
  const its = items.filter((d) => d[p.kind].includes(p.key));
  const multiUni = new Set(its.map((d) => d.uni)).size > 1;
  return [{ h: p[lang], items: multiUni ? its : byChrono(its) }];
}

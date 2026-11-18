/* ============================================================================
   STATISTICHE — tutto calcolato dai dati salvati
   <Kpis/>        = 4 riquadri in cima alla Home
   <StatsDetail/> = barre per universo, Fase, tipo e distribuzione dei voti
   ============================================================================ */
import { DATA } from "../data/titles";
import { UNIVERSES } from "../data/meta";
import { useT } from "../i18n";
import { go } from "../router";
import { useStore } from "../store";
import type { Title } from "../types";
import { fmtMin, watchedMin } from "../utils";
import { GemsRow } from "./Gem";

/** Calcoli comuni */
function useStats() {
  const { data } = useStore();
  const seen = DATA.filter((d) => data.seen[d.id]);
  const rated = DATA.filter((d) => data.rating[d.id]);
  const avg = rated.length ? rated.reduce((a, d) => a + data.rating[d.id], 0) / rated.length : 0;
  // Preferito = voto più alto; a parità, il primo in ordine di uscita
  const fav = [...rated].sort((a, b) => data.rating[b.id] - data.rating[a.id])[0];
  const minutes = DATA.reduce((a, d) => a + watchedMin(d, data), 0);
  return { data, seen, rated, avg, fav, minutes };
}

export function Kpis() {
  const { t, lang } = useT();
  const { seen, avg, fav, minutes } = useStats();
  const pct = (seen.length / DATA.length) * 100;
  return (
    <div className="grid4" style={{ marginTop: 0 }}>
      <div className="panel kpi">
        <span className="eyebrow">{t("done")}</span>
        <b>{Math.round(pct)}<small>% · {seen.length}/{DATA.length}</small></b>
        <div className="progress" style={{ "--w": `${pct}%`, marginTop: 10 } as React.CSSProperties}><i /></div>
      </div>
      <div className="panel kpi"><span className="eyebrow">{t("hours")}</span><b>{fmtMin(minutes)}</b></div>
      <div className="panel kpi">
        <span className="eyebrow">{t("avg")}</span>
        <b>{avg ? avg.toFixed(1) : "–"}<small>/6</small></b>
        <div style={{ marginTop: 6 }}><GemsRow n={Math.round(avg)} /></div>
      </div>
      {/* Il preferito è cliccabile: apre la sua scheda */}
      <div className="panel kpi" style={fav ? { cursor: "pointer" } : undefined} onClick={() => fav && go({ page: "title", id: fav.id })}>
        <span className="eyebrow">{t("fav")}</span>
        <b style={{ fontFamily: "Inter", fontSize: 16, fontWeight: 600 }}>{fav ? fav.t[lang] : "–"}</b>
      </div>
    </div>
  );
}

/** Una barra orizzontale: etichetta | barra | valore */
function Bar({ label, done, total }: { label: React.ReactNode; done: number; total: number }) {
  return (
    <div className="bar">
      <span>{label}</span>
      <div className="progress" style={{ "--w": `${total ? (done / total) * 100 : 0}%` } as React.CSSProperties}><i /></div>
      <span>{done}/{total}</span>
    </div>
  );
}

export function StatsDetail() {
  const { t, lang } = useT();
  const { data, rated } = useStats();
  const seenOf = (arr: Title[]) => arr.filter((d) => data.seen[d.id]).length;
  const mcu = DATA.filter((d) => d.uni === "mcu");
  const phases = [...new Set(mcu.map((d) => d.phase))].sort((a, b) => (a ?? 0) - (b ?? 0));

  return (
    <div className="grid2" style={{ marginTop: 12 }}>
      <div className="panel">
        <h2>{t("byUni")}</h2>
        {UNIVERSES.filter((u) => u.k !== "all").map((u) => {
          const arr = DATA.filter((d) => d.uni === u.k);
          return <Bar key={u.k} label={u.short || u[lang]} done={seenOf(arr)} total={arr.length} />;
        })}
        <h2 style={{ marginTop: 20 }}>{t("byPhase")} · MCU</h2>
        {phases.map((p) => {
          const arr = mcu.filter((d) => d.phase === p);
          return <Bar key={p} label={`${t("phaseN")} ${p}`} done={seenOf(arr)} total={arr.length} />;
        })}
        <h2 style={{ marginTop: 20 }}>{t("byType")}</h2>
        {(["film", "serie", "anim"] as const).map((ty) => {
          const arr = DATA.filter((d) => d.type === ty);
          return <Bar key={ty} label={t(ty)} done={seenOf(arr)} total={arr.length} />;
        })}
      </div>
      <div className="panel">
        <h2>{t("byRating")}</h2>
        {[6, 5, 4, 3, 2, 1].map((n) => {
          const c = rated.filter((d) => data.rating[d.id] === n).length;
          return (
            <div key={n} className="bar">
              <GemsRow n={n} />
              <div className="progress" style={{ "--w": `${rated.length ? (c / rated.length) * 100 : 0}%` } as React.CSSProperties}><i /></div>
              <span>{c}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

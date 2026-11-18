/* ============================================================================
   PREPARAZIONE — prossime uscite, conto alla rovescia, liste di visione
   (minima/estesa) e ripasso veloce. Le righe sono gli STESSI titoli della
   Home: segnarli qui li segna ovunque.
   ============================================================================ */
import { useEffect, useState } from "react";
import { BY_ID } from "../data/titles";
import { UPCOMING } from "../data/meta";
import { useT } from "../i18n";
import { useStore } from "../store";
import { fmtMin, watchedMin } from "../utils";
import { TitleRow } from "./TitleRow";

export function Prep() {
  const { t, lang } = useT();
  const { data } = useStore();
  const [upId, setUpId] = useState(UPCOMING[0].id);
  const [wl, setWl] = useState<"min" | "ext">("min");

  const u = UPCOMING.find((x) => x.id === upId) ?? UPCOMING[0];
  const items = u[wl].map((id) => BY_ID[id]).filter(Boolean);
  const done = items.filter((d) => data.seen[d.id]).length;
  const total = items.reduce((a, d) => a + d.min, 0);
  const left = items.reduce((a, d) => a + d.min - watchedMin(d, data), 0); // serie: solo episodi mancanti
  const dateStr = new Date(u.date + "T00:00:00").toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="page page-enter">
      <div className="page-head"><h1>{t("prep")}</h1><p>{t("prepSub")}</p></div>

      {/* Prossima uscita + conto alla rovescia + calendario */}
      <div className="panel" style={{ marginTop: 18 }}>
        <div className="release">
          <div>
            <span className="eyebrow">{t("next")}</span>
            <h2>{u.t}</h2>
            <div className="mono" style={{ color: "var(--muted)", fontSize: 12 }}>{u.approx ? `${new Date(u.date + "T00:00:00").toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", { month: "long", year: "numeric" })} · ${t("dateApprox")}` : `${dateStr} · ${t("dateNote")}`}</div>
          </div>
          <Countdown date={u.date} />
        </div>
        <div className="upcoming">
          {UPCOMING.map((x) => (
            <button key={x.id} className={x.id === u.id ? "on" : ""} onClick={() => setUpId(x.id)}>{x.t}<small>{x.date}</small></button>
          ))}
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="tabs-seg">
            {(["min", "ext"] as const).map((w) => (
              <button key={w} className={wl === w ? "on" : ""} onClick={() => setWl(w)}>{t(w === "min" ? "minList" : "extList")}</button>
            ))}
          </div>
          <div className="progress-row">
            <span>{t("progress")} <b>{done}/{items.length}</b></span>
            <span>{t("left")} <b>{fmtMin(left)}</b> / {fmtMin(total)}</span>
          </div>
          <div className="progress" style={{ "--w": `${items.length ? (done / items.length) * 100 : 0}%` } as React.CSSProperties}><i /></div>
          <div className="wl" style={{ marginTop: 8 }}>
            {items.map((d) => <TitleRow key={d.id} d={d} />)}
          </div>
        </div>

        <div className="panel">
          <h2>{t("recap")}</h2>
          <div className="eyebrow" style={{ margin: "-6px 0 14px" }}>{t("recapSub")}</div>
          {u.recap.map((r, i) => (
            <div key={i} className="recap"><b>{r.title[lang]}</b><span className="placeholder">{r.text[lang]}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Conto alla rovescia aggiornato ogni secondo */
function Countdown({ date }: { date: string }) {
  const { t } = useT();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.max(0, (new Date(date + "T00:00:00").getTime() - now) / 1000);
  const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), Math.floor(s % 60)];
  return (
    <div className="countdown">
      {(["d", "h", "m", "s"] as const).map((k, i) => (
        <div key={k}><b>{String(parts[i]).padStart(2, "0")}</b><span>{t(k)}</span></div>
      ))}
    </div>
  );
}

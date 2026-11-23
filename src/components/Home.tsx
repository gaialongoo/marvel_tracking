/* ============================================================================
   HOME — la prima pagina dopo l'accesso:
   1. Intestazione: avatar, nome, frase e quanto hai visto in tutto;
      a destra la prossima uscita con il conto alla rovescia
   2. Le "porte" degli universi: un riquadro con immagine per ogni universo,
      con la sua avanzata; cliccando si apre il Catalogo su quell'universo
   3. Continua a guardare: serie iniziate e non finite + il prossimo titolo
      non visto nell'ordine delle preferenze di visione del Profilo
   Le immagini degli universi sono in public/universes/<chiave>.webp
   (scripts/ottimizza-immagini.py); finché mancano si vede uno sfondo di colore.
   ============================================================================ */
import { useState } from "react";
import { DATA, BY_ID } from "../data/titles";
import { PATHS, UNIVERSES, UPCOMING } from "../data/meta";
import { useDisplayName } from "../hooks";
import { buildGroups, prefsToHome } from "../homeState";
import { useT } from "../i18n";
import { go } from "../router";
import { useStore } from "../store";
import type { Title } from "../types";
import { epsSeen, fmtMin, hasEps, watchedMin } from "../utils";
import { Avatar } from "./Avatar";
import { Thumb } from "./Thumb";

/** Colore di riserva di ogni porta (quando l'immagine non c'è ancora) */
const DOOR_COLOR: Record<string, string> = {
  mcu: "#7a1a1a", xmen: "#1f3a6b", f4fox: "#1d4f7a", sony: "#5a1018",
  other: "#4a3218", tv: "#4a0f14", animation: "#4b2f63",
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
  const next = buildGroups(prefs, lang, t).flatMap((g) => g.items).find((d) => !data.seen[d.id] && !started.includes(d));
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
   PORTA di un universo: immagine di sfondo, nome, visti e barra.
   Se l'immagine non si carica resta lo sfondo di colore.
   --------------------------------------------------------------------------- */
function Door({ k, title, sub, seen, total, onClick }: { k: string; title: string; sub: string; seen: number; total: number; onClick: () => void }) {
  const [imgOk, setImgOk] = useState(true);
  const pct = total ? (seen / total) * 100 : 0;
  return (
    <button className={`door door-${k}`} onClick={onClick} style={{ "--c": DOOR_COLOR[k] ?? "#333" } as React.CSSProperties}>
      {imgOk && <img src={`${import.meta.env.BASE_URL}universes/${k}.webp`} alt="" loading="lazy" onError={() => setImgOk(false)} />}
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

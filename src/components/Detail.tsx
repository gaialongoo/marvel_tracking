/* ============================================================================
   SCHEDA DEL TITOLO — pagina a sé (#/t/<id>), con pulsante Home.
   Sinistra: voto, episodi, sinossi/riassunto, post-credits
   Destra:   collegamenti prima/dopo
   Sotto:    mappa dei collegamenti a tutta larghezza
   ============================================================================ */
import { useState } from "react";
import { BY_ID } from "../data/titles";
import { GEMS, UNIVERSES } from "../data/meta";
import { useT } from "../i18n";
import { go } from "../router";
import { rate, setSeen, toggleEp, toggleSeen, useStore } from "../store";
import type { Link, Title } from "../types";
import { epsSeen, hasEps } from "../utils";
import { ConnectionMap } from "./ConnectionMap";
import { Gem } from "./Gem";
import { IconCheckText, IconExternal, IconLock } from "./Icons";
import { Thumb } from "./Thumb";

export function Detail({ id }: { id: string }) {
  const { t, lang } = useT();
  const d = BY_ID[id];

  if (!d) {
    return (
      <div className="page">
        <button className="back" onClick={() => go({ page: "home" })}>{t("back")}</button>
        <p className="empty">{t("notFound")}</p>
      </div>
    );
  }

  // Contesto: Fase per l'MCU (o "Netflix" se senza Fase), nome dell'universo per gli altri
  const ctx = d.uni === "mcu"
    ? (d.phase ? `${t("phaseN")} ${d.phase} · ${d.saga ? t(d.saga) : ""}` : t("noPhase"))
    : UNIVERSES.find((u) => u.k === d.uni)?.[lang] ?? d.uni;

  return (
    <div className="page page-enter">
      <button className="back" onClick={() => go({ page: "home" })}>{t("back")}</button>
      <Head d={d} ctx={ctx} />

      <div className="detail-grid" style={{ marginTop: 26 }}>
        <div>
          <Rating d={d} />
          {hasEps(d) && <Episodes d={d} />}
          <Texts />
          <PostCredits d={d} />
        </div>
        <div>
          <div className="block">
            <span className="eyebrow">{t("links")}</span>
            <div className="links">
              <div><div className="eyebrow" style={{ marginBottom: 8 }}>{t("before")}</div><LinkList links={d.before} /></div>
              <div><div className="eyebrow" style={{ marginBottom: 8 }}>{t("after")}</div><LinkList links={d.after} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mappa a tutta larghezza sotto le due colonne */}
      <div className="block">
        <span className="eyebrow">{t("map")}</span>
        <div className="card" style={{ padding: "18px 20px" }}><ConnectionMap d={d} /></div>
      </div>
    </div>
  );
}

/* ----- Testata: miniatura, titoli, dati, pulsanti ----- */
function Head({ d, ctx }: { d: Title; ctx: string }) {
  const { t, lang } = useT();
  const { data } = useStore();
  const seen = !!data.seen[d.id];
  return (
    <div className="d-head">
      <Thumb d={d} large />
      <div>
        <div className="eyebrow">{ctx}</div>
        <h1>{d.t[lang]}</h1>
        {/* Titolo originale sotto quello italiano, se diverso */}
        {lang === "it" && d.t.en !== d.t.it && <div className="orig">{d.t.en}</div>}
        <div className="facts">
          <span>{t("year")} <b>{d.y}</b></span>
          <span>{t("duration")} <b>{hasEps(d) ? `${d.eps} ${t("eps")}` : `${d.min} ${t("min")}`}</b></span>
          <span><b>{t(d.type)}</b></span>
          {/* Campi non ancora confermati da una fonte ufficiale */}
          {d.unverified.length > 0 && (
            <span style={{ color: "var(--red)" }} title={t("sample")}>
              {t("sample")}: {d.unverified.map((f) => t(`f_${f}` as const)).join(", ")}
            </span>
          )}
        </div>
        <div className="actions">
          <button className={`btn ${seen ? "done" : "primary"}`} onClick={() => toggleSeen(d.id)}>
            <IconCheckText /> {seen ? t("isSeen") : t("markSeen")}
          </button>
          <a className="btn" href={d.officialUrl || "https://www.marvel.com/"} target="_blank" rel="noopener noreferrer">
            {t("official")} <IconExternal />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ----- Voto a Gemme: clic = voto; riclic sulla stessa gemma = azzera ----- */
function Rating({ d }: { d: Title }) {
  const { t, lang } = useT();
  const { data } = useStore();
  const r = data.rating[d.id] || 0;
  return (
    <div className="block">
      <div className="rate-head">
        <span className="eyebrow">{t("rating")}</span>
        <span className="score">{r || "–"}<small>/6</small></span>
      </div>
      <div className="rate">
        {GEMS.map((g, i) => (
          <button key={g.k} className={i < r ? "on" : ""} style={{ "--c": `var(--${g.k})` } as React.CSSProperties}
            onClick={() => rate(d.id, i + 1)} title={`${g[lang]} · ${i + 1}/6`} aria-label={`${g[lang]} ${i + 1}/6`}>
            <Gem index={i} on={i < r} />
          </button>
        ))}
      </div>
      {r === 6 && <div className="gauntlet">{t("gauntlet")}</div>}
    </div>
  );
}

/* ----- Episodi (serie e animazione) ----- */
function Episodes({ d }: { d: Title }) {
  const { t } = useT();
  const { data } = useStore();
  const n = d.eps as number;
  const done = epsSeen(data, d.id);
  const list = data.eps[d.id] || [];
  return (
    <div className="block">
      <div className="rate-head">
        <span className="eyebrow">{t("episodes")}</span>
        <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{done}/{n}</span>
      </div>
      <div className="progress" style={{ "--w": `${(done / n) * 100}%`, margin: "8px 0 10px" } as React.CSSProperties}><i /></div>
      <div className="eps">
        {Array.from({ length: n }, (_, i) => i + 1).map((ep) => (
          <button key={ep} className={list.includes(ep) ? "on" : ""} onClick={() => toggleEp(d.id, ep)}>
            <IconCheckText /><span>{t("epN")} {ep}</span>
          </button>
        ))}
      </div>
      <div className="eps-tools">
        <button onClick={() => setSeen(d.id, true)}>{t("allEps")}</button>
        <button onClick={() => setSeen(d.id, false)}>{t("noEps")}</button>
      </div>
    </div>
  );
}

/* ----- Spoiler: testo sfocato finché non lo sblocchi ----- */
function Spoiler({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  return (
    <div className={`spoiler${open ? "" : " locked"}`}>
      {children}
      <button className="unlock" onClick={() => setOpen(true)}><IconLock /> {t("unlock")}</button>
    </div>
  );
}

/* ----- Sinossi (senza spoiler) / riassunto completo ----- */
function Texts() {
  const { t } = useT();
  const [tab, setTab] = useState<"syn" | "full">("syn");
  return (
    <div className="block card">
      <div className="inner-tabs">
        <button className={tab === "syn" ? "on" : ""} onClick={() => setTab("syn")}>{t("synopsis")}</button>
        <button className={tab === "full" ? "on" : ""} onClick={() => setTab("full")}>{t("full")}</button>
      </div>
      {tab === "syn" ? (
        <><p className="placeholder">{t("synText")}</p><div className="src">{t("synSrc")}</div></>
      ) : (
        <><Spoiler><p className="placeholder">{t("fullText")}</p></Spoiler><div className="src">{t("fullSrc")}</div></>
      )}
    </div>
  );
}

/* ----- Scene post-credits (ognuna nascosta come spoiler) ----- */
function PostCredits({ d }: { d: Title }) {
  const { t } = useT();
  return (
    <div className="block">
      <span className="eyebrow">{t("postcredits")} · {d.pc}</span>
      <div className="card">
        {d.pc ? Array.from({ length: d.pc }, (_, i) => (
          <div key={i} className="pc-item">
            <span className="n">{i + 1}</span>
            <Spoiler><p className="placeholder">{t("pcText")}</p></Spoiler>
          </div>
        )) : <div className="empty">{t("noPc")}</div>}
      </div>
    </div>
  );
}

/* ----- Elenco dei collegamenti: cliccabili, con pallino "visto" ----- */
function LinkList({ links }: { links: Link[] }) {
  const { t, lang } = useT();
  const { data } = useStore();
  const valid = links.filter((l) => BY_ID[l.id]);
  if (!valid.length) return <div className="empty">{t("none")}</div>;
  return (
    <>
      {valid.map((l) => {
        const x = BY_ID[l.id];
        return (
          <button key={l.id} className="link" onClick={() => go({ page: "title", id: l.id })}>
            <Thumb d={x} />
            <div><b>{x.t[lang]}</b><small>{l.why[lang]}</small></div>
            <i className={`dot${data.seen[l.id] ? " on" : ""}`} />
          </button>
        );
      })}
    </>
  );
}

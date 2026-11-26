// Home - la prima pagina dopo l'accesso.
// Su PC (schermo largo) è divisa in 3 colonne:
//   sinistra = profilo + amici · centro = universi ·
//   destra = Continua a guardare + Preparazione
// Su telefono e tablet le parti vanno una sotto l'altra, in questo ordine:
// 1. Intestazione: avatar, nome, @tag, frase e quanto hai visto in tutto
//    (su PC diventa la scheda del profilo, con i badge; sotto c'è "Amici")
// 2. In alto, affiancati:
//    - Continua a guardare: serie iniziate e non finite + il prossimo titolo
//      secondo le preferenze di visione del Profilo (universo, ordine, tipi):
//      quello dopo l'ultimo visto della lista, senza tornare ai saltati
//    - Preparazione: la prossima uscita con il conto alla rovescia
//      (cliccando si va alla pagina Preparazione)
// 3. Le "porte" degli universi: un riquadro per ogni universo, con la sua
//    avanzata; cliccando si apre il Catalogo su quell'universo
// Ogni porta ha il colore del suo universo e un grande simbolo in filigrana
// (disegni SVG nostri, in data/universeArt.ts: li usano anche i badge).
import { DATA, BY_ID } from "../data/titles";
import { PATHS, UNIVERSES, UPCOMING } from "../data/meta";
import { DOOR_COLOR, DOOR_SYMBOL } from "../data/universeArt";
import { useEffect, useMemo, useRef, useState } from "react";
import { computeBadges } from "../badges";
import { useFriends } from "../friends";
import { useHandle } from "../handle";
import { useDisplayName } from "../hooks";
import { buildGroups, nextUp, prefsToHome } from "../homeState";
import { useT } from "../i18n";
import { go } from "../router";
import { useStore } from "../store";
import type { Title } from "../types";
import { epsSeen, fmtMin, hasEps, isNew, watchIds, watchedMin } from "../utils";
import { Avatar } from "./Avatar";
import { Thumb } from "./Thumb";



/** openUni = apre il Catalogo su un universo (da App) */
export function Home({ openUni, openWatch }: { openUni: (uni: string) => void; openWatch: () => void }) {
  const { t, lang } = useT();
  const { data } = useStore();
  const name = useDisplayName();
  const p = data.profile ?? {};
  const { handle } = useHandle();
  const { friends, incoming } = useFriends();
  // badge conquistati (solo per il riepilogo nella scheda del profilo su PC)
  const badges = useMemo(() => computeBadges(data), [data]);
  const badgesWon = badges.filter((b) => b.level > 0).length;
  const badgesGold = badges.filter((b) => b.level === 3).length;

  // 1. quanto ho visto in tutto
  const seenN = DATA.filter((d) => data.seen[d.id]).length;
  const minutes = DATA.reduce((a, d) => a + watchedMin(d, data), 0);

  // 3. continua a guardare
  const started = DATA.filter((d) => hasEps(d) && !data.seen[d.id] && epsSeen(data, d.id) > 0);
  const prefs = prefsToHome(p);
  // Massimo 3 titoli in tutto: prima le serie iniziate, poi i "da guardare"
  // (i primi non visti dopo l'ultimo visto della lista, vedi nextUp; il primo è il "prossimo")
  const MAX_CW = 3;
  const startedShown = started.slice(0, MAX_CW);
  const nexts = nextUp(buildGroups(prefs, lang, t).flatMap((g) => g.items), (d) => !!data.seen[d.id], (d) => started.includes(d), MAX_CW - startedShown.length);
  const next = nexts[0];
  const uni = UNIVERSES.find((u) => u.k === prefs.uni);
  // Ordine usato per il "prossimo", es. "Cronologico · MCU" o "Percorsi · Iron Man"
  const orderLabel = prefs.order === "paths"
    ? `${t("paths")} · ${PATHS.find((x) => x.key === prefs.path)?.[lang] ?? ""}`
    : `${t(prefs.order)}${prefs.uni !== "all" && uni ? ` · ${uni.short || uni[lang]}` : ""}`;

  // novità (usciti da poco) e lista "Da vedere"
  const fresh = DATA.filter((d) => isNew(d.id));
  const wl = watchIds(data).map((id) => BY_ID[id]).filter(Boolean);
  const MAX_WL = 4;

  // prossima uscita: la prima con data futura
  const today = new Date().toISOString().slice(0, 10);
  const up = UPCOMING.find((u) => u.date > today);
  const days = up ? Math.ceil((new Date(up.date + "T00:00:00").getTime() - Date.now()) / 86400000) : 0;
  const upItems = up ? up.list.map((id) => BY_ID[id]).filter(Boolean) : [];
  const upDone = upItems.filter((d) => data.seen[d.id]).length;

  return (
    <div className="page page-enter home">
      {/* 1. Intestazione */}
      <header className="home-head">
        <button className="home-av" onClick={() => go({ page: "profile" })} aria-label={t("profile")}>
          <Avatar k={p.avatar} size={64} fallback={name} />
        </button>
        <div className="home-who">
          <h1>{name}</h1>
          {handle && <span className="home-tag mono">@{handle}</span>}
          <p>
            {p.bio ? <>{p.bio} · </> : null}
            <span className="mono">{seenN}/{DATA.length}</span> {t("titles")} · <span className="mono">{fmtMin(minutes)}</span>
          </p>
          {/* solo su PC: riepilogo dei badge, porta al Profilo */}
          <button className="home-badges" onClick={() => go({ page: "profile" })}>
            <span className="mono">{badgesWon}/{badges.length}</span> {t("badgesWon")} · <span className="mono">{badgesGold}</span> {t("lvlGold")} →
          </button>
        </div>
      </header>

      {/* Amici (solo su PC, colonna di sinistra): richieste in arrivo e i
   primi amici; ricerca e lista completa sono nel Profilo */}
      <section className="home-friends panel">
        <h2 className="home-h2">{t("friends")} <small className="mono muted">{friends.length}</small></h2>
        {incoming.length > 0 && (
          <button className="hf-req" onClick={() => go({ page: "profile" })}>{incoming.length} {t("frNewRequests")} →</button>
        )}
        {friends.length === 0 ? <p className="muted-p">{t("frNoneHome")}</p> : (
          <div className="hf-list">
            {friends.slice(0, 6).map((f) => (
              <button key={f.id} className="hf-item" onClick={() => go({ page: "friend", tag: f.handle })}>
                <Avatar k={f.avatar ?? undefined} size={34} fallback={f.name || f.handle} />
                <span>{f.name || `@${f.handle}`}</span>
              </button>
            ))}
          </div>
        )}
        <button className="link-btn" onClick={() => go({ page: "profile" })}>{handle ? t("frManage") : t("pickHandle")} →</button>
      </section>

      {/* 2. In alto: continua a guardare (a sinistra) + preparazione (a destra) */}
      <section className="home-top">
          {(started.length > 0 || next) && (
            <div className="home-cw">
              <h2 className="home-h2">{t("continue")}</h2>
              <ScrollRow>
                {startedShown.map((d) => <ContinueCard key={d.id} d={d} />)}
                {nexts.map((d, i) => (
                  <ContinueCard key={d.id} d={d}
                    tag={i === 0 ? `${t("nextUp")} · ${orderLabel}` : `${t("thenUp")} · ${i + 1}°`} />
                ))}
              </ScrollRow>
            </div>
          )}
          {up && (
            <div className="home-prep">
              <h2 className="home-h2">{t("prep")}</h2>
              <button className="home-next" onClick={() => go({ page: "prep" })}>
                <small>{up.t}</small>
                <b className="mono">{up.approx ? "~" : ""}{days} <span>{t("d")}</span></b>
                {upItems.length > 0 && <small>{t("officialList")} {upDone}/{upItems.length} →</small>}
              </button>
            </div>
          )}
          {/* Appena usciti: titoli usciti da poco (solo se ce ne sono) */}
          {fresh.length > 0 && (
            <div className="home-extra">
              <h2 className="home-h2">{t("newTitles")}</h2>
              <div className="mini-list">{fresh.map((d) => <MiniRow key={d.id} d={d} tag={t("newTag")} />)}</div>
            </div>
          )}
          {/* Da vedere: i primi titoli della lista (aggiunti dalla scheda) */}
          <div className="home-extra">
            <h2 className="home-h2">{t("watchlist")} <small className="mono muted">{wl.length}</small></h2>
            {wl.length === 0 ? <p className="muted-p">{t("watchEmpty")}</p> : (
              <div className="mini-list">{wl.slice(0, MAX_WL).map((d) => <MiniRow key={d.id} d={d} />)}</div>
            )}
            {wl.length > MAX_WL && <button className="link-btn" onClick={openWatch}>{t("watchAll")} →</button>}
          </div>
      </section>

      {/* 3. Porte degli universi (la prima, l'MCU, è più grande) */}
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
    </div>
  );
}

// Riga piccola (Appena usciti, Da vedere): miniatura, titolo, anno e tipo.
// tag = etichetta a destra (es. «Nuovo»)
function MiniRow({ d, tag }: { d: Title; tag?: string }) {
  const { t, lang } = useT();
  return (
    <button className="mini-row" onClick={() => go({ page: "title", id: d.id })}>
      <Thumb d={d} />
      <span><b>{d.t[lang]}</b><small>{d.y} · {t(d.type)}</small></span>
      {tag && <span className="added new">{tag}</span>}
    </button>
  );
}

// Porta di un universo: colore, simbolo in filigrana, nome, visti e barra.
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

// Riquadro di "Continua a guardare": miniatura, titolo, episodi visti.
// tag = etichetta in alto (per il "prossimo titolo")
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

// Fila che scorre di lato con una barra sotto che mostra dove sei.
// La barra è disegnata da noi: quella del browser sul telefono (soprattutto
// iPhone) sparisce da sola. Se tutto ci sta, la barra non si vede.
function ScrollRow({ children }: { children: React.ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  // size = larghezza del cursore (0–1), pos = posizione (0–1)
  const [bar, setBar] = useState({ size: 1, pos: 0 });

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const update = () => {
      const size = el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1;
      const max = el.scrollWidth - el.clientWidth;
      setBar({ size, pos: max > 0 ? el.scrollLeft / max : 0 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update); // cambia la larghezza (rotazione, finestra) o il contenuto
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);

  return (
    <div className="cw-wrap">
      <div className="cw-row" ref={row}>{children}</div>
      {bar.size < 1 && (
        <div className="cw-bar" aria-hidden="true">
          <i style={{ width: `${bar.size * 100}%`, left: `${bar.pos * (1 - bar.size) * 100}%` }} />
        </div>
      )}
    </div>
  );
}

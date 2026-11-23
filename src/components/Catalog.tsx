/* ============================================================================
   CATALOGO — l'elenco completo: universo + ordine + tipo.
   (Prima era la Home; statistiche e backup ora sono nel Profilo.)
   Le scelte arrivano da App, così restano uguali quando torni dalla scheda
   di un titolo; all'avvio partono dalle preferenze di visione del profilo.
   ============================================================================ */
import { useLayoutEffect } from "react";
import { DATA } from "../data/titles";
import { PATHS, UNIVERSES } from "../data/meta";
import { useT } from "../i18n";
import { useStore } from "../store";
import { ALL_TYPES, ORDERS, buildGroups, sanitize, type HomeState } from "../homeState";
import { TitleRow } from "./TitleRow";

/** Posizione di scorrimento del Catalogo, ricordata quando apri una scheda */
let savedScroll = 0;

export function Catalog({ s: raw, set }: { s: HomeState; set: (p: Partial<HomeState>) => void }) {
  const s = sanitize(raw);
  const { t, lang } = useT();
  const { data } = useStore();

  // Ripristina lo scorrimento al ritorno, lo salva all'uscita
  useLayoutEffect(() => {
    window.scrollTo(0, savedScroll);
    return () => { savedScroll = window.scrollY; };
  }, []);

  const groups = buildGroups(s, lang, t);
  // Titoli della vista corrente (senza doppioni): per il conteggio "visti" in alto
  const visible = [...new Map(groups.flatMap((g) => g.items).map((d) => [d.id, d])).values()];
  const seenN = visible.filter((d) => data.seen[d.id]).length;
  let n = 0; // numerazione continua tra i gruppi

  return (
    <div className="page page-enter">
      <div className="list-head" style={{ paddingTop: 0 }}>
        <h1>{t("catalog")}</h1>
        <div className="sub">{t("listSub")} · {DATA.length} {t("titles")} · {t("isSeen").toLowerCase()} {seenN}/{visible.length}</div>

        {/* Universi: si combinano con ogni ordine e filtro.
            (Le liste Disney+ sono in data/collections.ts, per ora non mostrate.) */}
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
            {ORDERS.map((o) => (
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
    </div>
  );
}

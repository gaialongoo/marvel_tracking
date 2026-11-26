/* ============================================================================
   SCELTA DEL TITOLO PREFERITO (finestra "Modifica profilo")
   Al posto del vecchio menu a discesa lunghissimo:
   - un pulsante che mostra la scelta attuale (locandina + titolo);
   - cliccandolo si apre, sotto, un pannello con:
       · un campo di RICERCA (titolo italiano o originale, accenti ignorati);
       · senza ricerca, gli universi come TENDINE apribili (MCU, X-Men…),
         con il numero di titoli; è già aperta quella del titolo scelto.
   Scegliere un titolo chiude il pannello.
   ============================================================================ */
import { useMemo, useState } from "react";
import { UNIVERSES } from "../data/meta";
import { BY_ID, DATA } from "../data/titles";
import { useT } from "../i18n";
import type { Title } from "../types";
import { norm } from "../utils";
import { Thumb } from "./Thumb";

/** Massimo di risultati mostrati mentre si cerca */
const MAX_RESULTS = 40;

export function TitlePicker({ value, onChange }: { value?: string; onChange: (id: string) => void }) {
  const { t, lang } = useT();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const current = value ? BY_ID[value] : undefined;

  // titoli divisi per universo (nell'ordine delle porte), dal più vecchio
  const byUni = useMemo(
    () => UNIVERSES.filter((u) => u.k !== "all").map((u) => ({ u, items: DATA.filter((d) => d.uni === u.k) })),
    [],
  );
  // ricerca: cerco nel titolo italiano e in quello originale
  const results = useMemo(() => {
    const k = norm(q.trim());
    if (!k) return [];
    return DATA.filter((d) => norm(d.t.it).includes(k) || norm(d.t.en).includes(k)).slice(0, MAX_RESULTS);
  }, [q]);

  const pick = (id: string) => { onChange(id); setOpen(false); setQ(""); };
  const uniName = (k: string) => UNIVERSES.find((u) => u.k === k)?.[lang] ?? "";

  /** Una riga della lista: locandina, titolo, anno (e universo durante la ricerca) */
  const row = (d: Title, showUni = false) => (
    <button key={d.id} type="button" className={`tp-item${d.id === value ? " on" : ""}`} onClick={() => pick(d.id)}
      aria-pressed={d.id === value}>
      <Thumb d={d} />
      <span><b>{d.t[lang]}</b><small>{d.y}{showUni ? ` · ${uniName(d.uni)}` : ""}</small></span>
      {d.id === value && <i className="tp-check">✓</i>}
    </button>
  );

  return (
    <div className="tp">
      {/* Pulsante con la scelta attuale */}
      <button type="button" className="field tp-current" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {current ? <><Thumb d={current} /><b>{current.t[lang]}</b></> : <span className="tp-ph">{t("pickTitle")}</span>}
        <span className={`tp-chev${open ? " up" : ""}`} aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="tp-panel">
          <input className="field" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPh")} />
          <div className="tp-list">
            {/* "Nessuno": toglie il preferito */}
            {value && !q && (
              <button type="button" className="tp-none" onClick={() => pick("")}>{t("noFav")}</button>
            )}
            {q.trim()
              ? (results.length ? results.map((d) => row(d, true)) : <p className="muted-p tp-empty">{t("noResults")}</p>)
              : byUni.map(({ u, items }) => (
                // tendina dell'universo: aperta se contiene il titolo scelto
                <details key={u.k} className="tp-uni" open={items.some((d) => d.id === value) || undefined}>
                  <summary><span>{u[lang]}</span><small>{items.length}</small></summary>
                  <div className="tp-items">{items.map((d) => row(d))}</div>
                </details>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

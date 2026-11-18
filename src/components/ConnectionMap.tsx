/* ============================================================================
   MAPPA DEI COLLEGAMENTI
   Tre colonne di riquadri: Prima | Questo titolo | Dopo.
   Dopo il disegno misuro dove sono finiti i riquadri e traccio le frecce:
   - orizzontali se le colonne sono affiancate (PC)
   - verticali se sono impilate (telefono)
   Linea continua = l'altro titolo è già visto; tratteggiata = da vedere.
   ============================================================================ */
import { useLayoutEffect, useRef, useState } from "react";
import { BY_ID } from "../data/titles";
import { useT } from "../i18n";
import { go } from "../router";
import { useStore } from "../store";
import type { Title } from "../types";

interface Edge { id: string; d: string; seen: boolean }

export function ConnectionMap({ d }: { d: Title }) {
  const { t, lang } = useT();
  const { data } = useStore();
  const box = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hot, setHot] = useState<string | null>(null);   // riquadro sotto il mouse

  // Misura e traccia le linee; ripete quando cambia la larghezza
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const draw = () => {
      const base = el.getBoundingClientRect();
      const cur = el.querySelector<HTMLElement>('[data-side="cur"]');
      if (!cur) return;
      const rel = (r: DOMRect) => ({
        l: r.left - base.left, r: r.right - base.left, t: r.top - base.top, b: r.bottom - base.top,
        cx: (r.left + r.right) / 2 - base.left, cy: (r.top + r.bottom) / 2 - base.top,
      });
      const C = rel(cur.getBoundingClientRect());
      const out: Edge[] = [];
      el.querySelectorAll<HTMLElement>('[data-side="before"],[data-side="after"]').forEach((n) => {
        const N = rel(n.getBoundingClientRect());
        const [A, B] = n.dataset.side === "before" ? [N, C] : [C, N]; // la freccia va da "prima" a "dopo"
        let path: string;
        if (A.r <= B.l + 1) {           // colonne affiancate → curva orizzontale
          const mx = (A.r + B.l) / 2;
          path = `M${A.r} ${A.cy} C${mx} ${A.cy}, ${mx} ${B.cy}, ${B.l - 4} ${B.cy}`;
        } else {                        // colonne impilate → curva verticale
          const my = (A.b + B.t) / 2;
          path = `M${A.cx} ${A.b} C${A.cx} ${my}, ${B.cx} ${my}, ${B.cx} ${B.t - 4}`;
        }
        const id = n.dataset.node as string;
        out.push({ id, d: path, seen: !!data.seen[id] });
      });
      setEdges(out);
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    document.fonts?.ready.then(draw); // i font caricati cambiano le misure
    return () => ro.disconnect();
  }, [d.id, data, lang]);

  /** Riquadro di un titolo */
  const Node = ({ id, side }: { id: string; side: "before" | "cur" | "after" }) => {
    const x = BY_ID[id];
    if (!x) return null;
    return (
      <button
        className={`mnode${side === "cur" ? " cur" : ""}${data.seen[id] ? " seen" : ""}`}
        style={{ "--c": x.c } as React.CSSProperties}
        data-side={side} data-node={id} title={x.t[lang]}
        onClick={side === "cur" ? undefined : () => go({ page: "title", id })}
        onMouseEnter={() => setHot(id)} onMouseLeave={() => setHot(null)}
      >
        <b>{x.t[lang]}</b><small>{x.y} · {t(x.type)}</small><span className="ms" />
      </button>
    );
  };

  /** Colonna con intestazione */
  const Col = ({ label, ids, side }: { label: string; ids: string[]; side: "before" | "cur" | "after" }) => (
    <div className="mcol">
      <div className="mh">{label}</div>
      {ids.length ? ids.map((id) => <Node key={id} id={id} side={side} />) : <div className="mempty">{t("none")}</div>}
    </div>
  );

  return (
    <>
      <div className="map2" ref={box}>
        <svg className="map-lines" aria-hidden="true">
          <defs>
            <marker id="arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L8 4L0 8z" fill="#6b717c" stroke="none" />
            </marker>
          </defs>
          {edges.map((e) => (
            <path key={e.id} d={e.d} className={`${e.seen ? "" : "todo"}${hot === e.id ? " hot" : ""}`} markerEnd="url(#arrow)" />
          ))}
        </svg>
        <Col label={t("mapBefore")} ids={d.before.map((l) => l.id)} side="before" />
        <Col label={t("mapNow")} ids={[d.id]} side="cur" />
        <Col label={t("mapAfter")} ids={d.after.map((l) => l.id)} side="after" />
      </div>
      <div className="map-legend">
        <span><i />{t("legSeen")}</span>
        <span><i className="todo" />{t("legTodo")}</span>
      </div>
    </>
  );
}

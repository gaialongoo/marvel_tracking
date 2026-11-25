/* ============================================================================
   BARRA IN ALTO
   [logo: reattore arc + nome]   [Home | Catalogo | Preparazione]   [ricerca] [IT | EN] [avatar]
   L'avatar apre il menu: Profilo, stato del salvataggio, Esci.
   La scheda di un titolo NON è nel selettore: si apre solo cliccando un
   titolo o dalla ricerca.
   ============================================================================ */
import { useEffect, useMemo, useRef, useState } from "react";
import { DATA } from "../data/titles";
import { useT } from "../i18n";
import { go, type Route } from "../router";
import { setLang } from "../store";
import { hasEps, norm } from "../utils";
import { ArcReactor } from "./ArcReactor";
import { AccountMenu } from "./Auth";
import { IconSearch } from "./Icons";
import { Thumb } from "./Thumb";

export function TopBar({ route }: { route: Route }) {
  const { t, lang } = useT();
  return (
    <header className="top">
      <div className="brand" onClick={() => go({ page: "home" })}>
        {/* Logo: il reattore arc di Iron Man */}
        <ArcReactor size={32} />
        <b>MARVEL TRACKER</b>
      </div>

      {/* Selettore centrale: nessuna voce attiva quando sei in una scheda */}
      <div className="switch">
        {(["home", "catalog", "prep"] as const).map((p) => (
          <button key={p} className={route.page === p ? "on" : ""} onClick={() => go({ page: p })}>{t(p)}</button>
        ))}
      </div>

      <div className="top-right">
        <Search />
        <div className="seg">
          {(["it", "en"] as const).map((l) => (
            <button key={l} className={lang === l ? "on" : ""} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
        {/* Account: avatar con lo stato del salvataggio; menu con Profilo ed Esci */}
        <AccountMenu />
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------------------
   RICERCA — cerca nel titolo italiano, inglese e nella sigla.
   Frecce su/giù per scegliere, Invio per aprire, Esc per chiudere,
   "/" da qualsiasi punto porta il cursore qui.
   --------------------------------------------------------------------------- */
function Search() {
  const { t, lang } = useT();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);

  // Risultati (massimo 8)
  const hits = useMemo(() => {
    const n = norm(q.trim());
    return n ? DATA.filter((d) => norm(`${d.t.it} ${d.t.en} ${d.abbr}`).includes(n)).slice(0, 8) : [];
  }, [q]);

  // Scorciatoia "/" e chiusura cliccando fuori
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== input.current) { e.preventDefault(); input.current?.focus(); }
    };
    const onDown = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, []);

  // Apre il titolo scelto e svuota la ricerca
  const choose = (id: string) => { go({ page: "title", id }); setQ(""); setOpen(false); input.current?.blur(); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { setHi((h) => Math.min(h + 1, hits.length - 1)); e.preventDefault(); }
    else if (e.key === "ArrowUp") { setHi((h) => Math.max(h - 1, 0)); e.preventDefault(); }
    else if (e.key === "Enter" && hits[hi]) choose(hits[hi].id);
    else if (e.key === "Escape") { setQ(""); setOpen(false); input.current?.blur(); }
  };

  return (
    <div className="search" ref={box}>
      <IconSearch />
      <input ref={input} type="search" autoComplete="off" placeholder={t("searchPh")} value={q}
        onChange={(e) => { setQ(e.target.value); setHi(0); setOpen(true); }}
        onFocus={() => setOpen(true)} onKeyDown={onKeyDown} />
      <div className={`results${open && q.trim() ? " on" : ""}`}>
        {hits.length ? hits.map((d, i) => (
          <button key={d.id} className={i === hi ? "hi" : ""} onMouseEnter={() => setHi(i)} onClick={() => choose(d.id)}>
            <Thumb d={d} />
            <div>
              <b>{d.t[lang]}</b>
              <small>{d.y} · {t(d.type)} · {hasEps(d) ? `${d.eps} ${t("eps")}` : `${d.min} ${t("min")}`}</small>
            </div>
          </button>
        )) : <div className="empty" style={{ padding: "10px 12px" }}>{t("noResults")}</div>}
      </div>
    </div>
  );
}

/* ============================================================================
   PROFILO — la scheda personale:
   1. Intestazione: avatar, nome, frase, personaggio e titolo preferiti
      (pulsante "Modifica profilo" per cambiarli)
   Subito sotto: Amici (ricerca per @tag, richieste, lista; vedi Friends.tsx)
   2. Modifica (finestra a comparsa aperta col pulsante): scelta dell'avatar
      a griglia, nome, frase, personaggio preferito, titolo preferito
   3. Preferenze di visione: universo, ordine e tipi con cui si apre il Catalogo
      (servono anche al "prossimo titolo" della Home)
   4. Badge: traguardi a livelli (components/Badges.tsx)
   5. Statistiche (riquadri + dettagli)
   6. Backup dei dati
   Il tag utente (@nome) si sceglie nella finestra di modifica; è unico tra
   tutti gli utenti e sta in una tabella a parte (vedi handle.ts).
   Ogni modifica si salva subito nell'account, come visti e voti.
   ============================================================================ */
import { useEffect, useState } from "react";
import { checkHandle, HANDLE_RE, normHandle, saveHandle, useHandle } from "../handle";
import { useAuth } from "../auth";
import { DATA, BY_ID } from "../data/titles";
import { PATHS, UNIVERSES } from "../data/meta";
import { useDisplayName } from "../hooks";
import { ALL_TYPES, ORDERS, prefsToHome } from "../homeState";
import { useT } from "../i18n";
import { go } from "../router";
import { setProfile, useStore } from "../store";
import type { Order } from "../types";
import { AVATARS, AVATAR_BY_KEY } from "../data/avatars";
import { Avatar } from "./Avatar";
import { Backup } from "./Backup";
import { Badges } from "./Badges";
import { FriendsSection } from "./Friends";
import { Kpis, StatsDetail } from "./Stats";
import { Thumb } from "./Thumb";

/** Lunghezze massime dei campi di testo */
const MAX_NAME = 30;
const MAX_BIO = 80;

/** openPath = apre il Catalogo sul percorso del personaggio (da App) */
export function Profile({ openPath }: { openPath: (path: string) => void }) {
  const { t, lang } = useT();
  const { data } = useStore();
  const { user } = useAuth();
  const name = useDisplayName();
  const p = data.profile ?? {};
  const [editing, setEditing] = useState(false);
  const { handle } = useHandle();

  const favChar = p.favChar ? AVATAR_BY_KEY[p.favChar] : undefined;
  const favTitle = p.favTitle ? BY_ID[p.favTitle] : undefined;

  return (
    <div className="page page-enter">
      {/* 1. INTESTAZIONE */}
      <section className="panel prof-head">
        <Avatar k={p.avatar} size={112} fallback={name} className="prof-av" />
        <div className="prof-main">
          <span className="eyebrow">{t("profile")}</span>
          <h1>{name}</h1>
          {/* Tag utente: se manca, un invito a sceglierlo */}
          {handle
            ? <span className="prof-tag mono">@{handle}</span>
            : <button className="prof-tag empty" onClick={() => setEditing(true)}>{t("pickHandle")}</button>}
          <small className="mono prof-mail">{user?.email}</small>
          {p.bio ? <p className="bio">“{p.bio}”</p> : <p className="bio placeholder">{t("noBio")}</p>}

          <div className="prof-favs">
            {/* Personaggio preferito: se ha un percorso, lo apre nel Catalogo */}
            <div className="fav-box">
              <span className="eyebrow">{t("favChar")}</span>
              {favChar ? (
                <button className="fav-item" disabled={!favChar.path} onClick={() => favChar.path && openPath(favChar.path)}
                  title={favChar.path ? t("openPath") : undefined}>
                  <Avatar k={favChar.key} size={34} />
                  <b>{favChar[lang]}</b>
                </button>
              ) : <span className="placeholder">–</span>}
            </div>
            {/* Titolo preferito: apre la scheda */}
            <div className="fav-box">
              <span className="eyebrow">{t("favTitle")}</span>
              {favTitle ? (
                <button className="fav-item" onClick={() => go({ page: "title", id: favTitle.id })}>
                  <Thumb d={favTitle} />
                  <b>{favTitle.t[lang]}</b>
                </button>
              ) : <span className="placeholder">–</span>}
            </div>
          </div>
        </div>
        <button className="btn prof-edit" onClick={() => setEditing(true)}>{t("editProfile")}</button>
      </section>

      {/* 2. MODIFICA: finestra a comparsa sopra la pagina */}
      {editing && <EditProfile onClose={() => setEditing(false)} />}

      {/* AMICI: ricerca per @tag, richieste e lista (components/Friends.tsx) */}
      <FriendsSection onPickHandle={() => setEditing(true)} />

      {/* 3. PREFERENZE DI VISIONE */}
      <Prefs />

      {/* 4. BADGE */}
      <Badges />

      {/* 5. STATISTICHE */}
      <section className="block">
        <span className="eyebrow">{t("stats")}</span>
        <Kpis items={DATA} />
        <StatsDetail />
      </section>

      {/* 6. BACKUP */}
      <Backup />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   MODIFICA PROFILO — finestra a comparsa (pop-up) sopra la pagina.
   I campi si salvano mentre scrivi; "Fatto", la X, il tasto Esc o un clic
   fuori dalla finestra la chiudono.
   --------------------------------------------------------------------------- */
function EditProfile({ onClose }: { onClose: () => void }) {
  const { t, lang } = useT();
  const { data } = useStore();
  const p = data.profile ?? {};
  const heroes = AVATARS.filter((a) => !a.villain);
  const villains = AVATARS.filter((a) => a.villain);
  // Titoli raggruppati per universo, in ordine di uscita (per la tendina del preferito)
  const byUni = UNIVERSES.filter((u) => u.k !== "all").map((u) => ({ u, items: DATA.filter((d) => d.uni === u.k) }));

  // Esc chiude; la pagina sotto non scorre finché la finestra è aperta
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  /** Griglia di avatar cliccabili (eroi o cattivi) */
  const grid = (list: typeof AVATARS) => (
    <div className="av-grid">
      {list.map((a) => (
        <button key={a.key} className={`av-pick${p.avatar === a.key ? " on" : ""}`} onClick={() => setProfile({ avatar: a.key })}
          aria-pressed={p.avatar === a.key}>
          <Avatar k={a.key} size={64} />
          <span>{a[lang]}</span>
        </button>
      ))}
    </div>
  );

  return (
    // clic sullo sfondo scuro = chiudi (ma non sui clic dentro la finestra)
    <div className="modal-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal panel prof-form" role="dialog" aria-modal="true" aria-labelledby="ep-title">
      <div className="ep-head">
        <h2 id="ep-title">{t("editProfile")}</h2>
        <button className="ep-x" onClick={onClose} aria-label={t("done2")}>✕</button>
      </div>
      <div className="ep-body">
      <HandleField />
      <span className="eyebrow">{t("pickAvatar")}</span>
      <h3 className="av-group">{t("heroesG")}</h3>
      {grid(heroes)}
      <h3 className="av-group">{t("villainsG")}</h3>
      {grid(villains)}

      <div className="form-grid">
        <label>
          <span className="eyebrow">{t("displayName")}</span>
          <input className="field" value={p.name ?? ""} maxLength={MAX_NAME} placeholder={t("namePh")}
            onChange={(e) => setProfile({ name: e.target.value })} />
        </label>
        <label>
          <span className="eyebrow">{t("bio")} <small>{(p.bio ?? "").length}/{MAX_BIO}</small></span>
          <input className="field" value={p.bio ?? ""} maxLength={MAX_BIO} placeholder={t("bioPh")}
            onChange={(e) => setProfile({ bio: e.target.value })} />
        </label>
        <label>
          <span className="eyebrow">{t("favChar")}</span>
          <select className="field" value={p.favChar ?? ""} onChange={(e) => setProfile({ favChar: e.target.value })}>
            <option value="">–</option>
            <optgroup label={t("heroesG")}>{heroes.map((a) => <option key={a.key} value={a.key}>{a[lang]}</option>)}</optgroup>
            <optgroup label={t("villainsG")}>{villains.map((a) => <option key={a.key} value={a.key}>{a[lang]}</option>)}</optgroup>
          </select>
        </label>
        <label>
          <span className="eyebrow">{t("favTitle")}</span>
          <select className="field" value={p.favTitle ?? ""} onChange={(e) => setProfile({ favTitle: e.target.value })}>
            <option value="">–</option>
            {byUni.map(({ u, items }) => (
              <optgroup key={u.k} label={u[lang]}>
                {items.map((d) => <option key={d.id} value={d.id}>{d.t[lang]} ({d.y})</option>)}
              </optgroup>
            ))}
          </select>
        </label>
      </div>
      </div>
      <div className="ep-foot">
        <button className="btn primary" onClick={onClose}>{t("done2")}</button>
      </div>
    </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   TAG UTENTE — campo "@nome" nella finestra di modifica.
   Mentre scrivi controllo (dopo una breve pausa) se il tag è libero;
   si salva col pulsante, perché va confermato dal database (è unico).
   --------------------------------------------------------------------------- */
type HandleSt = "idle" | "checking" | "free" | "mine" | "taken" | "invalid" | "missing" | "error" | "saved";

function HandleField() {
  const { t } = useT();
  const { handle, missing } = useHandle();
  const { data } = useStore();
  const [draft, setDraft] = useState(handle ?? "");
  const [checked, setChecked] = useState<{ h: string; r: HandleSt } | null>(null); // risultato del controllo
  const [saved, setSaved] = useState<{ h: string; r: HandleSt } | null>(null);     // risultato del salvataggio
  const [busy, setBusy] = useState(false);

  // Quando il tag arriva dal database (apertura lenta), lo metto nel campo
  useEffect(() => { if (handle) setDraft((d) => d || handle); }, [handle]);

  // Controllo se è libero 400 ms dopo l'ultimo tasto
  useEffect(() => {
    if (!draft || draft === handle || !HANDLE_RE.test(draft)) return;
    let stop = false;
    const id = window.setTimeout(async () => {
      const r = await checkHandle(draft);
      if (!stop) setChecked({ h: draft, r });
    }, 400);
    return () => { stop = true; clearTimeout(id); };
  }, [draft, handle]);

  // Stato da mostrare, calcolato da quello che c'è scritto
  let st: HandleSt;
  if (saved && saved.h === draft) st = saved.r;
  else if (!draft || draft === handle) st = missing ? "missing" : "idle";
  else if (!HANDLE_RE.test(draft)) st = "invalid";
  else if (checked && checked.h === draft) st = checked.r;
  else st = "checking";

  const save = async () => {
    setBusy(true);
    const r = await saveHandle(draft, { name: data.profile?.name, avatar: data.profile?.avatar });
    setBusy(false);
    setSaved({ h: draft, r: r === "ok" ? "saved" : r });
  };

  const msg: Record<HandleSt, string> = {
    idle: "", checking: t("handleChecking"), free: t("handleFree"), mine: t("handleMine"), taken: t("handleTaken"),
    invalid: t("handleInvalid"), missing: t("handleMissing"), error: t("handleError"), saved: t("handleSaved"),
  };
  const good = st === "free" || st === "saved" || st === "mine";
  return (
    <div className="handle-field">
      <span className="eyebrow">{t("handle")}</span>
      <div className="handle-row">
        <label className="handle-in">
          <span>@</span>
          <input value={draft} maxLength={20} placeholder="nome" autoComplete="off" spellCheck={false}
            onChange={(e) => setDraft(normHandle(e.target.value))} aria-label={t("handle")} />
        </label>
        <button className="btn primary" disabled={busy || st !== "free"} onClick={save}>{t("handleSave")}</button>
      </div>
      <small className={`handle-msg${good ? " ok" : st === "checking" || st === "idle" ? "" : " bad"}`}>{msg[st] || t("handleHelp")}</small>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   PREFERENZE DI VISIONE — come si apre il Catalogo
   --------------------------------------------------------------------------- */
function Prefs() {
  const { t, lang } = useT();
  const { data } = useStore();
  const cur = prefsToHome(data.profile); // valori attuali (con i predefiniti)
  return (
    <section className="panel block">
      <span className="eyebrow">{t("prefs")}</span>
      <p className="muted-p">{t("prefsSub")}</p>
      <div className="controls">
        <select className="input" value={cur.uni} onChange={(e) => setProfile({ prefUni: e.target.value })} aria-label={t("universe")}>
          {UNIVERSES.map((u) => <option key={u.k} value={u.k}>{u[lang]}</option>)}
        </select>
        <div className="tabs-seg">
          {ORDERS.map((o) => (
            <button key={o} className={cur.order === o ? "on" : ""} onClick={() => setProfile({ prefOrder: o as Order })}>{t(o)}</button>
          ))}
        </div>
        {cur.order === "paths" && (
          <select className="input" value={cur.path} onChange={(e) => setProfile({ prefPath: e.target.value })}>
            {PATHS.map((x) => <option key={x.key} value={x.key}>{x[lang]}</option>)}
          </select>
        )}
        {/* Cosa voglio guardare: come i filtri del Catalogo, "Tutti" azzera */}
        <div className="chips">
          <button className={`chip${cur.types.length === 0 ? " on" : ""}`} onClick={() => setProfile({ prefTypes: undefined })}>{t("all")}</button>
          {ALL_TYPES.map((ty) => (
            <button key={ty} className={`chip${cur.types.includes(ty) ? " on" : ""}`} aria-pressed={cur.types.includes(ty)}
              onClick={() => {
                const next = cur.types.includes(ty) ? cur.types.filter((x) => x !== ty) : [...cur.types, ty];
                // nessuno o tutti accesi = "Tutti" (il campo si toglie dal profilo)
                setProfile({ prefTypes: next.length === 0 || next.length === ALL_TYPES.length ? undefined : next });
              }}>{t(ty)}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   PROFILO — la scheda personale:
   1. Intestazione: avatar, nome, frase, personaggio e titolo preferiti
      (pulsante "Modifica profilo" per cambiarli)
   2. Modifica (aperta col pulsante): scelta dell'avatar a griglia, nome,
      frase, personaggio preferito, titolo preferito
   3. Preferenze di visione: universo e ordine con cui si apre il Catalogo
      (servono anche al "prossimo titolo" della Home)
   4. Statistiche (riquadri + dettagli)
   5. Backup dei dati
   Ogni modifica si salva subito nell'account, come visti e voti.
   ============================================================================ */
import { useState } from "react";
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
        <button className={`btn${editing ? " primary" : ""} prof-edit`} onClick={() => setEditing((e) => !e)}>
          {editing ? t("done2") : t("editProfile")}
        </button>
      </section>

      {/* 2. MODIFICA */}
      {editing && <EditProfile />}

      {/* 3. PREFERENZE DI VISIONE */}
      <Prefs />

      {/* 4. STATISTICHE */}
      <section className="block">
        <span className="eyebrow">{t("stats")}</span>
        <Kpis items={DATA} />
        <StatsDetail />
      </section>

      {/* 5. BACKUP */}
      <Backup />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   MODIFICA PROFILO — i campi si salvano mentre scrivi
   --------------------------------------------------------------------------- */
function EditProfile() {
  const { t, lang } = useT();
  const { data } = useStore();
  const p = data.profile ?? {};
  const heroes = AVATARS.filter((a) => !a.villain);
  const villains = AVATARS.filter((a) => a.villain);
  // Titoli raggruppati per universo, in ordine di uscita (per la tendina del preferito)
  const byUni = UNIVERSES.filter((u) => u.k !== "all").map((u) => ({ u, items: DATA.filter((d) => d.uni === u.k) }));

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
    <section className="panel block prof-form">
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
    </section>
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

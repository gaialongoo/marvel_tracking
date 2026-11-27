// Amici
// - FriendsSection (nel Profilo): ricerca per @tag, richieste ricevute
//   (Accetta / Rifiuta), richieste mandate (Annulla) e lista degli amici
// - FriendPage (#/u/<tag>): la pagina di un amico con avatar, nome, numeri,
//   cosa sta guardando e i suoi voti. Se non siete amici si vede solo la
//   sua scheda pubblica (avatar, nome, @tag) e il pulsante per chiedere.
// Solo "amici": niente seguiti/follower. La logica è in friends.ts.
import { useEffect, useMemo, useState } from "react";
import { computeBadges } from "../badges";
import { DATA } from "../data/titles";
import {
  acceptRequest, blockPerson, fetchFriendData, findPerson, relationOf, removeFriendship, reportPerson, REPORT_REASONS, searchPeople,
  sendRequest, unblockPerson, useFriends, type Person, type ReportReason,
} from "../friends";
import { shareInvite } from "../share";
import { useHandle } from "../handle";
import { useT } from "../i18n";
import { go, goBack } from "../router";
import { showToast } from "../toast";
import type { SavedData } from "../types";
import { epsSeen, fmtMin, hasEps, watchedMin } from "../utils";
import { Avatar } from "./Avatar";
import { GemsRow } from "./Gem";
import { Thumb } from "./Thumb";

/** Nome da mostrare di una persona: il nome scelto, altrimenti il @tag */
const shown = (p: Person) => p.name || `@${p.handle}`;

// Sezione amici del profilo
export function FriendsSection({ onPickHandle }: { onPickHandle: () => void }) {
  const { t } = useT();
  useActTexts();
  const { friends, incoming, outgoing, blocked, missing } = useFriends();
  const { handle } = useHandle();

  return (
    <section className="panel block friends" id="amici">
      <span className="eyebrow">{t("friends")} <small className="mono">{friends.length}</small></span>

      {missing ? <p className="muted-p">{t("friendsMissing")}</p> : (
        <>
          {/* Senza tag non ti trova nessuno: invito a sceglierlo */}
          {!handle && (
            <p className="muted-p">{t("friendsNeedTag")} <button className="link-btn" onClick={onPickHandle}>{t("pickHandle")}</button></p>
          )}

          <FriendSearch />

          {/* Invita: link alla tua pagina (chi lo apre può chiederti l'amicizia) */}
          {handle && <InviteButton handle={handle} />}

          {/* Richieste ricevute */}
          {incoming.length > 0 && (
            <div className="fr-block">
              <h3 className="av-group">{t("frIncoming")} <small>{incoming.length}</small></h3>
              {incoming.map((p) => (
                <PersonRow key={p.id} p={p}>
                  <button className="btn primary" onClick={() => act(acceptRequest(p.id), t("frAccepted"))}>{t("frAccept")}</button>
                  <button className="btn" onClick={() => act(removeFriendship(p.id))}>{t("frDecline")}</button>
                </PersonRow>
              ))}
            </div>
          )}

          {/* Lista degli amici: cliccando si apre la loro pagina */}
          <div className="fr-block">
            <h3 className="av-group">{t("frList")}</h3>
            {friends.length === 0 ? <p className="muted-p">{t("frNone")}</p> : (
              <div className="fr-grid">
                {friends.map((p) => (
                  <button key={p.id} className="fr-card" onClick={() => go({ page: "friend", tag: p.handle })}>
                    <Avatar k={p.avatar ?? undefined} size={48} fallback={p.name || p.handle} />
                    <span><b>{shown(p)}</b><small className="mono">@{p.handle}</small></span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Persone bloccate: si possono sbloccare */}
          {blocked.length > 0 && (
            <div className="fr-block">
              <h3 className="av-group">{t("frBlocked")} <small>{blocked.length}</small></h3>
              {blocked.map((p) => (
                <PersonRow key={p.id} p={p}>
                  <button className="btn" onClick={() => act(unblockPerson(p.id), t("frUnblocked"))}>{t("frUnblock")}</button>
                </PersonRow>
              ))}
            </div>
          )}

          {/* Richieste mandate, in attesa */}
          {outgoing.length > 0 && (
            <div className="fr-block">
              <h3 className="av-group">{t("frOutgoing")} <small>{outgoing.length}</small></h3>
              {outgoing.map((p) => (
                <PersonRow key={p.id} p={p}>
                  <button className="btn" onClick={() => act(removeFriendship(p.id))}>{t("frCancel")}</button>
                </PersonRow>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

/** Testi degli avvisi (impostati dal componente con la lingua giusta) */
let errTexts = { missing: "", error: "" };

/** Esegue un'azione e avvisa se va male (o con un messaggio se va bene) */
async function act(p: Promise<"missing" | "error" | null>, okMsg?: string) {
  const err = await p;
  if (err) showToast(errTexts[err], true);
  else if (okMsg) showToast(okMsg);
}

/** Aggiorna i testi degli avvisi nella lingua attuale */
function useActTexts() {
  const { t } = useT();
  errTexts = { missing: t("friendsMissing"), error: t("handleError") };
}

/** Riga di una persona: avatar, nome, @tag e pulsanti a destra */
function PersonRow({ p, children }: { p: Person; children?: React.ReactNode }) {
  return (
    <div className="fr-row">
      <Avatar k={p.avatar ?? undefined} size={40} fallback={p.name || p.handle} />
      <span className="fr-who"><b>{shown(p)}</b><small className="mono">@{p.handle}</small></span>
      <span className="fr-acts">{children}</span>
    </div>
  );
}

/**
 * Ricerca per @tag: risultati dopo una breve pausa, con il pulsante giusto
 * per ognuno (Aggiungi / Accetta / Richiesta inviata / Amici)
 */
function FriendSearch() {
  const { t } = useT();
  useFriends(); // si ridisegna quando cambiano le amicizie (pulsanti aggiornati)
  const [q, setQ] = useState("");
  const [res, setRes] = useState<{ q: string; list: Person[] } | null>(null);

  useEffect(() => {
    const clean = q.trim();
    if (clean.replace(/^@+/, "").length < 2) return;
    let stop = false;
    const id = window.setTimeout(async () => {
      const r = await searchPeople(clean);
      if (!stop) setRes({ q: clean, list: Array.isArray(r) ? r : [] });
    }, 350);
    return () => { stop = true; clearTimeout(id); };
  }, [q]);

  const clean = q.trim();
  const short = clean.replace(/^@+/, "").length < 2;
  const list = !short && res && res.q === clean ? res.list : null; // null = sto cercando

  return (
    <div className="fr-search">
      <label className="handle-in">
        <span>@</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("frSearchPh")} autoComplete="off" spellCheck={false} aria-label={t("frSearchPh")} />
      </label>
      {!short && (
        <div className="fr-results">
          {list === null ? <p className="muted-p">{t("handleChecking")}</p>
            : list.length === 0 ? <p className="muted-p">{t("frNoResults")}</p>
            : list.map((p) => {
              const rel = relationOf(p.id);
              return (
                <PersonRow key={p.id} p={p}>
                  {rel === "none" && <button className="btn primary" onClick={() => act(sendRequest(p.id), t("frSent"))}>{t("frAdd")}</button>}
                  {rel === "incoming" && <button className="btn primary" onClick={() => act(acceptRequest(p.id), t("frAccepted"))}>{t("frAccept")}</button>}
                  {rel === "outgoing" && <span className="fr-state">{t("frPending")}</span>}
                  {rel === "friend" && <button className="btn" onClick={() => go({ page: "friend", tag: p.handle })}>{t("frOpen")}</button>}
                </PersonRow>
              );
            })}
        </div>
      )}
    </div>
  );
}

// Pagina di un amico (#/u/<tag>)
export function FriendPage({ tag }: { tag: string }) {
  const { t } = useT();
  useActTexts();
  useFriends(); // per aggiornare il rapporto dopo Aggiungi / Accetta / Togli
  // chi è (dal @tag) e i suoi dati (solo se siete amici)
  const [person, setPerson] = useState<Person | null | undefined>(undefined); // undefined = carico
  const [data, setData] = useState<SavedData | null | undefined>(undefined);
  const [reporting, setReporting] = useState(false);
  const { handle: myHandle } = useHandle();

  // Trovo la persona dal @tag
  useEffect(() => {
    let stop = false;
    (async () => {
      const p = await findPerson(tag);
      if (!stop) setPerson(p);
    })();
    return () => { stop = true; };
  }, [tag]);

  const rel = person ? relationOf(person.id) : "none";

  // Se siete amici scarico i suoi dati (si riscaricano se cambia il rapporto)
  useEffect(() => {
    if (!person || rel !== "friend") return;
    let stop = false;
    fetchFriendData(person.id).then((d) => { if (!stop) setData(d); });
    return () => { stop = true; };
  }, [person, rel]);

  if (person === undefined) return <div className="page"><p className="muted-p">{t("handleChecking")}</p></div>;
  if (person === null) {
    return (
      <div className="page page-enter">
        <button className="btn" onClick={goBack}>{t("back")}</button>
        <p className="muted-p" style={{ marginTop: 16 }}>{t("frNotFound")}</p>
      </div>
    );
  }

  const friendData = rel === "friend" ? data : null;
  return (
    <div className="page page-enter">
      <button className="btn" onClick={goBack}>{t("back")}</button>

      {/* Intestazione: avatar, nome, @tag e pulsanti del rapporto */}
      <section className="panel prof-head fr-head">
        <Avatar k={friendData?.profile?.avatar ?? person.avatar ?? undefined} size={96} fallback={person.name || person.handle} className="prof-av" />
        <div className="prof-main">
          <span className="eyebrow">{rel === "friend" ? t("frFriend") : t("frPerson")}</span>
          <h1>{friendData?.profile?.name || shown(person)}</h1>
          <span className="prof-tag mono">@{person.handle}</span>
          {friendData?.profile?.bio && <p className="bio">“{friendData.profile.bio}”</p>}
        </div>
        <div className="fr-acts">
          {rel === "none" && <button className="btn primary" onClick={() => act(sendRequest(person.id), t("frSent"))}>{t("frAdd")}</button>}
          {rel === "incoming" && <>
            <button className="btn primary" onClick={() => act(acceptRequest(person.id), t("frAccepted"))}>{t("frAccept")}</button>
            <button className="btn" onClick={() => act(removeFriendship(person.id))}>{t("frDecline")}</button>
          </>}
          {rel === "outgoing" && <button className="btn" onClick={() => act(removeFriendship(person.id))}>{t("frCancel")}</button>}
          {rel === "friend" && <button className="btn" onClick={() => { if (confirm(t("frRemoveAsk"))) void act(removeFriendship(person.id)); }}>{t("frRemove")}</button>}
          {rel === "blocked" && <button className="btn" onClick={() => act(unblockPerson(person.id), t("frUnblocked"))}>{t("frUnblock")}</button>}
        </div>
        {/* Blocca e Segnala (non sulla propria pagina) */}
        {person.handle !== myHandle && (
          <div className="fr-safety">
            {rel !== "blocked" && (
              <button className="link-btn muted" onClick={() => { if (confirm(t("frBlockAsk"))) void act(blockPerson(person.id), t("frBlockedMsg")); }}>{t("frBlock")}</button>
            )}
            <button className="link-btn muted" onClick={() => setReporting(true)}>{t("frReport")}</button>
          </div>
        )}
      </section>
      {reporting && <ReportDialog p={person} onClose={() => setReporting(false)} />}

      {rel === "blocked" ? <p className="muted-p block">{t("frIsBlocked")}</p>
        : rel !== "friend" ? <p className="muted-p block">{t("frOnlyFriends")}</p>
        : data === undefined ? <p className="muted-p block">{t("handleChecking")}</p>
        : !data ? <p className="muted-p block">{t("frNoData")}</p>
        : <FriendStats d={data} />}
    </div>
  );
}

/** Numeri, cosa sta guardando e voti di un amico */
function FriendStats({ d }: { d: SavedData }) {
  const { t, lang } = useT();
  const badges = useMemo(() => computeBadges(d), [d]);
  const seen = DATA.filter((x) => d.seen[x.id]);
  const minutes = DATA.reduce((a, x) => a + watchedMin(x, d), 0);
  const watching = DATA.filter((x) => hasEps(x) && !d.seen[x.id] && epsSeen(d, x.id) > 0);
  // voti dal più alto, a parità in ordine di uscita
  const rated = DATA.filter((x) => (d.rating[x.id] ?? 0) > 0).sort((a, b) => d.rating[b.id] - d.rating[a.id]);

  return (
    <>
      {/* Numeri generali */}
      <section className="block fr-kpis">
        <div className="panel"><span className="eyebrow">{t("titles")}</span><b className="mono">{seen.length}/{DATA.length}</b></div>
        <div className="panel"><span className="eyebrow">{t("hours")}</span><b className="mono">{fmtMin(minutes)}</b></div>
        <div className="panel"><span className="eyebrow">{t("badges")}</span><b className="mono">{badges.filter((b) => b.level > 0).length}/{badges.length}</b></div>
        <div className="panel"><span className="eyebrow">{t("lvlGold")}</span><b className="mono">{badges.filter((b) => b.level === 3).length}</b></div>
      </section>

      {/* Cosa sta guardando: serie iniziate e non finite */}
      <section className="block">
        <h2 className="home-h2">{t("frWatching")}</h2>
        {watching.length === 0 ? <p className="muted-p">{t("frNotWatching")}</p> : (
          <div className="fr-grid">
            {watching.map((x) => (
              <button key={x.id} className="cw-card" onClick={() => go({ page: "title", id: x.id })}>
                <Thumb d={x} />
                <div className="cw-txt"><b>{x.t[lang]}</b><small>{epsSeen(d, x.id)}/{x.eps} {t("eps")}</small></div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Voti */}
      <section className="block">
        <h2 className="home-h2">{t("frRatings")} <small className="mono muted">{rated.length}</small></h2>
        {rated.length === 0 ? <p className="muted-p">{t("frNoRatings")}</p> : (
          <div className="fr-rated">
            {rated.map((x) => (
              <button key={x.id} className="fr-rate" onClick={() => go({ page: "title", id: x.id })}>
                <Thumb d={x} />
                <span><b>{x.t[lang]}</b><small className="mono">{x.y}</small></span>
                <GemsRow n={d.rating[x.id]} />
              </button>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// Invita amici - condivide (telefono) o copia (PC) il link alla tua pagina
function InviteButton({ handle }: { handle: string }) {
  const { t } = useT();
  return (
    <div className="fr-invite">
      <button className="btn primary" onClick={async () => {
        const r = await shareInvite(handle, t("inviteText"));
        if (r === "copied") showToast(t("inviteCopied"));
        if (r === "error") showToast(t("handleError"), true);
      }}>{t("invite")}</button>
      <small className="muted-p">{t("inviteHelp")}</small>
    </div>
  );
}

// Segnala - finestra con il motivo e una nota facoltativa.
// La segnalazione arriva a chi gestisce il sito (tabella "reports").
function ReportDialog({ p, onClose }: { p: Person; onClose: () => void }) {
  const { t } = useT();
  const [reason, setReason] = useState<ReportReason>("handle");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  // Esc chiude la finestra
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = async () => {
    setBusy(true);
    const err = await reportPerson(p.id, reason, note);
    setBusy(false);
    if (err) showToast(err === "missing" ? t("friendsMissing") : t("handleError"), true);
    else { showToast(t("frReportSent")); onClose(); }
  };

  return (
    <div className="modal-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal panel report-box" role="dialog" aria-modal="true" aria-labelledby="rep-title">
        <div className="ep-head">
          <h2 id="rep-title">{t("frReport")} @{p.handle}</h2>
          <button className="ep-x" onClick={onClose} aria-label={t("frCancel")}>✕</button>
        </div>
        <div className="report-body">
          {REPORT_REASONS.map((r) => (
            <label key={r} className="report-opt">
              <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />
              <span>{t(`rep_${r}` as const)}</span>
            </label>
          ))}
          <textarea className="field" rows={3} maxLength={300} value={note} placeholder={t("repNotePh")} onChange={(e) => setNote(e.target.value)} />
          <p className="muted-p">{t("repInfo")}</p>
        </div>
        <div className="ep-foot">
          <button className="btn" onClick={onClose}>{t("frCancel")}</button>
          <button className="btn primary" disabled={busy} onClick={send}>{busy ? "…" : t("repSend")}</button>
        </div>
      </div>
    </div>
  );
}

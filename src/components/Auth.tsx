/* ============================================================================
   ACCOUNT — tutto quello che riguarda l'accesso:
   - AuthGate: decide cosa mostrare (configurazione mancante, caricamento,
     pagina di accesso, nuova password, oppure l'app vera)
   - AuthPage: Accedi / Registrati / Password dimenticata
   - NewPassword: dopo il link "password dimenticata" ricevuto via email
   - BrowserDataDialog: cosa fare dei dati salvati nel browser prima degli account
   - AccountMenu: avatar nella barra in alto (nome, email, Profilo,
     stato salvataggio, Esci)
   ============================================================================ */
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { signIn, signOut, signUp, sendReset, updatePassword, useAuth, type AuthErr } from "../auth";
import { useDisplayName } from "../hooks";
import { useT } from "../i18n";
import { go } from "../router";
import { clearLocalCopy, resolveBrowserData, setLang, useStore } from "../store";
import { isConfigured } from "../supabase";
import { Avatar } from "./Avatar";

/** Password lunga almeno 8 caratteri (stessa regola da impostare su Supabase) */
const MIN_PW = 8;

/* ---------------------------------------------------------------------------
   AUTH GATE — avvolge l'app: senza accesso non si vede niente
   --------------------------------------------------------------------------- */
export function AuthGate({ children }: { children: ReactNode }) {
  const { ready, user, recovery } = useAuth();
  const { loaded, sync } = useStore();
  const { t } = useT();

  if (!isConfigured) return <Shell><SetupHelp /></Shell>;
  if (!ready) return <Shell><p className="auth-wait">{t("authLoading")}</p></Shell>;
  if (!user) return <AuthPage />;
  if (recovery) return <NewPassword />;
  if (!loaded) return <Shell><p className="auth-wait">{sync === "error" ? t("syncOffline") : t("authLoading")}</p></Shell>;
  return <>{children}<BrowserDataDialog /></>;
}

/** Cornice delle pagine di accesso: logo, lingua e riquadro centrale */
function Shell({ children }: { children: ReactNode }) {
  const { lang } = useT();
  return (
    <div className="auth">
      <div className="auth-box panel">
        <div className="auth-head">
          <div className="brand">
            <div className="brand-mark" />
            <div><b>MARVEL TRACKER</b><small>v0.1</small></div>
          </div>
          <div className="seg">
            {(["it", "en"] as const).map((l) => (
              <button key={l} className={lang === l ? "on" : ""} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Mostrata se mancano indirizzo e chiave di Supabase (vedi README) */
function SetupHelp() {
  const { t } = useT();
  return (
    <>
      <h2>{t("setupTitle")}</h2>
      <p className="auth-note">{t("setupText")}</p>
      <pre className="auth-code">VITE_SUPABASE_URL=…{"\n"}VITE_SUPABASE_PUBLISHABLE_KEY=…</pre>
    </>
  );
}

/* ---------------------------------------------------------------------------
   PAGINA DI ACCESSO — tre modalità nello stesso riquadro
   --------------------------------------------------------------------------- */
type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const { t } = useT();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<AuthErr | "err_short" | "err_mismatch" | null>(null);
  const [info, setInfo] = useState<"infoConfirm" | "infoReset" | null>(null);

  /** Cambia modalità tenendo l'email già scritta */
  const switchTo = (m: Mode) => { setMode(m); setErr(null); setInfo(null); setPw(""); setPw2(""); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null); setInfo(null);
    const mail = email.trim();
    // Controlli prima di disturbare il server
    if (mode === "signup" && pw.length < MIN_PW) return setErr("err_short");
    if (mode === "signup" && pw !== pw2) return setErr("err_mismatch");
    setBusy(true);
    if (mode === "signin") {
      setErr(await signIn(mail, pw)); // se va bene, AuthGate mostra l'app da solo
    } else if (mode === "signup") {
      const r = await signUp(mail, pw);
      setErr(r.err);
      if (!r.err && r.needsConfirm) { setInfo("infoConfirm"); setMode("signin"); setPw(""); setPw2(""); }
    } else {
      const r = await sendReset(mail);
      setErr(r);
      if (!r) setInfo("infoReset");
    }
    setBusy(false);
  };

  return (
    <Shell>
      <h2>{t(mode === "signin" ? "signIn" : mode === "signup" ? "signUp" : "forgotTitle")}</h2>
      <p className="auth-note">{t(mode === "forgot" ? "forgotSub" : "authSub")}</p>

      <form className="auth-form" onSubmit={submit}>
        <label>
          <span className="eyebrow">{t("email")}</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {mode !== "forgot" && (
          <label>
            <span className="eyebrow">{t("password")}</span>
            <input type="password" required minLength={mode === "signup" ? MIN_PW : undefined}
              autoComplete={mode === "signup" ? "new-password" : "current-password"} value={pw} onChange={(e) => setPw(e.target.value)} />
          </label>
        )}
        {mode === "signup" && (
          <label>
            <span className="eyebrow">{t("password2")}</span>
            <input type="password" required autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
          </label>
        )}

        {/* Messaggi: errore in rosso, informazione in oro */}
        {err && <p className="auth-msg err" role="alert">{t(err)}</p>}
        {info && <p className="auth-msg" role="status">{t(info)}</p>}

        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? "…" : t(mode === "signin" ? "signIn" : mode === "signup" ? "createAccount" : "sendLink")}
        </button>
      </form>

      {/* Collegamenti tra le modalità */}
      <div className="auth-links">
        {mode === "signin" && <>
          <button onClick={() => switchTo("forgot")}>{t("forgot")}</button>
          <button onClick={() => switchTo("signup")}>{t("noAccount")}</button>
        </>}
        {mode !== "signin" && <button onClick={() => switchTo("signin")}>{t("haveAccount")}</button>}
      </div>
    </Shell>
  );
}

/* ---------------------------------------------------------------------------
   NUOVA PASSWORD — si apre dal link dell'email "password dimenticata"
   --------------------------------------------------------------------------- */
function NewPassword() {
  const { t } = useT();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<AuthErr | "err_short" | "err_mismatch" | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pw.length < MIN_PW) return setErr("err_short");
    if (pw !== pw2) return setErr("err_mismatch");
    setBusy(true);
    setErr(await updatePassword(pw)); // se va bene, AuthGate mostra l'app
    setBusy(false);
  };

  return (
    <Shell>
      <h2>{t("newPwTitle")}</h2>
      <p className="auth-note">{t("newPwSub")}</p>
      <form className="auth-form" onSubmit={submit}>
        <label>
          <span className="eyebrow">{t("password")}</span>
          <input type="password" required minLength={MIN_PW} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
        <label>
          <span className="eyebrow">{t("password2")}</span>
          <input type="password" required autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        </label>
        {err && <p className="auth-msg err" role="alert">{t(err)}</p>}
        <button className="btn primary" type="submit" disabled={busy}>{busy ? "…" : t("savePw")}</button>
      </form>
    </Shell>
  );
}

/* ---------------------------------------------------------------------------
   DATI DEL BROWSER — compare dopo l'accesso se in questo browser ci sono
   dati salvati prima degli account. Si sceglie una volta per dispositivo.
   --------------------------------------------------------------------------- */
function BrowserDataDialog() {
  const { t } = useT();
  const { browserData, data } = useStore();
  if (!browserData) return null;

  /** Riassunto di un salvataggio: quanti visti e quanti voti */
  const count = (d: typeof data) =>
    `${Object.values(d.seen).filter(Boolean).length} ${t("cntSeen")} · ${Object.values(d.rating).filter((v) => v > 0).length} ${t("cntRated")}`;

  return (
    <div className="modal-back">
      <div className="modal panel" role="dialog" aria-modal="true" aria-labelledby="bd-title">
        <h2 id="bd-title">{t("bdTitle")}</h2>
        <p className="auth-note">{t("bdText")}</p>
        <div className="bd-compare">
          <div><span className="eyebrow">{t("bdBrowser")}</span><b>{count(browserData)}</b></div>
          <div><span className="eyebrow">{t("bdAccount")}</span><b>{count(data)}</b></div>
        </div>
        <div className="bd-actions">
          <button className="btn primary" onClick={() => resolveBrowserData("merge")}>{t("bdMerge")}</button>
          <button className="btn" onClick={() => resolveBrowserData("browser")}>{t("bdKeepBrowser")}</button>
          <button className="btn" onClick={() => resolveBrowserData("account")}>{t("bdKeepAccount")}</button>
        </div>
        <p className="auth-note small">{t("bdNote")}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   MENU ACCOUNT — nella barra in alto: l'avatar del profilo con un anello
   che indica lo stato del salvataggio; al clic mostra nome, email,
   "Profilo" ed "Esci"
   --------------------------------------------------------------------------- */
export function AccountMenu() {
  const { t } = useT();
  const { user } = useAuth();
  const { sync, data } = useStore();
  const name = useDisplayName();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Chiude il menu cliccando fuori
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  /** Esce dopo aver salvato; se il salvataggio non parte chiede conferma */
  const logout = async () => {
    const ok = await clearLocalCopy();
    if (!ok && !confirm(t("logoutUnsaved"))) return;
    await signOut();
  };

  const syncLabel = t(sync === "error" ? "syncError" : sync === "saving" || sync === "loading" ? "syncSaving" : "syncSaved");

  return (
    <div className="account" ref={box}>
      <button className={`account-btn sync-${sync}`} onClick={() => setOpen((o) => !o)} title={syncLabel} aria-label={t("account")}>
        <Avatar k={data.profile?.avatar} size={30} fallback={name} />
      </button>
      {open && (
        <div className="account-menu">
          <div className="am-head">
            <Avatar k={data.profile?.avatar} size={40} fallback={name} />
            <div>
              <b>{name}</b>
              <small className="am-mail">{user?.email}</small>
            </div>
          </div>
          <small className={`sync-txt sync-${sync}`}>{syncLabel}</small>
          <button className="btn" onClick={() => { setOpen(false); go({ page: "profile" }); }}>{t("profile")}</button>
          <button className="btn" onClick={logout}>{t("signOut")}</button>
        </div>
      )}
    </div>
  );
}

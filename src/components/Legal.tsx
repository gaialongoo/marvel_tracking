// Privacy, condizioni d'uso e nota legale
// - Privacy (#/privacy): si apre anche senza aver fatto l'accesso (serve
//   prima di registrarsi). Testi in italiano e inglese qui sotto.
// - SiteFooter: in fondo a ogni pagina, con la nota "progetto di fan, non
//   affiliato a Marvel o Disney" e il link alla Privacy.
// Contatto ed età minima arrivano da config.ts.
import { CONTACT_EMAIL, MIN_AGE } from "../config";
import { useT } from "../i18n";
import { goBack } from "../router";
import { setLang } from "../store";
import { ArcReactor } from "./ArcReactor";
import { ThemeButton } from "./ThemeButton";

/** Ultimo aggiornamento del testo (da cambiare quando cambia qualcosa) */
const UPDATED = "2026-11-26";

/** Il contatto: l'email se c'è, altrimenti un avviso */
function Contact() {
  const { lang } = useT();
  return CONTACT_EMAIL
    ? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
    : <em>{lang === "it" ? "(indirizzo email in arrivo)" : "(email address coming soon)"}</em>;
}

/**
 * Citazione obbligatoria di TMDB (condizioni d'uso delle sue API): logo
 * ufficiale (public/tmdb.svg) + frase "usa TMDB ma non è approvato da TMDB"
 */
function TmdbCredit({ it }: { it: boolean }) {
  return (
    <p className="tmdb-credit">
      <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer"><img src="tmdb.svg" alt="TMDB" /></a>
      {it
        ? "Questo sito usa TMDB e le API di TMDB ma non è approvato, certificato o comunque autorizzato da TMDB. Locandine: The Movie Database (TMDB)."
        : "This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB. Posters: The Movie Database (TMDB)."}
    </p>
  );
}

// Pagina privacy
export function Privacy() {
  const { t, lang } = useT();
  const it = lang === "it";
  return (
    <div className="legal">
      <header className="legal-top">
        <div className="brand"><ArcReactor size={28} /><b>MARVEL TRACKER</b></div>
        <div className="seg">
          {(["it", "en"] as const).map((l) => (
            <button key={l} className={lang === l ? "on" : ""} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
          ))}
          <ThemeButton />
        </div>
      </header>
      <article className="page legal-page">
        <button className="back" onClick={goBack}>{t("back")}</button>
        <h1>{it ? "Privacy e condizioni d'uso" : "Privacy and terms of use"}</h1>
        <p className="muted-p">{it ? "Ultimo aggiornamento" : "Last updated"}: <span className="mono">{UPDATED}</span></p>

        {it ? <>
          <h2>Chi siamo</h2>
          <p>Marvel Tracker è un <b>progetto personale di una fan</b>, gratuito e senza pubblicità. Chi lo gestisce è la titolare del trattamento dei dati. Per qualunque richiesta sulla privacy, per una segnalazione o per far cancellare i dati scrivi a: <Contact />.</p>

          <h2>Quali dati raccogliamo</h2>
          <ul>
            <li><b>Account</b>: email e password. La password non la vediamo mai: è conservata cifrata da Supabase.</li>
            <li><b>I tuoi progressi</b>: titoli visti, episodi, voti, lista «Da vedere» e il profilo (nome, avatar, frase, personaggio e titolo preferiti, preferenze di visione).</li>
            <li><b>Community</b>: il tuo @tag, le amicizie, le persone che blocchi e le segnalazioni che invii.</li>
          </ul>
          <p>Non raccogliamo dati di pagamento, posizione, contatti o altro. Non ci sono statistiche di visita, pubblicità o profilazione.</p>

          <h2>Perché e su che base</h2>
          <p>Solo per far funzionare il servizio che chiedi creando l'account: salvare i tuoi progressi e mostrarli su tutti i tuoi dispositivi, e farti trovare dagli amici (art. 6.1.b del GDPR, esecuzione del servizio).</p>

          <h2>Chi vede cosa</h2>
          <ul>
            <li><b>Tutti gli utenti registrati</b> vedono il tuo @tag, il nome e l'avatar (servono per la ricerca amici), solo se hai scelto un @tag.</li>
            <li><b>I tuoi amici</b> (solo dopo che avete accettato entrambi) vedono in sola lettura i tuoi visti, voti, la serie che stai guardando, la frase e i preferiti.</li>
            <li>La tua email non la vede nessun altro utente.</li>
          </ul>

          <h2>Dove sono i dati</h2>
          <p>Account e database sono ospitati da <b>Supabase</b> (supabase.com), che li tratta per nostro conto. Le email dell'account (conferma e nuova password) partono tramite <b>Resend</b> (resend.com, server in Irlanda), che riceve solo il tuo indirizzo email per consegnarle. Il sito è pubblicato su <b>GitHub Pages</b>, che come ogni server registra l'indirizzo IP di chi visita. Il dominio è gestito da <b>Cloudflare</b>, che inoltra anche i messaggi scritti all'indirizzo di contatto. Nelle pagine di accesso e registrazione c'è il controllo anti-bot <b>Cloudflare Turnstile</b>: per distinguere le persone dai programmi Cloudflare legge alcune informazioni tecniche del browser (indirizzo IP, tipo di browser), senza cookie pubblicitari e senza sapere chi sei. I caratteri del sito sono inclusi nell'app (il browser non contatta Google). Le <b>locandine</b> si caricano dal server di <b>TMDB</b> (themoviedb.org): come ogni sito, TMDB vede l'indirizzo IP di chi le scarica, ma non riceve nessun altro dato su di te.</p>

          <h2>Cookie e memoria del browser</h2>
          <p>Non usiamo cookie di profilazione. Il browser conserva solo dati <b>tecnici</b> necessari: la sessione di accesso, una copia dei tuoi progressi (per usare l'app anche con una connessione lenta), la lingua scelta e, se hai aperto un link di invito, il @tag di chi ti ha invitato. Per questo non serve un banner dei cookie.</p>

          <h2>Per quanto tempo</h2>
          <p>Finché hai l'account. Se lo elimini, tutti i dati vengono cancellati subito e per sempre.</p>

          <h2>I tuoi diritti</h2>
          <ul>
            <li><b>Copia dei dati</b>: Profilo → Backup → scarica il file.</li>
            <li><b>Correzione</b>: modifichi tutto dal Profilo.</li>
            <li><b>Cancellazione</b>: Profilo → Account → Elimina account (immediata), oppure scrivendo al contatto sopra.</li>
            <li>Puoi anche fare reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).</li>
          </ul>

          <h2>Condizioni d'uso</h2>
          <ul>
            <li>Per creare un account devi avere almeno <b>{MIN_AGE} anni</b>.</li>
            <li>Niente @tag, nomi o frasi offensivi, discriminatori, volgari o che imitano un'altra persona. Puoi <b>bloccare</b> e <b>segnalare</b> chiunque dalla sua pagina; gli account che non rispettano queste regole possono essere eliminati.</li>
            <li>Il servizio è offerto così com'è, senza garanzie: può cambiare o chiudere. Ti consigliamo di scaricare ogni tanto il Backup.</li>
          </ul>

          <h2>Nota legale</h2>
          <p>Marvel Tracker è un progetto di fan <b>non ufficiale</b>, non affiliato né approvato da Marvel, The Walt Disney Company, Sony Pictures o 20th Century Studios. Marvel, i nomi dei personaggi, dei film e delle serie sono marchi dei rispettivi proprietari e sono citati solo per indicare i titoli. Sinossi e riassunti sono scritti da noi. Le locandine appartengono ai rispettivi proprietari e sono fornite da TMDB.</p>

          <h2>Crediti</h2>
          <TmdbCredit it />
        </> : <>
          <h2>Who we are</h2>
          <p>Marvel Tracker is a <b>personal fan project</b>, free and ad-free. The person who runs it is the data controller. For any privacy request, a report or to have your data deleted, write to: <Contact />.</p>

          <h2>What data we collect</h2>
          <ul>
            <li><b>Account</b>: email and password. We never see your password: Supabase stores it encrypted.</li>
            <li><b>Your progress</b>: titles watched, episodes, ratings, watchlist and profile (name, avatar, tagline, favourite character and title, viewing preferences).</li>
            <li><b>Community</b>: your @tag, friendships, the people you block and the reports you send.</li>
          </ul>
          <p>We don't collect payment details, location, contacts or anything else. There are no visit analytics, ads or profiling.</p>

          <h2>Why and on what basis</h2>
          <p>Only to run the service you ask for when you create an account: saving your progress, showing it on all your devices and letting friends find you (GDPR art. 6.1.b, performance of the service).</p>

          <h2>Who sees what</h2>
          <ul>
            <li><b>All registered users</b> see your @tag, name and avatar (needed for the friend search), only if you picked an @tag.</li>
            <li><b>Your friends</b> (only once you have both accepted) see, read-only, your watched titles, ratings, the series you're watching, your tagline and favourites.</li>
            <li>No other user sees your email.</li>
          </ul>

          <h2>Where the data is</h2>
          <p>Accounts and the database are hosted by <b>Supabase</b> (supabase.com), which processes them on our behalf. Account emails (confirmation and new password) are sent through <b>Resend</b> (resend.com, servers in Ireland), which only receives your email address to deliver them. The site is published on <b>GitHub Pages</b>, which, like any server, logs visitors' IP addresses. The domain is managed by <b>Cloudflare</b>, which also forwards messages sent to the contact address. The sign-in and sign-up pages use the <b>Cloudflare Turnstile</b> bot check: to tell people from programs, Cloudflare reads some technical information from your browser (IP address, browser type), with no advertising cookies and without knowing who you are. The site's fonts are bundled with the app (your browser doesn't contact Google). <b>Posters</b> load from the <b>TMDB</b> server (themoviedb.org): like any website, TMDB sees the IP address of whoever downloads them, but receives no other data about you.</p>

          <h2>Cookies and browser storage</h2>
          <p>We don't use profiling cookies. Your browser only keeps <b>technical</b> data that's needed: the login session, a copy of your progress (so the app works on slow connections), your language and, if you opened an invite link, the @tag of who invited you. That's why there's no cookie banner.</p>

          <h2>How long</h2>
          <p>As long as you have an account. If you delete it, all data is erased immediately and permanently.</p>

          <h2>Your rights</h2>
          <ul>
            <li><b>Copy of your data</b>: Profile → Backup → download the file.</li>
            <li><b>Correction</b>: edit everything from your Profile.</li>
            <li><b>Deletion</b>: Profile → Account → Delete account (immediate), or write to the contact above.</li>
            <li>You can also complain to your data protection authority (in Italy, garanteprivacy.it).</li>
          </ul>

          <h2>Terms of use</h2>
          <ul>
            <li>You must be at least <b>{MIN_AGE} years old</b> to create an account.</li>
            <li>No offensive, discriminatory or vulgar @tags, names or taglines, and no impersonating others. You can <b>block</b> and <b>report</b> anyone from their page; accounts that break these rules may be deleted.</li>
            <li>The service is provided as is, without warranties: it may change or close. We suggest downloading a Backup now and then.</li>
          </ul>

          <h2>Legal notice</h2>
          <p>Marvel Tracker is an <b>unofficial</b> fan project, not affiliated with or endorsed by Marvel, The Walt Disney Company, Sony Pictures or 20th Century Studios. Marvel and the names of characters, films and series are trademarks of their respective owners and are mentioned only to identify the titles. Synopses and summaries are written by us. Posters belong to their respective owners and are provided by TMDB.</p>

          <h2>Credits</h2>
          <TmdbCredit it={false} />
        </>}
      </article>
      <SiteFooter />
    </div>
  );
}

// Piè di pagina (tutte le pagine, anche quella di accesso)
export function SiteFooter() {
  const { lang } = useT();
  return (
    <footer className="site-foot">
      <span>{lang === "it"
        ? "Progetto di fan non ufficiale, non affiliato a Marvel o Disney. I marchi appartengono ai rispettivi proprietari. Locandine da TMDB."
        : "Unofficial fan project, not affiliated with Marvel or Disney. Trademarks belong to their respective owners. Posters from TMDB."}</span>
      <a href="#/privacy">{lang === "it" ? "Privacy e condizioni" : "Privacy & terms"}</a>
    </footer>
  );
}

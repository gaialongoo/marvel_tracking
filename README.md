# Marvel Tracker

Web app personale per seguire tutto l'universo Marvel: film e serie MCU, film Fox e Sony, serie live-action non MCU e animazione.

> **Stato attuale:** catalogo con **188 titoli**: MCU completo (timeline ufficiale marvel.com), film Fox/Sony/altri studi, serie live-action fuori MCU e animazione (classica e recente, esclusa quella per bambini). **Fonti:** prima quelle ufficiali (marvel.com, pagine Disney+ Italia dei singoli titoli), poi fonti affidabili non ufficiali (it/en.wikipedia) solo dove le ufficiali non dicono nulla; se non coincidono vale Disney+. Restano **Da verificare** 5 titoli: le scene dopo i titoli di Hulk Vs., Planet Hulk, The Amazing Spider-Man 2 e The Punisher: One Last Kill (nessuna fonte le descrive per intero) e la posizione cronologica di Spider-Man: Brand New Day (non ancora nella timeline ufficiale di marvel.com). Per le serie la durata totale è una stima (episodi × durata media).

## Funzionalità

| Area | Cosa fa |
| --- | --- |
| **Universi** | Schede in alto: Tutto, MCU, X-Men (Fox), Fantastici 4 (Fox), Sony, Animazione. Si combinano con qualsiasi ordine; il cronologico si calcola dentro ogni universo |
| **Ordini di visione** | Uscita, cronologico (dentro ogni universo), per Fase/Saga, per personaggio e percorsi tematici |
| **Voto** | Da 1 a 6 con le Gemme dell'Infinito; 6/6 = Guanto completo |
| **Tipi** | Film, Serie (TV), Animazione (ANI), Speciali (SPC, es. Licantropus), Corti One-Shot (ONE): la sigla compare nell'angolo della miniatura. I filtri per tipo sono a **scelta multipla** (es. Film + Serie, senza Corti) |
| **Episodi** | Per serie e animazione si spuntano i singoli episodi; nell'elenco un anello mostra la % vista, al 100% diventa la spunta |
| **Riassunti** | Sinossi senza spoiler + riassunto completo con spoiler (nascosto finché non lo sblocchi) + descrizione di ogni scena dopo i titoli. Testi scritti da Claude in italiano e inglese; il pulsante «Pagina ufficiale» apre la pagina Disney+ Italia con la sinossi ufficiale. **Stato:** tutti i 188 titoli hanno la sinossi e 187 il riassunto completo (manca Jeff, serie su cui Wikipedia non ha ancora una trama). Tutte le scene dopo i titoli scritte sono confermate (le ultime due, Speciale di Natale dei Guardiani e Thunderbolts*, il 23/11/2026). Per i titoli 2025-2026 la trama viene da Wikipedia (en) |
| **Collegamenti** | Cosa vedere prima, cosa viene dopo, scene post-credits, mappa visiva con frecce |
| **Preparazione** | Prossime uscite con conto alla rovescia, lista **ufficiale** (Disney+) con tempo mancante, nessuna proposta nostra |
| **Statistiche** | In alto: completamento, ore viste, media voti e preferito **della vista corrente** (universo, ordine/percorso, tipi scelti); dettaglio per universo, Fase, tipo e voti |
| **Account** | Accesso **obbligatorio** con email e password (Supabase). Chiunque può registrarsi; ognuno vede solo i propri dati. C'è «Password dimenticata?» con link via email |
| **Salvataggio** | Automatico **nell'account**: i dati ti seguono su telefono e PC. Una copia resta nel browser, così se manca la connessione non si perde niente (viene inviata appena torna). Il pallino dell'account in alto mostra lo stato: grigio = salvato, oro = salvataggio, rosso = non salvato. Backup esportabile/importabile in `.json` |
| **Lingue** | Italiano e inglese. La lingua resta **per dispositivo** (non va nell'account); la prima volta si usa quella del browser |

**Stile:** "Stark Industries": grafite scura, oro come accento, rosso solo per avvisi e spoiler. Funziona su telefono e su PC.

**Navigazione:** barra in alto con **Home | Preparazione**, ricerca (scorciatoia `/`) e lingua. La **scheda** di un titolo si apre solo cliccando un titolo o dalla ricerca, e ha il pulsante **Home**. Indirizzi: `#/` Home, `#/prep` Preparazione, `#/t/<id>` scheda.

**Fonti:** date, ordini e sinossi solo da fonti ufficiali (marvel.com, Disney+, Marvel Studios). I riassunti completi sono scritti a parte e possono usare fonti secondarie.

## Come avviare l'app

Serve [Node.js](https://nodejs.org/) (versione LTS). Su Windows: `winget install OpenJS.NodeJS.LTS`, poi riavvia VS Code e verifica con `node -v`.

```bash
npm install     # installa le dipendenze (solo la prima volta)
npm run dev     # avvia l'app: apri l'indirizzo che compare (di solito http://localhost:5173)
npm run build   # crea la versione pronta da pubblicare nella cartella dist/
npm run lint    # controlla il codice
```

> **Errore "running scripts is disabled on this system" in PowerShell?** Usa `npm.cmd run dev`, oppure abilita gli script una volta per sempre (solo per il tuo utente) con `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, oppure usa il terminale Command Prompt o Git Bash in VS Code.

I tuoi dati (visti, voti, episodi) sono salvati nel tuo account Supabase. Per avviare l'app in locale serve prima il collegamento a Supabase (vedi sotto); senza, l'app mostra una pagina che spiega cosa manca.

## Account e Supabase (da fare una volta)

L'app usa [Supabase](https://supabase.com) (piano gratuito) per gli account e per salvare i dati. I passaggi da fare a mano:

1. **Crea il progetto** su supabase.com → New project.
2. **Crea la tabella**: SQL Editor → New query → incolla tutto [supabase/schema.sql](supabase/schema.sql) → Run. Crea la tabella `progress` (una riga per utente) con le regole che permettono a ognuno di leggere e scrivere **solo i propri dati**.
3. **Indirizzi consentiti**: Authentication → URL Configuration
   - *Site URL*: `https://gaialongoo.github.io/marvel_tracking/`
   - *Redirect URLs*: aggiungi `https://gaialongoo.github.io/marvel_tracking/**` e `http://localhost:5173/**`
   Servono per i link nelle email (conferma dell'account e nuova password).
4. **Password**: Authentication → Sign In / Providers → Email: lascia attivi «Enable sign ups» e «Confirm email», e porta la lunghezza minima della password a **8** (l'app chiede almeno 8 caratteri).
5. **Chiavi in locale**: copia [.env.example](.env.example) come `.env.local` e incolla *Project URL* e *Publishable key* (Project Settings → API Keys; va bene anche la vecchia chiave *anon*). `.env.local` non viene caricato su GitHub. Riavvia `npm run dev`.
6. **Chiavi per GitHub Pages**: su GitHub → Settings → Secrets and variables → Actions → scheda **Variables** → crea `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` con gli stessi valori. La chiave publishable è fatta per stare in un sito pubblico: i dati sono protetti dalle regole del punto 2.

**Email:** le email di Supabase gratuite hanno un limite di pochi invii all'ora e possono finire nello spam. Per molti utenti conviene collegare un servizio SMTP (Authentication → Emails → SMTP Settings).

**Come funziona il salvataggio** ([src/store.ts](src/store.ts)):
- dopo l'accesso i dati vengono scaricati dall'account; ogni modifica si vede subito e parte verso l'account dopo meno di un secondo;
- tornando sull'app (cambio scheda o finestra) i dati vengono riletti, così si vedono le modifiche fatte su un altro dispositivo. Se modifichi la stessa cosa su due dispositivi nello stesso momento vale l'ultimo salvataggio;
- **dati di prima degli account**: se nel browser ci sono visti e voti salvati prima, dopo l'accesso una finestra chiede se *unirli* (visti ed episodi si sommano, per i voti diversi vince l'account), *tenere quelli del browser* o *tenere quelli dell'account*. Dopo la scelta i dati del browser vengono cancellati;
- uscendo dall'account (pulsante in alto a destra → Esci) la copia nel browser viene cancellata, così su un PC condiviso non resta niente;
- i link nelle email (conferma, nuova password) vanno aperti **nello stesso browser** in cui li hai chiesti. Se apri il link di conferma altrove l'email risulta comunque confermata: basta accedere.

## Struttura del progetto

```text
marvel_tracker/
├── src/
│   ├── main.tsx            ← punto di ingresso
│   ├── App.tsx             ← barra + pagina attiva
│   ├── styles.css          ← tutti gli stili
│   ├── types.ts            ← forma dei dati (Title, SavedData…)
│   ├── store.ts            ← dati personali: salvataggio nell'account + azioni
│   ├── auth.ts             ← accesso, registrazione, uscita, recupero password
│   ├── supabase.ts         ← collegamento a Supabase (legge .env.local)
│   ├── router.ts           ← navigazione con #/…
│   ├── i18n.ts             ← testi IT/EN
│   ├── homeState.ts        ← scelte dell'elenco (universo, ordine…)
│   ├── hooks.ts, utils.ts, toast.ts
│   ├── data/
│   │   ├── titles.ts       ← CATALOGO dei titoli (fonti in cima al file)
│   │   ├── collections.ts  ← liste Disney+ (pronte, per ora NON mostrate nell'app)
│   │   ├── disneyLinks.ts  ← indirizzi delle pagine ufficiali Disney+ Italia
│   │   ├── texts/          ← sinossi, riassunti e scene dopo i titoli (un file per blocco)
│   │   └── meta.ts         ← universi, percorsi, prossime uscite, Gemme
│   └── components/         ← TopBar, Home, Detail, Prep, Auth (accesso e menu account), ConnectionMap, Gem…
├── supabase/schema.sql     ← tabella e regole di sicurezza da eseguire su Supabase
├── .env.example            ← modello per .env.local (indirizzo e chiave di Supabase)
├── prototype/design.html   ← prototipo HTML (riferimento del design)
├── index.html              ← pagina di ingresso
└── vite.config.ts          ← configurazione (base relativa per GitHub Pages)
```

## Prototipo

`prototype/design.html` è il prototipo da cui è nata l'app: si apre con doppio clic, senza installare niente. Resta come riferimento del design.

## Convenzioni

- Tutto il codice è **commentato** (in italiano).
- Questo README viene **aggiornato a ogni modifica** rilevante.

## Pubblicazione online (GitHub Pages)

L'app è online su **https://gaialongoo.github.io/marvel_tracking/** e si apre anche dal telefono.
- A ogni push su `main`, il flusso `.github/workflows/deploy.yml` compila l'app e pubblica la cartella `dist`.
- Va fatto **una volta sola**: su GitHub, Settings → Pages → Build and deployment → Source = **GitHub Actions**. Con "Deploy from a branch" GitHub pubblica i file sorgente e la pagina resta bianca.
- Il flusso legge `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` dalle Variables del repo (vedi «Account e Supabase», punto 6): senza, il sito pubblicato mostra la pagina «Collegamento all'account da configurare».
- Con l'account, «visto» e voti sono gli stessi su telefono e PC.

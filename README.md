# Marvel Tracker

Web app personale per seguire tutto l'universo Marvel: film e serie MCU, film Fox e Sony, serie live-action non MCU e animazione.

> **Stato attuale:** catalogo con **188 titoli**: MCU completo (timeline ufficiale marvel.com), film Fox/Sony/altri studi, serie live-action fuori MCU e animazione (classica e recente, esclusa quella per bambini). **Fonti:** prima quelle ufficiali (marvel.com, pagine Disney+ Italia dei singoli titoli), poi fonti affidabili non ufficiali (it/en.wikipedia) solo dove le ufficiali non dicono nulla; se non coincidono vale Disney+. Restano **Da verificare** 4 titoli: le scene dopo i titoli di Hulk Vs., Planet Hulk e The Amazing Spider-Man 2 (nessuna fonte le descrive per intero) e la posizione cronologica di Spider-Man: Brand New Day (non ancora nella timeline ufficiale di marvel.com). Per le serie la durata totale è una stima (episodi × durata media).

## Funzionalità

| Area | Cosa fa |
| --- | --- |
| **Home** | La prima pagina dopo l'accesso, **a tutta larghezza** (niente bande vuote ai lati). **Su PC è in 3 colonne**: a sinistra la scheda del profilo (avatar, nome, @tag, frase, visti, ore, riepilogo dei badge) e sotto **Amici** (richieste in arrivo e i primi amici; ricerca e lista complete sono nel Profilo); al centro gli universi (MCU su tutta la riga, poi 3 per riga su due righe); a destra Continua a guardare (in colonna), Preparazione, **Appena usciti** e **Da vedere**. Le colonne laterali si restringono un po' sulle finestre meno larghe e, se la colonna centrale è stretta, le porte piccole mostrano solo nome e barra (niente sottotitolo), così il testo non esce mai dal riquadro. **Su telefono e tablet** le parti vanno una sotto l'altra: avatar, nome, frase e quanto hai visto in tutto. Subito sotto, affiancati: **Continua a guardare** (al massimo **3 titoli**: serie iniziate e poi i prossimi da guardare; da telefono scorrono di lato con una barra sotto che mostra dove sei. Il **prossimo** titolo è secondo le preferenze di visione: il primo non visto **dopo l'ultimo visto** della lista; i titoli saltati più indietro non vengono riproposti) e **Preparazione**, con i giorni alla prossima uscita (cliccando si va alla pagina Preparazione). Sotto, le **porte degli universi**: un riquadro per ogni universo, con un colore diverso per ogni universo e un grande simbolo in filigrana (scudo di Cap, X degli X-Men, 4, ragno, scritta MARVEL, televisore, pellicola) (l'MCU su tutta la riga, gli altri in tante colonne quante ne stanno) con visti/totale; cliccando si apre il Catalogo su quell'universo. |
| **Catalogo** | L'elenco completo (prima era la Home), con universi, ordini e filtri qui sotto. All'accesso si apre con le preferenze di visione del Profilo (universo, ordine e tipi) |
| **Profilo** | Con **Modifica profilo** si apre una finestra a comparsa (si chiude con Fatto, la X, Esc o un clic fuori). Avatar (22 personaggi disegnati da noi in SVG: 16 eroi e 6 cattivi, in stile kawaii che «si affaccia dal bordo» con le manine, tratto disegnato a mano), nome, **tag utente `@nome`** (unico tra tutti gli utenti, per la futura community; modificabile), frase breve, personaggio preferito (se ha un percorso, cliccandolo si apre nel Catalogo), titolo preferito, preferenze di visione (universo, ordine e tipi da guardare — film, serie, animazione… — con cui si apre il Catalogo e si calcola il «prossimo»), **badge**, statistiche e backup. Tutto si salva da solo nell'account |
| **Universi** | Schede in cima al Catalogo: Tutto, MCU, X-Men (Fox), Fantastici 4 (Fox), Sony, Animazione. Si combinano con qualsiasi ordine; il cronologico si calcola dentro ogni universo |
| **Ordini di visione** | Uscita, cronologico (dentro ogni universo), per Fase/Saga, per personaggio e percorsi tematici |
| **Voto** | Da 1 a 6 con le Gemme dell'Infinito; 6/6 = Guanto completo |
| **Tipi** | Film, Serie (TV), Animazione (ANI), Speciali (SPC, es. Licantropus), Corti One-Shot (ONE): la sigla compare nell'angolo della miniatura. I filtri per tipo sono a **scelta multipla** (es. Film + Serie, senza Corti) |
| **Episodi** | Per serie e animazione si spuntano i singoli episodi; nell'elenco un anello mostra la % vista, al 100% diventa la spunta |
| **Riassunti** | Sinossi senza spoiler + riassunto completo con spoiler (nascosto finché non lo sblocchi) + descrizione di ogni scena dopo i titoli. Testi scritti da Claude in italiano e inglese; il pulsante «Pagina ufficiale» apre la pagina Disney+ Italia con la sinossi ufficiale. **Stato:** tutti i 188 titoli hanno sinossi e riassunto completo (per Jeff il riassunto viene dalle descrizioni degli episodi sulla pagina ufficiale Disney+). Tutte le scene dopo i titoli scritte sono confermate (le ultime due, Speciale di Natale dei Guardiani e Thunderbolts*, il 23/11/2026). **Serie** (26/11/2026): il numero è il totale della stagione e ogni scena indica l'episodio, visibile anche senza sbloccare lo spoiler. Hanno scene WandaVision (4), Falcon and the Winter Soldier (2), Loki 1 e 2, What If…? 1 e 2, Hawkeye, Moon Knight, Ms. Marvel (2), She-Hulk (5), Echo, Ironheart, Daredevil: Rinascita 1 e I Am Groot 1 e 2; non ne hanno Secret Invasion, Agatha, Wonder Man, Daredevil: Rinascita 2, What If…? 3, Werewolf by Night e The Punisher: One Last Kill. Per i titoli 2025-2026 la trama viene da Wikipedia (en) |
| **Novità e Da vedere** | **«Nuovo»**: un titolo uscito da meno di 90 giorni ha l'etichetta azzurra «Nuovo» nel Catalogo e nella scheda, e compare in Home sotto **Appena usciti**. Le date di uscita in Italia sono in `RELEASE_DATES` ([src/data/meta.ts](src/data/meta.ts)), con la fonte di ognuna: quando esce un titolo basta aggiungere la sua data. **Da vedere**: nella scheda di un titolo non visto il pulsante con il segnalibro lo aggiunge (o lo toglie) dalla tua lista; segnarlo come visto lo toglie da solo. In Home ci sono i primi 4 della lista (dal più vecchio aggiunto) e «Tutta la lista» apre il Catalogo con il filtro **Da vedere** acceso, che si combina con universo, ordine e tipi. Nel Catalogo i titoli in lista hanno un segnalibro d'oro. La lista è salvata nell'account (campo `watch`) |
| **Collegamenti** | Cosa vedere prima, cosa viene dopo, scene post-credits, mappa visiva con frecce |
| **Preparazione** | Prossime uscite con conto alla rovescia, lista **ufficiale** (Disney+) con tempo mancante, nessuna proposta nostra |
| **Badge** | Nel Profilo, divisi in **tendine** per gruppo (chiuse all'inizio; nell'intestazione badge conquistati, livelli e barra di completamento): 61 traguardi a **3 livelli** (Bronzo, Argento, Oro), ognuno con un disegno kawaii a tema (popcorn, clessidra, Gemme, scudo di Cap, shawarma…; per i percorsi l'avatar del personaggio). Gruppi: Traguardi (titoli, ore, episodi), MCU (ogni Fase, le due Saghe, Avengers, pronto per la prossima uscita), Universi (esploratore, un badge per universo, Defenders), Percorsi dei personaggi, Modo di guardare (cronologico, scene dopo i titoli, voti, titoli di prima del 2000, serie finite, animazione) e Segreti («???» finché non li scopri). I badge di completamento hanno come soglie un terzo, due terzi e tutto. Calcoli in [src/badges.ts](src/badges.ts), disegni in [src/data/badgeArt.ts](src/data/badgeArt.ts) |
| **Amici** | Solo «amici» (niente seguiti/follower): nel **Profilo** cerchi una persona per **@tag**, le mandi una richiesta e lei la accetta o la rifiuta; puoi ritirare una richiesta o togliere un'amicizia. Cliccando un amico si apre la sua pagina (`#/u/<tag>`) con avatar, nome, frase, titoli visti, ore, badge, cosa sta guardando e i suoi voti. Prima di diventare amici si vedono solo avatar, nome e @tag. Logica in [src/friends.ts](src/friends.ts), pagine in [src/components/Friends.tsx](src/components/Friends.tsx) |
| **Statistiche** | Nel Profilo: completamento, ore viste, media voti e titolo col voto più alto su tutto il catalogo; dettaglio per universo, Fase, tipo e voti |
| **Account** | Accesso **obbligatorio** con email e password (Supabase). Chiunque può registrarsi; ognuno vede solo i propri dati. C'è «Password dimenticata?» con link via email |
| **Salvataggio** | Automatico **nell'account**: i dati ti seguono su telefono e PC. Una copia resta nel browser, così se manca la connessione non si perde niente (viene inviata appena torna). L'anello intorno all'avatar in alto mostra lo stato: grigio = salvato, oro = salvataggio, rosso = non salvato. Backup (nel Profilo) esportabile/importabile in `.json`, profilo compreso |
| **Lingue** | Italiano e inglese. La lingua resta **per dispositivo** (non va nell'account); la prima volta si usa quella del browser |

**Stile:** "Stark Industries": grafite scura, oro come accento, rosso solo per avvisi e spoiler. **Logo:** il reattore arc di Iron Man (anello d'oro, bobine di rame, nucleo azzurro che pulsa piano), disegnato in SVG in [src/components/ArcReactor.tsx](src/components/ArcReactor.tsx); lo stesso disegno, semplificato, è l'icona della scheda del browser. Funziona su telefono e su PC.

**Navigazione:** barra in alto con **Home | Catalogo | Preparazione**, ricerca (scorciatoia `/`; da telefono occupa una riga intera), lingua e **avatar** (menu con Profilo, stato del salvataggio ed Esci). La **scheda** di un titolo si apre solo cliccando un titolo o dalla ricerca, e ha il pulsante **← Indietro** (torna alla pagina da cui sei arrivato; se hai aperto la scheda da un link, va alla Home). Indirizzi: `#/` Home, `#/catalog` Catalogo, `#/prep` Preparazione, `#/profile` Profilo, `#/t/<id>` scheda, `#/u/<tag>` pagina di un amico.

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

I tuoi dati (visti, voti, episodi e profilo) sono salvati nel tuo account Supabase. Per avviare l'app in locale serve prima il collegamento a Supabase (vedi sotto); senza, l'app mostra una pagina che spiega cosa manca.

## Account e Supabase (da fare una volta)

L'app usa [Supabase](https://supabase.com) (piano gratuito) per gli account e per salvare i dati. I passaggi da fare a mano:

1. **Crea il progetto** su supabase.com → New project.
2. **Crea le tabelle**: SQL Editor → New query → incolla tutto [supabase/schema.sql](supabase/schema.sql) → Run. Crea la tabella `progress` (una riga per utente) con le regole che permettono a ognuno di leggere e scrivere **solo i propri dati**, la tabella `handles` per i **tag utente** (`@nome`, con nome e avatar accanto per la ricerca amici): il tag è unico, tutti gli utenti collegati possono leggere i tag ma ognuno modifica solo il proprio; la tabella `friendships` per le **amicizie** (richiesta → accettata) e la regola che permette agli **amici** di leggere i tuoi dati (solo lettura, solo se l'amicizia è accettata). Il file si può rieseguire senza problemi: se avevi già creato le tabelle, rieseguilo per aggiungere quelle nuove (ogni volta che il file cambia).
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
- il **profilo** sta nella stessa riga dei visti (campo `profile` dentro `data`), come il contatore `back` del badge «Ritorno al passato» (quante volte hai visto un titolo uscito prima dell'ultimo che avevi già visto);
- il **tag utente** invece sta nella tabella `handles` ([src/handle.ts](src/handle.ts)), perché solo il database può garantire che sia unico. Nella finestra «Modifica profilo» l'app controlla mentre scrivi se il tag è libero e lo salva col pulsante;
- uscendo dall'account (avatar in alto a destra → Esci) la copia nel browser viene cancellata, così su un PC condiviso non resta niente;
- i link nelle email (conferma, nuova password) vanno aperti **nello stesso browser** in cui li hai chiesti. Se apri il link di conferma altrove l'email risulta comunque confermata: basta accedere.
- se un link dell'email non funziona (scaduto, già usato o aperto in un altro browser) la pagina di accesso lo dice e spiega cosa fare, invece di tornare muta all'accesso;
- **password**: il controllo degli 8 caratteri lo fa l'app (con il contatore sotto il campo, es. «Almeno 8 caratteri · 5/8»), non il browser; se la nuova password è uguale alla vecchia compare un messaggio apposta;
- **«Manda il link»** dopo un invio resta bloccato 60 secondi con il conto alla rovescia: Supabase permette poche email (con il servizio email gratuito sono pochissime all'ora), e un secondo invio troppo vicino verrebbe rifiutato.

## Avatar, badge e porte degli universi

- **Avatar** ([src/data/avatars.ts](src/data/avatars.ts)): disegni SVG nostri. Testa larga con contorno nero spesso, colori piatti, manine appoggiate a una linea e un dettaglio del personaggio che spunta (scudo, Mjolnir, artigli, Guanto…). Un filtro SVG (`feTurbulence` + `feDisplacementMap`) fa tremare appena le linee, come un tratto a pennarello.
- **Badge** ([src/data/badgeArt.ts](src/data/badgeArt.ts)): icone nello stesso stile degli avatar (contorno nero, colori piatti, faccine) dentro una medaglia rotonda; l'anello è di bronzo, argento o oro secondo il livello, grigio se il badge non è ancora conquistato.
- **Porte della Home** ([src/data/universeArt.ts](src/data/universeArt.ts), usati anche dai badge degli universi): un colore per universo (rosso, blu, verde acqua, magenta, arancio, verde, viola) + simbolo in filigrana disegnato da noi, preso da un oggetto, un personaggio o il segno più noto dell'universo (la X degli X-Men, la scritta MARVEL per gli altri film).
- [docs/prompt-immagini.md](docs/prompt-immagini.md) e [scripts/ottimizza-immagini.py](scripts/ottimizza-immagini.py) servivano per le immagini generate: per ora l'app non le usa.

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
│   ├── homeState.ts        ← scelte del Catalogo (universo, ordine…) e costruzione dei gruppi dell'elenco
│   ├── badges.ts           ← regole e livelli dei badge
│   ├── handle.ts           ← tag utente @nome (tabella "handles" su Supabase)
│   ├── friends.ts          ← amici: ricerca per @tag, richieste, dati degli amici
│   ├── hooks.ts, utils.ts, toast.ts
│   ├── data/
│   │   ├── titles.ts       ← CATALOGO dei titoli (fonti in cima al file)
│   │   ├── avatars.ts      ← avatar del profilo (disegni SVG)
│   │   ├── badgeArt.ts     ← disegni dei badge
│   │   ├── universeArt.ts  ← colori e simboli degli universi (porte della Home, badge)
│   │   ├── collections.ts  ← liste Disney+ (pronte, per ora NON mostrate nell'app)
│   │   ├── disneyLinks.ts  ← indirizzi delle pagine ufficiali Disney+ Italia
│   │   ├── texts/          ← sinossi, riassunti e scene dopo i titoli (un file per blocco)
│   │   └── meta.ts         ← universi, percorsi, prossime uscite, Gemme
│   └── components/         ← TopBar, ArcReactor (logo), Home (bacheca), Catalog, Profile, Badges, Friends, Avatar, Detail, Prep, Auth (accesso e menu account), ConnectionMap, Gem…
├── scripts/ottimizza-immagini.py ← prepara le immagini generate
├── docs/prompt-immagini.md ← testi per generare le immagini
├── supabase/schema.sql     ← tabelle (progress, handles, friendships) e regole di sicurezza da eseguire su Supabase
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

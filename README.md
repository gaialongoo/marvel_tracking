# Marvel Tracker

Web app personale per seguire tutto l'universo Marvel: film e serie MCU, film Fox e Sony, serie live-action non MCU e animazione.

> **Stato attuale:** **Blocco 1 — MCU completo** inserito: 82 titoli (le 81 voci della timeline ufficiale marvel.com + Spider-Man: Brand New Day), con titoli italiani Disney+ e ordine cronologico ufficiale. Le serie Netflix sono nell'MCU perché la timeline ufficiale le include (gruppo "Marvel Television · Netflix", senza Fase). I campi non confermati da una fonte ufficiale (es. durate, episodi, post-credits) sono segnati nella scheda come **Da verificare**. X-Men e Spider-Man Sony sono ancora di esempio: arrivano con i prossimi blocchi.

## Funzionalità

| Area | Cosa fa |
| --- | --- |
| **Universi** | Come le collezioni di Disney+: Tutto, MCU, X-Men, Spider-Man (Sony)… Si combinano con qualsiasi ordine |
| **Ordini di visione** | Uscita, cronologico (dentro ogni universo), per Fase/Saga, per personaggio e percorsi tematici |
| **Voto** | Da 1 a 6 con le Gemme dell'Infinito; 6/6 = Guanto completo |
| **Tipi** | Film, Serie (TV), Animazione (ANI), Speciali (SPC, es. Licantropus), Corti One-Shot (ONE): la sigla compare nell'angolo della miniatura |
| **Episodi** | Per serie e animazione si spuntano i singoli episodi; nell'elenco un anello mostra la % vista, al 100% diventa la spunta |
| **Riassunti** | Sinossi ufficiale senza spoiler (con fonte) + riassunto completo con spoiler, nascosto finché non lo sblocchi |
| **Collegamenti** | Cosa vedere prima, cosa viene dopo, scene post-credits, mappa visiva con frecce |
| **Preparazione** | Prossime uscite con conto alla rovescia, lista minima/estesa con tempo mancante, ripasso veloce |
| **Statistiche** | Completamento, ore viste, media voti, preferito; dettaglio per universo, Fase, tipo e voti |
| **Salvataggio** | Automatico, **solo su questo PC** (nel browser). Niente account. Backup esportabile/importabile in `.json` |
| **Lingue** | Italiano e inglese |

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

I tuoi dati (visti, voti, episodi) restano nel browser con cui usi l'app. Se cancelli i dati di navigazione si perdono: usa **Esporta backup** in fondo alla Home.

## Struttura del progetto

```text
marvel_tracker/
├── src/
│   ├── main.tsx            ← punto di ingresso
│   ├── App.tsx             ← barra + pagina attiva
│   ├── styles.css          ← tutti gli stili
│   ├── types.ts            ← forma dei dati (Title, SavedData…)
│   ├── store.ts            ← dati personali salvati su questo PC + azioni
│   ├── router.ts           ← navigazione con #/…
│   ├── i18n.ts             ← testi IT/EN
│   ├── homeState.ts        ← scelte dell'elenco (universo, ordine…)
│   ├── hooks.ts, utils.ts, toast.ts
│   ├── data/
│   │   ├── titles.ts       ← CATALOGO dei titoli (fonti in cima al file)
│   │   └── meta.ts         ← universi, percorsi, prossime uscite, Gemme
│   └── components/         ← TopBar, Home, Detail, Prep, ConnectionMap, Gem…
├── prototype/design.html   ← prototipo HTML (riferimento del design)
├── index.html              ← pagina di ingresso
└── vite.config.ts          ← configurazione (base relativa per GitHub Pages)
```

## Prototipo

`prototype/design.html` è il prototipo da cui è nata l'app: si apre con doppio clic, senza installare niente. Resta come riferimento del design.

## Convenzioni

- Tutto il codice è **commentato** (in italiano).
- Questo README viene **aggiornato a ogni modifica** rilevante.

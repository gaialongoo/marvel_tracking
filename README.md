# Marvel Tracker

Web app personale per seguire tutto l'universo Marvel: film e serie MCU, film Sony e Fox, animazione e speciali.

> **Stato attuale:** fase di **design**. C'è solo un prototipo grafico da approvare; l'app React vera non è ancora stata scritta.

## Funzionalità previste

| Area | Cosa fa |
|---|---|
| **Universi** | Come le collezioni di Disney+: Tutto, MCU, X-Men, Spider-Man (Sony)… Si combinano con qualsiasi ordine |
| **Ordini di visione** | Uscita, cronologico (dentro ogni universo), per Fase/Saga, per personaggio e percorsi tematici |
| **Episodi** | Per serie e animazione si spuntano i singoli episodi; la serie è "vista" quando li hai visti tutti |
| **Backup** | Esporta/importa un file `.json` con visti, voti ed episodi (per non perderli o spostarli su un altro dispositivo) |
| **Voto** | Da 1 a 6 con le Gemme dell'Infinito; 6/6 = Guanto completo |
| **Riassunti** | Sinossi ufficiale senza spoiler (con fonte) + riassunto completo con spoiler, nascosto finché non lo sblocchi |
| **Collegamenti** | Cosa vedere prima, cosa viene dopo, scene post-credits, mappa visiva |
| **Preparazione ai nuovi film** | Calendario e conto alla rovescia, watchlist minima/estesa con tempo totale, ripasso veloce, avanzamento |
| **Statistiche** | Ore viste, percentuale completata, media voti, preferito per Fase |
| **Lingue** | Italiano e inglese |
| **Immagini** | Nessuna locandina: copertine generate dall'app + link alla pagina ufficiale |

**Stile:** "Stark Industries": grafite scura, oro come accento, rosso solo per avvisi e spoiler. Funziona su telefono e su PC.

**Navigazione:**
- Barra in alto con selettore **Home | Preparazione**, ricerca e lingua.
- **Home**: statistiche rapide, elenco a righe (con miniatura) e ordini di visione; statistiche dettagliate richiudibili in fondo.
- **Scheda del titolo**: pagina a sé, si apre **solo** cliccando un titolo o dalla ricerca; ha un pulsante **Home** per tornare.

**Mappa dei collegamenti** (nella scheda): tre colonne Prima → Questo titolo → Dopo, con frecce; linea continua = già visto, tratteggiata = da vedere. Su telefono diventa verticale.

**Gemme del voto** (forme ispirate ai film, senza nomi sotto: il nome appare passando sopra): Spazio = cubo (Tesseract), Mente = goccia, Realtà = forma fluida (Aether), Potere = sfera (Orb), Tempo = occhio (Occhio di Agamotto), Anima = ovale.

**Fonti:** date, ordini e sinossi solo da fonti ufficiali (marvel.com, Disney+, Marvel Studios). I riassunti completi sono scritti a parte e possono usare fonti secondarie.

**Salvataggio dati:** inizialmente nel browser; la sincronizzazione tra dispositivi verrà decisa più avanti.

## Come aprire il prototipo

Il prototipo è un file HTML unico e non richiede installazioni.

1. Apri la cartella `marvel_tracker/prototype` in Esplora file.
2. Fai doppio clic su `design.html`: si apre nel browser.
3. Per vederlo come su un telefono: premi `F12`, poi `Ctrl+Shift+M`.

Da VS Code: clic destro su `prototype/design.html` → **Reveal in File Explorer** → doppio clic.

Il prototipo è **funzionante**: puoi aprire ogni scheda, segnare i titoli come visti, spuntare gli episodi, votare con le Gemme, cercare (scorciatoia `/`), cambiare universo, ordine e lingua, esportare/importare un backup. I dati restano salvati in quel browser.

> Nel prototipo testi, date, durate, ordine cronologico e collegamenti sono **segnaposto**, non ancora verificati sulle fonti ufficiali. Ci sono 16 titoli di esempio (MCU, X-Men, Spider-Man Sony).

## Struttura del progetto

```
marvel_tracker/
├── prototype/
│   └── design.html     ← prototipo funzionante (HTML + CSS + JS in un file, commentato)
├── src/                ← app React (ancora il template iniziale di Vite)
├── public/             ← file statici
├── index.html          ← pagina di ingresso dell'app Vite
├── package.json        ← dipendenze e comandi
└── vite.config.ts      ← configurazione di Vite
```

## Sviluppo dell'app (in arrivo)

L'app è basata su **React 19 + TypeScript + Vite**. Serve [Node.js](https://nodejs.org/) (versione LTS). Per installarlo su Windows: `winget install OpenJS.NodeJS.LTS`, poi riavvia VS Code e verifica con `node -v`.

```bash
npm install     # installa le dipendenze
npm run dev     # avvia l'app in locale
npm run build   # crea la versione pronta da pubblicare
npm run lint    # controlla il codice
```

## Convenzioni

- Tutto il codice è **commentato** (in italiano).
- Questo README viene **aggiornato a ogni modifica** rilevante.

# Marvel Tracker

Web app personale per seguire tutto l'universo Marvel: film e serie MCU, film Sony e Fox, animazione e speciali.

> **Stato attuale:** fase di **design**. C'è solo un prototipo grafico da approvare; l'app React vera non è ancora stata scritta.

## Funzionalità previste

| Area | Cosa fa |
|---|---|
| **Ordini di visione** | Uscita, cronologico ufficiale, per Fase/Saga, per personaggio e percorsi tematici (Multiverso, X-Men, Spider-Man…) |
| **Voto** | Da 1 a 6 con le Gemme dell'Infinito; 6/6 = Guanto completo |
| **Riassunti** | Sinossi ufficiale senza spoiler (con fonte) + riassunto completo con spoiler, nascosto finché non lo sblocchi |
| **Collegamenti** | Cosa vedere prima, cosa viene dopo, scene post-credits, mappa visiva |
| **Preparazione ai nuovi film** | Calendario e conto alla rovescia, watchlist minima/estesa con tempo totale, ripasso veloce, avanzamento |
| **Statistiche** | Ore viste, percentuale completata, media voti, preferito per Fase |
| **Lingue** | Italiano e inglese |
| **Immagini** | Nessuna locandina: copertine generate dall'app + link alla pagina ufficiale |

**Stile:** interfaccia HUD tech ispirata a Iron Man. Funziona su telefono e su PC.

**Fonti:** date, ordini e sinossi solo da fonti ufficiali (marvel.com, Disney+, Marvel Studios). I riassunti completi sono scritti a parte e possono usare fonti secondarie.

**Salvataggio dati:** inizialmente nel browser; la sincronizzazione tra dispositivi verrà decisa più avanti.

## Come aprire il prototipo

Il prototipo è un file HTML unico e non richiede installazioni.

1. Apri la cartella `marvel_tracker/prototype` in Esplora file.
2. Fai doppio clic su `design.html`: si apre nel browser.
3. Per vederlo come su un telefono: premi `F12`, poi `Ctrl+Shift+M`.

Da VS Code: clic destro su `prototype/design.html` → **Reveal in File Explorer** → doppio clic.

> Nel prototipo testi, date e ordine cronologico sono **segnaposto**, non ancora verificati.

## Struttura del progetto

```
marvel_tracker/
├── prototype/
│   └── design.html     ← prototipo grafico (HTML + CSS + JS in un file, commentato)
├── src/                ← app React (ancora il template iniziale di Vite)
├── public/             ← file statici
├── index.html          ← pagina di ingresso dell'app Vite
├── package.json        ← dipendenze e comandi
└── vite.config.ts      ← configurazione di Vite
```

## Sviluppo dell'app (in arrivo)

L'app è basata su **React 19 + TypeScript + Vite**. Serve [Node.js](https://nodejs.org/) installato (non ancora presente su questo PC).

```bash
npm install     # installa le dipendenze
npm run dev     # avvia l'app in locale
npm run build   # crea la versione pronta da pubblicare
npm run lint    # controlla il codice
```

## Convenzioni

- Tutto il codice è **commentato** (in italiano).
- Questo README viene **aggiornato a ogni modifica** rilevante.

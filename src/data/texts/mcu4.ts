// Testi - blocco MCU 4: Fase 5 e Fase 6
// Scritti da Claude. syn = senza spoiler · full = con spoiler · pc = scene dopo i titoli
// Per i titoli 2025-2026 la trama viene da Wikipedia (en), letta il 18/11/2026.
// Dove la fonte non bastava per tutta la trama, "full" manca (resta "da scrivere")
// e le scene dopo i titoli non confermate sono null.
import type { TitleTexts } from "./types";

export const MCU4: Record<string, TitleTexts> = {
  // Fase 5
  quantumania: {
    syn: {
      it: "Scott Lang, Hope e la loro famiglia vengono risucchiati nel Regno Quantico, un mondo pieno di creature strane dove li aspetta Kang il Conquistatore.",
      en: "Scott Lang, Hope and their family are pulled into the Quantum Realm, a world full of strange creatures where Kang the Conqueror awaits them.",
    },
    full: {
      it: "Cassie, la figlia di Scott, ha costruito un dispositivo per mandare segnali nel Regno Quantico; Janet lo spegne terrorizzata, ma tutti vengono risucchiati dentro. Janet rivela di aver conosciuto lì Kang, un viaggiatore esiliato dai suoi stessi alter ego, e di avergli distrutto il motore della nave per impedirgli di fuggire. Kang cattura Scott e lo costringe a rubare il nucleo energetico; M.O.D.O.K., che si scopre essere Darren Cross, lo affianca. Cassie guida la rivolta dei popoli del Regno Quantico, Hank arriva con un esercito di formiche super evolute e M.O.D.O.K. si ribella a Kang morendo. Scott e Hope spingono Kang nel nucleo del motore, che esplode. Tornati a casa, Scott si gode la vita ma si chiede se Kang sia davvero sconfitto.",
      en: "Scott's daughter Cassie has built a device to send signals into the Quantum Realm; a terrified Janet shuts it off, but they are all pulled inside. Janet reveals she met Kang there, a traveler exiled by his own variants, and destroyed his ship's engine to stop him from escaping. Kang captures Scott and forces him to steal the power core; M.O.D.O.K., who turns out to be Darren Cross, works with him. Cassie leads the uprising of the Quantum Realm's peoples, Hank arrives with an army of hyper-evolved ants and M.O.D.O.K. turns on Kang and dies. Scott and Hope push Kang into the engine core, which explodes. Back home, Scott enjoys life but wonders whether Kang is really defeated.",
    },
    pc: [
      {
        it: "Tre varianti di Kang radunano migliaia di altre varianti nel Consiglio dei Kang: il loro esiliato è stato sconfitto e gli Avengers iniziano a intromettersi nel multiverso.",
        en: "Three Kang variants gather thousands of others in the Council of Kangs: their exile has been defeated and the Avengers are starting to meddle in the multiverse.",
      },
      {
        it: "In un'altra epoca Loki e Mobius assistono a uno spettacolo dell'inventore Victor Timely, un'altra variante di Kang. Anteprima di Loki stagione 2.",
        en: "In another era Loki and Mobius watch a show by inventor Victor Timely, another Kang variant. A teaser for Loki season 2.",
      },
    ],
  },

  gotg3: {
    syn: {
      it: "I Guardiani vivono su Ovunque, ma quando Rocket viene ferito gravemente, la squadra deve scoprire il suo passato per salvargli la vita.",
      en: "The Guardians live on Knowhere, but when Rocket is gravely wounded, the team must uncover his past to save his life.",
    },
    full: {
      it: "Adam Warlock attacca Ovunque per catturare Rocket e lo ferisce; nel corpo di Rocket c'è un blocco che lo uccide se si prova a curarlo. Il suo creatore è l'Alto Evoluzionario, uno scienziato che vuole creare una società perfetta e considera Rocket un esperimento prezioso. I Guardiani, aiutati da Gamora (quella del 2014, ora con i Ravagers), si infiltrano nella sede della Orgocorp e raggiungono la Contro-Terra. In flashback si scopre l'infanzia di Rocket con i suoi amici animali Lylla, Teefs e Floor, uccisi dall'Alto Evoluzionario. Nebula salva Rocket, Peter lo riporta in vita mentre sta morendo, e la squadra libera i bambini e gli animali prigionieri sull'astronave dell'Alto Evoluzionario, che viene sconfitto. Adam salva Peter nello spazio. La squadra si scioglie: Peter torna sulla Terra dal nonno, Mantis parte da sola, Gamora torna dai Ravagers, Nebula e Drax restano su Ovunque e Rocket guida i nuovi Guardiani.",
      en: "Adam Warlock attacks Knowhere to capture Rocket and wounds him; Rocket's body holds a kill switch that triggers if anyone tries to heal him. His creator is the High Evolutionary, a scientist who wants to build a perfect society and sees Rocket as a valuable experiment. The Guardians, helped by Gamora (the 2014 one, now with the Ravagers), infiltrate Orgocorp's headquarters and reach Counter-Earth. Flashbacks reveal Rocket's childhood with his animal friends Lylla, Teefs and Floor, killed by the High Evolutionary. Nebula saves Rocket, Peter revives him as he is dying, and the team frees the children and animals held on the High Evolutionary's ship, and he is defeated. Adam saves Peter in space. The team breaks up: Peter returns to Earth to his grandfather, Mantis leaves on her own, Gamora returns to the Ravagers, Nebula and Drax stay on Knowhere and Rocket leads the new Guardians.",
    },
    pc: [
      {
        it: "I nuovi Guardiani guidati da Rocket (con Groot, Kraglin, Cosmo, Adam e Phyla) difendono un pianeta.",
        en: "The new Guardians led by Rocket (with Groot, Kraglin, Cosmo, Adam and Phyla) defend a planet.",
      },
      {
        it: "Peter fa colazione con il nonno sulla Terra. Una scritta annuncia: «Il leggendario Star-Lord tornerà».",
        en: "Peter has breakfast with his grandfather on Earth. A caption reads: \"The Legendary Star-Lord will return.\"",
      },
    ],
  },

  si: {
    syn: {
      it: "Nick Fury torna sulla Terra e scopre che un gruppo di Skrull ribelli si è infiltrato ai vertici del potere per conquistare il pianeta.",
      en: "Nick Fury returns to Earth and discovers that a group of rebel Skrulls has infiltrated the highest levels of power to take over the planet.",
    },
    full: {
      it: "Gli Skrull rifugiati sulla Terra si sentono traditi da Fury, che aveva promesso loro una nuova casa. Il ribelle Gravik guida un esercito Skrull che ha preso il posto di persone importanti e vuole scatenare una guerra tra Stati Uniti e Russia. Maria Hill viene uccisa da Gravik e Talos muore poco dopo. Si scopre che anche Rhodey è da tempo sostituito da una Skrull, Raava. Gravik ottiene con il Raccolto, il DNA degli eroi raccolto dopo la battaglia di Endgame, poteri di molti supereroi; anche G'iah, figlia di Talos, li ottiene. G'iah si presenta a Gravik travestita da Fury, lo inganna e lo uccide. Il presidente Ritson, influenzato dagli eventi, dichiara guerra agli Skrull e agli alieni. Fury va nello spazio con la moglie Skrull Varra, mentre G'iah e Sonya Falsworth lavorano insieme.",
      en: "Skrull refugees on Earth feel betrayed by Fury, who had promised them a new home. Rebel Gravik leads a Skrull army that has replaced important people and wants to start a war between the United States and Russia. Maria Hill is killed by Gravik and Talos dies soon after. It turns out Rhodey too has long been replaced by a Skrull, Raava. Using the Harvest, the heroes' DNA collected after the battle in Endgame, Gravik gains the powers of many superheroes; Talos's daughter G'iah gets them too. G'iah meets Gravik disguised as Fury, tricks him and kills him. President Ritson, shaken by events, declares war on Skrulls and aliens. Fury goes to space with his Skrull wife Varra, while G'iah and Sonya Falsworth work together.",
    },
  },

  groot2: {
    syn: {
      it: "Nuovi corti animati con il piccolo Groot, alle prese con pianeti misteriosi, creature curiose e qualche disastro.",
      en: "New animated shorts with baby Groot, dealing with mysterious planets, curious creatures and a few disasters.",
    },
    full: {
      it: "Cinque corti senza dialoghi. Groot esplora strani pianeti, combatte con un alieno per una pianta, festeggia un compleanno, cerca di sfuggire a un mostro e incontra creature che lo trattano come un dio. Ogni episodio è una gag a sé.",
      en: "Five dialogue-free shorts. Groot explores strange planets, fights an alien over a plant, celebrates a birthday, tries to escape a monster and meets creatures who treat him like a god. Each episode is a standalone gag.",
    },
    pc: [
      {
        it: "Episodio 3 · Groot rovescia una tazza di cioccolata calda e Rocket urla.",
        en: "Episode 3 · Groot knocks over a mug of hot chocolate and Rocket shouts.",
      },
    ],
  },

  loki2: {
    syn: {
      it: "Loki scivola senza controllo tra passato e futuro, mentre la TVA è nel caos dopo la morte di Colui che Rimane e il multiverso continua a ramificarsi.",
      en: "Loki slips uncontrollably between past and future, while the TVA is in chaos after the death of He Who Remains and the multiverse keeps branching out.",
    },
    full: {
      it: "Loki «scivola» nel tempo; Mobius e il tecnico Ouroboros (O.B.) lo stabilizzano. Il Telaio Temporale, la macchina che tiene in piedi la linea temporale, rischia di essere distrutto dai rami in eccesso. Loki e Mobius trovano Victor Timely, variante giovane di Colui che Rimane, e lo portano alla TVA per riparare il Telaio. Ravonna Renslayer e Miss Minutes tradiscono la TVA. Il Telaio esplode e Timely muore. Loki impara a viaggiare nel tempo volontariamente e rivive più volte gli eventi, senza trovare una soluzione. Alla fine capisce che il suo destino è un sacrificio: va alla fine del tempo, distrugge il Telaio e tiene insieme con le sue mani tutte le linee temporali, che diventano i rami di un albero intorno al suo trono. Sylvie e Mobius tornano alla loro vita, mentre la TVA veglia sulle varianti di Kang.",
      en: "Loki is \"time-slipping\"; Mobius and technician Ouroboros (O.B.) stabilize him. The Temporal Loom, the machine holding the timeline together, risks being destroyed by too many branches. Loki and Mobius find Victor Timely, a young variant of He Who Remains, and bring him to the TVA to repair the Loom. Ravonna Renslayer and Miss Minutes betray the TVA. The Loom explodes and Timely dies. Loki learns to time-travel at will and relives events several times without finding a solution. In the end he realizes his destiny is a sacrifice: he goes to the end of time, destroys the Loom and holds all the timelines together with his own hands; they become the branches of a tree around his throne. Sylvie and Mobius return to their lives, while the TVA keeps watch over Kang's variants.",
    },
    pc: [
      {
        it: "Episodio 1 · Sylvie esce da un portale temporale nell'Oklahoma del 1982 ed entra in un McDonald's.",
        en: "Episode 1 · Sylvie steps out of a time portal in 1982 Oklahoma and walks into a McDonald's.",
      },
    ],
  },

  marvels: {
    syn: {
      it: "Carol Danvers, Monica Rambeau e Kamala Khan si ritrovano con i poteri legati: ogni volta che li usano si scambiano di posto. Devono imparare a combattere insieme.",
      en: "Carol Danvers, Monica Rambeau and Kamala Khan find their powers linked: each time they use them, they swap places. They must learn to fight together.",
    },
    full: {
      it: "Dar-Benn, leader dei Kree, trova uno dei due braccialetti quantici (l'altro è di Kamala) e apre un varco nello spazio, che collega i poteri delle tre eroine. Dar-Benn vuole salvare il suo pianeta morente, Hala, risucchiando risorse da altri mondi, per vendicarsi di Carol, che anni prima aveva distrutto la Suprema Intelligenza causando una guerra civile. Le tre, chiamate «The Marvels» da Kamala, salvano gli Skrull e il pianeta Aladna. Dar-Benn trova il secondo braccialetto e apre un varco enorme verso un altro universo, ma muore per il potere. Monica si sacrifica per richiudere il varco, mentre Carol riaccende il sole di Hala. Monica si risveglia in un altro universo, dove la madre Maria è viva e si chiama Binary. Kamala va a reclutare Kate Bishop per una nuova squadra di giovani eroi.",
      en: "Kree leader Dar-Benn finds one of two quantum bands (Kamala has the other) and tears a rift in space that links the three heroes' powers. Dar-Benn wants to save her dying planet Hala by draining resources from other worlds, and to take revenge on Carol, who years earlier destroyed the Supreme Intelligence and caused a civil war. The three, called \"The Marvels\" by Kamala, save the Skrulls and the planet Aladna. Dar-Benn finds the second band and opens a huge rift into another universe, but dies from the power. Monica sacrifices herself to close the rift, while Carol reignites Hala's sun. Monica wakes up in another universe, where her mother Maria is alive and called Binary. Kamala goes to recruit Kate Bishop for a new team of young heroes.",
    },
    pc: [{
      it: "Nell'altro universo, Monica viene curata dalla «sua» madre, Binary, e da Hank McCoy, la Bestia degli X-Men.",
      en: "In the other universe, Monica is cared for by \"her\" mother, Binary, and by Hank McCoy, the X-Men's Beast.",
    }],
  },

  whatif2: {
    syn: {
      it: "L'Osservatore mostra nuove realtà alternative dell'MCU, con versioni inattese di eroi conosciuti e alcuni eroi nuovi.",
      en: "The Watcher shows new alternate realities of the MCU, with unexpected versions of familiar heroes and some new ones.",
    },
    full: {
      it: "Tra gli episodi: Nebula diventa un'agente di polizia di Nova Prime; Happy Hogan affronta Justin Hammer alla festa di Natale dei Vendicatori; Peter Quill diventa un gigante cresciuto da Ego; Hela, senza poteri, finisce a Kamar-Taj; Kahhori, giovane Mohawk, ottiene poteri dal Tesseract caduto in America nel '600; Captain Carter affronta una versione di sé. Nel finale Strange Supremo sta rapendo persone di universi diversi; l'Osservatore manda Captain Carter e Kahhori a fermarla. Con l'aiuto degli eroi rapiti, Strange viene sconfitta e il multiverso torna stabile.",
      en: "Among the episodes: Nebula becomes a police officer on Nova Prime; Happy Hogan faces Justin Hammer at the Avengers' Christmas party; Peter Quill becomes a giant raised by Ego; Hela, without her powers, ends up at Kamar-Taj; Kahhori, a young Mohawk woman, gets powers from the Tesseract that fell in 17th-century America; Captain Carter faces a version of herself. In the finale Strange Supreme is abducting people from different universes; the Watcher sends Captain Carter and Kahhori to stop her. With help from the abducted heroes, Strange is defeated and the multiverse is stable again.",
    },
    pc: [
      {
        it: "Episodio 4 · Il Gran Maestro, ridotto a una pozzanghera, chiede a Topaz di raccoglierlo.",
        en: "Episode 4 · The Grandmaster, reduced to a puddle, asks Topaz to scoop him up.",
      },
    ],
  },

  echo: {
    syn: {
      it: "Maya Lopez, ricercata dopo aver sparato a Wilson Fisk, torna nella sua città d'origine in Oklahoma, dove deve fare i conti con la famiglia e le sue radici Choctaw.",
      en: "Maya Lopez, wanted after shooting Wilson Fisk, returns to her hometown in Oklahoma, where she must face her family and her Choctaw roots.",
    },
    full: {
      it: "Dopo Hawkeye, Maya torna a Tamaha e cerca di distruggere l'organizzazione di Fisk nella zona, scatenando la sua ira. In flashback si scopre la storia delle antenate Choctaw che hanno trasmesso un potere alla famiglia di Maya, compresa la prima, Chafa. Fisk arriva in città per riprendersi Maya, che considera una figlia. Durante un festival, Maya attinge al potere delle antenate e, insieme alla nonna e alla madre, entra nella mente di Fisk e gli fa rivivere i suoi traumi d'infanzia, spingendolo ad andarsene. Fisk, rientrato a New York, vede un notiziario che lo spinge a candidarsi sindaco.",
      en: "After Hawkeye, Maya returns to Tamaha and tries to destroy Fisk's organization in the area, unleashing his anger. Flashbacks reveal the story of the Choctaw ancestors who passed a power down to Maya's family, starting with the first, Chafa. Fisk comes to town to take back Maya, whom he sees as a daughter. During a festival, Maya draws on her ancestors' power and, with her grandmother and mother, enters Fisk's mind and makes him relive his childhood traumas, driving him away. Back in New York, Fisk sees a news report that pushes him to run for mayor.",
    },
    pc: [
      {
        it: "Episodio 5 · Wilson Fisk convoca i boss del crimine e vede al telegiornale la corsa a sindaco di New York, che lo spinge a candidarsi.",
        en: "Episode 5 · Wilson Fisk calls a meeting of crime bosses and watches a news report on the New York mayoral race, which pushes him to run.",
      },
    ],
  },

  dpw: {
    syn: {
      it: "La TVA vuole cancellare l'universo di Deadpool. Per salvare i suoi cari, Wade Wilson recluta una variante molto riluttante di Wolverine.",
      en: "The TVA wants to erase Deadpool's universe. To save his loved ones, Wade Wilson recruits a very reluctant Wolverine variant.",
    },
    full: {
      it: "Wade, che ha lasciato la vita da Deadpool, viene portato alla TVA da Mr. Paradox: il suo universo sta morendo perché ha perso il suo «essere àncora», Logan, morto dopo Logan. Paradox vuole accelerarne la fine con una macchina. Wade cerca un altro Wolverine nel multiverso e trova il «peggiore», un Logan alcolizzato che ha abbandonato i suoi X-Men. Paradox li spedisce nel Vuoto, dove regna Cassandra Nova, la gemella di Charles Xavier. Lì incontrano una resistenza di eroi dimenticati: Elektra, Blade, X-23 e Gambit. Cassandra va alla TVA per usare la macchina e distruggere tutti gli universi. Deadpool e Wolverine bloccano la macchina con i loro corpi, che guariscono all'infinito; Cassandra muore e Paradox viene arrestato. La TVA aiuta Wade, e Logan resta nel suo universo come nuova àncora.",
      en: "Wade, who has left the Deadpool life behind, is taken to the TVA by Mr. Paradox: his universe is dying because it has lost its \"anchor being\", Logan, who died in Logan. Paradox wants to speed up its end with a machine. Wade searches the multiverse for another Wolverine and finds the \"worst\" one, an alcoholic Logan who abandoned his X-Men. Paradox sends them to the Void, ruled by Cassandra Nova, Charles Xavier's twin. There they meet a resistance of forgotten heroes: Elektra, Blade, X-23 and Gambit. Cassandra goes to the TVA to use the machine to destroy every universe. Deadpool and Wolverine block the machine with their bodies, which heal endlessly; Cassandra dies and Paradox is arrested. The TVA helps Wade, and Logan stays in his universe as the new anchor.",
    },
    pc: [{
        it: "Nel Vuoto, Johnny Storm insulta Cassandra Nova con un monologo pieno di parolacce.",
        en: "In the Void, Johnny Storm insults Cassandra Nova in an expletive-filled monologue.",
      }],
  },

  agatha: {
    syn: {
      it: "Libera dall'incantesimo di Wanda, Agatha Harkness ha perso i suoi poteri. Con un adolescente misterioso e un gruppo di streghe percorre la leggendaria Strada delle Streghe.",
      en: "Freed from Wanda's spell, Agatha Harkness has lost her powers. With a mysterious teenager and a coven of witches, she walks the legendary Witches' Road.",
    },
    full: {
      it: "Il ragazzo chiamato Teen libera Agatha dall'incantesimo e vuole percorrere la Strada delle Streghe, un percorso di prove che promette a chi arriva in fondo ciò che desidera. Agatha forma una congrega con Lilia, Jennifer, Alice e Sharon, mentre la Strega Verde Rio Vidal li insegue. Lungo la strada Alice e Sharon muoiono. Si scopre che Teen è Billy Maximoff, figlio di Wanda, la cui anima si è reincarnata nel corpo di un ragazzo morto; vuole ritrovare il fratello Tommy. Rio è la Morte in persona, ex amante di Agatha. Alla fine Agatha si lascia prendere dalla Morte al posto di Billy, ma torna come fantasma, legato a lui, mentre Billy parte alla ricerca di Tommy. Si scopre anche che la Strada non esisteva: l'aveva creata Billy con i suoi poteri.",
      en: "The boy called Teen breaks Agatha out of the spell and wants to walk the Witches' Road, a series of trials that promises those who reach the end whatever they desire. Agatha forms a coven with Lilia, Jennifer, Alice and Sharon, while the Green Witch Rio Vidal hunts them. Along the road Alice and Sharon die. It turns out Teen is Billy Maximoff, Wanda's son, whose soul was reborn in the body of a dead boy; he wants to find his brother Tommy. Rio is Death herself, Agatha's former lover. In the end Agatha lets Death take her instead of Billy, but returns as a ghost bound to him, while Billy sets out to find Tommy. It is also revealed that the Road never existed: Billy created it with his powers.",
    },
  },

  whatif3: {
    syn: {
      it: "Ultima stagione dell'antologia: l'Osservatore mostra nuovi mondi alternativi e alla fine deve affrontare le conseguenze di essere intervenuto nel multiverso.",
      en: "The anthology's final season: the Watcher shows new alternate worlds and in the end must face the consequences of having intervened in the multiverse.",
    },
    full: {
      it: "Tra gli episodi: un esperimento di Banner crea un mostro gamma, e Banner diventa un «Mega-Hulk» che lo uccide e governa i mostri sopravvissuti; Agatha Harkness ruba il potere del Celestiale Tiamut, poi vi rinuncia; il Guardiano Rosso salva gli Stark e Bucky elimina Obadiah Stane; Riri Williams sconfigge la Federazione di Iron Man di Quentin Beck; Shang-Chi e Kate Bishop affrontano Hood, che si rivela una Xialing corrotta. Negli ultimi episodi Captain Carter cerca di salvare l'Osservatore, catturato dagli altri Osservatori guidati dall'Eminenza; anche Ultron dell'Infinito si pente e la aiuta. Nel finale Ultron si sacrifica e Carter dà la vita per mandare tutti nell'universo di Strange Supremo, che toglie i poteri agli Osservatori nemici. L'Osservatore invita Kahhori, Byrdie e Tempesta a vegliare con lui sul multiverso.",
      en: "Among the episodes: a Banner experiment creates a gamma monster, and Banner becomes a \"Mega-Hulk\" who kills it and rules the surviving monsters; Agatha Harkness steals the Celestial Tiamut's power, then gives it up; Red Guardian saves the Starks and Bucky takes out Obadiah Stane; Riri Williams defeats Quentin Beck's Iron Federation; Shang-Chi and Kate Bishop face the Hood, who turns out to be a corrupted Xialing. In the last episodes Captain Carter tries to rescue the Watcher, captured by the other Watchers led by the Eminence; Infinity Ultron also repents and helps her. In the finale Ultron sacrifices himself and Carter gives her life to send everyone to Strange Supreme's universe, where Strange strips the enemy Watchers of their powers. The Watcher invites Kahhori, Byrdie and Storm to watch over the multiverse with him.",
    },
  },

  ddba1: {
    syn: {
      it: "Anni dopo, Matt Murdock ha appeso il costume e fa l'avvocato. Wilson Fisk è diventato sindaco di New York: i loro destini tornano a incrociarsi.",
      en: "Years later, Matt Murdock has hung up the suit and works as a lawyer. Wilson Fisk has become mayor of New York: their paths cross again.",
    },
    full: {
      it: "Nel primo episodio Bullseye uccide Foggy Nelson; Matt lo getta da un palazzo e smette di essere Daredevil. Un anno dopo Fisk, eletto sindaco, sostiene di voler cambiare e chiede a Matt una tregua. Matt difende in tribunale Hector Ayala (la Tigre Bianca), poi ucciso. Un serial killer chiamato Muse terrorizza la città: Daredevil torna in azione e lo affronta. Vanessa, moglie di Fisk, aveva assoldato Bullseye per uccidere Foggy. Fisk crea una task force anti-vigilanti con poliziotti corrotti. Bullseye evade e cerca di uccidere Fisk, ma Matt lo ferma. Nel finale Fisk dichiara la legge marziale a New York; Matt riunisce Karen e altri alleati per formare una resistenza.",
      en: "In the first episode Bullseye kills Foggy Nelson; Matt throws him off a building and stops being Daredevil. A year later Fisk, elected mayor, claims to have changed and asks Matt for a truce. Matt defends Hector Ayala (White Tiger) in court, who is later killed. A serial killer called Muse terrorizes the city: Daredevil returns and confronts him. Fisk's wife Vanessa had hired Bullseye to kill Foggy. Fisk creates an anti-vigilante task force with corrupt cops. Bullseye escapes and tries to kill Fisk, but Matt stops him. In the finale Fisk declares martial law in New York; Matt brings together Karen and other allies to form a resistance.",
    },
    pc: [
      {
        it: "Episodio 9 · Frank Castle inganna una guardia con una stretta di mano, le rompe il braccio ed evade dalla prigione segreta di Fisk.",
        en: "Episode 9 · Frank Castle tricks a guard into a handshake, breaks his arm and escapes from Fisk's secret prison.",
      },
    ],
  },

  bnw: {
    syn: {
      it: "Sam Wilson, ora Capitan America, si ritrova al centro di un incidente internazionale dopo un attentato alla Casa Bianca e deve scoprire chi tira i fili.",
      en: "Sam Wilson, now Captain America, finds himself at the center of an international incident after an attack at the White House and must find out who is pulling the strings.",
    },
    full: {
      it: "Thaddeus Ross, da cinque mesi presidente degli Stati Uniti, manda Sam e il nuovo Falcon, Joaquin Torres, in Messico a fermare Sidewinder e il gruppo dei Serpenti. Alla Casa Bianca Ross presenta un trattato sull'adamantio trovato sull'Isola Celestiale; durante il vertice la canzone «Mr. Blue» attiva alcuni uomini, tra cui Isaiah Bradley, che sparano al presidente. Sam indaga e scopre che dietro c'è il dottor Samuel Sterns, imprigionato da Ross, che lo ha avvelenato per anni con pillole per il cuore piene di raggi gamma. Smascherato, Ross si trasforma in Hulk Rosso e devasta la Casa Bianca; Sam lo calma ricordandogli la figlia Betty. Bradley viene scagionato, Torres viene invitato nei Vendicatori, il trattato è ratificato e Ross si dimette e finisce nella prigione del Raft.",
      en: "Thaddeus Ross, US president for five months, sends Sam and the new Falcon, Joaquin Torres, to Mexico to stop Sidewinder and the Serpent group. At the White House Ross presents a treaty on the adamantium found on Celestial Island; during the summit the song \"Mr. Blue\" triggers several men, including Isaiah Bradley, to shoot at the president. Sam investigates and discovers the man behind it is Dr. Samuel Sterns, imprisoned by Ross, who has poisoned him for years with heart pills laced with gamma radiation. Exposed, Ross turns into the Red Hulk and wrecks the White House; Sam calms him by reminding him of his daughter Betty. Bradley is cleared, Torres is invited to join the Avengers, the treaty is ratified and Ross resigns and ends up in the Raft.",
    },
    pc: [{
      it: "Sam visita Sterns nel Raft; Sterns lo avverte che sta per arrivare una minaccia da altri mondi.",
      en: "Sam visits Sterns in the Raft; Sterns warns him that a threat from other worlds is coming.",
    }],
  },

  thunderbolts: {
    syn: {
      it: "Un gruppo di antieroi, ciascuno con un passato pesante, cade nella trappola della stessa persona. Per sopravvivere devono collaborare, per quanto controvoglia.",
      en: "A group of antiheroes, each with a heavy past, falls into the same person's trap. To survive they must work together, however reluctantly.",
    },
    full: {
      it: "Valentina Allegra de Fontaine, direttrice della CIA, sta cancellando le prove del Progetto Sentry e manda Yelena Belova, John Walker, Ghost (Ava Starr) e Taskmaster (Antonia Dreykov) in una trappola perché si uccidano a vicenda. Ava uccide Antonia, e da una capsula esce un uomo senza memoria, Bob. I sopravvissuti fuggono con lui. Alexei Shostakov, il Guardiano Rosso, li salva e Walker li battezza «Thunderbolts». Bucky Barnes, ora deputato, si unisce a loro. Bob, diventato Sentry, si rivolta contro Valentina; il suo lato oscuro, il Vuoto, avvolge New York nell'ombra e intrappola le persone nei loro ricordi peggiori. Yelena entra nell'oscurità e raggiunge i ricordi di Bob; il gruppo lo abbraccia e lui riprende il controllo. Valentina presenta la squadra al mondo come i nuovi Vendicatori, prendendosene il merito, ma Yelena le dice che ora sono loro ad avere potere su di lei.",
      en: "CIA director Valentina Allegra de Fontaine is erasing evidence of Project Sentry and sends Yelena Belova, John Walker, Ghost (Ava Starr) and Taskmaster (Antonia Dreykov) into a trap to kill one another. Ava kills Antonia, and a man with no memory, Bob, emerges from a pod. The survivors escape with him. Alexei Shostakov, the Red Guardian, rescues them and Walker names them the \"Thunderbolts\". Bucky Barnes, now a congressman, joins them. Bob, now Sentry, turns on Valentina; his dark side, the Void, engulfs New York in shadow and traps people in their worst memories. Yelena enters the darkness and reaches Bob's memories; the group embraces him and he regains control. Valentina presents the team to the world as the New Avengers, taking the credit, but Yelena tells her they now have power over her.",
    },
    // Prima scena confermata il 23/11/2026 (en.wikipedia, voce sulle scene dopo i titoli del MCU)
    pc: [
      {
        it: "Alexei Shostakov prova, senza successo, a convincere un cliente a comprare una scatola di Wheaties con i Nuovi Vendicatori in copertina.",
        en: "Alexei Shostakov tries, and fails, to get a shopper to buy a Wheaties box with the New Avengers on the cover.",
      },
      {
        it: "Quattordici mesi dopo, i Nuovi Vendicatori discutono della causa che Sam Wilson ha fatto loro per il nome, quando rilevano un'astronave da un'altra dimensione con il simbolo «4».",
        en: "Fourteen months later, the New Avengers are discussing Sam Wilson's lawsuit over the name, when they detect a spacecraft from another dimension bearing a \"4\" emblem.",
      },
    ],
  },

  ironheart: {
    syn: {
      it: "Riri Williams, geniale studentessa del MIT, torna a Chicago e, per finanziare la sua armatura, finisce in una banda criminale guidata da un uomo con poteri magici.",
      en: "Riri Williams, a brilliant MIT student, returns to Chicago and, to fund her armor, ends up in a criminal crew led by a man with magical powers.",
    },
    full: {
      it: "Espulsa dal MIT, Riri torna a Chicago, segnata dalla morte della migliore amica Natalie e del patrigno in una sparatoria. Si unisce alla banda di Parker Robbins, detto Hood, per finanziare la sua armatura, e ricrea Natalie come intelligenza artificiale della tuta, N.A.T.A.L.I.E. Durante un colpo Parker uccide un dirigente; il suo mantello, dono del demone Mefisto, lo corrompe. Riri lo inganna con un ologramma e gli strappa il mantello. La strega Zelma Stanton alimenta con la magia la nuova armatura di Riri, ma N.A.T.A.L.I.E. viene cancellata. Nel finale Mefisto offre a Riri di riportare in vita Natalie se lei accetterà un patto; Riri accetta, Natalie torna, ma il segno di Mefisto si estende sul braccio di Riri.",
      en: "Expelled from MIT, Riri returns to Chicago, scarred by the deaths of her best friend Natalie and her stepfather in a shooting. She joins the crew of Parker Robbins, known as the Hood, to fund her armor, and recreates Natalie as the suit's AI, N.A.T.A.L.I.E. During a heist Parker kills an executive; his cloak, a gift from the demon Mephisto, corrupts him. Riri tricks him with a hologram and rips the cloak away. The witch Zelma Stanton powers Riri's new armor with magic, but N.A.T.A.L.I.E. is deleted. In the finale Mephisto offers to bring Natalie back to life if Riri agrees to a deal; Riri accepts, Natalie returns, but Mephisto's mark spreads across Riri's arm.",
    },
    pc: [
      {
        it: "Episodio 6 · Parker Robbins, rimasto senza mantello e senza poteri, chiede aiuto a Zelma Stanton per la magia.",
        en: "Episode 6 · Parker Robbins, left without his cloak and powers, asks Zelma Stanton for help with magic.",
      },
    ],
  },

  // Fase 6
  eow: {
    syn: {
      it: "Gli Hatut Zaraze, guerrieri segreti del Wakanda, viaggiano nel mondo in epoche diverse per recuperare manufatti di vibranio prima che finiscano nelle mani sbagliate.",
      en: "The Hatut Zaraze, Wakanda's secret warriors, travel the world in different eras to recover vibranium artifacts before they fall into the wrong hands.",
    },
    full: {
      it: "Quattro episodi in quattro epoche. Nel 1260 a.C. Noni, ex Dora Milaje caduta in disgrazia, si fa catturare dal ribelle Nkati, il Leone, lo sconfigge in duello e poi entra negli Hatut Zaraze. Nel 1200 a.C., durante la guerra di Troia, l'agente B'Kai, sotto il nome di Memnone, aiuta i Greci con il cavallo e colpisce Achille al tallone. Nel 1400 d.C. Basha recupera un pezzo di vibranio in K'un-Lun e lo lascia all'Iron Fist Jorani. Nel 1896 Tafari e Kuda prendono un'ascia di vibranio ad Adua e incontrano l'ultima Pantera Nera, una regina wakandiana da un futuro lontano, che li avverte: l'isolamento del Wakanda lo lascerà indifeso contro l'Orda. Anni dopo, Killmonger si prepara a rubare l'ascia da un museo di Londra.",
      en: "Four episodes in four eras. In 1260 BC Noni, a disgraced former Dora Milaje, lets herself be captured by the rebel Nkati, the Lion, defeats him in a duel and then joins the Hatut Zaraze. In 1200 BC, during the Trojan War, agent B'Kai, posing as Memnon, helps the Greeks with the horse and strikes Achilles in the heel. In 1400 AD Basha recovers a piece of vibranium in K'un-Lun and leaves it to the Iron Fist Jorani. In 1896 Tafari and Kuda take a vibranium axe at Adwa and meet the last Black Panther, a Wakandan queen from the far future, who warns them: Wakanda's isolation will leave it defenseless against the Horde. Years later, Killmonger prepares to steal the axe from a London museum.",
    },
  },

  zombies: {
    syn: {
      it: "In una realtà alternativa devastata da un'epidemia di zombi, un gruppo di giovani eroi sopravvissuti cerca di raggiungere un segnale che potrebbe salvare il mondo.",
      en: "In an alternate reality ravaged by a zombie plague, a group of young surviving heroes tries to reach a signal that could save the world.",
    },
    full: {
      it: "Cinque anni dopo l'epidemia, Kamala Khan, Kate Bishop, Riri Williams e F.R.I.D.A.Y. cercano un trasmettitore all'Istituto North in Ohio. Carol Danvers, diventata zombi, uccide Kate; Riri e F.R.I.D.A.Y. si sacrificano per salvare Kamala, che viene soccorsa da Blade Knight. Il gruppo di Shang-Chi si unisce al loro nella prigione del Raft di Zemo: Namor zombi fa strage e Kamala lo uccide, mentre Yelena si sacrifica per far partire la capsula di fuga. In flashback si vede la morte di T'Challa contro Thanos zombi. A Nuova Asgard Wanda, la Regina dei Morti, rivela che il «cibo» era carne di zombi; i Nova Corps mettono la Terra in quarantena. Nel finale Banner diventa Hulk dell'Infinito; Wanda prende l'energia delle Gemme e convince Kamala ad aiutarla a rifare il mondo. Dopo un'esplosione Kamala si risveglia in un mondo normale con Riri e Kate, ma la vera Riri le rivela di aver violato il sistema: ciò che vede non è reale.",
      en: "Five years after the outbreak, Kamala Khan, Kate Bishop, Riri Williams and F.R.I.D.A.Y. look for a transmitter at the North Institute in Ohio. A zombified Carol Danvers kills Kate; Riri and F.R.I.D.A.Y. sacrifice themselves to save Kamala, who is rescued by Blade Knight. Shang-Chi's group joins theirs at Zemo's Raft prison: a zombie Namor causes carnage and Kamala kills him, while Yelena sacrifices herself to launch the escape pod. Flashbacks show T'Challa's death against a zombie Thanos. In New Asgard Wanda, the Queen of the Dead, reveals the \"food\" was zombie flesh; the Nova Corps quarantine Earth. In the finale Banner becomes the Infinity Hulk; Wanda takes the Stones' energy and persuades Kamala to help her remake the world. After an explosion Kamala wakes in a normal world with Riri and Kate, but the real Riri reveals she has hacked the system: what Kamala sees is not real.",
    },
  },

  ff: {
    syn: {
      it: "Su una Terra retrofuturistica degli anni '60, i Fantastici Quattro sono eroi amatissimi. L'arrivo di Silver Surfer annuncia una minaccia cosmica: Galactus.",
      en: "On a retro-futuristic 1960s Earth, the Fantastic Four are beloved heroes. The arrival of the Silver Surfer heralds a cosmic threat: Galactus.",
    },
    full: {
      it: "Sulla Terra-828, nel 1964, Reed Richards, Sue Storm, Ben Grimm e Johnny Storm sono celebri e Reed e Sue aspettano un figlio. Silver Surfer annuncia che Galactus ha scelto la Terra per divorarla. La squadra va nello spazio e Galactus, che percepisce il potere cosmico del bambino non ancora nato, propone di risparmiare la Terra in cambio di lui. I quattro fuggono e Sue partorisce Franklin durante il viaggio. Sulla Terra molti chiedono di sacrificare il bambino; Sue rifiuta e Reed costruisce ponti di teletrasporto per spostare la Terra in un altro sistema solare. Johnny scopre che Silver Surfer è Shalla-Bal, diventata araldo di Galactus per salvare il suo pianeta. Usando Franklin come esca, la squadra attira Galactus verso il portale; Sue lo spinge con un campo di forza e Shalla-Bal lo trascina dall'altra parte. Sue muore per lo sforzo, ma Franklin la riporta in vita.",
      en: "On Earth-828 in 1964, Reed Richards, Sue Storm, Ben Grimm and Johnny Storm are famous, and Reed and Sue are expecting a child. The Silver Surfer announces that Galactus has chosen Earth to devour. The team goes to space and Galactus, sensing the unborn child's cosmic power, offers to spare Earth in exchange for him. The four escape and Sue gives birth to Franklin on the way back. On Earth many demand the baby be sacrificed; Sue refuses and Reed builds teleportation bridges to move Earth to another solar system. Johnny discovers the Silver Surfer is Shalla-Bal, who became Galactus's herald to save her planet. Using Franklin as bait, the team lures Galactus toward the portal; Sue pushes him with a force field and Shalla-Bal drags him through. Sue dies from the strain, but Franklin brings her back to life.",
    },
    pc: [
      {
        it: "Quattro anni dopo, Sue legge una storia a Franklin; quando torna con un altro libro trova il bambino con un uomo dal mantello verde che tiene in mano una maschera di metallo.",
        en: "Four years later, Sue is reading to Franklin; when she comes back with another book she finds him with a man in a green cloak holding a metal mask.",
      },
      {
        it: "Uno spezzone del cartone animato dei Fantastici Quattro del loro mondo, con il nemico Red Ghost.",
        en: "A clip from the Fantastic Four's in-world cartoon, featuring the villain Red Ghost.",
      },
    ],
  },

  wonderman: {
    syn: {
      it: "Simon Williams, attore in difficoltà con un potere segreto, stringe un'amicizia improbabile con un attore in declino mentre cerca di ottenere il ruolo di un supereroe.",
      en: "Simon Williams, a struggling actor with a secret power, forms an unlikely friendship with a washed-up actor while chasing the role of a superhero.",
    },
    full: {
      it: "Simon nasconde i suoi poteri ionici per via della «clausola Doorman», che impedisce ai superumani di recitare. Conosce Trevor Slattery, l'attore che interpretava il Mandarino, che lo aiuta nei provini per il remake di Wonder Man del regista Von Kovak; in segreto, però, Trevor fa rapporto su Simon all'agente P. Cleary del Dipartimento di Controllo dei Danni. Entrambi ottengono una parte nel film. Mentre un giornalista del New York Times prepara un ritratto di Simon, Trevor confessa di averlo spiato: Simon perde il controllo e un'esplosione distrugge il set. Trevor si prende la colpa e finisce nella prigione di Yucca Valley, il film esce con successo e Cleary vuole usare Simon come risorsa. Alla fine Simon entra nella prigione fingendosi un documentarista, libera Trevor e vola via con lui.",
      en: "Simon hides his ionic powers because of the \"Doorman Clause\", which bars superhumans from acting. He meets Trevor Slattery, the actor who played the Mandarin, who coaches him through auditions for director Von Kovak's Wonder Man remake; secretly, though, Trevor reports on Simon to Damage Control agent P. Cleary. Both are cast in the film. While a New York Times writer prepares a profile of Simon, Trevor confesses to spying on him: Simon loses control and an explosion destroys the set. Trevor takes the blame and ends up in Yucca Valley prison, the film is a success and Cleary wants to use Simon as an asset. In the end Simon gets into the prison posing as a documentary maker, breaks Trevor out and flies away with him.",
    },
  },

  ddba2: {
    syn: {
      it: "Con il sindaco Fisk deciso a eliminare i vigilanti, Matt Murdock guida una resistenza per farlo cadere.",
      en: "With Mayor Fisk determined to wipe out vigilantes, Matt Murdock leads a resistance to bring him down.",
    },
    full: {
      it: "Matt viene smascherato nel primo episodio e riorganizza la resistenza con Karen Page, Cherry e Angie Kim, mentre la task force anti-vigilanti di Fisk dà la caccia agli eroi. Daredevil libera i prigionieri di Red Hook e Fisk fa saltare in aria la nave Northern Star con dei recuperanti a bordo. Dex Poindexter, l'assassino di Foggy, tenta di uccidere Fisk. A un incontro di boxe, una scheggia di vetro colpisce Vanessa, che muore dopo l'operazione; Fisk uccide il chirurgo. Anche Jessica Jones si unisce alla lotta. Buck Cashman tortura e uccide Daniel Blake. Nel finale Matt chiama Fisk come testimone e rivela in tribunale di essere Daredevil; il caso viene archiviato. Fisk accetta l'esilio dopo che Matt lo convince, lascia New York e la task force viene sciolta. Heather Glenn indossa la maschera di Muse e Matt viene arrestato e incarcerato per le sue azioni da Daredevil.",
      en: "Matt is unmasked in the first episode and reorganizes the resistance with Karen Page, Cherry and Angie Kim, while Fisk's anti-vigilante task force hunts the heroes. Daredevil frees the Red Hook prisoners and Fisk blows up the ship Northern Star with salvagers aboard. Dex Poindexter, Foggy's killer, tries to kill Fisk. At a boxing match, a shard of glass hits Vanessa, who dies after surgery; Fisk kills the surgeon. Jessica Jones also joins the fight. Buck Cashman tortures and kills Daniel Blake. In the finale Matt calls Fisk as a witness and reveals in court that he is Daredevil; the case is dismissed. Fisk accepts exile after Matt talks him down, leaves New York and the task force is disbanded. Heather Glenn puts on Muse's mask and Matt is arrested and imprisoned for his actions as Daredevil.",
    },
  },

  bnd: {
    syn: {
      it: "Quattro anni dopo che il mondo ha dimenticato chi è, Peter Parker protegge New York da solo come Spider-Man, mentre i suoi poteri iniziano a cambiare.",
      en: "Four years after the world forgot who he is, Peter Parker protects New York alone as Spider-Man, while his powers begin to change.",
    },
    full: {
      it: "Peter sceglie di non farsi riconoscere da MJ e Ned e combatte il crimine, sconfiggendo Mac Gargan e i ninja della Mano e guadagnandosi la fiducia della detective Jean DeWolff. Una telepate che salta da un corpo all'altro aiuta Gargan a evadere; i nuovi poteri di Peter, come le ragnatele organiche, gli fanno perdere il controllo e ferisce un agente. Bruce Banner gli dà un inibitore. La telepate è la giovane Jean Grey, che attacca MJ dopo aver letto una lettera mai spedita; Peter la salva. Jean possiede Banner, che diventa Hulk, e Peter lo calma. Jean cerca la sorella Sara, rapita dal Dipartimento di Controllo dei Danni: nella loro base a Roosevelt Island crea un campo psichico che blocca tutti tranne Peter. Peter sconfigge la Mano, impedisce a Jean di uccidere, entra nella sua mente e la fa ragionare. Frank Castle spara a Jean e Peter la protegge, ferito gravemente; Jean lo tiene in vita. Jean lascia la città e Peter, deciso a non fare più tutto da solo, si fa riconoscere da Ned con la loro vecchia stretta di mano.",
      en: "Peter chooses not to reintroduce himself to MJ and Ned and fights crime, defeating Mac Gargan and the Hand ninjas and earning the trust of Detective Jean DeWolff. A body-hopping telepath helps Gargan escape; Peter's new powers, like organic webbing, make him lose control and he injures an officer. Bruce Banner gives him an inhibitor. The telepath is young Jean Grey, who attacks MJ after reading an unsent letter; Peter saves her. Jean possesses Banner, who becomes the Hulk, and Peter calms him. Jean is looking for her sister Sara, kidnapped by the Department of Damage Control: at their Roosevelt Island facility she creates a psychic field that freezes everyone except Peter. Peter defeats the Hand, stops Jean from killing, enters her mind and talks her down. Frank Castle shoots at Jean and Peter shields her, badly wounded; Jean keeps him alive. Jean leaves the city and Peter, determined not to do everything alone anymore, reintroduces himself to Ned with their old handshake.",
    },
    pc: [{
        it: "L'app «Spidey Tracker» di Ned rileva un avvistamento di Spider-Man lontano dalla Terra.",
        en: "Ned's \"Spidey Tracker\" app detects a Spider-Man sighting away from Earth.",
      }],
  },

  punolk: {
    syn: {
      it: "Frank Castle ha ucciso gli ultimi responsabili della morte della sua famiglia. Ma il quartiere che ha liberato è in mano al crimine, e lui non sa più chi essere.",
      en: "Frank Castle has killed the last people responsible for his family's death. But the neighborhood he freed is overrun by crime, and he no longer knows who to be.",
    },
    full: {
      it: "Dopo aver eliminato i Gnucci, Frank è perseguitato dalle allucinazioni. Va sulla tomba della famiglia per togliersi la vita, ma una visione della figlia Lisa lo ferma. Vaga per le strade, accompagnato dalla visione dell'amico Curtis Hoyle. Ma Gnucci, che vuole vendicare marito e figli, mette una taglia sulla sua testa. Nel suo appartamento una visione di Karen Page lo rimprovera e lo consola. I criminali assaltano il palazzo e incendiano la sua stanza; Frank fugge combattendo fino al tetto. Invece di inseguire Ma Gnucci, protegge il negoziante Dre, la moglie e la figlia Charli, che gli regala una rosa di carta; Frank la lascia sulla tomba di Lisa. Capisce di avere ancora un compito come Punisher e torna con un nuovo costume e nuove armi.",
      en: "After wiping out the Gnuccis, Frank is haunted by hallucinations. He goes to his family's grave to take his own life, but a vision of his daughter Lisa stops him. He wanders the streets, followed by a vision of his friend Curtis Hoyle. Ma Gnucci, seeking revenge for her husband and sons, puts a bounty on his head. In his apartment a vision of Karen Page scolds and comforts him. Criminals storm the building and set his room on fire; Frank fights his way up to the roof. Instead of chasing Ma Gnucci, he protects shopkeeper Dre, his wife and their daughter Charli, who gives him a paper rose; Frank leaves it on Lisa's grave. He realizes he still has work to do as the Punisher and returns with a new suit and new weapons.",
    },
  },

  visionquest: {
    syn: {
      it: "Visione, incerto su chi sia davvero, vive nascosto a Edimburgo e dialoga con le intelligenze artificiali nella sua mente. Quando gli mettono una taglia sulla testa, fugge con un ragazzo che potrebbe essere suo figlio.",
      en: "Vision, unsure who he really is, hides in Edinburgh and talks with the AIs in his mind. When a bounty is placed on him, he goes on the run with a teenager who may be his son.",
    },
    full: {
      it: "Visione lavora in un pub con il nome di Sherwood Ellis e nella sua mente lo aiutano altre intelligenze artificiali, mentre Ultron è rinchiuso in soffitta. Il cacciatore di taglie Paladin attacca il pub e cattura Thomas Shepherd, che dice di essere Tommy Maximoff. Visione lo salva ma resta gravemente ferito, e J.A.R.V.I.S. si cancella per salvare le altre IA. Un'androide assassina, la Butcherbird, si rivela Jocasta. Ultron tradisce Tommy e Visione abbassa le sue difese. Visione accetta Tommy come figlio. Nel finale il misterioso cliente si rivela Virgil Horton: Jocasta viene distrutta e i suoi nanobot danno un corpo a Ultron, che uccide Virgil. Visione intrappola Ultron in una sitcom e lo convince a ritirarsi, ma Ultron se ne va con parte dei nanobot. Billy Maximoff aiuta a riparare Visione, che con Tommy va a trovarlo. Nelle due scene dopo i titoli dell'ultima puntata Ultron tiene i dati di Jocasta e il Dottor Destino risveglia Wanda sul monte Wundagore.",
      en: "Vision works at a pub as Sherwood Ellis and other AIs help him inside his mind, while Ultron is locked in the attic. Bounty hunter Paladin attacks the pub and captures Thomas Shepherd, who claims to be Tommy Maximoff. Vision rescues him but is badly wounded, and J.A.R.V.I.S. deletes himself to save the other AIs. An android killer, the Butcherbird, turns out to be Jocasta. Ultron betrays Tommy and Vision lowers his defenses. Vision accepts Tommy as his son. In the finale the mysterious client turns out to be Virgil Horton: Jocasta is destroyed and her nanobots give Ultron a body, and he kills Virgil. Vision traps Ultron in a sitcom and persuades him to stand down, but Ultron leaves with some of the nanobots. Billy Maximoff helps restore Vision, who visits him with Tommy. In the final episode's two post-credits scenes Ultron keeps Jocasta's data and Doctor Doom awakens Wanda on Mount Wundagore.",
    },
    pc: [
      {
        it: "Episodio 8 · Nella villa degli Horton, Ultron guarda fuori dalla finestra stringendo una chiavetta con scritto «Jocasta»: forse vuole riportarla in vita.",
        en: "Episode 8 · In the Horton mansion, Ultron looks out of the window holding a drive labelled \"Jocasta\": he may want to bring her back.",
      },
      {
        it: "Episodio 8 · Sul monte Wundagore, dove Wanda era rimasta sepolta alla fine di Doctor Strange nel Multiverso della Follia, le rocce si sollevano: arriva il Dottor Destino, la risveglia e dice che i suoi poteri saranno suoi. Anteprima di Avengers: Doomsday.",
        en: "Episode 8 · On Mount Wundagore, where Wanda was buried at the end of Doctor Strange in the Multiverse of Madness, the rocks lift: Doctor Doom arrives, awakens her and says her powers will be his. A teaser for Avengers: Doomsday.",
      },
    ],
  },
};

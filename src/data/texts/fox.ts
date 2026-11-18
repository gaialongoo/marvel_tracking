/* ============================================================================
   TESTI — BLOCCO FOX: X-Men e Fantastici Quattro (20th Century Fox)
   Scritti da Claude. syn = senza spoiler · full = con spoiler · pc = scene dopo i titoli
   ============================================================================ */
import type { TitleTexts } from "./types";

export const FOX: Record<string, TitleTexts> = {
  /* ===== X-MEN ===== */
  xmen: {
    syn: {
      it: "In un mondo che teme i mutanti, la giovane Rogue e il solitario Wolverine trovano rifugio nella scuola del professor Xavier, mentre Magneto prepara un piano contro l'umanità.",
      en: "In a world that fears mutants, young Rogue and loner Wolverine find refuge at Professor Xavier's school, while Magneto prepares a plan against humanity.",
    },
    full: {
      it: "Il senatore Kelly propone una legge per schedare i mutanti. Magneto e la sua Confraternita rapiscono Kelly e lo trasformano in mutante con una macchina che sfrutta l'energia di Magneto; Kelly muore poco dopo. Il vero obiettivo è usare la macchina sui capi di Stato riuniti a Ellis Island, ma serve a costo della vita di chi la alimenta: per questo Magneto rapisce Rogue, che può assorbire i poteri altrui. Gli X-Men (Ciclope, Jean Grey, Tempesta e Wolverine) salgono sulla Statua della Libertà, distruggono la macchina e Wolverine salva Rogue trasferendole il suo potere di guarigione. Magneto viene rinchiuso in una prigione di plastica. Xavier dice a Wolverine di cercare risposte sul suo passato in una base in Canada.",
      en: "Senator Kelly proposes a law to register mutants. Magneto and his Brotherhood kidnap Kelly and turn him into a mutant with a machine powered by Magneto's energy; Kelly dies soon after. The real goal is to use the machine on world leaders gathered at Ellis Island, but it costs the life of whoever powers it: this is why Magneto kidnaps Rogue, who can absorb others' powers. The X-Men (Cyclops, Jean Grey, Storm and Wolverine) climb the Statue of Liberty, destroy the machine, and Wolverine saves Rogue by passing her his healing power. Magneto is locked in a plastic prison. Xavier tells Wolverine to look for answers about his past at a base in Canada.",
    },
  },
  x2: {
    syn: {
      it: "Dopo un attacco alla Casa Bianca da parte di un mutante, il colonnello William Stryker ottiene il permesso di attaccare la scuola di Xavier. X-Men e Magneto devono collaborare.",
      en: "After a mutant attack on the White House, Colonel William Stryker gets permission to raid Xavier's school. The X-Men and Magneto must work together.",
    },
    full: {
      it: "Nightcrawler, controllato mentalmente, attacca il presidente. Stryker, che anni prima ha sottoposto Wolverine all'esperimento dell'adamantio, assalta la scuola e rapisce Xavier e alcuni studenti. Il suo piano è usare una copia di Cerebro, controllata da Xavier sotto l'influsso del figlio di Stryker, per uccidere tutti i mutanti. Magneto, evaso con l'aiuto di Mystica, si allea con gli X-Men, ma poi modifica Cerebro per uccidere tutti gli umani. Tempesta e Nightcrawler liberano Xavier dal controllo. La diga di Alkali Lake sta per crollare: Jean Grey si sacrifica per salvare tutti, trattenendo l'acqua con la telecinesi. Il presidente riceve gli X-Men, che chiedono pace.",
      en: "Nightcrawler, under mind control, attacks the president. Stryker, who years earlier subjected Wolverine to the adamantium experiment, raids the school and kidnaps Xavier and several students. His plan is to use a copy of Cerebro, operated by Xavier under the influence of Stryker's son, to kill every mutant. Magneto, freed with Mystique's help, allies with the X-Men, but then alters Cerebro to kill every human. Storm and Nightcrawler free Xavier from the mind control. The Alkali Lake dam is about to burst: Jean Grey sacrifices herself to save everyone, holding back the water with telekinesis. The president receives the X-Men, who ask for peace.",
    },
  },
  x3: {
    syn: {
      it: "Una cura capace di eliminare il gene mutante divide il mondo dei mutanti, mentre Jean Grey torna dal lago con un potere enorme e incontrollabile.",
      en: "A cure able to remove the mutant gene divides the mutant world, while Jean Grey returns from the lake with enormous, uncontrollable power.",
    },
    full: {
      it: "La Worthington Labs annuncia una cura per la mutazione, ricavata dal giovane Leech. Jean ritorna dal lago come Fenice, uccide Ciclope e, a casa sua, Xavier. Magneto recluta un esercito di mutanti contrari alla cura e Jean si unisce a lui. Mystica, colpita dalla cura, viene abbandonata da Magneto. Lo scontro finale avviene ad Alcatraz: gli X-Men, guidati da Tempesta, combattono la Confraternita; Magneto perde i poteri colpito da una dose della cura. La Fenice si scatena e Wolverine, il solo capace di avvicinarsi, la uccide. Rogue sceglie di prendere la cura. Magneto, solo in un parco, sposta leggermente un pezzo degli scacchi: i suoi poteri potrebbero tornare.",
      en: "Worthington Labs announces a cure for mutation, derived from the young Leech. Jean returns from the lake as the Phoenix, kills Cyclops and, at her home, Xavier. Magneto recruits an army of mutants opposed to the cure and Jean joins him. Mystique, hit by the cure, is abandoned by Magneto. The final battle takes place at Alcatraz: the X-Men, led by Storm, fight the Brotherhood; Magneto loses his powers when struck by a dose of the cure. The Phoenix runs wild and Wolverine, the only one able to get close, kills her. Rogue chooses to take the cure. Magneto, alone in a park, slightly moves a chess piece: his powers may be returning.",
    },
    pc: [{
      it: "Moira MacTaggert visita un paziente in coma, che le parla con la voce di Xavier.",
      en: "Moira MacTaggert visits a comatose patient, who speaks to her with Xavier's voice.",
    }],
  },
  xow: {
    syn: {
      it: "La storia delle origini di Wolverine: dal rapporto con il fratello Victor fino al programma segreto che gli diede lo scheletro di adamantio.",
      en: "Wolverine's origin story: from his relationship with his brother Victor to the secret program that gave him his adamantium skeleton.",
    },
    full: {
      it: "Logan e il fratello Victor combattono in tutte le guerre del Novecento, finché il colonnello Stryker li recluta nella squadra speciale Team X. Logan abbandona la squadra e si ritira in Canada con Kayla Silverfox. Anni dopo Victor (Sabretooth) uccide Kayla; per vendicarsi Logan accetta l'esperimento di Stryker, che gli dà lo scheletro di adamantio. Scopre che la morte di Kayla era una messinscena e che Stryker rapisce mutanti per creare Weapon XI, un mutante con i poteri di tutti, Deadpool. Sull'isola di Three Mile Logan, con l'aiuto di Victor, sconfigge Weapon XI e libera i prigionieri, tra cui il giovane Ciclope. Stryker gli spara un proiettile di adamantio alla testa e Logan perde la memoria.",
      en: "Logan and his brother Victor fight in every war of the 20th century until Colonel Stryker recruits them into the special unit Team X. Logan leaves the team and retires to Canada with Kayla Silverfox. Years later Victor (Sabretooth) kills Kayla; to get revenge Logan accepts Stryker's experiment, which gives him his adamantium skeleton. He discovers Kayla's death was staged and that Stryker kidnaps mutants to create Weapon XI, a mutant with all their powers, Deadpool. On Three Mile Island Logan, with Victor's help, defeats Weapon XI and frees the prisoners, including young Cyclops. Stryker shoots him in the head with an adamantium bullet and Logan loses his memory.",
    },
    pc: [
      {
        it: "Stryker viene fermato dalla polizia militare per l'omicidio del generale Munson.",
        en: "Stryker is detained by military police for the murder of General Munson.",
      },
      {
        it: "Logan beve in un bar in Giappone (scena diversa a seconda delle copie del film).",
        en: "Logan drinks in a bar in Japan (the scene differs between prints of the film).",
      },
      {
        it: "Tra le macerie, la testa di Deadpool apre gli occhi e fa segno di stare zitti.",
        en: "Among the rubble, Deadpool's head opens its eyes and signals to keep quiet.",
      },
    ],
  },
  xfc: {
    syn: {
      it: "Negli anni '60, prima di diventare il professor X e Magneto, i giovani Charles Xavier ed Erik Lehnsherr sono amici e uniscono le forze contro una minaccia comune.",
      en: "In the 1960s, before becoming Professor X and Magneto, young Charles Xavier and Erik Lehnsherr are friends and join forces against a common threat.",
    },
    full: {
      it: "Erik, sopravvissuto ai campi di concentramento, dà la caccia a Sebastian Shaw, il medico nazista che gli uccise la madre. Charles, telepate, e la sorella adottiva Raven (Mystica) vengono reclutati dalla CIA tramite l'agente Moira MacTaggert. Charles ed Erik reclutano giovani mutanti, tra cui Bestia, Havok e Banshee. Shaw, a capo del Club Infernale, manipola Stati Uniti e URSS per scatenare la crisi dei missili di Cuba e una guerra nucleare che farebbe dominare i mutanti. Al largo di Cuba, Erik uccide Shaw con la moneta con cui la madre era morta. Quando le flotte sparano sui mutanti, Erik devia i missili; Moira spara, il proiettile deviato colpisce Charles alla schiena, paralizzandolo. Erik se ne va con Raven, diventando Magneto, e Charles fonda la sua scuola.",
      en: "Erik, a concentration camp survivor, hunts Sebastian Shaw, the Nazi doctor who killed his mother. Charles, a telepath, and his adoptive sister Raven (Mystique) are recruited by the CIA through agent Moira MacTaggert. Charles and Erik recruit young mutants, including Beast, Havok and Banshee. Shaw, head of the Hellfire Club, manipulates the US and USSR to trigger the Cuban Missile Crisis and a nuclear war that would let mutants rule. Off the coast of Cuba, Erik kills Shaw with the coin from the day his mother died. When the fleets fire on the mutants, Erik deflects the missiles; Moira shoots, the deflected bullet hits Charles in the back, paralyzing him. Erik leaves with Raven, becoming Magneto, and Charles founds his school.",
    },
  },
  wolv13: {
    syn: {
      it: "Logan, tormentato dal passato, viene invitato in Giappone da un uomo che salvò durante la guerra. Lì gli viene offerta la possibilità di diventare mortale.",
      en: "Logan, haunted by his past, is invited to Japan by a man he saved during the war. There he is offered the chance to become mortal.",
    },
    full: {
      it: "Yashida, che Logan salvò a Nagasaki nel 1945, sta morendo e gli propone di trasferirgli il suo potere di guarigione. Logan rifiuta. Dopo la morte di Yashida, Logan protegge la nipote Mariko dalla Yakuza e se ne innamora. Scopre che il suo potere di guarigione è stato bloccato dalla mutante Viper, e lo riattiva togliendosi da solo un parassita dal cuore. Si scopre che Yashida ha finto la morte: chiuso nell'armatura del Samurai d'Argento, vuole rubare a Logan la guarigione per vivere per sempre. Logan perde gli artigli di adamantio, ma gli restano quelli d'osso; Mariko uccide il nonno. Logan riparte.",
      en: "Yashida, whom Logan saved at Nagasaki in 1945, is dying and offers to transfer his healing power to himself. Logan refuses. After Yashida's death, Logan protects his granddaughter Mariko from the Yakuza and falls in love with her. He discovers his healing has been suppressed by the mutant Viper, and restores it by cutting a parasite from his own heart. It turns out Yashida faked his death: encased in the Silver Samurai armor, he wants to steal Logan's healing to live forever. Logan loses his adamantium claws but keeps his bone ones; Mariko kills her grandfather. Logan moves on.",
    },
    pc: [{
      it: "Due anni dopo, in un aeroporto, Logan viene fermato da Magneto e dal professor X, vivo: c'è una minaccia che riguarda tutti i mutanti.",
      en: "Two years later, at an airport, Logan is stopped by Magneto and a living Professor X: there is a threat to all mutants.",
    }],
  },
  dofp: {
    syn: {
      it: "In un futuro in cui i mutanti sono quasi estinti, gli X-Men mandano la coscienza di Wolverine negli anni '70 per cambiare il corso della storia.",
      en: "In a future where mutants are nearly extinct, the X-Men send Wolverine's consciousness back to the 1970s to change the course of history.",
    },
    full: {
      it: "Nel futuro le Sentinelle, robot che si adattano a qualsiasi potere, sterminano i mutanti. Kitty Pryde manda la mente di Logan nel suo corpo del 1973: deve impedire a Mystica di uccidere lo scienziato Bolivar Trask, perché il suo DNA catturato dopo l'omicidio rese invincibili le Sentinelle. Logan trova un giovane Charles disilluso, che usa un siero per camminare a costo di perdere la telepatia, e Bestia. Con Quicksilver fanno evadere Magneto dal Pentagono. A Parigi Mystica sfugge; Magneto cerca di ucciderla. A Washington, durante la presentazione delle Sentinelle, Magneto prende il controllo dei robot e attacca il presidente. Mystica salva il presidente e risparmia Trask, convinta da Charles. Il futuro cambia: Logan si risveglia in una scuola piena di vita, con Jean e Ciclope vivi.",
      en: "In the future the Sentinels, robots that adapt to any power, are exterminating mutants. Kitty Pryde sends Logan's mind into his 1973 body: he must stop Mystique from killing scientist Bolivar Trask, because her DNA, captured after the murder, made the Sentinels unstoppable. Logan finds a disillusioned young Charles, who uses a serum to walk at the cost of his telepathy, and Beast. With Quicksilver they break Magneto out of the Pentagon. In Paris Mystique escapes; Magneto tries to kill her. In Washington, during the Sentinels' unveiling, Magneto takes control of the robots and attacks the president. Mystique saves the president and spares Trask, persuaded by Charles. The future changes: Logan wakes up in a school full of life, with Jean and Cyclops alive.",
    },
    pc: [{
      it: "Nell'antico Egitto una folla acclama un giovane En Sabah Nur, che costruisce piramidi con la telecinesi; in lontananza quattro cavalieri.",
      en: "In ancient Egypt a crowd hails a young En Sabah Nur, who builds pyramids with telekinesis; four horsemen watch in the distance.",
    }],
  },
  deadpool: {
    syn: {
      it: "Wade Wilson, ex soldato e mercenario, si sottopone a un trattamento sperimentale contro il cancro. Ne esce sfigurato e quasi immortale, e vuole vendetta.",
      en: "Wade Wilson, a former soldier and mercenary, undergoes an experimental cancer treatment. He comes out disfigured and nearly immortal, and wants revenge.",
    },
    full: {
      it: "Wade si innamora di Vanessa, ma scopre di avere un cancro terminale. Accetta l'offerta di un programma segreto guidato da Ajax (Francis), che lo tortura per attivare un gene mutante: Wade guarisce da tutto ma resta sfigurato. Si fa chiamare Deadpool e, con l'aiuto dell'amico Weasel e della coinquilina Al, dà la caccia a Francis per farsi curare l'aspetto. Colosso e Testata Mutante Negasonica cercano di reclutarlo negli X-Men. Francis rapisce Vanessa. In un cantiere navale, con l'aiuto degli X-Men, Deadpool salva Vanessa e uccide Francis, nonostante Colosso lo implori di non farlo. Vanessa lo accetta così com'è.",
      en: "Wade falls in love with Vanessa but learns he has terminal cancer. He accepts an offer from a secret program run by Ajax (Francis), who tortures him to trigger a mutant gene: Wade heals from everything but is left disfigured. He calls himself Deadpool and, with help from his friend Weasel and roommate Al, hunts Francis to get his looks fixed. Colossus and Negasonic Teenage Warhead try to recruit him into the X-Men. Francis kidnaps Vanessa. In a shipyard, with the X-Men's help, Deadpool saves Vanessa and kills Francis, despite Colossus begging him not to. Vanessa accepts him as he is.",
    },
    pc: [{
      it: "In accappatoio, come in una famosa scena di Ferris Bueller, Deadpool dice agli spettatori che il film è finito e annuncia che nel seguito arriverà Cable.",
      en: "In a bathrobe, like a famous scene from Ferris Bueller, Deadpool tells viewers the movie is over and announces Cable will be in the sequel.",
    }],
  },
  apocalypse: {
    syn: {
      it: "Negli anni '80 si risveglia En Sabah Nur, il primo e più potente mutante della storia, deciso a distruggere la civiltà e a ricrearla a sua immagine.",
      en: "In the 1980s En Sabah Nur awakens, the first and most powerful mutant in history, determined to destroy civilization and remake it in his image.",
    },
    full: {
      it: "Apocalisse, sepolto da millenni in Egitto, si risveglia e recluta i suoi quattro cavalieri: Tempesta, Psylocke, Angelo e Magneto, che ha perso la moglie e la figlia in Polonia. Rapisce Xavier per prenderne il corpo e la telepatia, così da controllare tutte le menti. Alla scuola di Xavier, giovani come Jean Grey, Ciclope e Nightcrawler vengono catturati dal colonnello Stryker; nella sua base Wolverine, ancora sotto controllo, li libera. Al Cairo Magneto e Tempesta si ribellano ad Apocalisse e Jean libera tutto il suo potere, la Fenice, distruggendolo. Charles e Magneto si riconciliano e la nuova squadra degli X-Men, guidata da Mystica e Bestia, inizia ad allenarsi.",
      en: "Apocalypse, buried for millennia in Egypt, awakens and recruits his four horsemen: Storm, Psylocke, Angel and Magneto, who has lost his wife and daughter in Poland. He kidnaps Xavier to take his body and telepathy and control every mind. At Xavier's school, young mutants such as Jean Grey, Cyclops and Nightcrawler are captured by Colonel Stryker; at his base Wolverine, still under control, frees them. In Cairo Magneto and Storm turn against Apocalypse and Jean unleashes her full power, the Phoenix, destroying him. Charles and Magneto reconcile and the new X-Men team, led by Mystique and Beast, begins training.",
    },
    pc: [{
      it: "Uomini in giacca e cravatta prelevano dalla base di Stryker un campione del sangue di Weapon X, per conto della Essex Corporation.",
      en: "Men in suits collect a sample of Weapon X's blood from Stryker's base, on behalf of the Essex Corporation.",
    }],
  },
  logan: {
    syn: {
      it: "Nel 2029 i mutanti sono quasi scomparsi. Un Logan stanco e malato si prende cura di un anziano Charles Xavier, finché una bambina misteriosa non cambia tutto.",
      en: "In 2029 mutants have almost disappeared. A tired and sick Logan cares for an elderly Charles Xavier, until a mysterious girl changes everything.",
    },
    full: {
      it: "Logan fa l'autista vicino al confine messicano e nasconde Charles, colpito da una malattia che rende pericolose le sue crisi telepatiche, insieme al mutante Calibano. Un'infermiera gli affida Laura, una bambina con gli artigli e il suo stesso potere: è stata creata in laboratorio dalla Transigen con il DNA di Logan. Inseguiti dai Reavers di Donald Pierce e dal dottor Rice, i tre partono verso l'Eden, un luogo sicuro in North Dakota. Calibano muore. Una famiglia di contadini li ospita, ma X-24, un clone di Logan, uccide Charles e la famiglia. Logan accompagna Laura dagli altri bambini mutanti fuggiti; nello scontro finale, Laura uccide X-24 con un proiettile di adamantio, ma Logan muore. Laura gira la croce sulla sua tomba e la trasforma in una X.",
      en: "Logan works as a driver near the Mexican border and hides Charles, who suffers from an illness that makes his telepathic seizures dangerous, together with the mutant Caliban. A nurse entrusts him with Laura, a girl with claws and his same power: she was created in a lab by Transigen from Logan's DNA. Chased by Donald Pierce's Reavers and Dr. Rice, the three head for Eden, a safe haven in North Dakota. Caliban dies. A farming family takes them in, but X-24, a clone of Logan, kills Charles and the family. Logan escorts Laura to the other escaped mutant children; in the final fight Laura kills X-24 with an adamantium bullet, but Logan dies. Laura tilts the cross on his grave to make it an X.",
    },
  },
  deadpool2: {
    syn: {
      it: "Deadpool deve proteggere un giovane mutante da Cable, un soldato venuto dal futuro. Per farlo mette insieme una squadra tutta sua: la X-Force.",
      en: "Deadpool must protect a young mutant from Cable, a soldier from the future. To do it, he assembles his own team: X-Force.",
    },
    full: {
      it: "Vanessa viene uccisa da criminali che inseguivano Wade. Colosso lo porta alla scuola degli X-Men; durante una missione Wade incontra Russell, un ragazzo mutante maltrattato in un orfanotrofio, e finiscono entrambi nella prigione dei mutanti. Arriva Cable, che vuole uccidere Russell: nel futuro il ragazzo diventerà un assassino e ucciderà la famiglia di Cable. Wade forma la X-Force, ma quasi tutti muoiono al primo salto con il paracadute, tranne la fortunata Domino. Russell si allea con il Fenomeno (Juggernaut) per vendicarsi del direttore dell'orfanotrofio. Wade si prende la pallottola destinata a Russell, che rinuncia a uccidere: il futuro cambia. Cable usa l'ultima carica del suo dispositivo per tornare indietro e salvare Wade.",
      en: "Vanessa is killed by criminals who were after Wade. Colossus takes him to the X-Men's school; during a mission Wade meets Russell, a mutant boy abused at an orphanage, and they both end up in a mutant prison. Cable arrives, wanting to kill Russell: in the future the boy will become a killer and murder Cable's family. Wade forms X-Force, but nearly everyone dies on their first parachute jump, except the lucky Domino. Russell teams up with Juggernaut to take revenge on the orphanage's headmaster. Wade takes the bullet meant for Russell, who gives up killing: the future changes. Cable uses his device's last charge to go back and save Wade.",
    },
    pc: [
      {
        it: "Con il dispositivo di Cable riparato, Wade torna indietro nel tempo e salva Vanessa e Peter della X-Force.",
        en: "With Cable's device repaired, Wade travels back in time and saves Vanessa and X-Force's Peter.",
      },
      {
        it: "Wade continua a «correggere» il passato: elimina il Deadpool di X-Men le origini: Wolverine e l'attore Ryan Reynolds mentre legge il copione di Lanterna Verde.",
        en: "Wade keeps \"fixing\" the past: he takes out the Deadpool from X-Men Origins: Wolverine and actor Ryan Reynolds while he reads the Green Lantern script.",
      },
    ],
  },
  darkphoenix: {
    syn: {
      it: "Nel 1992, durante una missione nello spazio, Jean Grey viene colpita da una forza cosmica che la rende potentissima e instabile.",
      en: "In 1992, during a space mission, Jean Grey is struck by a cosmic force that makes her immensely powerful and unstable.",
    },
    full: {
      it: "Gli X-Men salvano gli astronauti di uno shuttle e Jean assorbe una misteriosa energia. Tornata sulla Terra, perde il controllo, scopre che Xavier le ha nascosto la verità sul padre e, in uno scatto, uccide Mystica. Si rifugia da Magneto a Genosha, poi viene avvicinata da Vuk, capa degli alieni D'Bari, che vuole il potere per ricostruire il suo popolo distrutto da quella forza. Bestia e Magneto vogliono uccidere Jean per vendicare Mystica. Su un treno militare, D'Bari ed X-Men si scontrano; Jean riprende il controllo, assorbe Vuk nello spazio e si sacrifica. La scuola viene rinominata in suo onore e Charles si ritira a Parigi, dove Magneto lo raggiunge per una partita a scacchi.",
      en: "The X-Men rescue a shuttle crew and Jean absorbs a mysterious energy. Back on Earth she loses control, learns Xavier hid the truth about her father from her and, in an outburst, kills Mystique. She takes refuge with Magneto in Genosha, then is approached by Vuk, leader of the alien D'Bari, who wants the power to rebuild her people, destroyed by that force. Beast and Magneto want to kill Jean to avenge Mystique. On a military train the D'Bari and the X-Men clash; Jean regains control, carries Vuk into space and sacrifices herself. The school is renamed in her honor and Charles retires to Paris, where Magneto joins him for a game of chess.",
    },
  },
  newmutants: {
    syn: {
      it: "Cinque giovani mutanti sono rinchiusi in un ospedale isolato, dove una dottoressa li studia. Ma qualcosa di terribile comincia a dar loro la caccia.",
      en: "Five young mutants are held in an isolated hospital, where a doctor studies them. But something terrible begins to hunt them.",
    },
    full: {
      it: "Danielle Moonstar, unica sopravvissuta alla distruzione della sua riserva, si risveglia nella struttura della dottoressa Reyes, dove sono trattenuti Rahne, Illyana, Sam e Roberto. I ragazzi iniziano a rivivere le loro paure più grandi come incubi reali. Si scopre che è il potere di Dani a crearle: è stata lei, senza saperlo, a distruggere la riserva evocando l'Orso Demone. Reyes lavora per la Essex Corporation e vuole uccidere Dani; i ragazzi la fermano. L'Orso Demone attacca, Illyana lo affronta con la sua spada di energia e Dani riesce a calmarlo. Reyes muore e i ragazzi lasciano la struttura per un futuro insieme.",
      en: "Danielle Moonstar, sole survivor of the destruction of her reservation, wakes up at Dr. Reyes's facility, where Rahne, Illyana, Sam and Roberto are also held. The teens start reliving their greatest fears as real nightmares. It turns out Dani's power is creating them: she unknowingly destroyed the reservation by summoning the Demon Bear. Reyes works for the Essex Corporation and wants to kill Dani; the teens stop her. The Demon Bear attacks, Illyana faces it with her energy sword and Dani manages to calm it. Reyes dies and the teens leave the facility for a future together.",
    },
  },

  /* ===== FANTASTICI QUATTRO (Fox) ===== */
  ff2005: {
    syn: {
      it: "Quattro persone vengono colpite da una tempesta cosmica durante un esperimento nello spazio e tornano sulla Terra con poteri straordinari.",
      en: "Four people are struck by a cosmic storm during an experiment in space and return to Earth with extraordinary powers.",
    },
    full: {
      it: "Reed Richards, Sue Storm, il fratello Johnny e Ben Grimm vanno nella stazione spaziale di Victor von Doom per studiare una nube cosmica, che li investe. Reed diventa elastico, Sue invisibile, Johnny prende fuoco e Ben si trasforma in una creatura di roccia, la Cosa. Dopo aver salvato persone sul ponte di Brooklyn, diventano famosi. Anche Victor cambia: la sua pelle diventa metallo e controlla l'elettricità. Geloso di Reed e rovinato economicamente, Victor manipola Ben, che si fa curare da Reed ma poi torna a essere la Cosa per salvare l'amico. Insieme i quattro sconfiggono Victor, ora Dottor Destino, congelandolo. Reed chiede a Sue di sposarlo.",
      en: "Reed Richards, Sue Storm, her brother Johnny and Ben Grimm go to Victor von Doom's space station to study a cosmic cloud, which engulfs them. Reed becomes elastic, Sue invisible, Johnny bursts into flame and Ben turns into a rock creature, the Thing. After saving people on the Brooklyn Bridge, they become famous. Victor changes too: his skin becomes metal and he controls electricity. Jealous of Reed and financially ruined, Victor manipulates Ben, who gets Reed to cure him but then turns back into the Thing to save his friend. Together the four defeat Victor, now Doctor Doom, by freezing him. Reed asks Sue to marry him.",
    },
  },
  ff2007: {
    syn: {
      it: "Mentre Reed e Sue preparano il matrimonio, un misterioso essere argentato attraversa la galassia e arriva sulla Terra, annunciando la sua distruzione.",
      en: "As Reed and Sue prepare their wedding, a mysterious silver being crosses the galaxy and arrives on Earth, heralding its destruction.",
    },
    full: {
      it: "Silver Surfer, araldo di Galactus, crea crateri in tutto il mondo e manda in tilt il matrimonio di Reed e Sue. Johnny, toccato dal Surfer, inizia a scambiare i poteri con chi tocca. L'esercito si allea con Victor von Doom, che ruba la tavola del Surfer e ne prende il potere. Sue fa breccia nel Surfer, che rivela di servire Galactus per salvare la persona amata. I Quattro tolgono la tavola a Destino, con Johnny che assorbe tutti i poteri della squadra. Il Surfer riprende la tavola e si sacrifica per distruggere Galactus. Reed e Sue si sposano in Giappone.",
      en: "The Silver Surfer, herald of Galactus, creates craters around the world and wrecks Reed and Sue's wedding. Johnny, touched by the Surfer, starts swapping powers with anyone he touches. The army allies with Victor von Doom, who steals the Surfer's board and takes its power. Sue gets through to the Surfer, who reveals he serves Galactus to save the one he loves. The Four take the board from Doom, with Johnny absorbing the whole team's powers. The Surfer reclaims his board and sacrifices himself to destroy Galactus. Reed and Sue get married in Japan.",
    },
    pc: [{
      it: "La tavola del Surfer galleggia nello spazio; il Surfer apre gli occhi e la tavola vola via.",
      en: "The Surfer's board drifts in space; the Surfer opens his eyes and the board flies off.",
    }],
  },
  fant4stic: {
    syn: {
      it: "Il giovane genio Reed Richards costruisce un teletrasporto verso un'altra dimensione. Il viaggio cambia per sempre lui e i suoi amici.",
      en: "Young genius Reed Richards builds a teleporter to another dimension. The journey changes him and his friends forever.",
    },
    full: {
      it: "Reed e l'amico Ben Grimm vengono reclutati dal dottor Franklin Storm, che con i figli Sue e Johnny e il brillante Victor von Doom sta costruendo un portale per il Pianeta Zero. Reed, Johnny, Victor e Ben ci vanno di nascosto; Victor tocca un'energia verde e resta indietro, gli altri tornano con poteri, e anche Sue viene colpita. Reed fugge per un anno. Il governo apre di nuovo il portale e trova Victor, fuso con la tuta e potentissimo, che vuole distruggere la Terra per salvare il Pianeta Zero. Uccide il dottor Storm. I quattro lo affrontano insieme sul Pianeta Zero e lo sconfiggono. Il governo concede loro una base e Reed propone il nome della squadra.",
      en: "Reed and his friend Ben Grimm are recruited by Dr. Franklin Storm, who with his children Sue and Johnny and the brilliant Victor von Doom is building a portal to Planet Zero. Reed, Johnny, Victor and Ben go through in secret; Victor touches a green energy and is left behind, the others return with powers, and Sue is hit too. Reed runs away for a year. The government reopens the portal and finds Victor, fused with his suit and immensely powerful, who wants to destroy Earth to save Planet Zero. He kills Dr. Storm. The four face him together on Planet Zero and defeat him. The government gives them a base and Reed suggests the team's name.",
    },
  },
};

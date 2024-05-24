/**
 * @fileoverview Sistema di gestione delle attività per creare, modificare, eliminare e cercare attività.
 * Questo è un semplice programma di gestione delle attività che consente agli utenti di creare, eliminare, modificare e cercare attività.
 * Ogni attività può essere contrassegnata come completata. Le attività sono archiviate in un file JSON denominato "promemoria.json" nella directory "src".
 * Il programma prevede un sistema di menu basato su testo per interagire con le attività.
 * @author Stefania Giuseppe, Di Maggio Federico, Di Stolfo Simone
 */
/**
 * Modulo per richiedere input all'utente tramite la console.
 */
const prompt = require("prompt-sync")();
/**
 * Modulo del file system di Node.js per leggere e scrivere file.
 */
const fs = require('fs');
/**
 * Classe che rappresenta un'attività.
 * @class
 */
class Attività {
    /**
     * Crea una nuova istanza di Attività.
     * @param {string} nomeAttività - Il nome dell'attività.
     * @param {string} dataAttività - La data dell'attività.
     */
    constructor(nomeAttività, dataAttività) {
        /**
         * Il nome dell'attività.
         * @type {string}
         */
        this.nomeAttività = nomeAttività;
        /**
         * Stato di marcatura dell'attività, indica se l'attività è stata completata, parte come non completata.
         * @type {boolean}
         */
        this.marcaturaAttività = false;
        /**
         * La data dell'attività.
         * @type {string}
         */
        this.dataAttività = dataAttività;
    }
}

class Promemoria {
    constructor() {
        this.mappa = new Map([
            ['Lavoro', []],
            ['Personale', []],
            ['Hobby', []],
        ]);
    }
    aggiungiAttività(categoria, attività) {
        for (const attivitàList of this.mappa.values()) 
            if (attivitàList.some(a => a.nomeAttività === attività.nomeAttività && a.dataAttività === attività.dataAttività))
                return false;
        if (!this.mappa.has(categoria))
            this.mappa.set(categoria, [attività]);
        else
            this.mappa.get(categoria).push(attività);
        return true;
    }
    eliminaAttività(attivitàDaEliminare) {
        for (const [categoria, attivitàList] of this.mappa.entries()) {
            const indice = attivitàList.findIndex(a => a.nomeAttività === attivitàDaEliminare.nomeAttività && a.dataAttività === attivitàDaEliminare.dataAttività);
            if (indice !== -1) {
                attivitàList.splice(indice, 1);
                // Se trovi l'attività e la elimini, controlla se la lista è vuota e se la categoria può essere eliminata
                if (attivitàList.length === 0 && categoria !== 'Lavoro' && categoria !== 'Personale' && categoria !== 'Hobby') {
                    this.mappa.delete(categoria);
                }
                return;
            }
        }
    }
    ricercaAttività(paroleChiave) {
        const paroleChiaveLower = paroleChiave.toLowerCase();
        const risultatiMappa = new Map();
        for (const [categoria, attivitàList] of this.mappa.entries()) {
            const risultati = attivitàList.filter(attività => {
                const nomeAttività = attività.nomeAttività.toLowerCase();
                if (paroleChiaveLower.length === 1)
                    return nomeAttività.startsWith(paroleChiaveLower);
                else
                    return nomeAttività.includes(paroleChiaveLower);
            });
            if (risultati.length > 0) {
                risultatiMappa.set(categoria, risultati);
            }
        }
        if (Array.from(risultatiMappa.keys()).length === 0) {
            console.log("\n                       ════════════════════════════════════");
            console.log("                       !!!NESSUNA CORRISPONDENZA TROVATA!!!");
            console.log("                       ════════════════════════════════════\n");
            prompt("                        PREMERE INVIO PER CONTINUARE ...")
        }
        return risultatiMappa;
    }
    modificaAttività(vecchiaNomeAttività, nuovoNomeAttività, nuovaDataAttività) {
        for (const [categoria, attivitàList] of this.mappa.entries()) {
            const indice = attivitàList.findIndex(a => a.nomeAttività === vecchiaNomeAttività);
            if (indice !== -1) {
                if (nuovoNomeAttività) {
                    attivitàList[indice].nomeAttività = nuovoNomeAttività;
                }
                if (nuovaDataAttività) {
                    attivitàList[indice].dataAttività = nuovaDataAttività;
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Marca un'attività come completata.
     * @param {string} nomeAttività - Il nome dell'attività da marcare.
     * @returns {boolean} - True se l'attività è stata marcata, altrimenti false.
     */
    marcaAttività(nomeAttività) {
        for (const [categoria, attivitàList] of this.mappa.entries()) {
            const indice = attivitàList.findIndex(a => a.nomeAttività === nomeAttività);
            if (indice !== -1) {
                attivitàList[indice].marcaturaAttività = true;
                return true;
            }
        }
        return false;
    }
    visualizzaTutte() {
        this.stampaMappa(this.mappa);
    }
    stampaMappa(mappa) {
        for (const [categoria, attivitàList] of mappa.entries()) {
            console.log("                    ════════════════════════════════════════════");
            console.log(`                      - ${categoria}`);
            if (attivitàList.length > 0) {
                let c = 0;
                // Visualizza attività non marcate
                for (let i = 0; i < attivitàList.length; i++) {
                    if (!attivitàList[i].marcaturaAttività) {
                        c++;
                        console.log(`                      ${c}. ${attivitàList[i].nomeAttività} (${attivitàList[i].dataAttività})`);
                    }
                }
                // Visualizza attività marcate
                for (let k = 0; k < attivitàList.length; k++) {
                    if (attivitàList[k].marcaturaAttività) {
                        c++;
                        console.log(`                      ${c}. \x1b[9m${attivitàList[k].nomeAttività} (${attivitàList[k].dataAttività})\x1b[0m`);
                    }
                }
            } else
                console.log('                        Nessuna attività');
        }
        console.log("                    ════════════════════════════════════════════\n");
    }
}
function testoValoreNonValido() {
    console.log("\n                               ═══════════════════════");
    console.log("                               !!!VALORE NON VALIDO!!!");
    console.log("                               ═══════════════════════\n");
}
/**
 * @description Questa funzione prende un array di oggetti attività e lo converte in una stringa JSON.
 * Successivamente, scrive questa stringa in un file chiamato "promemoria.json" nella cartella "src".
 * Se il file non esiste, viene creato. Se esiste già, viene sovrascritto.
 * @param {Array<Attività>} attività - L'array di oggetti Attività da salvare.
 */
function salvaAttivitàSuFile(attività) {
    fs.writeFileSync("src/promemoria.json", JSON.stringify(Array.from(attività.mappa.entries())));
}
/**
 * @description Questa funzione legge un file JSON contenente attività e le restituisce come array di oggetti. 
 * Se si verifica un errore durante la lettura del file, restituisce un array vuoto.
 * @returns {Array} - Array di oggetti attività.
 */
function leggiAttivitàDaFile() {
    const promemoria = new Promemoria();
    try {
        const datiJSON = fs.readFileSync("src/promemoria.json", 'utf8');
        promemoria.mappa = new Map(JSON.parse(datiJSON));
        return promemoria;
    } catch (errore) {
        return promemoria;
    }
}
function formattaData() {
    let dataAttività, controllo = false;
    do {
        dataAttività = prompt("                    DATA (D/M/YY) > ");
        let parti = dataAttività.split('/');
        if (parti.length !== 3) {
            testoValoreNonValido();
            continue;
        }
        let giorno = parseInt(parti[0], 10);
        let mese = parseInt(parti[1], 10);
        let anno = parseInt(parti[2], 10);
        // Verifica se il parsing dei numeri ha restituito valori validi
        if (isNaN(giorno) || isNaN(mese) || isNaN(anno)) {
            testoValoreNonValido();
            continue;
        }

        if (parti[2].length === 1||parti[2].length === 3) {
            testoValoreNonValido();
            continue;
        } else if (parti[2].length === 2) {
            anno += 2000;
        }

        // Verifica la validità del giorno e del mese
        if (giorno < 1 || giorno > 31 || mese < 1 || mese > 12) {
            testoValoreNonValido();
            continue;
        }
        // Aggiunge zero iniziale se necessario per giorno e mese
        if (giorno < 10) giorno = '0' + giorno;
        if (mese < 10) mese = '0' + mese;
        // Se tutte le condizioni sono soddisfatte, imposta controllo a true e ritorna la data formattata
        controllo = true;
        return giorno + '/' + mese + '/' + anno;
    } while (!controllo);
}


/**
 * @description Questa funzione permette di aggiungere una nuova attività all'elenco.
 * @param {Array} vet - Array di oggetti attività.
 */
function aggiungiAttività(promemoria) {
    console.clear(); // Pulisce la console per una visualizzazione pulita
    console.log("                    ╔══════════════════════════════════════════╗");
    console.log("                    ║      ___            _                _   ║");
    console.log("                    ║     / _ |___ ____ _(_)_ _____  ___ _(_)  ║");
    console.log("                    ║    / __ / _ `/ _ `/ / // / _ \\/ _ `/ /   ║");
    console.log("                    ║   /_/ |_\\_, /\\_, /_/\\_,_/_//_/\\_, /_/    ║");
    console.log("                    ║         \\__//\\__/            \\__/        ║");
    console.log("                    ║                                          ║");
    console.log("                    ╚══════════════════════════════════════════╝\n");
    promemoria.visualizzaTutte();
    let categoriaAttività;
    let nomeAttività;
    // Ciclo per richiedere la categoria finché non è valida (non vuota)
    do {
        categoriaAttività = prompt("                    CATEGORIA > ");
        categoriaAttività = categoriaAttività.charAt(0).toUpperCase() + categoriaAttività.slice(1).toLowerCase();
        if (categoriaAttività.length === 0)
            testoValoreNonValido();
    } while (categoriaAttività.length === 0);
    console.log();
    // Ciclo per richiedere il nome dell'attività finché non è valido (non vuoto)
    do {
        nomeAttività = prompt("                    NOME > ");
        nomeAttività = nomeAttività.charAt(0).toUpperCase() + nomeAttività.slice(1).toLowerCase();
        if (nomeAttività.length === 0) 
            testoValoreNonValido();
    } while (nomeAttività.length === 0);

    console.log();
    let dataAttività=formattaData();
    let controlloDoppioni=promemoria.aggiungiAttività(categoriaAttività, new Attività(nomeAttività, dataAttività));
    if(controlloDoppioni===true){
        console.log("\n                           ═══════════════════════════════");
        console.log("                           ATTIVITÀ AGGIUNTA CON SUCCESSO!");
        console.log("                           ═══════════════════════════════\n");
        prompt("                           PREMERE INVIO PER CONTINUARE ...");
    }else{
        console.log("\n ══════════════════════════════════════════════════════════════════════════════════");
        console.log(" !!!ATTENZIONE, DUE ATTIVITÀ CON LO STESSO NOME NON POSSONO AVERE LA STESSA DATA!!!");
        console.log(" ══════════════════════════════════════════════════════════════════════════════════\n");
        prompt("                           PREMERE INVIO PER CONTINUARE ...");
        aggiungiAttività(promemoria);     
    }
}
function selezionaAttivitàNeiRisultati(promemoria,risultati, attività) {
    let attivitàSelezionata;
    if(attività.length>0){
        if (Array.from(risultati.keys()).length === 1 && Array.from(risultati.values())[0].length === 1) {
            // Esattamente una attività trovata
            attivitàSelezionata = new Attività(
                Array.from(risultati.values())[0][0].nomeAttività,
                Array.from(risultati.values())[0][0].dataAttività
            );
        } else {
            console.clear();
            console.log("\n    ════════════════════════════════════════════════════════════════════════════");
            console.log("    !!!ATTENZIONE, LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE CON LA DATA!!!");
            console.log("    ════════════════════════════════════════════════════════════════════════════\n");
            promemoria.stampaMappa(risultati);
            let dataAttività;
            let categoria;
            do {
                dataAttività = formattaData();
                categoria = Array.from(risultati).find(([key, value]) => {
                    return value.some(activity => activity.dataAttività === dataAttività);
                });
                if (!categoria) 
                    testoValoreNonValido();
            } while (!categoria);

                attivitàSelezionata = new Attività(attività, dataAttività);
        }
        console.clear();
        console.log("\n                                 ══════════════════");
        console.log("                                  ATTIVITÀ TROVATA ");
        console.log("                                 ══════════════════\n");
        let categoria = null;
        risultati.forEach((val, key) => {
            if (val.some(activity => activity.nomeAttività === attivitàSelezionata.nomeAttività && activity.dataAttività === attivitàSelezionata.dataAttività)) {
                categoria = key;
                return;
            }
        });
        promemoria.stampaMappa(new Map([[categoria, [attivitàSelezionata]]]));
        return attivitàSelezionata;
    }else{
        testoValoreNonValido();
        prompt("                           PREMERE INVIO PER CONTINUARE ...");
        return null;
    }
}
/**
 * @description Questa funzione permette di cercare e cancellare un'attività dall'elenco.
 * @param {Array} vet - Array di oggetti attività.
 */
function cancellaAttività(promemoria) {
    console.clear();
    let attivitàDaEliminare;
    console.log("                      ╔═════════════════════════════════════╗");
    console.log("                      ║    _____                  ____      ║");
    console.log("                      ║   / ___/__ ____  _______ / / /__ _  ║");
    console.log("                      ║  / /__/ _  / _ \\/ __/ -_) / / _  /  ║");
    console.log("                      ║  \\___/\\___/_//_/\\__/\\__/_/_/\\___/   ║");
    console.log("                      ║                                     ║");
    console.log("                      ╚═════════════════════════════════════╝\n");
    promemoria.visualizzaTutte();
    let attività = prompt("                      ATTIVITÀ > ");
    attività = attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase()
    let risultati = promemoria.ricercaAttività(attività);
    if (Array.from(risultati.keys()).length > 0) {
        let conferma;
        attivitàDaEliminare = selezionaAttivitàNeiRisultati(promemoria,risultati, attività);
        if(attivitàDaEliminare!==null){
            do {
                console.log("                         ┌─────────────────────────────────┐");
                console.log("                         │ VUOI ELIMINARE?                 │");
                console.log("                         │ 1 : SÌ                          │");
                console.log("                         │ 2 : NO                          │");
                console.log("                         └─────────────────────────────────┘")
                conferma = parseInt(prompt("                          > "));
                switch (conferma) {
                    case 1: {
                        promemoria.eliminaAttività(attivitàDaEliminare);
                        console.log("\n                        ══════════════════════════════════════");
                        console.log("                        !!!ATTIVITÀ CANCELLATA CON SUCCESSO!!!");
                        console.log("                        ══════════════════════════════════════\n");
                        break;
                    }
                    case 2: {
                        console.log("\n                               ══════════════════════════");
                        console.log("                               !!!OPERAZIONE ANNULLATA!!!");
                        console.log("                               ══════════════════════════\n");
                        break;
                    }
                    default: {
                        testoValoreNonValido()
                        break;
                    }
                }
                prompt("                           PREMERE INVIO PER CONTINUARE ...");
                console.clear();
            } while (conferma !== 1 && conferma !== 2);
        }
    } 
}

/**
 * @description Questa funzione permette di modificare il nome di un'attività specifica cercata dall'utente. 
 * L'utente può cercare un'attività, confermare la modifica e inserire un nuovo nome per l'attività. 
 * Le modifiche vengono salvate nel file delle attività.
 * @param {Array} vet - Array di oggetti attività.
 */
function modificaAttività(promemoria) {
    let attivitàDaModificare;
    console.clear();
    console.log("              ╔═════════════════════════════════════════════════════╗");
    console.log("              ║       __  _______  ____  _______________________    ║");
    console.log("              ║      /  |/  / __ \\/ __ \\/  _/ ____/  _/ ____/   |   ║");
    console.log("              ║     / /|_/ / / / / / / // // /_   / // /   / /| |   ║");
    console.log("              ║    / /  / / /_/ / /_/ // // __/ _/ // /___/ ___ |   ║");
    console.log("              ║   /_/  /_/\\____/_____/___/_/   /___/\\____/_/  |_|   ║");
    console.log("              ║                                                     ║");
    console.log("              ╚═════════════════════════════════════════════════════╝\n");
    promemoria.visualizzaTutte();
    let attività = prompt("              ATTIVITÀ > ");
    attività=attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase();
    let risultati = promemoria.ricercaAttività(attività);
    if (Array.from(risultati.keys()).length > 0) {
        let conferma;
        attivitàDaModificare = selezionaAttivitàNeiRisultati(promemoria, risultati, attività);
        if(attivitàDaModificare!==null){
            do {
                console.log("                            ┌───────────────────────────┐");
                console.log("                            │COSA DESIDERI MODIFICARE ? │");
                console.log("                            │1: NOME                    │");
                console.log("                            │2: DATA                    │");
                console.log("                            │3: ENTRAMBI (NOME E DATA)  │");
                console.log("                            │4: TORNA INDIETRO          │");
                console.log("                            └───────────────────────────┘");
                conferma = parseInt(prompt("                             > "));
                let nomeAttività=attivitàDaModificare.nomeAttività;
                switch (conferma) {
                    case 3:
                    case 1: {
                        console.log("\n                                ═══════════════════════");
                        console.log("                                INSERISCI IL NUOVO NOME");
                        console.log("                                ═══════════════════════");
                        nomeAttività = prompt("                                > ");
                        nomeAttività = nomeAttività.charAt(0).toUpperCase() + nomeAttività.slice(1).toLowerCase()
                        promemoria.modificaAttività(attivitàDaModificare.nomeAttività, nomeAttività, null);
                        console.log("\n                     ═══════════════════════════════════════════");
                        console.log("                     NOME DELL'ATTIVITÀ MODIFICATO CON SUCCESSO!");
                        console.log("                     ═══════════════════════════════════════════\n");
                        if(conferma!==3)break;
                    }
                    case 2: {
                        let dataAttività;
                        let contatore = 0;
                        do{
                            contatore = 0;
                            console.log("\n                           ════════════════════════════════");
                            console.log("                           INSERISCI LA NUOVA DATA (D/M/YY)");
                            console.log("                           ════════════════════════════════\n");
                            dataAttività = formattaData();
                            promemoria.mappa.forEach(attivitàList => {
                                attivitàList.forEach(att => {
                                    if (att.nomeAttività===nomeAttività&&att.dataAttività === dataAttività) 
                                        contatore++;
                                });
                            });
                            if(contatore>0)
                            {
                                console.clear();
                                console.log("\n ══════════════════════════════════════════════════════════════════════════════════");
                                console.log(" !!!ATTENZIONE, DUE ATTIVITÀ CON LO STESSO NOME NON POSSONO AVERE LA STESSA DATA!!!");
                                console.log(" ══════════════════════════════════════════════════════════════════════════════════\n");
                                promemoria.stampaMappa(risultati);
                            }
                        }while(contatore>0);
                        promemoria.modificaAttività(attivitàDaModificare.nomeAttività, null, dataAttività);
                        console.log("\n                      ═══════════════════════════════════════════");
                        console.log("                      DATA DELL'ATTIVITÀ MODIFICATA CON SUCCESSO!");
                        console.log("                      ═══════════════════════════════════════════\n");
                        break;
                    }
                    case 4: {
                        console.log("\n                                  ═══════════════════");
                        console.log("                                  MODIFICA ANNULLATA!");
                        console.log("                                  ═══════════════════\n");
                        break;
                    }
                    default: {
                        console.log("\n                                ═══════════════════════");
                        console.log("                                !!!SCELTA NON VALIDA!!!");
                        console.log("                                ═══════════════════════\n");
                        break;
                    }
                }
                prompt("                            PREMERE INVIO PER CONTINUARE ...")
                console.clear();
            } while (conferma !== 1 && conferma !== 2 && conferma !== 3 && conferma !== 4);
        }
    } 
}
/**
 * @description Questa funzione permette di marcare un'attività come completata. 
 * L'utente può cercare un'attività specifica e, se trovata, marcare la sua conclusione. 
 * Se l'attività è già segnata come completata, viene mostrato un messaggio di errore. 
 * La funzione aggiorna il file delle attività se l'operazione di marcatura è completata con successo.
 * @param {Array} vet - Array di oggetti attività.
 */
function marcaturaAttività(promemoria) {
    console.clear();
    console.log("                ╔═════════════════════════════════════════════════╗");
    console.log("                ║     __  ___                  __                 ║");
    console.log("                ║    /  |/  /__ ____________ _/ /___ ___________  ║");
    console.log("                ║   / /|_/ / _ `/ __/ __/ _ `/ __/ // / __/ _ `/  ║");
    console.log("                ║  /_/  /_/\\_,_/_/  \\__/\\_,_/\\__/\\_,_/_/  \\_,_/   ║");
    console.log("                ║                                                 ║");
    console.log("                ╚═════════════════════════════════════════════════╝\n");
    promemoria.visualizzaTutte();
    let attività = prompt("                ATTIVITÀ > ");
    attività = attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase();
    let risultati = promemoria.ricercaAttività(attività);
    if (Array.from(risultati.keys()).length > 0) {
        let conferma;
        attivitàDaMarcare = selezionaAttivitàNeiRisultati(promemoria, risultati, attività);
        if(attivitàDaMarcare!==null){
            do {
                console.log("                            ┌──────────────────────────┐");
                console.log("                            │SEGNARE COME COMPLETATA?  │");
                console.log("                            │1: SÌ                     │");
                console.log("                            │2: ANNULLA                │");
                console.log("                            └──────────────────────────┘");
                conferma = parseInt(prompt("                            > "));
                switch (conferma) {
                    case 1: {
                        promemoria.marcaAttività(attivitàDaMarcare.nomeAttività)
                        console.log("\n                           ═══════════════════════════════");
                        console.log("                            ATTIVITÀ SEGNATA COME SVOLTA!");
                        console.log("                           ═══════════════════════════════\n");
                        break;
                    }
                    case 2: {
                        console.log("\n                           ═══════════════════════════════");
                        console.log("                            MODIFICA MARCATURA ANNULLATA!");
                        console.log("                           ═══════════════════════════════\n");
                        break;
                    }
                    default: {
                        console.log("\n                              ═══════════════════════");
                        console.log("                              !!!SCELTA NON VALIDA!!!");
                        console.log("                              ═══════════════════════\n");
                        break;
                    }
                }
                prompt("                          PREMERE INVIO PER CONTINUARE ...");
                console.clear();
            } while (conferma !== 1 && conferma !== 2);
        }
    }
}
/**
 * @description Questa funzione gestisce il menu di modifica dell'applicazione. 
 * Mostra un sottomenu con opzioni per aggiungere, cancellare, modificare o marcare le attività. 
 * L'utente può selezionare un'opzione inserendo il numero corrispondente. Utilizza un ciclo 
 * do-while per mantenere il sottomenu attivo fino a quando l'utente sceglie di tornare indietro.
 */
function menuModifica(promemoria) {
    let scelta = 0;
    do {
        console.clear();
        console.log("               ╔══════════════════════════════════════════════════════╗");
        console.log("               ║      _______________________________  _   ________   ║");
        console.log("               ║     / ____/ ____/ ___/_  __/  _/ __ \\/ | / / ____/   ║");
        console.log("               ║    / / __/ __/  \\__ \\ / /  / // / / /  |/ / __/      ║");
        console.log("               ║   / /_/ / /___ ___/ // / _/ // /_/ / /|  / /___      ║");
        console.log("               ║   \\____/_____//____//_/ /___/\\____/_/ |_/_____/      ║");
        console.log("               ║                                                      ║")
        console.log("               ╚══════════════════════════════════════════════════════╝");
        console.log("\n                             ┌────────────────────────┐");
        console.log("                             │1: AGGIUNGI ATTIVITÀ    │");
        console.log("                             │2: CANCELLA ATTIVITÀ    │");
        console.log("                             │3: MODIFICA ATTIVITÀ    │");
        console.log("                             │4: MARCATURA ATTIVITÀ   │");
        console.log("                             │5: INDIETRO             │");
        console.log("                             └────────────────────────┘\n");
        scelta = parseInt(prompt("                             > "));
        vet = leggiAttivitàDaFile(); // Legge le attività da un file e le memorizza in un array in modo che sia sempre aggiornato
        switch (scelta) {
            case 1: {
                aggiungiAttività(promemoria); // Chiamata alla funzione per aggiungere un'attività
                break;
            }
            case 2: {
                cancellaAttività(promemoria); // Chiamata alla funzione per cancellare un'attività
                break;
            }
            case 3: {
                modificaAttività(promemoria); // Chiamata alla funzione per modificare un'attività
                break;
            }
            case 4: {
                marcaturaAttività(promemoria); // Chiamata alla funzione per marcare un'attività
                break;
            }
            case 5: {
                break;
            }
            default:
                {
                    testoValoreNonValido();
                    prompt("                          PREMERE INVIO PER CONTINUARE ...");
                    break;
                }
        }
    } while (scelta !== 5);
}
/**
 * @description Stampa se ci sono attività nel file l'elenco delle attività richiamando 
 * la funzione 'visualizzaAttività(vet)'
 */
function elencoAttività(promemoria) {
    console.clear();
    console.log("                          ╔═══════════════════════════════╗");
    console.log("                          ║     ______                    ║");
    console.log("                          ║    / __/ /__ ___  _______     ║");
    console.log("                          ║   / _// / -_) _ \\/ __/ _ \\    ║");
    console.log("                          ║  /___/_/\\__/_//_/\\__/\\___/    ║");
    console.log("                          ║                               ║");
    console.log("                          ╚═══════════════════════════════╝\n");
    promemoria.visualizzaTutte();
    prompt("                           PREMERE INVIO PER CONTINUARE ...");
}
/**
 * @description Stampa decorativa della parola ricerca e ricerca attività nel file json
 */
function trovaAttività(promemoria) {
    console.clear();
    console.log("                       ╔═══════════════════════════════════╗");
    console.log("                       ║     ___  _                        ║");
    console.log("                       ║    / _ \\(_)______ ___________ _   ║");
    console.log("                       ║   / , _/ / __/ -_) __/ __/ _ `/   ║");
    console.log("                       ║  /_/|_/_/\\__/\\__/_/  \\__/\\_,_/    ║");
    console.log("                       ║                                   ║")
    console.log("                       ╚═══════════════════════════════════╝\n");
    let attività = prompt("                       ATTIVITÀ > ");
    console.log();
    let risultati = promemoria.ricercaAttività(attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase());
    if ((risultati.size != 0)) {
        promemoria.stampaMappa(risultati);
        prompt("                       PREMERE INVIO PER CONTINUARE ...")
    }
}

function parseDate(dataAttività) {
    const [day, month, year] = dataAttività.split('/');
    return new Date(year, month - 1, day);
}

function notificheAttività(promemoria) {
    console.clear();
    console.log("                  ╔═════════════════════════════════════════╗");
    console.log("                  ║                                         ║");
    console.log("                  ║     _  __     __  _ ____     __         ║");
    console.log("                  ║    / |/ /__  / /_(_) _(_)___/ /  ___    ║");
    console.log("                  ║   /    / _ \\/ __/ / _/ / __/ _ \\/ -_)   ║");
    console.log("                  ║  /_/|_/\\___/\\__/_/_//_/\\__/_//_/\\__/    ║");
    console.log("                  ║                                         ║")
    console.log("                  ╚═════════════════════════════════════════╝\n");

    let vuoto = true;
    // per controllare se le categorie sono vuote
    promemoria.mappa.forEach((attivitàList) => {
        if (attivitàList.length > 0) 
            vuoto = false;
    });
    if (vuoto) {
        console.log("                      ╔═════════════════════════════════╗");
        console.log("                      ║Nessuna notifica da visualizzare.║");
        console.log("                      ╚═════════════════════════════════╝");
        prompt("\n                       PREMERE INVIO PER CONTINUARE ...");
        return;
    }
    // Prendo la data corrente
    const currentDate = new Date();
    // Imposto la data a mezzanotte per poi confrontarla
    currentDate.setHours(0, 0, 0, 0);

    // vettori per memorizzare le attività utile per la stampa finale ordinata
    const scadenzaOggi = [];
    const inScadenza = [];
    const scadute = [];
    const completate = [];

    promemoria.mappa.forEach((attivitàList, key) => {
        attivitàList.forEach((attività) => {
            const inputDate = parseDate(attività.dataAttività);

            if (isNaN(inputDate.getTime())) {
                console.log(`La data per ${attività.nomeAttività} (${key}) non è valida.`);
            } else {
                // imposto anche qui la data a mezzanotter per il confronto equo
                inputDate.setHours(0, 0, 0, 0);
                if (attività.marcaturaAttività) 
                    completate.push(`\x1b[31m       L'attività : \x1b[9m (${key}) ${attività.nomeAttività}\x1b è stata completata.\x1b[0m`);
                else if (inputDate.getTime() === currentDate.getTime()) 
                    scadenzaOggi.push(`\x1b[33m       L'attività : (${key}) ${attività.nomeAttività} è in scadenza oggi.\x1b[0m`);
                else if (inputDate.getTime() > currentDate.getTime()) 
                    inScadenza.push(`\x1b[32m       L'attività : (${key}) ${attività.nomeAttività} è in scadenza ${attività.dataAttività}.\x1b[0m`);
                else 
                    scadute.push(`\x1b[31m       L'attività : (${key}) ${attività.nomeAttività} è scaduta il ${attività.dataAttività}.\x1b[0m`);
            }
        });
    });
    //stampo in ordine le attività
    scadenzaOggi.forEach((msg) => console.log(msg));
    inScadenza.forEach((msg) => console.log(msg));
    scadute.forEach((msg) => console.log(msg));
    completate.forEach((msg) => console.log(msg));
    prompt("\n                       PREMERE INVIO PER CONTINUARE ...");
}
/**
 * @description Questa funzione gestisce il menu di visualizzazione dell'applicazione. 
 * Mostra un sottomenu con opzioni per visualizzare l'elenco delle attività, 
 * cercare un'attività specifica, o tornare indietro al menu principale. 
 * Utilizza un ciclo do-while per mantenere il sottomenu attivo fino a quando 
 * l'utente sceglie di tornare indietro.
 */
function menuVisualizzazione(promemoria) {
    let scelta = 0;
    do {
        console.clear();
        console.log("          ╔════════════════════════════════════════════════════════════════╗");
        console.log("          ║    _    ___________ __  _____    __    ______________   ___    ║");
        console.log("          ║   | |  / /  _/ ___// / / /   |  / /   /  _/__  /__  /  /   |   ║");
        console.log("          ║   | | / // / \\__ \\/ / / / /| | / /    / /   / /  / /  / /| |   ║");
        console.log("          ║   | |/ // / ___/ / /_/ / ___ |/ /____/ /   / /__/ /__/ ___ |   ║");
        console.log("          ║   |___/___//____/\\____/_/  |_/_____/___/  /____/____/_/  |_|   ║");
        console.log("          ║                                                                ║");
        console.log("          ╚════════════════════════════════════════════════════════════════╝");
        console.log("\n                          ┌──────────────────────────────┐");
        console.log("                          │1: VISUALIZZA ELENCO ATTIVITÀ │");
        console.log("                          │2: RICERCA UN'ATTIVITÀ        │");
        console.log("                          │3: NOTIFICHE                  │");
        console.log("                          │4: INDIETRO                   │");
        console.log("                          └──────────────────────────────┘\n");
        scelta = parseInt(prompt("                          > "));
        switch (scelta) {
            case 1: {
                elencoAttività(promemoria);
                break;
            }
            case 2: {
                trovaAttività(promemoria);
                break;
            }
            case 3: {
                notificheAttività(promemoria);
                break;
            }
            case 4: {
                break;
            }
            default:
                testoValoreNonValido()
                prompt("                         PREMERE INVIO PER CONTINUARE ...");
                break;
        }
    } while (scelta !== 4);
}
/**
 * @description Funzione main che gestisce il menu principale dell'applicazione.
 * Mostra un menu con tre opzioni: gestire le attività, visualizzare le attività, o uscire dall'applicazione.
 * L'utente può selezionare un'opzione inserendo il numero corrispondente.
 * La funzione utilizza un ciclo do-while per mantenere il menu attivo fino a quando l'utente sceglie di uscire.
 */
function main() {
    let scelta = 0;
    let promemoria = leggiAttivitàDaFile();
    do {
        console.clear(); // Pulisce la console per un aspetto pulito
        console.log("      ╔══════════════════════════════════════════════════════════════════════╗");
        console.log("      ║       ____  ____  ____  __  ___ _______  ___ ___  ____  ____ ___     ║");
        console.log("      ║      / __ \\/ __ \\/ __ \\/  |/  / ____/  |/  / __ \\/ __ \\/  _/   |     ║");
        console.log("      ║     / /_/ / /_/ / / / / /|_/ / __/ / /|_/ / / / / /_/ // // /| |     ║");
        console.log("      ║    / ____/ _, _/ /_/ / /  / / /___/ /  / / /_/ / _, _// // ___ |     ║");
        console.log("      ║   /_/   /_/ |_|\\____/_/  /_/_____/_/  /_/\\____/_/ |_/___/_/  |_|     ║");
        console.log("      ║                                                                      ║");
        console.log("      ╚══════════════════════════════════════════════════════════════════════╝");
        console.log("\n                             ┌─────────────────────────┐")
        console.log("                             │    SCEGLI COSA FARE     │");
        console.log("                             │1: GESTISCI ATTIVITÀ     │");
        console.log("                             │2: VISUALIZZA ATTIVITÀ   │");
        console.log("                             │3: SALVA ED ESCI         │");
        console.log("                             └─────────────────────────┘\n");
        scelta = parseInt(prompt("                             > "));
        switch (scelta) {
            case 1: {
                menuModifica(promemoria);
                break;
            }
            case 2: {
                menuVisualizzazione(promemoria);
                break;
            }
            case 3: {
                salvaAttivitàSuFile(promemoria);
                break;
            }
            default:
                testoValoreNonValido()
                prompt("                          PREMERE INVIO PER CONTINUARE ...");
                break;
        }
    } while (scelta !== 3);
    console.clear();
}
main();
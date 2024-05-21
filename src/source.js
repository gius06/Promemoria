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
        if (!this.mappa.has(categoria)) 
            this.mappa.set(categoria, [attività]);
        else
            this.mappa.get(categoria).push(attività);
    }
    eliminaAttività(nomeAttività) {
        let attivitàEliminata = false;
        for (const [categoria, attivitàList] of this.mappa.entries()) {
            const indice = attivitàList.findIndex(a => a.nomeAttività === nomeAttività);
            if (indice !== -1) {
                attivitàList.splice(indice, 1);
                attivitàEliminata = true;
            }
        }
        return attivitàEliminata;
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
        if(Array.from(risultatiMappa.keys()).length===0)
        {
                console.log("\n              ════════════════════════════════════");
                console.log("              !!!NESSUNA CORRISPONDENZA TROVATA!!!");
                console.log("              ════════════════════════════════════\n");
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
            console.log(`\n               Categoria => ${categoria}`);
            if (attivitàList.length > 0) {
                let c = 0;
                // Visualizza attività non marcate
                for (let i = 0; i < attivitàList.length; i++) {
                    if (!attivitàList[i].marcaturaAttività) {
                        c++;
                        console.log(`                   - ${c}. ${attivitàList[i].nomeAttività} (${attivitàList[i].dataAttività})`);
                    }
                }
                // Visualizza attività marcate
                for (let k = 0; k < attivitàList.length; k++) {
                    if (attivitàList[k].marcaturaAttività) {
                        c++;
                        console.log(`                   - ${c}. \x1b[9m${attivitàList[k].nomeAttività} (${attivitàList[k].dataAttività})\x1b[0m`);
                    }
                }
            } else 
                console.log('                   Nessuna attività');
        }
    }
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
    const promemoria=new Promemoria();
    try {
        const datiJSON = fs.readFileSync("src/promemoria.json", 'utf8'); 
        promemoria.mappa=new Map(JSON.parse(datiJSON)); 
        return promemoria;
    } catch (errore) {
        return promemoria; 
    }
}
function formattaData(input) {
    var parti = input.split('/');
    // Controlla se la stringa contiene tre parti
    if (parti.length !== 3) 
        return false;
    var giorno = parseInt(parti[0], 10);
    var mese = parseInt(parti[1], 10);
    var anno = parseInt(parti[2], 10);
    // Verifica se il parsing dei numeri ha restituito valori validi
    if (isNaN(giorno) || isNaN(mese) || isNaN(anno)) 
        return false;
    // Verifica se l'anno è a due cifre e lo converte in formato a quattro cifre
    if (anno < 100) 
        anno += 2000;
    // Verifica la validità del giorno e del mese
    if (giorno < 1 || giorno > 31 || mese < 1 || mese > 12) 
        return false;
    // Aggiunge zero iniziale se necessario per giorno e mese
    if (giorno < 10) 
        giorno = '0' + giorno;
    if (mese < 10) 
        mese = '0' + mese;
    return giorno + '/' + mese + '/' + anno;
}

/**
 * @description Questa funzione permette di aggiungere una nuova attività all'elenco.
 * @param {Array} vet - Array di oggetti attività.
 */
function aggiungiAttività(promemoria)
{
    console.clear(); // Pulisce la console per una visualizzazione pulita
    console.log("              ╔══════════════════════════════════════════╗");
    console.log("              ║      ___            _                _   ║"); 
    console.log("              ║     / _ |___ ____ _(_)_ _____  ___ _(_)  ║");
    console.log("              ║    / __ / _ `/ _ `/ / // / _ \\/ _ `/ /   ║"); 
    console.log("              ║   /_/ |_\\_, /\\_, /_/\\_,_/_//_/\\_, /_/    ║");  
    console.log("              ║         \\__//\\__/            \\__/        ║");
    console.log("              ║                                          ║");
    console.log("              ╚══════════════════════════════════════════╝\n");
    let categoriaAttività = prompt("              CATEGORIA > ");
    console.log();
    let nomeAttività = prompt("              NOME > ");
    console.log();
    let dataAttività;
    do{
        dataAttività = prompt("              DATA (D/M/Y) > ");
        if(formattaData(dataAttività)===false)
        {
            console.log("\n                      ═══════════════════════");
            console.log("                      !!!VALORE NON VALIDO!!!");
            console.log("                      ═══════════════════════\n");
        }
    }while(formattaData(dataAttività)===false);
    console.log();
    promemoria.aggiungiAttività(categoriaAttività.charAt(0).toUpperCase() + categoriaAttività.slice(1).toLowerCase(),new Attività(nomeAttività.charAt(0).toUpperCase() + nomeAttività.slice(1).toLowerCase(),formattaData(dataAttività))); 
    console.log("\n                   ═══════════════════════════════");                     
    console.log("                   ATTIVITÀ AGGIUNTA CON SUCCESSO!");
    console.log("                   ═══════════════════════════════\n"); 
    prompt("                  PREMERE INVIO PER CONTINUARE ...");
}
/**
 * @description Questa funzione permette di cercare e cancellare un'attività dall'elenco.
 * @param {Array} vet - Array di oggetti attività.
 */
function cancellaAttività(promemoria) {
    console.clear();
    console.log("              ╔═════════════════════════════════════╗");
    console.log("              ║    _____                  ____      ║");    
    console.log("              ║   / ___/__ ____  _______ / / /__ _  ║");
    console.log("              ║  / /__/ _  / _ \\/ __/ -_) / / _  /  ║");
    console.log("              ║  \\___/\\___/_//_/\\__/\\__/_/_/\\___/   ║");
    console.log("              ║                                     ║");
    console.log("              ╚═════════════════════════════════════╝\n\n");
    let attività=prompt("              ATTIVITÀ > ");
    let risultati = promemoria.ricercaAttività(attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase());
    if (Array.from(risultati.keys()).length===1) { // Controlla se è stata trovata esattamente una attività
        let conferma;
        do {
            console.log("\n                        ══════════════════");
            console.log("                         ATTIVITÀ TROVATA ");
            console.log("                        ══════════════════\n");
            promemoria.stampaMappa(risultati);
            console.log("\n                 ┌─────────────────────────────────┐");
            console.log("                 │ VUOI ELIMINARE?                 │");
            console.log("                 │ 1 : SÌ                          │");
            console.log("                 │ 2 : NO                          │");
            console.log("                 └─────────────────────────────────┘")
            conferma = parseInt(prompt("                 > " ));
            switch (conferma) {
                case 1: {
                    promemoria.eliminaAttività(attività);
                    console.log("\n                ══════════════════════════════════════");
                    console.log("                !!!ATTIVITÀ CANCELLATA CON SUCCESSO!!!");
                    console.log("                ══════════════════════════════════════\n");
                    break;
                }
                case 2: {
                    console.log("\n                       ══════════════════════════");
                    console.log("                       !!!OPERAZIONE ANNULLATA!!!");
                    console.log("                       ══════════════════════════\n");
                    break;
                }
                default: {
                    console.log("\n                      ═══════════════════════");
                    console.log("                      !!!VALORE NON VALIDO!!!");
                    console.log("                      ═══════════════════════\n");
                    break;
                }
            }
            prompt("                  PREMERE INVIO PER CONTINUARE ...")
            console.clear();
        } while (conferma !== 1 && conferma !== 2);
    } else if(Array.from(risultati.keys()).length>1){ // Gestisce il caso in cui la ricerca ritorni più di un risultato
        console.log("\n════════════════════════════════════════════════════════════════════════════");
        console.log("!!!ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE!!!");
        console.log("════════════════════════════════════════════════════════════════════════════");
        promemoria.stampaMappa(risultati);
        prompt("\n                 PREMERE INVIO PER CONTINUARE ...")
        cancellaAttività(promemoria); // Richiama la funzione per specificare meglio la ricerca
    }
}
/**
 * @description Questa funzione permette di modificare il nome di un'attività specifica cercata dall'utente. 
 * L'utente può cercare un'attività, confermare la modifica e inserire un nuovo nome per l'attività. 
 * Le modifiche vengono salvate nel file delle attività.
 * @param {Array} vet - Array di oggetti attività.
 */
function modificaAttività(promemoria) {
    console.clear();
    console.log("       ╔═════════════════════════════════════════════════════╗");
    console.log("       ║       __  _______  ____  _______________________    ║");      
    console.log("       ║      /  |/  / __ \\/ __ \\/  _/ ____/  _/ ____/   |   ║");     
    console.log("       ║     / /|_/ / / / / / / // // /_   / // /   / /| |   ║");      
    console.log("       ║    / /  / / /_/ / /_/ // // __/ _/ // /___/ ___ |   ║");      
    console.log("       ║   /_/  /_/\\____/_____/___/_/   /___/\\____/_/  |_|   ║");
    console.log("       ║                                                     ║");
    console.log("       ╚═════════════════════════════════════════════════════╝\n");
    let attività=prompt("              ATTIVITÀ > ");
    let risultati = promemoria.ricercaAttività(attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase());
    
    if (Array.from(risultati.keys()).length === 1) { // Controlla se è stata trovata esattamente una attività
        let conferma;
        do {
            console.log("\n                        ══════════════════");
            console.log("                         ATTIVITÀ TROVATA ");
            console.log("                        ══════════════════\n");
            promemoria.stampaMappa(risultati);
            console.log("\n                     ┌───────────────────────────┐");
            console.log("                     │COSA DESIDERI MODIFICARE ? │");
            console.log("                     │1: NOME                    │");
            console.log("                     │2: DATA                    │");
            console.log("                     │3: ENTRAMBI (NOME E DATA)  │");
            console.log("                     │4: TORNA INDIETRO          │");
            console.log("                     └───────────────────────────┘");
            conferma = parseInt(prompt("                     > "));
            switch (conferma) {
                case 1||3: {
                    console.log("\n                     ═══════════════════════");
                    console.log("                     INSERISCI IL NUOVO NOME");
                    console.log("                     ═══════════════════════");
                    risultati[0].nomeAttività = prompt("                     > "); // Modifica il nome dell'attività
                    salvaAttivitàSuFile(vet);
                    console.log("\n            ═══════════════════════════════════════════");
                    console.log("            NOME DELL'ATTIVITÀ MODIFICATO CON SUCCESSO!");
                    console.log("            ═══════════════════════════════════════════\n");
                }
                case 2||3: {
                    console.log("\n                     ═══════════════════════");
                    console.log("                     INSERISCI LA NUOVA DATA");
                    console.log("                     ════════════════════════");
                    promemoria.modificaAttività(Array.from(risultati.keys()).length)
                    console.log("\n            ═══════════════════════════════════════════");
                    console.log("            DATA DELL'ATTIVITÀ MODIFICATA CON SUCCESSO!");
                    console.log("            ═══════════════════════════════════════════\n");
                    break;
                }
                case 4 : {
                    console.log("\n                       ═══════════════════");
                    console.log("                       MODIFICA ANNULLATA!");
                    console.log("                       ═══════════════════\n");
                    break;
                }
                default: {
                    console.log("\n                     ═══════════════════════");
                    console.log("                     !!!SCELTA NON VALIDA!!!");
                    console.log("                     ═══════════════════════\n");
                    break;
                }
            }
            prompt("                  PREMERE INVIO PER CONTINUARE ...")
            console.clear();
        } while (conferma !== 1 && conferma !== 2);
    } else if(Array.from(risultati.keys()).length>1){ // Gestisce il caso in cui la ricerca ritorni più di un risultato
        console.log("\n════════════════════════════════════════════════════════════════════════════");
        console.log("!!!ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE!!!")
        console.log("════════════════════════════════════════════════════════════════════════════\n");
        visualizzaAttività(risultato); // Visualizza tutte le attività trovate
        prompt("\n                   PREMERE INVIO PER CONTINUARE ...");
        modificaAttività(vet); // Richiama la funzione per specificare meglio la ricerca
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
    console.log("\n       ╔═════════════════════════════════════════════════╗");
    console.log("       ║     __  ___                  __                 ║");               
    console.log("       ║    /  |/  /__ ____________ _/ /___ ___________  ║");
    console.log("       ║   / /|_/ / _ `/ __/ __/ _ `/ __/ // / __/ _ `/  ║");
    console.log("       ║  /_/  /_/\\_,_/_/  \\__/\\_,_/\\__/\\_,_/_/  \\_,_/   ║");
    console.log("       ║                                                 ║");
    console.log("       ╚═════════════════════════════════════════════════╝");
    let risultato = ricercaAttività(vet); // Effettua la ricerca dell'attività
    if (risultato.length === 1) { // Controlla se è stata trovata esattamente una attività
        console.log("\n                     ══════════════════");
        console.log("                      ATTIVITÀ TROVATA ");
        console.log("                     ══════════════════\n");
        visualizzaAttività(risultato); // Visualizza l'attività trovata
        prompt("\n                PREMERE INVIO PER CONTINUARE ...")
        console.clear();
        if(risultato[0].marcaturaAttività===true){ // Controlla se l'attività è già marcata come completata
            console.log("\n       ═════════════════════════════════════════════════════");
            console.log("       !!!ERRORE, NON PUOI MARCARE UN'ATTIVITÀ GIÀ SVOLTA!!!");
            console.log("       ═════════════════════════════════════════════════════\n");
                 prompt("                  PREMERE INVIO PER CONTINUARE ...")
                return;
        }
        else{
            let conferma;
            do {
                console.log("\n                  ┌──────────────────────────┐");
                console.log("                  │SEGNARE COME COMPLETATA?  │");
                console.log("                  │1: SÌ                     │");
                console.log("                  │2: ANNULLA                │");
                console.log("                  └──────────────────────────┘");
                conferma = parseInt(prompt("                  > "));
                switch (conferma) {
                    case 1: {
                            risultato[0].marcaturaAttività=true; // Marca l'attività come completata           
                            console.log("\n                  ═════════════════════════════");                     
                            console.log("                  ATTIVITÀ SEGNATA COME SVOLTA!");
                            console.log("                  ═════════════════════════════\n");
                            break;
                    }
                    case 2: {
                        console.log("\n                     ═════════════════════════════"); 
                        console.log("                     MODIFICA MARCATURA ANNULLATA!");
                        console.log("                     ═════════════════════════════"); 
                        break;
                    }
                    default: {
                        console.log("\n                     ═══════════════════════");
                        console.log("                     !!!SCELTA NON VALIDA!!!");
                        console.log("                     ═══════════════════════\n");
                        break;
                    }
                }
                prompt("                   PREMERE INVIO PER CONTINUARE ...");
                console.clear();
            } while (conferma !== 1 && conferma !== 2);
            salvaAttivitàSuFile(vet); // Salva le modifiche al file
        }
    } else if(risultato.length>1){ // Gestisce il caso in cui la ricerca ritorni più di un risultato
        console.log("\n════════════════════════════════════════════════════════════════════════════");
        console.log("!!!ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE!!!");
        console.log("════════════════════════════════════════════════════════════════════════════\n");
        visualizzaAttività(risultato); // Visualizza tutte le attività trovate
        prompt("\n                  PREMERE INVIO PER CONTINUARE ...");
        marcaturaAttività(vet); // Richiama la funzione per specificare meglio la ricerca
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
        console.log("       ╔══════════════════════════════════════════════════════╗");
        console.log("       ║      _______________________________  _   ________   ║");
        console.log("       ║     / ____/ ____/ ___/_  __/  _/ __ \\/ | / / ____/   ║");
        console.log("       ║    / / __/ __/  \\__ \\ / /  / // / / /  |/ / __/      ║");
        console.log("       ║   / /_/ / /___ ___/ // / _/ // /_/ / /|  / /___      ║");  
        console.log("       ║   \\____/_____//____//_/ /___/\\____/_/ |_/_____/      ║");
        console.log("       ║                                                      ║")
        console.log("       ╚══════════════════════════════════════════════════════╝");
        console.log("\n                     ┌────────────────────────┐");
        console.log("                     │1: AGGIUNGI ATTIVITÀ    │");
        console.log("                     │2: CANCELLA ATTIVITÀ    │");
        console.log("                     │3: MODIFICA ATTIVITÀ    │");
        console.log("                     │4: MARCATURA ATTIVITÀ   │");
        console.log("                     │5: INDIETRO             │");
        console.log("                     └────────────────────────┘\n");
        scelta = parseInt(prompt("                     > "));
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
                console.log("\n                       ═══════════════════════");
                console.log("                       !!!VALORE NON VALIDO!!!");
                console.log("                       ═══════════════════════\n");
                prompt("                  PREMERE INVIO PER CONTINUARE ...");
                break;
                }
        }
    } while (scelta !== 5);
}
/**
 * @description Stampa se ci sono attività nel file l'elenco delle attività richiamando 
 * la funzione 'visualizzaAttività(vet)'
 */
function elencoAttività(promemoria)
{
    console.clear();
    console.log("              ╔═══════════════════════════════╗");
    console.log("              ║     ______                    ║");               
    console.log("              ║    / __/ /__ ___  _______     ║"); 
    console.log("              ║   / _// / -_) _ \\/ __/ _ \\    ║");
    console.log("              ║  /___/_/\\__/_//_/\\__/\\___/    ║");
    console.log("              ║                               ║");
    console.log("              ╚═══════════════════════════════╝\n");
    promemoria.visualizzaTutte();
    prompt("\n                PREMERE INVIO PER CONTINUARE ...");
}
/**
 * @description Stampa decorativa della parola ricerca e ricerca attività nel file json
 */
function trovaAttività(promemoria)
{
    console.clear();
    console.log("              ╔═══════════════════════════════════╗");
    console.log("              ║     ___  _                        ║");                    
    console.log("              ║    / _ \\(_)______ ___________ _   ║");
    console.log("              ║   / , _/ / __/ -_) __/ __/ _ `/   ║");
    console.log("              ║  /_/|_/_/\\__/\\__/_/  \\__/\\_,_/    ║");
    console.log("              ║                                   ║")
    console.log("              ╚═══════════════════════════════════╝");
    let attività=prompt("              ATTIVITÀ > ");
    let risultati = promemoria.ricercaAttività(attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase());
    promemoria.stampaMappa(risultati);
    prompt("\n                 PREMERE INVIO PER CONTINUARE ...")
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
        console.log("       ╔════════════════════════════════════════════════════════════════╗");
        console.log("       ║    _    ___________ __  _____    __    ______________   ___    ║");
        console.log("       ║   | |  / /  _/ ___// / / /   |  / /   /  _/__  /__  /  /   |   ║");
        console.log("       ║   | | / // / \\__ \\/ / / / /| | / /    / /   / /  / /  / /| |   ║");
        console.log("       ║   | |/ // / ___/ / /_/ / ___ |/ /____/ /   / /__/ /__/ ___ |   ║");
        console.log("       ║   |___/___//____/\\____/_/  |_/_____/___/  /____/____/_/  |_|   ║");
        console.log("       ║                                                                ║");
        console.log("       ╚════════════════════════════════════════════════════════════════╝");
        console.log("\n                        ┌──────────────────────────────┐");
        console.log("                        │1: VISUALIZZA ELENCO ATTIVITÀ │");
        console.log("                        │2: RICERCA UN'ATTIVITÀ        │");
        console.log("                        │3: INDIETRO                   │");
        console.log("                        └──────────────────────────────┘\n");
        scelta = parseInt(prompt("                         > "));
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
                break;
            }
            default:
                console.log("\n                             ═══════════════════════");
                console.log("                             !!!VALORE NON VALIDO!!!");
                console.log("                             ═══════════════════════\n");
                prompt("                         PREMERE INVIO PER CONTINUARE ...");
                break;
        }
    } while (scelta !== 3);
}
/**
 * @description Funzione main che gestisce il menu principale dell'applicazione.
 * Mostra un menu con tre opzioni: gestire le attività, visualizzare le attività, o uscire dall'applicazione.
 * L'utente può selezionare un'opzione inserendo il numero corrispondente.
 * La funzione utilizza un ciclo do-while per mantenere il menu attivo fino a quando l'utente sceglie di uscire.
 */
function main() {
    let scelta = 0;
    let promemoria=leggiAttivitàDaFile();
    do {
        console.clear(); // Pulisce la console per un aspetto pulito
        console.log("       ╔══════════════════════════════════════════════════════════════════════╗");
        console.log("       ║       ____  ____  ____  __  ___ _______  ___ ___  ____  ____ ___     ║");
        console.log("       ║      / __ \\/ __ \\/ __ \\/  |/  / ____/  |/  / __ \\/ __ \\/  _/   |     ║");
        console.log("       ║     / /_/ / /_/ / / / / /|_/ / __/ / /|_/ / / / / /_/ // // /| |     ║");
        console.log("       ║    / ____/ _, _/ /_/ / /  / / /___/ /  / / /_/ / _, _// // ___ |     ║");
        console.log("       ║   /_/   /_/ |_|\\____/_/  /_/_____/_/  /_/\\____/_/ |_/___/_/  |_|     ║");
        console.log("       ║                                                                      ║");
        console.log("       ╚══════════════════════════════════════════════════════════════════════╝");
        console.log("\n                           ┌─────────────────────────┐")
        console.log("                           │    SCEGLI COSA FARE     │");
        console.log("                           │1: GESTISCI ATTIVITÀ     │");
        console.log("                           │2: VISUALIZZA ATTIVITÀ   │");
        console.log("                           │3: ESCI                  │");
        console.log("                           └─────────────────────────┘\n");
        scelta = parseInt(prompt("                           > "));
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
                console.log("\n                              ═══════════════════════");
                console.log("                              !!!VALORE NON VALIDO!!!");
                console.log("                              ═══════════════════════\n");
                prompt("                          PREMERE INVIO PER CONTINUARE ...");
                break;
        }
    } while (scelta !== 3);
    console.clear();
}
main();
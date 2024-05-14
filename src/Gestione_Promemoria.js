/**
 * Si tratta di un semplice programma di gestione delle attività che consente agli utenti di creare, eliminare, modificare,
 * e cercare attività. Ogni attività può essere contrassegnata come completata. Le attività sono archiviate in
 * un file JSON denominato "promemoria.json" nella directory "src". Il programma prevede
 * un sistema di menu basato su testo per interagire con le attività.
 *
 * @fileoverview Sistema di gestione delle attività per creare, modificare, eliminare e cercare attività.
 * @author Stefania Giuseppe, Di Maggio Federico, Di Stolfo Simone
 */

const prompt = require("prompt-sync")();
const fs = require('fs');

/**
 * Classe che rappresenta una singola attività.
 */
class Attività {
    /**
     * Costruisce un'istanza di un'attività.
     * @constructor
     * @param {string} nomeAttività - Nome dell'attività.
     */
    constructor(nomeAttività) {
        this.nomeAttività = nomeAttività;
        this.marcaturaAttività = false;
    }
    /**
     * Marca l'attività come completata.
     */
    segnaMarcatura() {
        this.marcaturaAttività = true;
    }
}

/**
 * Salva la lista delle attività nel file .json .
 * @param {Attività[]} attività - Array delle attività che saranno salvate nel file.
 */
function salvaAttivitàSuFile(attività) {
        fs.writeFileSync("src/promemoria.json", JSON.stringify(attività));
}

/**
 * Elimina le attività dalla lista basandosi su un ulteriore conferma dell'utente.
 * @param {Attività[]} vet - Array delle attività.
 */
function cancellaAttività(vet) {
    let risultato = ricercaAttività(vet);
    if (risultato === false) {
        console.log("\n                     ═════════════════════════════════════");
        console.log("                     !!!NESSUNA CORRISPONDENZA TROVATA!!!");
        console.log("                     ═════════════════════════════════════");
        return;
    }
    else if (risultato.length === 1) {
        let conferma = 0;
        do {
            console.log("\n              ╔═════════════════════════════════════╗");
            console.log("              ║    _____                  ____      ║");    
            console.log("              ║   / ___/__ ____  _______ / / /__ _  ║");
            console.log("              ║  / /__/ _  / _ \\/ __/ -_) / / _  /  ║");
            console.log("              ║  \\___/\\___/_//_/\\__/\\__/_/_/\\___/   ║");
            console.log("              ║                                     ║");
            console.log("              ╚═════════════════════════════════════╝");
            
            console.log("\n              ┌─────────────────────────────────┐");
            console.log("              │ VUOI ELIMINARE ──>", risultato[0].nomeAttività,"<── ?│");
            console.log("              │ 1 : SÌ                          │");
            console.log("              │ 2 : NO                          │");
            console.log("              └─────────────────────────────────┘")
            conferma = parseInt(prompt("              > " ));
            switch (conferma) {
                case 1: {
                    vet = vet.filter(attività => attività.nomeAttività !== risultato[0].nomeAttività);
                    salvaAttivitàSuFile(vet);
                    console.log("\n             ══════════════════════════════════════");
                    console.log("             !!!ATTIVITÀ CANCELLATA CON SUCCESSO!!!");
                    console.log("             ══════════════════════════════════════");
                    break;
                }
                case 2: {
                    console.log("\n                  ══════════════════════════");
                    console.log("                  !!!OPERAZIONE ANNULLATA!!!");
                    console.log("                  ══════════════════════════");
                    break;
                }
                default: {
                    console.log("\n                     ═══════════════════════════");
                    console.log("                     !!!VALORE NON VALIDO!!!");
                    console.log("                     ═══════════════════════");
                    break;
                }
            }
        } while (conferma !== 1 && conferma !== 2);
    } else {
        console.log("\n                     ══════════════════════════════════════════════════════════════════════════════");
        console.log("                     !!!ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE!!!");
        console.log("                     ════════════════════════════════════════════════════════════════════════════");
        visualizzaAttività(risultato);
        cancellaAttività(vet);
    }
}

/**
 * Legge le attività dal file.
 * @returns {Attività[]} Array delle attività lette dal file.
 */
function leggiAttivitàDaFile() {
    try {
        const datiJSON = fs.readFileSync("src/promemoria.json", 'utf8');
        return JSON.parse(datiJSON);
    } catch (errore) {
        return [];
    }
}

/**
 * Cerca le attività nella lista logica (array), anche se la chiave non è identica all'attività che si trova nell'array.
 * @param {Attività[]} vet - Array delle attività
 * @returns {Attività[] | false} Array delle attività che corrispondo ai criteri di ricerca.
 */
function ricercaAttività(vet) {
    console.log();
    let paroleChiave = prompt("                     INSERIRE ATTIVITÀ DA RICERCARE > ")
    paroleChiave = paroleChiave.toLowerCase();
    let risultati = [];
    for (let i = 0; i < vet.length; i++) {
        const attivita = vet[i].nomeAttività.toLowerCase();
        if (paroleChiave.length === 1) {
            if (attivita.startsWith(paroleChiave)) {
                risultati.push(vet[i]);
            }
        } else {
            let tuttePresenti = attivita.includes(paroleChiave);
            if (tuttePresenti) {
                risultati.push(vet[i]);
            }
        }
    }
    return risultati.length > 0 ? risultati : false;
}

/**
 * Modifica il nome di un'attività in base all'input dell'utente.
 * @param {Attività[]} vet - Array delle attività.
 */
function modificaAttività(vet) {
    let risultato = ricercaAttività(vet);
    if (risultato === false) {
        console.log("\n                     ════════════════════════════════════");
        console.log("                     !!!NESSUNA CORRISPONDENZA TROVATA!!!");
        console.log("                     ════════════════════════════════════");
        return;
    } else if (risultato.length === 1) {
        console.log("\n                     ATTIVITÀ TROVATA: ");
        visualizzaAttività(risultato);
        let conferma = 0;
        do {
            console.log("\n       ╔═════════════════════════════════════════════════════╗");
            console.log("       ║       __  _______  ____  _______________________    ║");      
            console.log("       ║      /  |/  / __ \\/ __ \\/  _/ ____/  _/ ____/   |   ║");     
            console.log("       ║     / /|_/ / / / / / / // // /_   / // /   / /| |   ║");      
            console.log("       ║    / /  / / /_/ / /_/ // // __/ _/ // /___/ ___ |   ║");      
            console.log("       ║   /_/  /_/\\____/_____/___/_/   /___/\\____/_/  |_|   ║");
            console.log("       ║                                                     ║")
            console.log("       ╚═════════════════════════════════════════════════════╝");
            console.log("\n                     ┌─────────────────────┐");
            console.log("                     │DESIDERI MODIFICARE? │");
            console.log("                     │1: SÌ                │");
            console.log("                     │2: ANNULLA           │");
            console.log("                     └─────────────────────┘\n");
            conferma = parseInt(prompt("                     > "));
            switch (conferma) {
                case 1: {
                    console.log("\n                     ═══════════════════════");
                    console.log("                     INSERISCI IL NUOVO NOME");
                    console.log("                     ═══════════════════════");
                    risultato[0].nomeAttività = prompt("                     > ");
                    salvaAttivitàSuFile(vet);
                    console.log("\n                     ═══════════════════════════════════════════");
                    console.log("                     NOME DELL'ATTIVITÀ MODIFICATO CON SUCCESSO!");
                    console.log("                     ═══════════════════════════════════════════");
                    break;
                }
                case 2: {
                    console.log("\n                     ═══════════════════");
                    console.log("                     MODIFICA ANNULLATA!");
                    console.log("                     ═══════════════════");
                    break;
                }
                default: {
                    console.log("\n                     ═══════════════════════");
                    console.log("                     !!!SCELTA NON VALIDA!!!");
                    console.log("                     ═══════════════════════");
                    break;
                }
            }
        } while (conferma !== 1 && conferma !== 2 && conferma !== 3);
    } else {
        console.log("\n                     ════════════════════════════════════════════════════════════════════════════");
        console.log("                     !!!ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE!!!")
        console.log("                     ════════════════════════════════════════════════════════════════════════════");

        visualizzaAttività(risultato);
        modificaAttività(vet);
    }
}
/**
 * Marca attività
 * @param {Attività[]} vet - Array delle attività.
 */
function marcaturaAttività(vet) {
    let risultato = ricercaAttività(vet);
    if (risultato === false) {
        console.log("\n                     ════════════════════════════════════");
        console.log("                     !!!NESSUNA CORRISPONDENZA TROVATA!!!");
        console.log("                     ════════════════════════════════════");
        return;
    } else if (risultato.length === 1) {
        console.log("\n                     ══════════════════");
        console.log("                     ATTIVITÀ TROVATA: ");
        console.log("                     ══════════════════");
        visualizzaAttività(risultato);
        if(risultato[0].marcaturaAttività===true){
            console.log("\n                     ═════════════════════════════════════════════════════");
            console.log("                     !!!ERRORE, NON PUOI MARCARE UN'ATTIVITÀ GIÀ SVOLTA!!!");
            console.log("                     ═════════════════════════════════════════════════════");
                return;
        }
        else{
            let conferma = 0;
            do {
                console.log("\n       ╔═════════════════════════════════════════════════╗");
                console.log("       ║     __  ___                  __                 ║");               
                console.log("       ║    /  |/  /__ ____________ _/ /___ ___________  ║");
                console.log("       ║   / /|_/ / _ `/ __/ __/ _ `/ __/ // / __/ _ `/  ║");
                console.log("       ║  /_/  /_/\\_,_/_/  \\__/\\_,_/\\__/\\_,_/_/  \\_,_/   ║");
                console.log("       ║                                                 ║");
                console.log("       ╚═════════════════════════════════════════════════╝");
                console.log("\n                     ┌──────────────────────────┐");
                console.log("                     │SEGNARE COME COMPLETATA?  │");
                console.log("                     │1: SÌ                     │");
                console.log("                     │2: ANNULLA                │");
                console.log("                     └──────────────────────────┘\n");
                conferma = parseInt(prompt("                     > "));
                switch (conferma) {
                    case 1: {
                            risultato[0].segnaMarcatura();                                
                            console.log("\n                     ATTIVITÀ SEGNATA COME SVOLTA!");
                            break;
                    }
                    case 2: {
                        console.log("\n                     MODIFICA MARCATURA ANNULLATA!");
                        break;
                    }
                    default: {
                        console.log("\n                     ═══════════════════════");
                        console.log("                     !!!SCELTA NON VALIDA!!!");
                        console.log("                     ═══════════════════════");
                        break;
                    }
                }
            } while (conferma !== 1 && conferma !== 2 && conferma !== 3);
            salvaAttivitàSuFile(vet);
        }
    } else {
        console.log("\n                     ════════════════════════════════════════════════════════════════════════════");
        console.log("                     !!!ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE!!!");
        console.log("                     ════════════════════════════════════════════════════════════════════════════");

        visualizzaAttività(risultato);
        marcaturaAttività(vet);
    }
}
/**
 * Menu per la modifica delle attività, tra cui aggiunta, eliminazione, modifica e contrassegno delle attività.
 */
function menuModifica() {
    let vet = leggiAttivitàDaFile();
    let scelta = 0;
    do {
        console.log("\n       ╔══════════════════════════════════════════════════════╗");
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
        switch (scelta) {
            case 1: {
                console.log();
                console.log("\n              ╔══════════════════════════════════════════╗");
                console.log("              ║      ___            _                _   ║"); 
                console.log("              ║     / _ |___ ____ _(_)_ _____  ___ _(_)  ║");
                console.log("              ║    / __ / _ `/ _ `/ / // / _ \\/ _ `/ /   ║"); 
                console.log("              ║   /_/ |_\\_, /\\_, /_/\\_,_/_//_/\\_, /_/    ║");  
                console.log("              ║         \\__//\\__/            \\__/        ║");
                console.log("              ║                                          ║");
                console.log("              ╚══════════════════════════════════════════╝");

                const nomeAttività = prompt("              INSERIRE NOME DELLA NUOVA ATTIVITÀ > ");
                vet.push(new Attività(nomeAttività));
                salvaAttivitàSuFile(vet);
                break;
            }
            case 2: {
                vet = leggiAttivitàDaFile();
                cancellaAttività(vet);
                break;
            }
            case 3: {
                modificaAttività(vet);
                break;
            }
            case 4: {
                marcaturaAttività(vet);
                break;
            }
            case 5: {
                break;
            }
            default:
                {
                console.log("\n                     ═══════════════════════");
                console.log("                     !!!VALORE NON VALIDO!!!");
                console.log("                     ═══════════════════════");
                break;
                }
        }
    } while (scelta !== 5);
}
/**
 * Visualizza elenco attività in ordine di marcatura.
 * @param {Attività[]} vet - Array delle attività.
 */
function visualizzaAttività(vet)
{
    let c=0;
    for(let i=0;i<vet.length;i++)
        if(!vet[i].marcaturaAttività)
        {
            c++;
            console.log("- ",c,". ",vet[i].nomeAttività)
        }
    
    for(let k=0;k<vet.length;k++)
    {
        if(vet[k].marcaturaAttività)
        {
            c++;
            console.log("- ",c,". \x1b[9m",vet[k].nomeAttività,"\x1b[0m")
        }
    }
}

/**
 * Menu per visualizzare le attività, inclusa la visualizzazione di tutte le attività e la ricerca di un'attività.
 */
function menuVisualizzazione() {
    let scelta = 0;
    do {
        console.log("\n       ╔════════════════════════════════════════════════════════════════╗");
        console.log("       ║    _    ___________ __  _____    __    ______________   ___    ║");
        console.log("       ║   | |  / /  _/ ___// / / /   |  / /   /  _/__  /__  /  /   |   ║");
        console.log("       ║   | | / // / \\__ \\/ / / / /| | / /    / /   / /  / /  / /| |   ║");
        console.log("       ║   | |/ // / ___/ / /_/ / ___ |/ /____/ /   / /__/ /__/ ___ |   ║");
        console.log("       ║   |___/___//____/\\____/_/  |_/_____/___/  /____/____/_/  |_|   ║");
        console.log("       ║                                                                ║");
        console.log("       ╚════════════════════════════════════════════════════════════════╝");
        console.log();
        console.log("\n                            ┌──────────────────────────────┐");
        console.log("                            │1: VISUALIZZA ELENCO ATTIVITÀ │");
        console.log("                            │2: RICERCA UN'ATTIVITÀ        │");
        console.log("                            │3: INDIETRO                   │");
        console.log("                            └──────────────────────────────┘\n");
        scelta = parseInt(prompt("                            > "));
        switch (scelta) {
            case 1: {
                console.log("              ╔═══════════════════════════════╗");
                console.log("              ║     ______                    ║");               
                console.log("              ║    / __/ /__ ___  _______     ║"); 
                console.log("              ║   / _// / -_) _ \\/ __/ _ \\    ║");
                console.log("              ║  /___/_/\\__/_//_/\\__/\\___/    ║");
                console.log("              ║                               ║");
                console.log("              ╚═══════════════════════════════╝");
                visualizzaAttività(leggiAttivitàDaFile());
                break;
            }
            case 2: {
                console.log("                     ╔═══════════════════════════════════╗");
                console.log("                     ║     ___  _                        ║");                    
                console.log("                     ║    / _ \\(_)______ ___________ _   ║");
                console.log("                     ║   / , _/ / __/ -_) __/ __/ _ `/   ║");
                console.log("                     ║  /_/|_/_/\\__/\\__/_/  \\__/\\_,_/    ║");
                console.log("                     ║                                   ║")
                console.log("                     ╚═══════════════════════════════════╝");
                attivitàTrovata = ricercaAttività(leggiAttivitàDaFile());
                if (attivitàTrovata === false) {
                    console.log("\n                     ════════════════════════════════════");
                    console.log("                     !!!NESSUNA CORRISPONDENZA TROVATA!!!");
                    console.log("                     ════════════════════════════════════");
                } else {
                    console.log(attivitàTrovata);
                }
                break;
            }
            case 3: {
                break;
            }
            default:
                console.log("\n                     ═══════════════════════");
                console.log("                     !!!VALORE NON VALIDO!!!");
                console.log("                     ═══════════════════════");
                break;
        }
    } while (scelta !== 3);
}

/**
 * Il menu principale del programma. Consente la navigazione tra diverse funzionalità.
 */
function main() {
    let scelta = 0;
    do {
        console.log("\n       ╔══════════════════════════════════════════════════════════════════════╗");
        console.log("       ║       ____  ____  ____  __  ___ _______  ___ ___  ____  ____ ___     ║");
        console.log("       ║      / __ \\/ __ \\/ __ \\/  |/  / ____/  |/  / __ \\/ __ \\/  _/   |     ║");
        console.log("       ║     / /_/ / /_/ / / / / /|_/ / __/ / /|_/ / / / / /_/ // // /| |     ║");
        console.log("       ║    / ____/ _, _/ /_/ / /  / / /___/ /  / / /_/ / _, _// // ___ |     ║");
        console.log("       ║   /_/   /_/ |_|\\____/_/  /_/_____/_/  /_/\\____/_/ |_/___/_/  |_|     ║");
        console.log("       ║                                                                      ║");
        console.log("       ╚══════════════════════════════════════════════════════════════════════╝");
        console.log("\n                             ┌─────────────────────────┐")
        console.log("                             │SCEGLI COSA FARE:        │");
        console.log("                             │1: GESTISCI ATTIVITÀ     │");
        console.log("                             │2: VISUALIZZA ATTIVITÀ   │");
        console.log("                             │3: ESCI                  │");
        console.log("                             └─────────────────────────┘\n");
        scelta = parseInt(prompt("                            > "));
        switch (scelta) {
            case 1: {
                menuModifica();
                break;
            }
            case 2: {
                menuVisualizzazione();
                break;
            }
            case 3: {
                break;
            }
            default:
                console.log("\n                     ═══════════════════════");
                console.log("                     !!!VALORE NON VALIDO!!!");
                console.log("                     ═══════════════════════");
                break;
        }
    } while (scelta !== 3);
}

main();
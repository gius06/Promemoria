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
}
function segnaMarcatura(vet) {
    vet.marcaturaAttività = true;
}
/**
 * Salva la lista delle attività nel file .json .
 * @param {Attività[]} attività - Array delle attività che saranno salvate nel file.
 */
function salvaAttivitàSuFile(attività) {
    try {
        fs.writeFileSync("src/promemoria.json", JSON.stringify(attività));
    } catch (errore) { return [] }
}

/**
 * Elimina le attività dalla lista basandosi su un ulteriore conferma dell'utente.
 * @param {Attività[]} vet - Array delle attività.
 */
function cancellaAttività(vet) {
    let risultato = ricercaAttività(vet);
    if (risultato === false) {
        console.log("\nNESSUNA CORRISPONDENZA TROVATA\n");
        return;
    }
    else if (risultato.length === 1) {
        let conferma = 0;
        do {
            console.log("\n- VUOI ELIMINARE > ", risultato[0].nomeAttività, " < ?");
            console.log("1 : SÌ");
            console.log("2 : NO");
            conferma = parseInt(prompt("> "));
            switch (conferma) {
                case 1: {
                    vet = vet.filter(attività => attività.nomeAttività !== risultato[0].nomeAttività);
                    salvaAttivitàSuFile(vet);
                    console.log("\n- ATTIVITÀ CANCELLATA CON SUCCESSO !");
                    break;
                }
                case 2: {
                    console.log("\n- OPERAZIONE ANNULLATA ! ");
                    break;
                }
                default: {
                    console.log("\nVALORE NON VALIDO\n");
                    break;
                }
            }
        } while (conferma !== 1 && conferma !== 2);
    } else {
        console.log("\n- ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE\n")
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
    let paroleChiave = prompt("- INSERIRE ATTIVITÀ DA RICERCARE > ")
    paroleChiave = paroleChiave.toLowerCase();
    let risultati = [];
    for (let i = 0; i < vet.length; i++) {
        let attivita = vet[i].nomeAttività.toLowerCase();
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
        console.log("\nNESSUNA CORRISPONDENZA TROVATA\n");
        return;
    } else if (risultato.length === 1) {
        console.log("\nATTIVITÀ TROVATA: ");
        visualizzaAttività(risultato);
        let conferma = 0;
        do {
            console.log("\nDESIDERI MODIFICARE? ");
            console.log("1: SÌ");
            console.log("2: ANNULLA");
            conferma = parseInt(prompt("> "));
            switch (conferma) {
                case 1: {
                    console.log("\nINSERISCI IL NUOVO NOME");
                    risultato[0].nomeAttività = prompt("> ");
                    salvaAttivitàSuFile(vet);
                    console.log("\nNOME DELL'ATTIVITÀ MODIFICATO CON SUCCESSO!");
                    break;
                }
                case 2: {
                    console.log("\nMODIFICA ANNULLATA.");
                    break;
                }
                default: {
                    console.log("\nSCELTA NON VALIDA.");
                    break;
                }
            }
        } while (conferma !== 1 && conferma !== 2 && conferma !== 3);
    } else {
        console.log("\n- ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE\n")
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
        console.log("\nNESSUNA CORRISPONDENZA TROVATA\n");
        return;
    } else if (risultato.length === 1) {
        console.log("\nATTIVITÀ TROVATA: ");
        visualizzaAttività(risultato);
        let conferma = 0;
        do {
            console.log("\nMODIFICARE MARCATURA? ");
            console.log("1: SÌ");
            console.log("2: ANNULLA");
            conferma = parseInt(prompt("> "));
            switch (conferma) {
                case 1: {
                    if (risultato[0].marcaturaAttività === false) {
                        segnaMarcatura(risultato[0]);
                        salvaAttivitàSuFile(vet);
                        console.log("\nATTIVITÀ SEGNATA COME SVOLTA!");
                    } else {
                        risultato[0].marcaturaAttività = false;
                        salvaAttivitàSuFile(vet);
                        console.log("\nATTIVITÀ SEGNATA COME NON SVOLTA!");
                    }
                    break;
                }
                case 2: {
                    console.log("\nMODIFICA MARCATURA ANNULLATA.");
                    break;
                }
                default: {
                    console.log("\nSCELTA NON VALIDA.");
                    break;
                }
            }
        } while (conferma !== 1 && conferma !== 2 && conferma !== 3);
    } else {
        console.log("\n- ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE\n");
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
        console.log("\n╔════════════════════════════════════════════════════════════════════╗");
        console.log("░  ,--.   ,--. ,-----. ,------.  ,--.,------.,--. ,-----.  ,---.     ░");
        console.log("░  |   `.'   |'  .-.  '|  .-.  \\ |  ||  .---'|  |'  .--./ /  O  \\    ░");
        console.log("░  |  |'.'|  ||  | |  ||  |  \\  :|  ||  `--, |  ||  |    |  .-.  |   ░");
        console.log("░  |  |   |  |'  '-'  '|  '--'  /|  ||  |`   |  |'  '--'\\|  | |  |   ░");
        console.log("░  `--'   `--' `-----' `-------' '--''--'    '--' '-----''--' '--'   ░");
        console.log("╚════════════════════════════════════════════════════════════════════╝");
        console.log("\n1: AGGIUNGI ATTIVITÀ");
        console.log("\n2: CANCELLA ATTIVITÀ");
        console.log("\n3: MODIFICA ATTIVITÀ");
        console.log("\n4: MARCATURA ATTIVITÀ");
        console.log("\n5: INDIETRO\n");
        scelta = parseInt(prompt("> "));
        switch (scelta) {
            case 1: {
                console.log();
                let nomeAttività = prompt("- INSERIRE NOME DELLA NUOVA ATTIVITÀ > ");
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
                    console.log("\nVALORE NON VALIDO\n");
                    break;
                }
        }
    } while (scelta !== 5);
}
/**
 * Visualizza elenco attività in ordine di marcatura.
 * @param {Attività[]} vet - Array delle attività.
 */
function visualizzaAttività(vet) {
    let c = 0;
    console.log();
    for (let i = 0; i < vet.length; i++)
        if (!vet[i].marcaturaAttività) {
            c++;
            console.log("- ", c, ". ", vet[i].nomeAttività)
        }

    for (let k = 0; k < vet.length; k++) {
        if (vet[k].marcaturaAttività) {
            c++;
            console.log("- ", c, ". \x1b[9m", vet[k].nomeAttività, "\x1b[0m")
        }
    }
}

/**
 * Menu per visualizzare le attività, inclusa la visualizzazione di tutte le attività e la ricerca di un'attività.
 */
function menuVisualizzazione() {
    let scelta = 0;
    do {
        console.log("\n╔═══════════════════════════════════════════════════════════════════════════════════╗");
        console.log("░                                                                                   ░");
        console.log("░  ,--.  ,--.,--. ,---.  ,--. ,--.  ,---.  ,--.   ,--.,-------.,-------.  ,---.     ░");
        console.log("░  \\  '.'  / |  |'   .-' |  | |  | /  O  \\ |  |   |  |'--.   / '--.   /  /  O  \\    ░");
        console.log("░   \\     /  |  |`.  `-. |  | |  ||  .-.  ||  |   |  |  /   /    /   /  |  .-.  |   ░"); 3
        console.log("░    \\   /   |  |.-'    |'  '-'  '|  | |  ||  '--.|  | /   `--. /   `--.|  | |  |   ░");
        console.log("░     `-'    '--''-----'  '-----' '--' '--''-----''--''-------''-------''--' '--'   ░");
        console.log("░                                                                                   ░");
        console.log("╚═══════════════════════════════════════════════════════════════════════════════════╝")
        console.log("\n1: VISUALIZZA ELENCO ATTIVITÀ");
        console.log("\n2: RICERCA UN'ATTIVITÀ");
        console.log("\n3: INDIETRO\n");
        scelta = parseInt(prompt("> "));
        switch (scelta) {
            case 1: {
                visualizzaAttività(leggiAttivitàDaFile());
                break;
            }
            case 2: {
                attivitàTrovata = ricercaAttività(leggiAttivitàDaFile());
                if (attivitàTrovata === false) {
                    console.log("\nNESSUNA CORRISPONDENZA TROVATA\n")
                } else {
                    visualizzaAttività(attivitàTrovata);
                }
                break;
            }
            case 3: {
                break;
            }
            default:
                console.log("\nVALORE NON VALIDO\n");
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
        console.log("\n╔═════════════════════════════════════════════════════════════════════════════════════════════╗");
        console.log("░                                                                                             ░");
        console.log("░  ,------. ,------.  ,-----. ,--.   ,--.,------.,--.   ,--. ,-----. ,------. ,--.  ,---.     ░");
        console.log("░  |  .--. '|  .--. ''  .-.  '|   `.'   ||  .---'|   `.'   |'  .-.  '|  .--. '|  | /  O  \\    ░");
        console.log("░  |  '--' ||  '--'.'|  | |  ||  |'.'|  ||  `--, |  |'.'|  ||  | |  ||  '--'.'|  ||  .-.  |   ░");
        console.log("░  |  | --' |  |\\  \\ '  '-'  '|  |   |  ||  `---.|  |   |  |'  '-'  '|  |\\  \\ |  ||  | |  |   ░");
        console.log("░  `--'     `--' '--' `-----' `--'   ---''------'`--'   `--' `-----' '--' '--''--'`--' `--'   ░");
        console.log("░                                                                                             ░");
        console.log("╚═════════════════════════════════════════════════════════════════════════════════════════════╝");
        console.log("\nSCEGLI COSA FARE:");
        console.log("\n1: GESTISCI ATTIVITÀ");
        console.log("\n2: VISUALIZZA ATTIVITÀ");
        console.log("\n3: ESCI\n");
        scelta = parseInt(prompt("> "));
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
                console.log("\nVALORE NON VALIDO\n");
                break;
        }
    } while (scelta !== 3);
}

main();
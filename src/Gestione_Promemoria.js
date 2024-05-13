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
            console.log("1 : Sì");
            console.log("2 : No");
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
        console.log(risultato);//
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
 * Cerca le attività con una chiave.
 * @param {Attività[]} vet - Array delle attività
 * @returns {Attività[] | false} Array delle attività che corrispondo ai criteri di ricerca.
 */
function ricercaAttività(vet) {
    console.log();
    let paroleChiave = prompt("- INSERIRE ATTIVITÀ DA RICERCARE > ")
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
 * @param {Attività[]} vet - AArray delle attività.
 */
function modificaAttività(vet) {
    let risultato = ricercaAttività(vet);
    if (risultato === false) {
        console.log("\nNESSUNA CORRISPONDENZA TROVATA\n");
        return;
    } else if (risultato.length === 1) {
        console.log("\nATTIVITÀ TROVATA: ");
        console.log(risultato[0]);
        let conferma = 0;
        do {
            console.log("\nDESIDERI MODIFICARE? ");
            console.log("1: Sì");
            console.log("2: Annulla");
            conferma = parseInt(prompt("> "));
            switch (conferma) {
                case 1: {
                    console.log("\nInserisci il nuovo nome:");
                    const nuovoNome = prompt("> ");
                    risultato[0].nomeAttività = nuovoNome;
                    salvaAttivitàSuFile(vet);
                    console.log("\nNome dell'attività modificato con successo!");
                    break;
                }
                case 2: {
                    console.log("\nModifica annullata.");
                    break;
                }
                default: {
                    console.log("\nScelta non valida.");
                    break;
                }
            }
        } while (conferma !== 1 && conferma !== 2 && conferma !== 3);
    } else {
        console.log("\n- ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE\n")
        console.log(risultato);
        modificaAttività(vet);
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
                const nomeAttività = prompt("- INSERIRE NOME NUOVA ATTIVITÀ > ");
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
                // Implementa la funzione di marcatura attività
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
                const attività = leggiAttivitàDaFile();
                console.log(attività);
                break;
            }
            case 2: {
                let vet = leggiAttivitàDaFile();
                attivitàTrovata = ricercaAttività(vet);
                if (attivitàTrovata === false) {
                    console.log("\nNESSUNA CORRISPONDENZA TROVATA\n")
                } else {
                    console.log(attivitàTrovata);
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
        console.log("\n1: MODIFICA PROMEMORIA:");
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
const prompt = require("prompt-sync")();
const fs = require('fs');

class Attività {
    constructor(nomeAttività) {
        this.nomeAttività = nomeAttività;
        this.marcaturaAttività = false;
    }

    segnaMarcatura() {
        this.marcaturaAttività = true;
    }
}

function salvaAttivitàSuFile(attività) {
    try {
        fs.writeFileSync("src/promemoria.json", JSON.stringify(attività));
    } catch (errore) {return[]}
}

function leggiAttivitàDaFile() {
    try {
        const datiJSON = fs.readFileSync("src/promemoria.json", 'utf8');
        return JSON.parse(datiJSON);
    } catch (errore) {
        return [];
    }
}

function menuModifica() {
    let vet=leggiAttivitàDaFile();
    let scelta = 0;
    do {
        console.log("1 = aggiungi attività");
        console.log("2 = cancella attività");
        console.log("3 = modifica attività");
        console.log("4 = marcatura attività");
        console.log("5 = indietro");
        scelta = parseInt(prompt("> "));
        switch (scelta) {
            case 1: {
                const nomeAttività = prompt("Inserire nome attività: ");
                vet.push(new Attività(nomeAttività));
                break;
            }
            case 2: {
                const nomeAttività = prompt("Inserire nome attività da cancellare: ");
                vet=vet.filter(attività => attività.nomeAttività !== nomeAttività);
                break;
            }
            case 3: {
                // Implementa la funzione di modifica attività
                break;
            }
            case 4: {
                // Implementa la funzione di marcatura attività
                break;
            }
            case 5: {
                salvaAttivitàSuFile(vet);
                break;
            }
            default:
                console.log("VALORE NON VALIDO");
                break;
        }
    } while (scelta !== 5);
}

function menuVisualizzazione() {
    let scelta = 0;
    do {
        console.log("1 = visualizza elenco attività");
        console.log("2 = ricerca un'attività");
        console.log("3 = indietro");
        scelta = parseInt(prompt("> "));
        switch (scelta) {
            case 1: {
                const attività = leggiAttivitàDaFile();
                console.log(attività);
                break;
            }
            case 2: {
                // Implementa la funzione di ricerca attività
                break;
            }
            case 3: {
                break;
            }
            default:
                console.log("VALORE NON VALIDO");
                break;
        }
    } while (scelta !== 3);
}

function main() {
    let scelta = 0;
    do {
        console.log("1 = modifica promemoria");
        console.log("2 = visualizza attività");
        console.log("3 = esci");
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
                console.log("VALORE NON VALIDO");
                break;
        }
    } while (scelta !== 3);
}

main();

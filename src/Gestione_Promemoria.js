
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
    } catch (errore) { return [] }
}

function cancellaAttività(vet) {
    let risultato = ricercaAttività(vet);
    if (risultato.length === 1) {
        console.log(risultato);
        let conferma = 0;
        console.log("Eliminare l'attività?");
        console.log("1. Sì");
        console.log("2. No");
        conferma = parseInt(prompt("> "));
        switch (conferma) {
            case 1: {
                vet = vet.filter(attività => attività.nomeAttività !== risultato[0].nomeAttività);
                salvaAttivitàSuFile(vet);
                console.log("Attività cancellata!");
                break;
            }
            case 2: {
                console.log("Operazione annullata!");
                break;
            }
        }

    } else {
        console.log(risultato);
        console.log("Attenzione esistono più elementi specificare maggiormente")
        cancellaAttività(vet);
    }
}

function leggiAttivitàDaFile() {
    try {
        const datiJSON = fs.readFileSync("src/promemoria.json", 'utf8');
        return JSON.parse(datiJSON);
    } catch (errore) {
        return [];
    }
}
function ricercaAttività(vet) {

    let paroleChiave = prompt("Inserire l'attività da ricercare : ")
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
    return risultati.length > 0 ? risultati : "Nessun risultato trovato.";
}
function menuModifica() {
    let vet = leggiAttivitàDaFile();
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
                vet = leggiAttivitàDaFile();
                const nomeAttività = prompt("Inserire nome attività: ");
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
                // Implementa la funzione di modifica attività
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
                let vet = leggiAttivitàDaFile();
                console.log(ricercaAttività(vet));

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

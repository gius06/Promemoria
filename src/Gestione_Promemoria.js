
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
    if(risultato===false)
    {
        console.log("\nNESSUNA CORRISPONDENZA TROVATA\n");
        return;
    }
    else if (risultato.length === 1) {
        let conferma = 0;
        do{
            console.log("\n- VUOI ELIMINARE > ",risultato[0].nomeAttività," < ?");
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
        }while(conferma!==1&&conferma!==2);
    } else {
        console.log("\n- ATTENZIONE LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE MAGGIORMENTE\n")
        console.log(risultato);//
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
                {console.log("\nVALORE NON VALIDO\n");
                break;}
        }
    } while (scelta !== 5);
}

function menuVisualizzazione() {
    let scelta = 0;
    do {
        console.log("\n╔═══════════════════════════════════════════════════════════════════════════════════╗");
        console.log("░                                                                                   ░");
        console.log("░  ,--.  ,--.,--. ,---.  ,--. ,--.  ,---.  ,--.   ,--.,-------.,-------.  ,---.     ░");
        console.log("░  \\  '.'  / |  |'   .-' |  | |  | /  O  \\ |  |   |  |'--.   / '--.   /  /  O  \\    ░");
        console.log("░   \\     /  |  |`.  `-. |  | |  ||  .-.  ||  |   |  |  /   /    /   /  |  .-.  |   ░");3
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
                console.log(ricercaAttività(vet));
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

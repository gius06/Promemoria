/**
 * @fileoverview Questo programma è una rubrica virtuale che consente agli utenti di gestire le proprie attività.
 * La rubrica consente di aggiungere, eliminare, modificare e visualizzare attività suddivise in categorie come "Lavoro", "Personale", e "Hobby".
 * Il programma è costituito da diverse funzioni, ognuna delle quali svolge un compito specifico:
 * - Le funzioni come `aggiungiAttività()` e `eliminaAttività()` gestiscono l'aggiunta e l'eliminazione delle attività dalla rubrica.
 * - La funzione `modificaAttività()` permette agli utenti di modificare le informazioni di un'attività esistente.
 * - `elencoAttività()` e `trovaAttività()` consentono agli utenti di visualizzare l'elenco completo delle attività o di cercarne una specifica.
 * - `notificheAttività()` fornisce notifiche sull'attività in base alla loro scadenza.
 * Il programma utilizza una mappa per organizzare le attività per categoria. Ogni categoria contiene un elenco di attività associate ad essa.
 * Le operazioni di ricerca e modifica vengono eseguite iterando attraverso le categorie e le attività all'interno di esse.
 * Le funzioni interagiscono con l'utente attraverso l'input da console e mostrano i risultati attraverso la console.
 * Il programma offre anche una visualizzazione dettagliata e colorata per una migliore esperienza utente, ad esempio usando colori diversi per le attività scadute, in scadenza e completate.
 * Complessivamente, questo programma offre agli utenti un modo intuitivo e completo per gestire le proprie attività quotidiane in modo organizzato e efficiente.
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
 * Rappresenta un'attività con un nome, una data e uno stato di marcatura.
 * @class
 * @constructs Attività
 * @param {string} nomeAttività - Il nome dell'attività.
 * @param {string} dataAttività - La data dell'attività.
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
/**
 * Gestisce i promemoria organizzati per categorie e fornisce metodi per aggiungere, eliminare, cercare, modificare e visualizzare le attività.
 * @class
 * @constructs Promemoria
 */
class Promemoria {
    /**
     * Crea una nuova istanza di Promemoria con categorie predefinite.
     * @constructs Promemoria
     */
    constructor() {
        this.mappa = new Map([
            ['Lavoro', []],
            ['Personale', []],
            ['Hobby', []],
        ]);
    }
    /**
    * @description Questa funzione controlla se l'attività specificata è già presente nella categoria fornita.
    * Se l'attività non è già presente, viene aggiunta alla categoria specificata nella rubrica.
    * Aggiunge un'attività alla categoria specificata nella rubrica.
    * Controlla se l'attività è già presente nella categoria prima di aggiungerla.
    * Restituisce true se l'aggiunta ha avuto successo, altrimenti restituisce false.
    * @param {string} categoria - La categoria a cui aggiungere l'attività.
    * @param {Object} attività - L'oggetto rappresentante l'attività da aggiungere.
    * @param {string} attività.nomeAttività - Il nome dell'attività.
    * @param {string} attività.dataAttività - La data dell'attività (nel formato "gg/mm/aaaa").
    * @returns {boolean} true se l'aggiunta ha avuto successo, altrimenti false.
    */
    aggiungiAttività(categoria, attività) {
        // Controlla se l'attività è già presente nella categoria
        for (const attivitàList of this.mappa.values()) 
            if (attivitàList.some(a => a.nomeAttività === attività.nomeAttività && a.dataAttività === attività.dataAttività))
                return false;
        // Aggiunge l'attività alla categoria
        if (!this.mappa.has(categoria))
            this.mappa.set(categoria, [attività]);
        else
            this.mappa.get(categoria).push(attività);
        return true;
    }
    /**
    * @description Elimina un'attività dalla rubrica.
    * Questa funzione ricerca l'attività specificata all'interno delle categorie della rubrica.
    * Se l'attività viene trovata, viene rimossa dalla categoria corrispondente.
    * Se la categoria da cui viene rimossa l'attività diventa vuota e non è una categoria predefinita ("Lavoro", "Personale", "Hobby"),
    * la categoria stessa viene eliminata dalla rubrica.
    * @param {Object} attivitàDaEliminare - L'oggetto rappresentante l'attività da eliminare.
    * @param {string} attivitàDaEliminare.nomeAttività - Il nome dell'attività da eliminare.
    * @param {string} attivitàDaEliminare.dataAttività - La data dell'attività da eliminare (nel formato "gg/mm/aaaa").
    */
    eliminaAttività(attivitàDaEliminare) {
        for (const [categoria, attivitàList] of this.mappa.entries()) {
            const indice = attivitàList.findIndex(a => a.nomeAttività === attivitàDaEliminare.nomeAttività && a.dataAttività === attivitàDaEliminare.dataAttività);
            if (indice !== -1) {
                attivitàList.splice(indice, 1);
                // Se trova l'attività e la elimini, controlla se la lista è vuota e se la categoria può essere eliminata.
                if (attivitàList.length === 0 && categoria !== 'Lavoro' && categoria !== 'Personale' && categoria !== 'Hobby') {
                    this.mappa.delete(categoria);
                }
                return;
            }
        }
    }
    /**
     * @description Cerca le attività contenenti le parole chiave specificate.
     * @param {string} paroleChiave - Le parole chiave da cercare nelle attività.
     * @returns {Map<string, Attività[]>} - Mappa delle categorie con le attività corrispondenti alle parole chiave.
     */
    ricercaAttività(paroleChiave) {
        // Converte le parole chiave in minuscolo per una ricerca case-insensitive
        const paroleChiaveLower = paroleChiave.toLowerCase();
        // Mappa per memorizzare i risultati della ricerca
        const risultatiMappa = new Map();
        // Itera attraverso le categorie e filtra le attività corrispondenti alle parole chiave
        for (const [categoria, attivitàList] of this.mappa.entries()) {
            // Controlla se il nome dell'attività contiene o inizia con le parole chiave
            const risultati = attivitàList.filter(attività => {
                const nomeAttività = attività.nomeAttività.toLowerCase();
                if (paroleChiaveLower.length === 1)
                    return nomeAttività.startsWith(paroleChiaveLower);
                else
                    return nomeAttività.includes(paroleChiaveLower);
            });
            // Se ci sono risultati, li aggiunge alla mappa dei risultati
            if (risultati.length > 0) {
                risultatiMappa.set(categoria, risultati);
            }
        }
        // Se non ci sono risultati, visualizza un messaggio di avviso
        if (Array.from(risultatiMappa.keys()).length === 0) {
            console.log("\n                       ════════════════════════════════════");
            console.log("                       !!!NESSUNA CORRISPONDENZA TROVATA!!!");
            console.log("                       ════════════════════════════════════\n");
            prompt("                        PREMERE INVIO PER CONTINUARE ...")
        }
        return risultatiMappa;
    }
    /**
     * @description Modifica un'attività esistente cambiando il suo nome e la sua data.
     * @param {string} vecchiaNomeAttività - Il nome dell'attività da modificare.
     * @param {string} nuovoNomeAttività - Il nuovo nome per l'attività.
     * @param {string} nuovaDataAttività - La nuova data per l'attività.
     * @returns {Object|boolean} - Restituisce l'attività duplicata se esiste, altrimenti true se la modifica è avvenuta con successo, false se l'attività non è stata trovata.
     */
    modificaAttività(vecchiaNomeAttività, nuovoNomeAttività, nuovaDataAttività) {
        let duplicatoNome = null;
        // Controllo duplicato per il nuovo nome e la nuova data
        this.mappa.forEach((attivitàList) => {
            attivitàList.forEach((a) => {
                if (a.nomeAttività === nuovoNomeAttività && a.dataAttività === nuovaDataAttività) 
                    duplicatoNome = a; // Trovato un duplicato
            });
        });
        // Se c'è un duplicato, restituire l'attività duplicata
        if (duplicatoNome) return duplicatoNome;
        // Itera su tutte le categorie e le rispettive liste di attività
        for (const [categoria, attivitàList] of this.mappa.entries()) {
            // Trova l'indice dell'attività da modificare
            const indice = attivitàList.findIndex(a => a.nomeAttività === vecchiaNomeAttività);
            if (indice !== -1) {
                let attività = attivitàList[indice];
                // Modifica dell'attività
                attività.nomeAttività = nuovoNomeAttività;
                attività.dataAttività = nuovaDataAttività;
                return true; // Modifica avvenuta con successo
            }
        }
        return false; // Attività non trovata
    }
    /**
     * @description Marca un'attività come completata.
     * @param {string} nomeAttività - Il nome dell'attività da marcare.
     * @returns {boolean} - True se l'attività è stata marcata, altrimenti false.
     */
    marcaAttività(nomeAttività) {
        // Itera attraverso le categorie per trovare l'attività da marcare
        for (const [categoria, attivitàList] of this.mappa.entries()) {
            const indice = attivitàList.findIndex(a => a.nomeAttività === nomeAttività);
            if (indice !== -1) {
                // Se l'attività viene trovata, imposta il flag di marcatura su true
                attivitàList[indice].marcaturaAttività = true;
                // Restituisce true per indicare che l'attività è stata marcata con successo
                return true;
            }
        }
        // Se l'attività non viene trovata, restituisce false
        return false;
    }
    /**
     * @description Questa funzione permette quando viene richiamata di visualizzare tutto l'elenco delle attività
     * con le corrispettive categorie, fa questo passando semplicemente la mappa alla funzione stampaMappa().
     * Questa funzione è utile quando noi vogliamo stampare tutto il contenuto della mappa dell'oggetto Promemoria. 
     */
    visualizzaTutte() {
        // Chiama la funzione per stampare la mappa delle attività
        this.stampaMappa(this.mappa);
    }
     /**
     * @description Stampa una mappa di attività, a differenza di visualizzaTutte() ci permette nel caso in cui facciamo una ricerca e abbiamo una mappa come risultato,
     * di stampare solo quella, indicando categoria, nome, data e stato di completamento.
     * @param {Map<string, Attività[]>} mappa - La mappa delle attività da stampare.
     */
    stampaMappa(mappa) {
        // Itera attraverso le categorie della mappa
        for (const [categoria, attivitàList] of mappa.entries()) {
            console.log("                    ════════════════════════════════════════════");
            console.log(`                      - ${categoria}`);
            if (attivitàList.length > 0) {
                let c = 0;
                //Il ciclo scorre attraverso ogni elemento nella lista delle attività (attivitàList).
                for (let i = 0; i < attivitàList.length; i++) {
                    //L'if controlla se l'attività corrente non è stata marcata come completata.
                    if (!attivitàList[i].marcaturaAttività) {
                        // Incrementa il contatore delle attività non marcate
                        c++;
                        console.log(`                      ${c}. ${attivitàList[i].nomeAttività} (${attivitàList[i].dataAttività})`);
                    }
                }
                //Il ciclo for scorre attraverso ogni elemento nella lista delle attività (attivitàList).
                for (let k = 0; k < attivitàList.length; k++) {
                    //L'if controlla se l'attività corrente è stata marcata come completata.
                    if (attivitàList[k].marcaturaAttività) {
                        // Incrementa il contatore delle attività marcate
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
/**
 * @description Questa funzione stampa un messaggio di avviso a console quando un valore non valido viene inserito.
 * Il messaggio di avviso è formattato per rendere il tutto più pulito.
 */
function testoValoreNonValido() {
    console.log("\n                               ═══════════════════════");
    console.log("                               !!!VALORE NON VALIDO!!!");
    console.log("                               ═══════════════════════\n");
}
/**
 * @description Salva le attività su un file JSON.
 * Questa funzione prende un'istanza di Promemoria e salva le sue attività su un file JSON.
 * La funzione utilizza la sincronizzazione del filesystem per scrivere direttamente sul file senza aspettare.
 * Se il file "src/promemoria.json" esiste già, verrà sovrascritto con le nuove attività.
 * @param {Promemoria} attività - L'istanza di Promemoria contenente le attività da salvare.
 */
function salvaAttivitàSuFile(attività) {
    // Utilizza il metodo writeFileSync di Node.js per scrivere direttamente sul file in modo sincrono
    // Viene convertita la mappa delle attività in un array di coppie chiave-valore e serializzata in formato JSON
    fs.writeFileSync("src/promemoria.json", JSON.stringify(Array.from(attività.mappa.entries())));
}
/**
 * @description Legge le attività da un file JSON e restituisce un'istanza di Promemoria.
 * Questa funzione legge le attività salvate in formato JSON da un file "src/promemoria.json".
 * Se il file non esiste o se si verifica un errore durante la lettura, viene restituita una nuova istanza di Promemoria vuota.
 * @returns {Promemoria} Un'istanza di Promemoria contenente le attività lette dal file, o una nuova istanza vuota se non è possibile leggere il file.
 */
function leggiAttivitàDaFile() {
    // Crea una nuova istanza di Promemoria
    const promemoria = new Promemoria();
    try {
        // Legge i dati dal file JSON in formato UTF-8
        const datiJSON = fs.readFileSync("src/promemoria.json", 'utf8');
        // Converte i dati JSON in una mappa di attività e aggiorna la mappa dell'istanza di Promemoria
        promemoria.mappa = new Map(JSON.parse(datiJSON));
        // Restituisce l'istanza di Promemoria con le attività lette dal file 
        return promemoria;
    } catch (errore) {
        // Se si verifica un errore durante la lettura del file, restituisce comunque l'istanza di Promemoria vuota
        return promemoria;
    }
}
/**
 * @description Questa funzione richiede all'utente di inserire una data nel formato "D/M/YY" tramite prompt.
 * Verifica la validità della data inserita, inclusi giorno, mese e anno.
 * Se la data è valida, la formatta nel formato richiesto e la restituisce.
 * Se la data inserita non è valida, mostra un messaggio di avviso e richiede nuovamente l'inserimento.
 * @returns {string} La data formattata nel formato "D/M/YY".
 */
function formattaData() {
    let dataAttività, controllo = false;
    do {
        // Richiede all'utente di inserire una data nel formato "D/M/YY"
        dataAttività = prompt("                    DATA (D/M/YY) > ");
        // Divide la data inserita in parti separate dal carattere '/'
        let parti = dataAttività.split('/');
         // Verifica se la data è stata suddivisa correttamente in tre parti (giorno, mese, anno)
        if (parti.length !== 3) {
            // Se la suddivisione non è corretta, mostra un messaggio di valore non valido e continua il ciclo
            testoValoreNonValido();
            continue;
        }
        // Converte le parti della data in numeri interi
        let giorno = parseInt(parti[0], 10);
        let mese = parseInt(parti[1], 10);
        let anno = parseInt(parti[2], 10);
        // Verifica se il parsing dei numeri ha restituito valori validi
        if (isNaN(giorno) || isNaN(mese) || isNaN(anno)) {
            // Se uno dei numeri non è valido, mostra un messaggio di valore non valido e continua il ciclo
            testoValoreNonValido();
            continue;
        }
        // Verifica se l'anno è nel formato a due cifre
        if (parti[2].length === 1||parti[2].length === 3) {
            // Se l'anno è nel formato non valido, mostra un messaggio di valore non valido e continua il ciclo
            testoValoreNonValido();
            continue;
        } else if (parti[2].length === 2) {
            // Se l'anno è nel formato a due cifre, aggiunge il prefisso '20' per ottenere un formato a quattro cifre
            anno += 2000;
        }

        // Verifica la validità del giorno e del mese
        if (giorno < 1 || giorno > 31 || mese < 1 || mese > 12) {
            // Se il giorno o il mese non sono validi, mostra un messaggio di valore non valido e continua il ciclo
            testoValoreNonValido();
            continue;
        }
        // Aggiunge zero iniziale al mese o giorno nel caso in cui si inserisce un numero inferiore di 10.
        if (giorno < 10) giorno = '0' + giorno;
        if (mese < 10) mese = '0' + mese;
        // Se tutte le condizioni sono soddisfatte, imposta controllo a true e ritorna la data formattata.
        controllo = true;
        return giorno + '/' + mese + '/' + anno;
    } while (!controllo);
}
/**
 * @description Questa funzione gestisce l'interfaccia utente per aggiungere un'attività al promemoria.
 * Mostra un'intestazione grafica e visualizza tutte le attività presenti nel promemoria.
 * Richiede all'utente di inserire la categoria e il nome dell'attività.
 * Verifica la validità della categoria e del nome inseriti.
 * Chiede all'utente di inserire la data dell'attività utilizzando la funzione `formattaData`.
 * Aggiunge l'attività al promemoria utilizzando il metodo `aggiungiAttività`.
 * Se l'aggiunta è riuscita, mostra un messaggio di conferma, altrimenti mostra un messaggio di errore e richiede nuovamente l'inserimento.
 * @param {Promemoria} promemoria - L'istanza di Promemoria a cui aggiungere l'attività.
 */
function aggiungiAttività(promemoria) {
    // Pulisce la console per una visualizzazione pulita.
    console.clear(); 
    // Visualizza un'intestazione grafica.
    console.log("                    ╔══════════════════════════════════════════╗");
    console.log("                    ║      ___            _                _   ║");
    console.log("                    ║     / _ |___ ____ _(_)_ _____  ___ _(_)  ║");
    console.log("                    ║    / __ / _ `/ _ `/ / // / _ \\/ _ `/ /   ║");
    console.log("                    ║   /_/ |_\\_, /\\_, /_/\\_,_/_//_/\\_, /_/    ║");
    console.log("                    ║         \\__//\\__/            \\__/        ║");
    console.log("                    ║                                          ║");
    console.log("                    ╚══════════════════════════════════════════╝\n");
     // Visualizza tutte le attività presenti nel promemoria.
    promemoria.visualizzaTutte();
    let categoriaAttività;
    let nomeAttività;
    // Ciclo per richiedere la categoria finché non è valida (non vuota).
    do {
        categoriaAttività = prompt("                    CATEGORIA > ");
        // Formatta la categoria inserita per avere la prima lettera maiuscola e le altre minuscole.
        categoriaAttività = categoriaAttività.charAt(0).toUpperCase() + categoriaAttività.slice(1).toLowerCase();
        if (categoriaAttività.length === 0)
            // Se la categoria è vuota, mostra un messaggio di valore non valido.
            testoValoreNonValido();
    } while (categoriaAttività.length === 0);
    console.log();
    // Ciclo per richiedere il nome dell'attività finché non è valido (non vuoto).
    do {
        nomeAttività = prompt("                    NOME > ");
        // Formatta il nome inserito per avere la prima lettera maiuscola e le altre minuscole.
        nomeAttività = nomeAttività.charAt(0).toUpperCase() + nomeAttività.slice(1).toLowerCase();
        if (nomeAttività.length === 0) 
            // Se il nome dell'attività è vuoto, mostra un messaggio di valore non valido.
            testoValoreNonValido();
    } while (nomeAttività.length === 0);
    console.log();
    // Richiede all'utente di inserire la data dell'attività utilizzando la funzione formattaData.
    let dataAttività=formattaData();
    // Aggiunge l'attività al promemoria utilizzando il metodo aggiungiAttività.
    let controlloDoppioni=promemoria.aggiungiAttività(categoriaAttività, new Attività(nomeAttività, dataAttività));
    if(controlloDoppioni===true){
        // Se l'aggiunta è riuscita, mostra un messaggio di conferma.
        console.log("\n                           ═══════════════════════════════");
        console.log("                           ATTIVITÀ AGGIUNTA CON SUCCESSO!");
        console.log("                           ═══════════════════════════════\n");
        prompt("                           PREMERE INVIO PER CONTINUARE ...");
    }else{
        // Se l'aggiunta non è riuscita (a causa di attività duplicate), mostra un messaggio di errore.
        console.log("\n ══════════════════════════════════════════════════════════════════════════════════");
        console.log(" !!!ATTENZIONE, DUE ATTIVITÀ CON LO STESSO NOME NON POSSONO AVERE LA STESSA DATA!!!");
        console.log(" ══════════════════════════════════════════════════════════════════════════════════\n");
        prompt("                           PREMERE INVIO PER CONTINUARE ...");
        aggiungiAttività(promemoria);     
    }
}
/**
 * @description Questa funzione gestisce la selezione di un'attività dai risultati di una ricerca nel promemoria.
 * Verifica se l'array di attività restituito come risultato della ricerca contiene almeno un elemento.
 * Se è presente esattamente una sola attività nei risultati, crea e restituisce un'istanza di Attività con i dettagli dell'attività trovata.
 * Se ci sono più risultati, richiede all'utente di specificare la data per selezionare un'attività specifica.
 * Restituisce null se non è stata trovata alcuna attività nei risultati o se l'input dell'utente non è valido.
 * @param {Promemoria} promemoria - L'istanza di Promemoria su cui è stata eseguita la ricerca.
 * @param {Map} risultati - Una mappa contenente i risultati della ricerca, con le categorie come chiavi e un array di attività come valori.
 * @param {string[]} attività - Un array contenente le attività corrispondenti alla ricerca dell'utente.
 * @returns {Attività|null} Un'istanza di Attività con i dettagli dell'attività selezionata, se esiste una sola attività nei risultati o se l'utente ha selezionato un'attività specifica tramite la data.
 */
function selezionaAttivitàNeiRisultati(promemoria,risultati, attività) {
    let attivitàSelezionata;
    if(attività.length>0){
        // Verifica se è presente almeno un'attività nell'array dei risultati.
        if (Array.from(risultati.keys()).length === 1 && Array.from(risultati.values())[0].length === 1) {
            // Se è stata trovata esattamente una attività nei risultati,
            // crea un'istanza di Attività con i dettagli dell'attività trovata.
            attivitàSelezionata = new Attività(
                Array.from(risultati.values())[0][0].nomeAttività,
                Array.from(risultati.values())[0][0].dataAttività
            );
        } else {
            // Se ci sono più risultati, richiede all'utente di specificare la data per selezionare un'attività specifica.
            console.clear();
            console.log("\n    ════════════════════════════════════════════════════════════════════════════");
            console.log("    !!!ATTENZIONE, LA RICERCA HA AVUTO PIÙ RISULTATI, SPECIFICARE CON LA DATA!!!");
            console.log("    ════════════════════════════════════════════════════════════════════════════\n");
            // Visualizza i risultati della ricerca.
            promemoria.stampaMappa(risultati);
            let dataAttività;
            let categoria;
            // Ciclo per richiedere all'utente di specificare la data dell'attività.
            do {
                // Richiede all'utente di inserire la data dell'attività utilizzando la funzione formattaData.
                dataAttività = formattaData();
                // Trova la categoria corrispondente alla data inserita dall'utente.
                categoria = Array.from(risultati).find(([key, value]) => {
                    return value.some(activity => activity.dataAttività === dataAttività);
                });
                if (!categoria) 
                    // Se la categoria non è stata trovata, mostra un messaggio di valore non valido.
                    testoValoreNonValido();
            } while (!categoria);
                // Crea un'istanza di Attività con la data specificata dall'utente.
                attivitàSelezionata = new Attività(attività, dataAttività);
        }
        console.clear();
        console.log("\n                                 ══════════════════");
        console.log("                                  ATTIVITÀ TROVATA ");
        console.log("                                 ══════════════════\n");
        let chiave = null;
        // Trova la categoria corrispondente all'attività selezionata.
        risultati.forEach((val, key) => {
            if (val.some(activity => activity.nomeAttività === attivitàSelezionata.nomeAttività && activity.dataAttività === attivitàSelezionata.dataAttività)) {
                chiave = key;
                return;
            }
        });
        // Visualizza l'attività selezionata.
        promemoria.stampaMappa(new Map([[chiave, [attivitàSelezionata]]]));
        return attivitàSelezionata;
    }else{
        // Se non ci sono attività nei risultati, mostra un messaggio di valore non valido.
        testoValoreNonValido();
        prompt("                           PREMERE INVIO PER CONTINUARE ...");
        return null;
    }
}
/**
 * @description Questa funzione gestisce la cancellazione di un'attività dal promemoria.
 * Inizia cancellando il contenuto della console per una visualizzazione pulita.
 * Visualizza tutte le attività presenti nel promemoria.
 * Richiede all'utente di inserire il nome dell'attività da cancellare.
 * Esegue una ricerca delle attività corrispondenti al nome inserito dall'utente.
 * Se vengono trovati risultati validi, chiede all'utente di confermare la cancellazione dell'attività selezionata.
 * Se l'utente conferma, la funzione procede a eliminare l'attività dal promemoria.
 * Al termine, mostra un messaggio di conferma o annullamento dell'operazione e richiede all'utente di premere INVIO per continuare.
 * @param {Promemoria} promemoria - L'istanza di Promemoria da cui cancellare l'attività.
 */
function cancellaAttività(promemoria) {
    // Pulisce la console per una visualizzazione pulita.
    console.clear();
    // Variabile per memorizzare l'attività da eliminare.
    let attivitàDaEliminare;
    // Visualizza un'intestazione grafica nella console.
    console.log("                      ╔═════════════════════════════════════╗");
    console.log("                      ║    _____                  ____      ║");
    console.log("                      ║   / ___/__ ____  _______ / / /__ _  ║");
    console.log("                      ║  / /__/ _  / _ \\/ __/ -_) / / _  /  ║");
    console.log("                      ║  \\___/\\___/_//_/\\__/\\__/_/_/\\___/   ║");
    console.log("                      ║                                     ║");
    console.log("                      ╚═════════════════════════════════════╝\n");
    // Visualizza tutte le attività presenti nel promemoria.
    promemoria.visualizzaTutte();
    let attività = prompt("                      ATTIVITÀ > ");
    // Richiede all'utente di inserire il nome dell'attività da cancellare e lo formatta correttamente.
    attività = attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase()
    // Esegue una ricerca delle attività corrispondenti al nome inserito dall'utente.
    let risultati = promemoria.ricercaAttività(attività);
    // Verifica se sono stati trovati risultati validi.
    if (Array.from(risultati.keys()).length > 0) {
        let conferma;
         // Seleziona un'attività dai risultati della ricerca.
        attivitàDaEliminare = selezionaAttivitàNeiRisultati(promemoria,risultati, attività);
        // Verifica se è stata selezionata un'attività valida.
        if(attivitàDaEliminare!==null){
            do {
                // Visualizza un menu di conferma per l'eliminazione dell'attività.
                console.log("                         ┌─────────────────────────────────┐");
                console.log("                         │ VUOI ELIMINARE?                 │");
                console.log("                         │ 1 : SÌ                          │");
                console.log("                         │ 2 : NO                          │");
                console.log("                         └─────────────────────────────────┘")
                conferma = parseInt(prompt("                          > "));
                // Gestisce la scelta dell'utente.
                switch (conferma) {
                    case 1: {
                        // Se l'utente conferma, procede con l'eliminazione dell'attività selezionata.
                        promemoria.eliminaAttività(attivitàDaEliminare);
                        console.log("\n                        ══════════════════════════════════════");
                        console.log("                        !!!ATTIVITÀ CANCELLATA CON SUCCESSO!!!");
                        console.log("                        ══════════════════════════════════════\n");
                        break;
                    }
                    case 2: {
                        // Se l'utente annulla l'operazione, mostra un messaggio di annullamento.
                        console.log("\n                               ══════════════════════════");
                        console.log("                               !!!OPERAZIONE ANNULLATA!!!");
                        console.log("                               ══════════════════════════\n");
                        break;
                    }
                    default: {
                        // Se l'utente inserisce un valore non valido, mostra un messaggio di errore.
                        testoValoreNonValido()
                        break;
                    }
                }
                // Richiede all'utente di premere INVIO per continuare e pulisce la console per una nuova iterazione.
                prompt("                           PREMERE INVIO PER CONTINUARE ...");
                console.clear();
                // Continua il ciclo finché l'utente non conferma o annulla l'operazione.
            } while (conferma !== 1 && conferma !== 2);
        }
    } 
}
/**
 * @description Questo metodo consente di modificare il nome e/o la data di un'attività esistente all'interno del promemoria.
 * L'utente può scegliere di modificare solo il nome, solo la data, entrambi o annullare l'operazione.
 * Il processo di modifica è suddiviso in diverse fasi:
 * 1. Visualizzazione di tutte le attività presenti.
 * 2. Richiesta del nome dell'attività da modificare.
 * 3. Ricerca dell'attività inserita.
 * 4. Selezione dell'attività corretta se ci sono più risultati.
 * 5. Richiesta dell'operazione di modifica (nome, data o entrambi).
 * 6. Modifica dell'attività.
 * @param {Object} promemoria - Oggetto che gestisce le attività e le operazioni su di esse.
 */
function modificaAttività(promemoria) {
    // Inizializza la variabile per l'attività da modificare.
    let attivitàDaModificare;
    // Pulisce la console per una visualizzazione chiara.
    console.clear();
    // Visualizza il titolo dell'operazione.
    console.log("              ╔═════════════════════════════════════════════════════╗");
    console.log("              ║       __  _______  ____  _______________________    ║");
    console.log("              ║      /  |/  / __ \\/ __ \\/  _/ ____/  _/ ____/   |   ║");
    console.log("              ║     / /|_/ / / / / / / // // /_   / // /   / /| |   ║");
    console.log("              ║    / /  / / /_/ / /_/ // // __/ _/ // /___/ ___ |   ║");
    console.log("              ║   /_/  /_/\\____/_____/___/_/   /___/\\____/_/  |_|   ║");
    console.log("              ║                                                     ║");
    console.log("              ╚═════════════════════════════════════════════════════╝\n");
    // Visualizza tutte le attività presenti nel promemoria.
    promemoria.visualizzaTutte();
    // Richiede all'utente di inserire il nome dell'attività da modificare.
    let attività = prompt("              ATTIVITÀ > ");
    // Formatta il nome dell'attività inserito dall'utente.
    attività = attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase();
    // Ricerca le attività corrispondenti al nome inserito.
    let risultati = promemoria.ricercaAttività(attività);
    // Verifica se ci sono risultati della ricerca.
    if (Array.from(risultati.keys()).length > 0) {
        let conferma;
        // Seleziona l'attività da modificare dai risultati della ricerca.
        attivitàDaModificare = selezionaAttivitàNeiRisultati(promemoria, risultati, attività);
        // Verifica se l'attività selezionata è valida.
        if (attivitàDaModificare !== null) {
            do {
                // Visualizza le opzioni di modifica.
                console.log("                            ┌───────────────────────────┐");
                console.log("                            │COSA DESIDERI MODIFICARE ? │");
                console.log("                            │1: NOME                    │");
                console.log("                            │2: DATA                    │");
                console.log("                            │3: ENTRAMBI (NOME E DATA)  │");
                console.log("                            │4: TORNA INDIETRO          │");
                console.log("                            └───────────────────────────┘");
                // Richiede all'utente di selezionare un'opzione.
                conferma = parseInt(prompt("                             > "));
                console.log();
                // Inizializza la variabile per il nome e la data dell'attività.
                let nomeAttività = attivitàDaModificare.nomeAttività;
                let dataAttività = attivitàDaModificare.dataAttività;
                let nuovoNomeAttività = null;
                let nuovaDataAttività = null;
                switch (conferma) {
                    case 3:
                    case 1: {
                        // Chiede all'utente di inserire il nuovo nome dell'attività.
                        console.log("                                ═══════════════════════");
                        console.log("                                INSERISCI IL NUOVO NOME");
                        console.log("                                ═══════════════════════");
                        do {
                            // Richiede all'utente di inserire il nuovo nome.
                            nuovoNomeAttività = prompt("                                > ");
                            // Formatta il nuovo nome dell'attività.
                            nuovoNomeAttività = nuovoNomeAttività.charAt(0).toUpperCase() + nuovoNomeAttività.slice(1).toLowerCase();
                            // Verifica se il nome inserito è valido.
                            if (nuovoNomeAttività.length === 0) 
                                testoValoreNonValido();
                        } while (nuovoNomeAttività.length === 0);
                        // Se solo il nome deve essere modificato.
                        if (conferma !== 3) {
                            let risultatoModifica = promemoria.modificaAttività(nomeAttività, nuovoNomeAttività, dataAttività);
                            if (risultatoModifica === true) {
                                console.log("\n                     ═══════════════════════════════════════════");
                                console.log("                     NOME DELL'ATTIVITÀ MODIFICATO CON SUCCESSO!");
                                console.log("                     ═══════════════════════════════════════════\n");
                            } else {
                                console.log("\n  ════════════════════════════════════════════════════════════════════════════════════");
                                console.log("  !!!ERRORE: DUE ATTIVITÀ NON POSSONO AVERE SIA LO STESSO NOME E SIA LA STESSA DATA!!!");
                                console.log("  ════════════════════════════════════════════════════════════════════════════════════\n");
                            }
                            break;
                        } else console.log();
                    }
                    // Se solo la data deve essere modificata o sia il nome che la data.
                    case 2: {
                        console.log("                           ════════════════════════════════");
                        console.log("                           INSERISCI LA NUOVA DATA (D/M/YY)");
                        console.log("                           ════════════════════════════════\n");
                        do {
                            nuovaDataAttività = formattaData();
                            if (nuovaDataAttività.length === 0) 
                                testoValoreNonValido();
                        } while (nuovaDataAttività.length === 0);
                        let risultatoModifica = promemoria.modificaAttività(nomeAttività, conferma === 3 ? nuovoNomeAttività : nomeAttività, nuovaDataAttività);
                        if (risultatoModifica === true) {
                            console.log("\n                      ═══════════════════════════════════════════");
                            console.log("                      DATA DELL'ATTIVITÀ MODIFICATA CON SUCCESSO!");
                            console.log("                      ═══════════════════════════════════════════\n");
                        } else {
                            console.log("\n  ════════════════════════════════════════════════════════════════════════════════════");
                            console.log("  !!!ERRORE: DUE ATTIVITÀ NON POSSONO AVERE SIA LO STESSO NOME E SIA LA STESSA DATA!!!");
                            console.log("  ════════════════════════════════════════════════════════════════════════════════════\n");
                        }
                        break;
                    }
                    // Se l'utente desidera tornare indietro e annullare la modifica.
                    case 4: {
                        console.log("\n                                  ═══════════════════");
                        console.log("                                  MODIFICA ANNULLATA!");
                        console.log("                                  ═══════════════════\n");
                        break;
                    }
                    // Se l'utente inserisce una scelta non valida.
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
 * @param {Promemoria} promemoria - L'istanza del promemoria in cui si trova l'attività da segnare.
 */
function marcaturaAttività(promemoria) {
    // Pulisce la console.
    console.clear();
    // Visualizza il titolo.
    console.log("                ╔═════════════════════════════════════════════════╗");
    console.log("                ║     __  ___                  __                 ║");
    console.log("                ║    /  |/  /__ ____________ _/ /___ ___________  ║");
    console.log("                ║   / /|_/ / _ `/ __/ __/ _ `/ __/ // / __/ _ `/  ║");
    console.log("                ║  /_/  /_/\\_,_/_/  \\__/\\_,_/\\__/\\_,_/_/  \\_,_/   ║");
    console.log("                ║                                                 ║");
    console.log("                ╚═════════════════════════════════════════════════╝\n");
    // Visualizza tutte le attività nel promemoria.
    promemoria.visualizzaTutte();
    // Richiede all'utente di inserire il nome dell'attività da segnare.
    let attività = prompt("                ATTIVITÀ > ");
    // Formatta il nome dell'attività.
    attività = attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase();
    // Ricerca l'attività nel promemoria.
    let risultati = promemoria.ricercaAttività(attività);
    // Verifica se sono stati trovati risultati.
    if (Array.from(risultati.keys()).length > 0) {
        let conferma;
        // Seleziona l'attività nei risultati.
        attivitàDaMarcare = selezionaAttivitàNeiRisultati(promemoria, risultati, attività);
        // Verifica se l'attività è stata selezionata correttamente.
        if(attivitàDaMarcare!==null){
            do {
                // Visualizza le opzioni di marcatura.
                console.log("                            ┌──────────────────────────┐");
                console.log("                            │SEGNARE COME COMPLETATA?  │");
                console.log("                            │1: SÌ                     │");
                console.log("                            │2: ANNULLA                │");
                console.log("                            └──────────────────────────┘");
                // Richiede all'utente di inserire una scelta.
                conferma = parseInt(prompt("                            > "));
                switch (conferma) {
                    case 1: {
                        // Segna l'attività come completata nel promemoria.
                        promemoria.marcaAttività(attivitàDaMarcare.nomeAttività)
                        console.log("\n                           ═══════════════════════════════");
                        console.log("                            ATTIVITÀ SEGNATA COME SVOLTA!");
                        console.log("                           ═══════════════════════════════\n");
                        break;
                    }
                    case 2: {
                        // Visualizza un messaggio di annullamento.
                        console.log("\n                           ═══════════════════════════════");
                        console.log("                            MODIFICA MARCATURA ANNULLATA!");
                        console.log("                           ═══════════════════════════════\n");
                        break;
                    }
                    default: {
                        // Visualizza un messaggio di errore per scelta non valida.
                        console.log("\n                              ═══════════════════════");
                        console.log("                              !!!SCELTA NON VALIDA!!!");
                        console.log("                              ═══════════════════════\n");
                        break;
                    }
                }
                // Richiede all'utente di premere Invio per continuare.
                prompt("                          PREMERE INVIO PER CONTINUARE ...");
                // Pulisce la console.
                console.clear();
            } while (conferma !== 1 && conferma !== 2);
        }
    }
}
/**
 * @description La funzione `menuModifica` mostra un menu all'utente attraverso la console, dove possono selezionare diverse opzioni
 * per modificare le attività del promemoria. Dopo ogni interazione con l'utente, la funzione chiama le funzioni appropriate
 * per eseguire l'azione richiesta, come aggiungere, cancellare, modificare o marcare un'attività. Il menu viene visualizzato
 * finché l'utente sceglie di tornare indietro al menu principale. Se l'utente inserisce un'opzione non valida, viene mostrato
 * un messaggio di errore e l'utente viene invitato a premere INVIO per continuare.
 * @param {Array} promemoria - Un array contenente le attività del promemoria.
 */
function menuModifica(promemoria) {
    // Variabile per memorizzare la scelta dell'utente nel menu.
    let scelta = 0;
    do {
        // Pulisce la console ad ogni iterazione per una migliore visualizzazione.
        console.clear();
        // Stampa il titolo del menu.
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
        // Richiede all'utente di inserire la scelta.
        scelta = parseInt(prompt("                             > "));
        // Legge le attività da un file e le memorizza in un array in modo che sia sempre aggiornato.
        vet = leggiAttivitàDaFile();
        // Gestisce la scelta dell'utente.
        switch (scelta) {
            case 1: {
                // Chiamata alla funzione per aggiungere un'attività.
                aggiungiAttività(promemoria); 
                break;
            }
            case 2: {
                // Chiamata alla funzione per cancellare un'attività.
                cancellaAttività(promemoria); 
                break;
            }
            case 3: {
                // Chiamata alla funzione per modificare un'attività.
                modificaAttività(promemoria); 
                break;
            }
            case 4: {
                // Chiamata alla funzione per marcare un'attività.
                marcaturaAttività(promemoria); 
                break;
            }
            case 5: {
                // Termina il ciclo do-while e ritorna al menu principale
                break;
            }
            default:
                {
                    // Mostra un messaggio di errore se l'input non è valido.
                    testoValoreNonValido();
                    // Richiede all'utente di premere INVIO per continuare.
                    prompt("                          PREMERE INVIO PER CONTINUARE ...");
                    break;
                }
        }
        // Continua a visualizzare il menu finché l'utente non sceglie di tornare indietro
    } while (scelta !== 5);
}
/**
 * @description Questa funzione visualizza l'elenco di tutte le attività presenti nel promemoria.
 * La funzione accetta un array contenente le attività del promemoria come parametro.
 * La funzione `elencoAttività` pulisce la console per una visualizzazione più pulita e quindi mostra l'elenco di tutte le attività presenti nel promemoria utilizzando console.log.
 * Visualizza un titolo dell'elenco attività e poi chiama il metodo "visualizzaTutte" sull'oggetto promemoria per visualizzare tutte le attività.
 * Infine, richiede all'utente di premere INVIO per continuare.
 * @param {Array} promemoria - Un array contenente le attività del promemoria.
 */
function elencoAttività(promemoria) {
    // Pulisce la console per una visualizzazione più pulita.
    console.clear();
    console.log("                          ╔═══════════════════════════════╗");
    console.log("                          ║     ______                    ║");
    console.log("                          ║    / __/ /__ ___  _______     ║");
    console.log("                          ║   / _// / -_) _ \\/ __/ _ \\    ║");
    console.log("                          ║  /___/_/\\__/_//_/\\__/\\___/    ║");
    console.log("                          ║                               ║");
    console.log("                          ╚═══════════════════════════════╝\n");
    // Visualizza tutte le attività del promemoria utilizzando il metodo "visualizzaTutte".
    promemoria.visualizzaTutte();
    // Richiede all'utente di premere INVIO per continuare.
    prompt("                           PREMERE INVIO PER CONTINUARE ...");
}
/**
 * @description La funzione `trovaAttività` permette all'utente di inserire una stringa di ricerca per cercare un'attività nel promemoria.
 * Una volta eseguita la ricerca, i risultati vengono visualizzati utilizzando console.log.
 * @param {Array} promemoria - Un array contenente le attività del promemoria.
 */
function trovaAttività(promemoria) {
    // Pulisce la console per una visualizzazione più pulita.
    console.clear();
     // Stampa il titolo della funzione di ricerca attività.
    console.log("                       ╔═══════════════════════════════════╗");
    console.log("                       ║     ___  _                        ║");
    console.log("                       ║    / _ \\(_)______ ___________ _   ║");
    console.log("                       ║   / , _/ / __/ -_) __/ __/ _ `/   ║");
    console.log("                       ║  /_/|_/_/\\__/\\__/_/  \\__/\\_,_/    ║");
    console.log("                       ║                                   ║")
    console.log("                       ╚═══════════════════════════════════╝\n");
    // Richiede all'utente di inserire l'attività da cercare.
    let attività = prompt("                       ATTIVITÀ > ");
    // Aggiunge una riga vuota per una migliore leggibilità.
    console.log();
    // Esegue la ricerca dell'attività nel promemoria.
    let risultati = promemoria.ricercaAttività(attività.charAt(0).toUpperCase() + attività.slice(1).toLowerCase());
    // Se vengono trovati risultati.
    if ((risultati.size != 0)) {
        // Stampa i risultati utilizzando il metodo "stampaMappa".
        promemoria.stampaMappa(risultati);
        // Richiede all'utente di premere INVIO per continuare.
        prompt("                       PREMERE INVIO PER CONTINUARE ...")
    }
}
/**
 * @description La funzione `parseDate` accetta una stringa nel formato "gg/mm/yyyy" e restituisce un oggetto Data JavaScript corrispondente.
 * Viene divisa la stringa della data in giorno, mese e anno utilizzando il carattere "/".
 * Quindi viene creato e restituito un nuovo oggetto Data JavaScript utilizzando i valori ottenuti dalla stringa.
 * È importante notare che si sottrae 1 dal mese poiché JavaScript rappresenta i mesi da 0 a 11.
 * @param {string} dataAttività - Una stringa che rappresenta la data nel formato "gg/mm/yyyy".
 * @returns {Date} - Un oggetto Data JavaScript che rappresenta la data specificata dalla stringa.
 */
function parseDate(dataAttività) {
    // Divide la stringa della data in giorno, mese e anno utilizzando il carattere "/".
    const [day, month, year] = dataAttività.split('/');
    // Crea e restituisce un nuovo oggetto Data JavaScript utilizzando i valori ottenuti dalla stringa,
    // si sottrae 1 dal mese poiché JavaScript rappresenta i mesi da 0 a 11.
    return new Date(year, month - 1, day);
}
/**
 * @description Questa funzione gestisce la visualizzazione delle notifiche relative alle attività del promemoria.
 * Le notifiche vengono generate in base alla data delle attività e al loro stato di completamento.
 * Le notifiche vengono visualizzate utilizzando console.log con colori per differenziare i diversi tipi di notifiche.
 * La funzione mostra le seguenti categorie di notifiche:
 * - Attività in scadenza oggi, evidenziate in giallo.
 * - Attività in scadenza, evidenziate in verde.
 * - Attività scadute, evidenziate in rosso.
 * - Attività completate, evidenziate in rosso con il testo barrato.
 * Se non ci sono attività nel promemoria, viene mostrato un messaggio indicando l'assenza di notifiche.
 * La funzione accetta un array contenente le attività del promemoria e le elabora per generare le notifiche.
 * Successivamente, le notifiche vengono stampate a schermo in ordine di priorità.
 * @param {Array} promemoria - Un array contenente le attività del promemoria.
 */
function notificheAttività(promemoria) {
    // Pulisce la console per una visualizzazione più pulita.
    console.clear();
    // Stampa il titolo delle notifiche attività.
    console.log("                  ╔═════════════════════════════════════════╗");
    console.log("                  ║                                         ║");
    console.log("                  ║     _  __     __  _ ____     __         ║");
    console.log("                  ║    / |/ /__  / /_(_) _(_)___/ /  ___    ║");
    console.log("                  ║   /    / _ \\/ __/ / _/ / __/ _ \\/ -_)   ║");
    console.log("                  ║  /_/|_/\\___/\\__/_/_//_/\\__/_//_/\\__/    ║");
    console.log("                  ║                                         ║")
    console.log("                  ╚═════════════════════════════════════════╝\n");
    // Variabile per verificare se le categorie sono vuote.
    let vuoto = true;
    // Controlla se ci sono attività presenti nel promemoria.
    promemoria.mappa.forEach((attivitàList) => {
        if (attivitàList.length > 0) 
            // Imposta vuoto su false se ci sono attività presenti.
            vuoto = false;
    });
    // Se il promemoria è vuoto, mostra un messaggio e termina la funzione.
    if (vuoto) {
        console.log("                      ╔═════════════════════════════════╗");
        console.log("                      ║Nessuna notifica da visualizzare.║");
        console.log("                      ╚═════════════════════════════════╝");
        // Richiede all'utente di premere INVIO per continuare.
        prompt("\n                       PREMERE INVIO PER CONTINUARE ...");
        return;
    }
     // Ottiene la data corrente.
    const currentDate = new Date();
    // Imposta la data a mezzanotte per confronti precisi.
    currentDate.setHours(0, 0, 0, 0);

    // Vettori per memorizzare le attività utili per la stampa finale ordinata.
    const scadenzaOggi = [];
    const inScadenza = [];
    const scadute = [];
    const completate = [];
    // Itera attraverso le attività nel promemoria.
    promemoria.mappa.forEach((attivitàList, key) => {
        attivitàList.forEach((attività) => {
            // Converte la data dell'attività in un oggetto Data JavaScript.
            const inputDate = parseDate(attività.dataAttività);
            // Se la data non è valida, mostra un messaggio di errore.
            if (isNaN(inputDate.getTime())) {
                console.log(`La data per ${attività.nomeAttività} (${key}) non è valida.`);
            } else {
                // Imposta la data a mezzanotte per confronti precisi.
                inputDate.setHours(0, 0, 0, 0);
                // Verifica lo stato dell'attività in base alla data e alla marcatura.
                //Vengono utilizzate le seguenti sequenze di escape ANSI:
                //"\x1b[31m": Imposta il colore del testo su rosso se l'attività è scaduta.
                //"\x1b[9m": Applica la modalità "barrato" al testo se l'attività è marcata come completata.
                //"\x1b[33m": Imposta il colore del testo su giallo se l'attività è in scadenza.
                //"\x1b[32m": Imposta il colore del testo su verde se l'attività non è in scadenza.
                //"\x1b[0m": Reimposta il colore del testo al valore predefinito.
                if (attività.marcaturaAttività) 
                    completate.push(`\x1b[31m       L'attività :\x1b[9m (${key}) ${attività.nomeAttività} è stata completata.\x1b[0m`);
                else if (inputDate.getTime() === currentDate.getTime()) 
                    scadenzaOggi.push(`\x1b[33m       L'attività : (${key}) ${attività.nomeAttività} è in scadenza oggi.\x1b[0m`);
                else if (inputDate.getTime() > currentDate.getTime()) 
                    inScadenza.push(`\x1b[32m       L'attività : (${key}) ${attività.nomeAttività} è in scadenza il ${attività.dataAttività}.\x1b[0m`);
                else 
                    scadute.push(`\x1b[31m       L'attività : (${key}) ${attività.nomeAttività} è scaduta il ${attività.dataAttività}.\x1b[0m`);
            }
        });
    });
    // Stampa le notifiche in ordine di priorità.
    scadenzaOggi.forEach((msg) => console.log(msg));
    inScadenza.forEach((msg) => console.log(msg));
    scadute.forEach((msg) => console.log(msg));
    completate.forEach((msg) => console.log(msg));
    // Richiede all'utente di premere INVIO per continuare.
    prompt("\n                       PREMERE INVIO PER CONTINUARE ...");
}
/**
 * @description Questa funzione gestisce il menu di visualizzazione delle attività del promemoria.
 * La funzione accetta un array contenente le attività del promemoria come parametro.
 * La funzione `menuVisualizzazione` mostra un menu all'utente attraverso la console, 
 * consentendo loro di selezionare diverse opzioni per visualizzare le attività del promemoria. 
 * Il menu viene visualizzato finché l'utente non sceglie di tornare indietro al menu principale.
 * @param {Array} promemoria - Un array contenente le attività del promemoria.
 */
function menuVisualizzazione(promemoria) {
    // Variabile per memorizzare la scelta dell'utente nel menu.
    let scelta = 0;
    // Ciclo do-while per visualizzare il menu e gestire le interazioni utente.
    do {
        // Pulisce la console ad ogni iterazione per una migliore visualizzazione.
        console.clear();
        // Stampa il titolo del menu di visualizzazione delle attività.
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
        // Richiede all'utente di inserire la scelta.
        scelta = parseInt(prompt("                          > "));
        // Gestisce la scelta dell'utente.
        switch (scelta) {
            // Chiamata alla funzione per visualizzare l'elenco delle attività.
            case 1: {
                elencoAttività(promemoria);
                break;
            }
            case 2: {
                // Chiamata alla funzione per cercare un'attività.
                trovaAttività(promemoria);
                break;
            }
            case 3: {
                // Chiamata alla funzione per visualizzare le notifiche delle attività.
                notificheAttività(promemoria);
                break;
            }
            case 4: {
                // Termina il ciclo do-while e ritorna al menu principale.
                break;
            }
            default:
                // Mostra un messaggio di errore se l'input non è valido.
                testoValoreNonValido()
                // Richiede all'utente di premere INVIO per continuare.
                prompt("                         PREMERE INVIO PER CONTINUARE ...");
                break;
        }
        // Continua a visualizzare il menu finché l'utente non sceglie di tornare indietro.
    } while (scelta !== 4);
}
/**
 * @description La funzione 'main' mostra un menu all'utente attraverso la console, consentendo loro di scegliere tra diverse opzioni
 * per gestire e visualizzare le attività del promemoria. Il menu viene visualizzato finché l'utente sceglie di salvare ed uscire dal programma.
 * All'interno del menu principale, vengono chiamate le funzioni `menuModifica`, `menuVisualizzazione` e `salvaAttivitàSuFile`
 * per gestire le operazioni di gestione, visualizzazione e salvataggio delle attività rispettivamente.
 */
function main() {
    // Variabile per memorizzare la scelta dell'utente nel menu principale.
    let scelta = 0;
    // Legge le attività da un file all'avvio del programma.
    let promemoria = leggiAttivitàDaFile();
    // Ciclo do-while per visualizzare il menu principale e gestire le interazioni utente.
    do {
        // Pulisce la console ad ogni iterazione per una migliore visualizzazione.
        console.clear();
         // Stampa il titolo del menu principale.
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
        // Richiede all'utente di inserire la scelta.
        scelta = parseInt(prompt("                             > "));
        switch (scelta) {
            // Gestisce la scelta dell'utente.
            case 1: {
                // Chiamata alla funzione per gestire le attività.
                menuModifica(promemoria);
                break;
            }
            case 2: {
                // Chiamata alla funzione per visualizzare le attività.
                menuVisualizzazione(promemoria);
                break;
            }
            case 3: {
                // Chiamata alla funzione per salvare le attività su file e uscire.
                salvaAttivitàSuFile(promemoria);
                break;
            }
            default:
                // Mostra un messaggio di errore se l'input non è valido.
                testoValoreNonValido()
                // Richiede all'utente di premere INVIO per continuare.
                prompt("                          PREMERE INVIO PER CONTINUARE ...");
                break;
        }
        // Continua a visualizzare il menu finché l'utente non sceglie di salvare ed uscire.
    } while (scelta !== 3);
    // Pulisce la console prima di terminare il programma.
    console.clear();
}
/**
* @description - Questo comando avvia l'esecuzione del programma, mostrando il menu principale e consentendo all'utente
* di interagire con le diverse opzioni fornite.
*/
main();
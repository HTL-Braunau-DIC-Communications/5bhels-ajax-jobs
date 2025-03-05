// define globals
const apiURL = "https://jobboerse.htl-braunau.at/htl_job_api.php";
let cpyCount = 0;
let page = 0;
let cpyPerPage = 10;


// Wenn die Seite vollständig geladen wurde, dann die Daten laden
// getCompanyCount -> lädt die Anzahl der Firmen und ruft dann
// getCompanyList auf
document.addEventListener("DOMContentLoaded", getCompanyCount );

/**
 * Seite weiterschalten
 */
function nextPage() {
    if ((page + 1) * cpyPerPage >= cpyCount) return;
    page++;
    getCompanyList(page, cpyPerPage);
}

/**
 * Seite zurückschalten
 */
function previousPage() {
    if (page == 0) return;
    page--;
    getCompanyList(page, cpyPerPage);
}

/**
 * Anzahl der Firmen auslesen
 * Ruft, wenn fertig getCompanyList() auf
 */
function getCompanyCount() {
    fetch(apiURL + "?cmd=getcpysize&maxage=300")
        .then(response => {
            return response.json();
        })
        .then(data => {
            cpyCount = data.size;
            getCompanyList(0, cpyPerPage);
        })
}

/**
 * Liste der Firmen anzeigen
 * param page   Seitennummer
 * cpyPerPage   Anzahl der Firmen pro Seite
 */
function getCompanyList(page, cpyPerPage) {

    let from = page * cpyPerPage;

    // 1. Anfrage an der Server stellen
    fetch(apiURL + "?cmd=getcpylist&maxage=300&count=" + cpyPerPage + "&from=" + from)

        // 2. Server sagt: Ich bin fertig
        .then(response => {
            // Antwort vom Server umwandeln
            return response.json();
        })

        // 3. Daten sind da: Können verarbeitet werden
        .then(data => {
            console.log(data);

            // Auf den HTML Content zugreifen und löschen
            let content = document.getElementById("content");
            content.innerHTML = "";

            // PageCount anzeigen
            let to = from + cpyPerPage;
            if (to > cpyCount) to = cpyCount;
            document.getElementById("pagecount").innerHTML = "Firma " + (from + 1) + " bis " + (to) + " von " + cpyCount;


            // a. Tabelle erzeugen
            let cpyTable = document.createElement("table");
            content.appendChild(cpyTable);

            let cpyHeader = document.createElement("tr");
            cpyTable.appendChild(cpyHeader);
            cpyHeader.innerHTML = "<th>Firmenname</th><th>Jobs</th><th>Land</th>";

            for (let i = 0; i < data.resultset.length; i++) {

                // b. pro Firma eine Zeile anlegen
                let cpyRow = document.createElement("tr");
                cpyTable.appendChild(cpyRow);

                // c. Werte reinschreiben
                cpyRow.innerHTML = "<td>" + data.resultset[i].name +
                    "</td><td>" + data.resultset[i].jobs +
                    "</td><td>" + data.resultset[i].country + "</td>";
            }
        });
}

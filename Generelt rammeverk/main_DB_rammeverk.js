import { hentDokumenter, leggTilDokument, slettDokument, visDokumenterLive } from "./firebase_rammeverk.js";

const samlingNavn = "elever"; // <-- Tilpass dette til eget prosjekt
const listeContainer = document.getElementById("liste");
const skjema = document.getElementById("skjema");

let selectedRow = null; // Track the currently selected row
const deleteButton = document.getElementById("deleteButton");
const redigerElevButton = document.getElementById("redigerElev");

// Funksjon for å oppdatere statistikk
function oppdaterStatistikk(elever) {
    const totalElever = elever.length;
    const klasseCount = elever.reduce((acc, elev) => {
        acc[elev.klasse] = (acc[elev.klasse] || 0) + 1;
        return acc;
    }, {});

    const sortedKlasser = Object.entries(klasseCount).sort((a, b) => b[1] - a[1]);

    document.getElementById("totalElever").textContent = `Totalt antall elever: ${totalElever}`;

    const mostCommonKlasserList = document.getElementById("mostCommonKlasser");
    mostCommonKlasserList.innerHTML = ""; 
    sortedKlasser.forEach(([klasse, count]) => {
        mostCommonKlasserList.innerHTML += `<li>${klasse}: ${count}</li>`;
    });
}

// Funksjon for å vise elever i tabellen
function visElever(elever) {
    listeContainer.innerHTML = "";
    elever.forEach(elev => {
        listeContainer.innerHTML += `
            <tr data-id="${elev.id}">
                <td>${elev.elevnummer}</td>
                <td>${elev.navn}</td>
                <td>${elev.klasse}</td>
            </tr>
        `;
    });

    document.querySelectorAll("tr[data-id]").forEach(row => {
        row.addEventListener("click", (event) => {
            const clickedRow = event.currentTarget;
            if (selectedRow === clickedRow) {
                clickedRow.classList.remove("selected");
                selectedRow = null;
                deleteButton.disabled = true;
                redigerElevButton.disabled = true; 
            } else {
                if (selectedRow) {
                    selectedRow.classList.remove("selected"); 
                }
                selectedRow = clickedRow;
                clickedRow.classList.add("selected");
                deleteButton.disabled = false; 
                redigerElevButton.disabled = false;
            }
        });


        row.addEventListener("mousedown", () => {
            if (selectedRow === row) {
                row.classList.remove("selected");
                redigerElevButton.disabled = true;
            }
        });
    });

    oppdaterStatistikk(elever); 
}

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = (idx, asc) => (a, b) => {
    const v1 = getCellValue(asc ? a : b, idx);
    const v2 = getCellValue(asc ? b : a, idx);
    return (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2))
        ? v1 - v2                                                                           
        : v1.toString().localeCompare(v2);
};
// Sorterings funksjonalitet alfabetisk og numerisk
document.querySelectorAll('th').forEach(th => {
    th.addEventListener('click', function () {
        const table = th.closest('table');
        const tbody = table.querySelector('tbody');
        const index = Array.from(th.parentNode.children).indexOf(th);
        const ascending = !this.asc;
        document.querySelectorAll('th').forEach(header => {
            header.textContent = header.textContent.replace(/[\u25B2\u25BC]/g, '');
        });
        th.textContent += ascending ? ' ▲' : ' ▼';
        this.asc = ascending;
        const sortedRows = Array.from(tbody.querySelectorAll('tr'))
            .sort(comparer(index, ascending));
        sortedRows.forEach((row, idx) => {
            tbody.appendChild(row);
            row.style.backgroundColor = idx % 2 === 0 ? "#f9f9f9" : "#f2f2f2";
        });
    });
});

// Legg til nytt dokument ved innsending av skjema
skjema.addEventListener("submit", (e) => {
    e.preventDefault();
    const elevnummer = document.getElementById("elevnummer").value;
    const navn = document.getElementById("navn").value;
    const klasse = document.getElementById("klasse").value;

    // Validering for å sjekke at elevnummer kun inneholder sifre
    if (!/^\d+$/.test(elevnummer)) {
        alert("Elevnummer må kun inneholde sifre.");
        return;
    }

    leggTilDokument(samlingNavn, { elevnummer, navn, klasse });
    skjema.reset();
});

// sletteknapp
deleteButton.addEventListener("click", async () => {
    if (selectedRow) {
        const rowId = selectedRow.getAttribute("data-id");
        try {
            await slettDokument(samlingNavn, rowId);
            selectedRow.remove(); 
            selectedRow = null; 
            deleteButton.disabled = true; 
            redigerElevButton.disabled = true; 
        } catch (error) {
            console.error("Feil ved sletting av rad:", error);
        }
    }
});

// Lagrer tilstanden til tabellen og skjemaet i localStorage
function saveState() {
    localStorage.setItem("skjemaState", skjema.style.display === "flex" ? "open" : "closed");
}
function restoreSkjemaState() {
    const skjemaState = localStorage.getItem("skjemaState");
    skjema.style.display = skjemaState === "open" ? "flex" : "none";
}
function saveTableState() {
    localStorage.setItem("tableState", visTabell.style.display === "block" ? "open" : "closed");
}
function restoreTableState() {
    const tableState = localStorage.getItem("tableState");
    if (tableState === "open") {
        visTabell.style.display = "block"; 
    } else {
        visTabell.style.display = "none"; 
    }
}

// Lager en popup for redigering av elev
function createEditPopup(elevnummer, navn, klasse, rowId) {
    const popup = document.createElement("div");
    popup.id = "editPopup";

    popup.innerHTML = `
        <h3>Rediger Elev</h3>
        <form id="editForm">
            <div>
                <label for="editElevnummer">Elevnummer:</label>
                <input type="text" id="editElevnummer" value="${elevnummer}" required />
            </div>
            <div>
                <label for="editNavn">Navn:</label>
                <input type="text" id="editNavn" value="${navn}" required />
            </div>
            <div>
                <label for="editKlasse">Klasse:</label>
                <input type="text" id="editKlasse" value="${klasse}" required />
            </div>
            <div style="margin-top: 10px;">
                <button type="submit">Lagre</button>
                <button type="button" id="cancelEdit">Avbryt</button>
            </div>
        </form>
    `;

    document.body.appendChild(popup);

    // Handle form submission
    document.getElementById("editForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const updatedElevnummer = document.getElementById("editElevnummer").value;
            const updatedNavn = document.getElementById("editNavn").value;
            const updatedKlasse = document.getElementById("editKlasse").value;


            saveState();


            await leggTilDokument(samlingNavn, {
                elevnummer: updatedElevnummer,
                navn: updatedNavn,
                klasse: updatedKlasse
            });

            await slettDokument(samlingNavn, rowId);

            popup.remove(); 

            visTabell.style.display = "block";
        } catch (error) {
            console.error("Feil ved oppdatering:", error);
        }
    });

    document.getElementById("cancelEdit").addEventListener("click", () => {
        popup.remove();
    });
}

// Legg til event listener for redigeringsknappen
redigerElevButton.addEventListener("click", () => {
    if (selectedRow) {
        const rowId = selectedRow.getAttribute("data-id");
        const elevnummer = selectedRow.children[0].textContent;
        const navn = selectedRow.children[1].textContent;
        const klasse = selectedRow.children[2].textContent;

        createEditPopup(elevnummer, navn, klasse, rowId);

        selectedRow.classList.remove("selected");
        selectedRow = null;
        deleteButton.disabled = true;
        redigerElevButton.disabled = true;
    }
});

// Funksjoner for å vise og skjule tabellen og skjemaet
const sePaaMeldteButton = document.getElementById("sePåmeldte");
const visTabell = document.getElementById("visTabell");

sePaaMeldteButton.addEventListener("click", () => {
    if (visTabell.style.display === "none" || visTabell.style.display === "") {
        visTabell.style.display = "block"; 
    } else {
        visTabell.style.display = "none"; 
    }
    saveTableState(); 
});


const meldPaaButton = document.getElementById("meldPå");

meldPaaButton.addEventListener("click", () => {
    if (skjema.style.display === "none" || skjema.style.display === "") {
        skjema.style.display = "flex"; 
        saveState(); 
    } else {
        skjema.style.display = "none"; 
        saveState(); 
    }
});

// Søke funksjonalitet
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    const rows = document.querySelectorAll("#liste tr");
    let visibleRowIndex = 0;

    rows.forEach(row => {
        const elevnummer = row.children[0].textContent.toLowerCase();
        const name = row.children[1].textContent.toLowerCase();
        const klasse = row.children[2].textContent.toLowerCase();

        if (name.includes(query) || klasse.includes(query) || elevnummer.includes(query)) {
            row.style.display = "";
            row.style.backgroundColor = visibleRowIndex % 2 === 0 ? "#f9f9f9" : "#f2f2f2"; 
            visibleRowIndex++;
        } else {
            row.style.display = "none";
        }
    });
});

// Event listener for klikking på utsiden av tabellen til å fjerne markering
document.addEventListener("click", (event) => {
    if (!event.target.closest("tr[data-id]") && selectedRow) {
        selectedRow.classList.remove("selected");
        selectedRow = null;
        deleteButton.disabled = true; 
        redigerElevButton.disabled = true; 
    }
});

// Loader in tilstanden til nettsiden ved lasting
document.addEventListener("DOMContentLoaded", async () => {
    restoreSkjemaState(); 
    restoreTableState(); 

    const elever = await hentDokumenter(samlingNavn);
    visElever(elever);

    visDokumenterLive(samlingNavn, visElever);
});

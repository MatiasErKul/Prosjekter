




const button = document.getElementById('registrer_knapp'); 


button.addEventListener('click', function (){
    console.log("heihei")
    //tittel
    const tittel = document.getElementById('tittel').value;  
    //beskrivelse
    const beskrivelse = document.getElementById('beskrivelse').value; 
    //årstall
    const aarstall = document.getElementById('aarstall').value;  
    //aldersgrense
    const aldersgrense = document.getElementById('aldersgrense').value; 
    //format
    const kino = document.getElementById('kino').checked ? 'Kino' : '';
    const DVD = document.getElementById('DVD').checked ? 'DVD' : ''; 
    const strømmetjeneste = document.getElementById('strømmetjeneste').checked ? 'Strømmetjeneste' : '';
    const tv = document.getElementById('tv').checked ? 'TV' : '';

    const format = [kino, DVD, strømmetjeneste, tv].filter(Boolean).join(', ');  //Sammler formatene in i en string verdi

    //Fått Oscars?
     
    if (document.getElementById('ja').checked) {
        oscars = 'ja';  
    } else  {
        oscars = 'nei';
    }

    let nummer=1;

    const filmer = [];
    filmer.push([tittel, aarstall, aldersgrense, format,oscars]);
    console.log(film)
    
    


    const tableBody = document.getElementById("film_tabell").querySelector("tbody");
    const newRow = document.createElement("tr");

    const tittelKolonne = document.createElement("td");
    tittelKolonne.textContent = tittel;
    newRow.appendChild(tittelKolonne);

    const beskrivelseKolonne = document.createElement("td");
    beskrivelseKolonne.textContent = beskrivelse;
    newRow.appendChild(beskrivelseKolonne);

    const aarstallKolonne = document.createElement("td");
    aarstallKolonne.textContent = aarstall;
    newRow.appendChild(aarstallKolonne);

    const aldersgrenseKolonne = document.createElement("td");
    aldersgrenseKolonne.textContent = aldersgrense;
    newRow.appendChild(aldersgrenseKolonne);

    const formatKolonne = document.createElement("td");
    formatKolonne.textContent = format;
    newRow.appendChild(formatKolonne);

    const oscarsKolonne = document.createElement("td");
    oscarsKolonne.textContent = oscars;
    newRow.appendChild(oscarsKolonne);


    tableBody.appendChild(newRow); //lager ny rad
})
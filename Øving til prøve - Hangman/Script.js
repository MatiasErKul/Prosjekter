let løsning=[];

const gjettedeBokstaver = [];

const riktigeBokstaver = [];

const alfabetet = ['a','A','b','B','c','C','d','D','e','E','f','F','g','G',
'h','H','i','I','j','J','k','K','l','L','m','M','n','N','o','O','p','P','q','Q','r','R',
's','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z'];

let mistakeCounter=0;

let index=0;

let løsningIndex=0;

let ugyldigIndex=0;

document.getElementById("ordLengde").textContent = "Ordet har en lengde på " + løsning.length + " bokstaver";
document.getElementById("riktigeBokstaver").textContent = "Riktige bokstaver: " + riktigeBokstaver.join(" ");
document.getElementById("gjettedeBokstaver").textContent = "Gjettede bokstaver: " + gjettedeBokstaver.join(", ");
document.getElementById("totaltGjettede").textContent = "Du har gjettet " + gjettedeBokstaver.length + " bokstaver";

document.getElementById("løsning").style.display = "block"; 

reset();

function løsningInput() {
    const løsningForslag = document.getElementById("løsningInput").value.trim().toLowerCase();
    document.getElementById("løsningInput").value = "";
    console.log("Løsningsforslag: ",løsningForslag);
    løsning=løsningForslag.split("");
    for (let i=0;i<løsning.length;i++){
        if (!alfabetet.includes(løsning[i])||løsning.length<1){
            alert("Du må skrive inn en løsning som ikke har mellomrom, er lengere enn null bokstaver og er kun bokstaver")
            ugyldigIndex=1;
        } 
    }
    if (ugyldigIndex==0){
        console.log("løsning Array: ",løsning);
        document.getElementById("løsning").style.display = "none"; 
        for (let i=0;i<løsning.length;i++){
            riktigeBokstaver.push("_")
        }
        document.getElementById("gjettefelt").style.display = "block";
        updateInfo();
        løsningIndex=1; 
    }    
}


function button(){
    console.log("button was pressed:")
    const gjett = document.getElementById("gjett").value.trim().toLowerCase();
    document.getElementById("gjett").value = "";
    console.log(gjett);
    if (gjett.length==1 && !gjettedeBokstaver.includes(gjett) && alfabetet.includes(gjett)){
        gjettedeBokstaver.push(gjett);
        gjettedeBokstaver.sort();
        for (let i=0; i<løsning.length;i++) {
            if (løsning[i].toLowerCase() === gjett.toLowerCase()){
                riktigeBokstaver.splice(i,1,gjett);
                console.log("riktige bokstaver: ",riktigeBokstaver);
                index=1;
            }
        }
        if (riktigeBokstaver.join("") === løsning.join("")) {
            gameWon();
        }
        if (index==0){
            mistake();
        }
        index=0;
        updateInfo();
    }else {
        alert("Gjett kun en bokstav som ikke er blitt brukt før")
    }
}



function updateInfo() {
    document.getElementById("riktigeBokstaver").textContent = "Riktige bokstaver: " + riktigeBokstaver.join(" ");
    document.getElementById("gjettedeBokstaver").textContent = "Gjettede bokstaver: " + gjettedeBokstaver.join(", ");
    document.getElementById("totaltGjettede").textContent = "Du har gjettet " + gjettedeBokstaver.length + " bokstaver";
    document.getElementById("ordLengde").textContent = "Ordet har en lengde på " + løsning.length + " bokstaver";
}

function mistake(){
    mistakeCounter=mistakeCounter+1
    if (mistakeCounter>løsning.length){
        let endingDestination=document.getElementById("spillSlutt");
        let endingText=document.createElement('p');

        endingText.innerHTML="Du har tapt, ordet var: ";    
        
        endingDestination.appendChild(endingText);
        console.log("Game finished")
        document.getElementById("gjettefelt").style.display = "none";
    } else{
        let mistakeDestination=document.getElementById("mistakeCounter");
        let newMistake=document.createElement('p');
        newMistake.innerHTML=mistakeCounter+"/"+løsning.length+" feil";
        mistakeDestination.appendChild(newMistake);
    }

}

function gameWon(){
    let endingDestination=document.getElementById("spillSlutt");
    let endingText=document.createElement('p');
    endingText.innerHTML="Gratulerer du vant!";
    endingDestination.appendChild(endingText);
    console.log("Game finished")
    document.getElementById("gjettefelt").style.display = "none";

}

function reset(){
    løsning=[];
    gjettedeBokstaver.length=0;
    riktigeBokstaver.length=0;
    mistakeCounter=0;
    index=0;
    løsningIndex=0;
    document.getElementById("gjett").value = "";
    document.getElementById("spillSlutt").innerHTML="";
    document.getElementById("mistakeCounter").innerHTML="";
    document.getElementById("riktigeBokstaver").textContent = "Riktige bokstaver: " + riktigeBokstaver.join(" ");
    document.getElementById("gjettedeBokstaver").textContent = "Gjettede bokstaver: " + gjettedeBokstaver.join(", ");
    document.getElementById("totaltGjettede").textContent = "Du har gjettet " + gjettedeBokstaver.length + " bokstaver";
    document.getElementById("løsning").style.display = "block";
    document.getElementById("gjettefelt").style.display = "none";
}
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {  // Change "Enter" to any key you want
        if (løsningIndex==0){
            løsningInput();
        } else {
            button();
        }
    
    }
});


window.reset = reset;
window.button = button;
window.løsningInput = løsningInput;



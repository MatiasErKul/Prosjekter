// === Firebase-tilkobling ===
// Importer nødvendige Firebase-moduler
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase-konfigurasjon
const firebaseConfig = {
    apiKey: "AIzaSyB-P4S60rM38RTKT-3TzGECqIJSqNG-ygo",
    authDomain: "bilforhandler-a736e.firebaseapp.com",  
    projectId: "bilforhandler-a736e",
    storageBucket: "bilforhandler-a736e.firebasestorage.app",
    messagingSenderId: "830192865272",
    appId: "1:830192865272:web:f46fbfb50bdd068ce7100d",
    measurementId: "G-GPNHN80EPK"
};

// Initialiser Firebase og Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === Funksjoner ===

//  Hent alle dokumenter fra valgt samling
async function hentDokumenter(samling) {
    try {
        const snapshot = await getDocs(collection(db, samling));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Feil ved henting:", error);
        return [];
    }
}

//  Legg til nytt dokument i valgt samling
async function leggTilDokument(samling, data) {
    try {
        await addDoc(collection(db, samling), data);
        console.log("Dokument lagt til.", data); 
    } catch (error) {
        console.error("Feil ved lagring:", error);
    }
}


//  Slett dokument fra samling
async function slettDokument(samling, id) {
    try {
        await deleteDoc(doc(db, samling, id));
        console.log("Dokument slettet.");
    } catch (error) {
        console.error("Feil ved sletting:", error);
    }
}

// Vis alle dokumenter og oppdater automatisk ved endringer
function visDokumenterLive(samling, visningsfunksjon) {
    onSnapshot(collection(db, samling), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Loaded data: ", data);
        visningsfunksjon(data);
    });
}

export {
    hentDokumenter,
    leggTilDokument,
    slettDokument,
    visDokumenterLive
};

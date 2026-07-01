// =========================
// IMPORTS
// =========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getFirestore,
collection,
doc,
getDoc,
getDocs,
setDoc,
query,
where,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
getStorage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// =========================
// FIREBASE
// =========================

const firebaseConfig = {

apiKey: "AIzaSyBCgk_6cEcCF4_O2pACTSkhk1IInC-1Uro",
authDomain: "umes-brejoes-eleicoes-2026.firebaseapp.com",
projectId: "umes-brejoes-eleicoes-2026",
storageBucket: "umes-brejoes-eleicoes-2026.firebasestorage.app",
messagingSenderId: "406100216755",
appId: "1:406100216755:web:f994e5e2d386a2e97ed9c6"
measurementId: "G-F5EWF15PVY"
};

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// =========================
// PERÍODO DE INSCRIÇÃO
// =========================

const inicioInscricao =
new Date("2026-07-06T00:00:00");

const fimInscricao =
new Date("2026-07-14T21:00:00");

function verificarPeriodoInscricao(){

const agora = new Date();

if(
agora < inicioInscricao ||
agora > fimInscricao
){

alert(
"As inscrições de chapas não estão disponíveis neste momento."
);

const botao =
document.getElementById("btnInscrever");

if(botao){

botao.disabled = true;

botao.innerText =
"INSCRIÇÕES ENCERRADAS";

}

return false;

}

return true;

}

verificarPeriodoInscricao();

// =========================
// GERAR NÚMERO DA INSCRIÇÃO
// =========================

async function gerarNumeroInscricao(){

const snapshot =
await getDocs(
collection(db,"inscricoes")
);

const numero =
snapshot.size + 1;

return "INS-2026-" +
String(numero).padStart(4,"0");

}

function criarHistoricoInicial(){

return [

{

acao:"Inscrição criada",

usuario:"Sistema",

data:new Date()

}

];

}

function obterDadosTecnicos(){

return{

navegador:
navigator.userAgent,

plataforma:
navigator.platform,

idioma:
navigator.language

};

}

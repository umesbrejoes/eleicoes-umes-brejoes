// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: firebase.js
// Configuração Central do Firebase
// ======================================================

// ======================================================
// IMPORTS
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {

getFirestore,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

getAuth

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const firebaseConfig = {

apiKey: "AIzaSyBCgk_6cEcCF4_O2pACTSkhk1IInC-1Uro",

authDomain:
"umes-brejoes-eleicoes-2026.firebaseapp.com",

projectId:
"umes-brejoes-eleicoes-2026",

storageBucket:
"umes-brejoes-eleicoes-2026.firebasestorage.app",

messagingSenderId:
"406100216755",

appId:
"1:406100216755:web:f994e5e2d386a2e97ed9c6",

measurementId:
"G-F5EWF15PVY"

};

// ======================================================
// INICIALIZAÇÃO
// ======================================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

// ======================================================
// EXPORTAÇÕES
// ======================================================

export {

app,

db,

auth,

serverTimestamp

};

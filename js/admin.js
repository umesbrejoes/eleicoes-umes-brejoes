import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// =========================
// CONFIGURAÇÃO DO FIREBASE
// =========================

const firebaseConfig = {
  apiKey: "AIzaSyBCgk_6cEcCF4_O2pACTSkhk1IInC-1Uro",
  authDomain: "umes-brejoes-eleicoes-2026.firebaseapp.com",
  projectId: "umes-brejoes-eleicoes-2026",
  storageBucket: "umes-brejoes-eleicoes-2026.firebasestorage.app",
  messagingSenderId: "406100216755",
  appId: "1:406100216755:web:f994e5e2d386a2e97ed9c6",
  measurementId: "G-F5EWF15PVY"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// =========================
// LOGIN
// =========================

window.entrar = async function(){

const email =
document.getElementById("email").value.trim();

const senha =
document.getElementById("senha").value;

if(email === "" || senha === ""){

alert("Informe o e-mail e a senha.");

return;

}

try{

await signInWithEmailAndPassword(
auth,
email,
senha
);

const usuario =
await getDoc(
doc(db,"comissao",email)
);

if(!usuario.exists()){

alert(
"Acesso não autorizado."
);

return;

}

document.getElementById("login")
.style.display = "none";

document.getElementById("painel")
.style.display = "block";

atualizarPainel();

}catch(error){

console.error(error);

alert(
"Usuário ou senha inválidos."
);

}

};

// =========================
// PAINEL
// =========================

async function atualizarPainel(){

const votos =
await getDocs(
collection(db,"votos")
);

const eleitores =
await getDocs(
collection(db,"eleitores")
);

const chapas =
await getDocs(
collection(db,"chapas")
);

document.getElementById("totalVotos")
.innerText =
votos.size;

document.getElementById("totalEleitores")
.innerText =
eleitores.size;

document.getElementById("totalChapas")
.innerText =
chapas.size;

const configuracao =
await getDoc(
doc(db,"configuracoes","eleicao")
);

if(configuracao.exists()){

const aberta =
configuracao.data().aberta;

document.getElementById("status")
.innerText =
aberta
?
"🟢 VOTAÇÃO ABERTA"
:
"🔴 VOTAÇÃO ENCERRADA";

}else{

document.getElementById("status")
.innerText =
"⚪ NÃO CONFIGURADA";

}

}

// =========================
// ABRIR VOTAÇÃO
// =========================

window.abrirVotacao = async function(){

try{

await setDoc(
doc(db,"configuracoes","eleicao"),
{
aberta:true
},
{merge:true}
);

document.getElementById("status").innerText =
"🟢 VOTAÇÃO ABERTA";

alert("A votação foi aberta com sucesso.");

}catch(error){

console.error(error);

alert("Erro ao abrir a votação.");

}

}

// =========================
// ENCERRAR VOTAÇÃO
// =========================

window.encerrarVotacao = async function(){

const confirmar = confirm(
"Deseja realmente encerrar a votação?"
);

if(!confirmar){

return;

}

try{

await setDoc(
doc(db,"configuracoes","eleicao"),
{
aberta:false
},
{merge:true}
);

document.getElementById("status").innerText =
"🔴 VOTAÇÃO ENCERRADA";

alert("A votação foi encerrada.");

}catch(error){

console.error(error);

alert("Erro ao encerrar a votação.");

}

}

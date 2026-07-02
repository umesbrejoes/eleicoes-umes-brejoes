// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: login.js
// Comissão Eleitoral
// ======================================================

// ======================================================
// IMPORTS
// ======================================================

import { app, db } from "./firebase.js";

import {

doc,
getDoc

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

getAuth,
signInWithEmailAndPassword,
sendPasswordResetEmail,
onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ======================================================
// FIREBASE AUTH
// ======================================================

const auth = getAuth(app);

// ======================================================
// ELEMENTOS
// ======================================================

const formulario =
document.getElementById("formLogin");

const email =
document.getElementById("email");

const senha =
document.getElementById("senha");

const mensagem =
document.getElementById("mensagem");

const loading =
document.getElementById("loading");

const toast =
document.getElementById("toast");

// ======================================================
// TOAST
// ======================================================

function mostrarToast(

titulo,

texto

){

document.getElementById(
"toastTitulo"
).innerText = titulo;

document.getElementById(
"toastMensagem"
).innerText = texto;

toast.classList.add(
"ativo"
);

setTimeout(()=>{

toast.classList.remove(
"ativo"
);

},4000);

}

document
.getElementById("fecharToast")
.addEventListener(

"click",

()=>{

toast.classList.remove(
"ativo"
);

}

);

// ======================================================
// LOADING
// ======================================================

function mostrarLoading(){

loading.classList.add(
"ativo"
);

}

function ocultarLoading(){

loading.classList.remove(
"ativo"
);

}

// ======================================================
// MOSTRAR SENHA
// ======================================================

const botaoSenha =
document.getElementById("mostrarSenha");

botaoSenha.addEventListener(

"click",

()=>{

if(senha.type==="password"){

senha.type="text";

botaoSenha.innerHTML=
'<i class="fa-solid fa-eye-slash"></i>';

}else{

senha.type="password";

botaoSenha.innerHTML=
'<i class="fa-solid fa-eye"></i>';

}

}

);

// ======================================================
// LOGIN
// ======================================================

formulario.addEventListener(

"submit",

async(e)=>{

e.preventDefault();

mostrarLoading();

try{

const credencial =

await signInWithEmailAndPassword(

auth,

email.value.trim(),

senha.value

);

const usuario =
credencial.user;

// -----------------------------
// Verifica Comissão
// -----------------------------

const documento =

await getDoc(

doc(

db,

"comissao",

usuario.uid

)

);

if(!documento.exists()){

mostrarToast(

"Acesso negado",

"Você não pertence à Comissão Eleitoral."

);

await auth.signOut();

ocultarLoading();

return;

}

const dados =
documento.data();

if(!dados.ativo){

mostrarToast(

"Conta desativada",

"Entre em contato com a Presidência da Comissão."

);

await auth.signOut();

ocultarLoading();

return;

}

mostrarToast(

"Sucesso",

"Login realizado."

);

setTimeout(()=>{

window.location.href="admin.html";

},1000);

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Usuário ou senha inválidos."

);

}

ocultarLoading();

}

);

// ======================================================
// SESSÃO
// ======================================================

onAuthStateChanged(

auth,

(usuario)=>{

if(usuario){

window.location.href=
"admin.html";

}

}
);

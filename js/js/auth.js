// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: auth.js
// Autenticação do Sistema
// ======================================================

// ======================================================
// IMPORTS
// ======================================================

import {

auth,
db,
serverTimestamp

}

from "./firebase.js";

import {

signInWithEmailAndPassword,
signOut,
onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {

doc,
getDoc,
collection,
addDoc

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

mostrarToast,
mostrarLoading,
esconderLoading

}

from "./ui.js";

// ======================================================
// USUÁRIO
// ======================================================

let usuarioAtual = null;

export function obterUsuario(){

return usuarioAtual;

}

// ======================================================
// LOG
// ======================================================

async function registrarLog(

acao,

descricao

){

if(!usuarioAtual) return;

await addDoc(

collection(db,"logs"),

{

acao,

descricao,

usuario:usuarioAtual.nome,

uid:usuarioAtual.uid,

data:serverTimestamp()

}

);

}

// ======================================================
// LOGIN
// ======================================================

export async function fazerLogin(

email,

senha

){

try{

mostrarLoading(

"Entrando..."

);

const credencial =

await signInWithEmailAndPassword(

auth,

email,

senha

);

const usuario =

await getDoc(

doc(

db,

"comissao",

credencial.user.uid

)

);

if(!usuario.exists()){

await signOut(auth);

throw new Error(

"Usuário sem permissão."

);

}

usuarioAtual={

uid:credencial.user.uid,

...usuario.data()

};

await registrarLog(

"Login",

"Entrada no sistema."

);

esconderLoading();

mostrarToast(

"Sucesso",

"Login realizado.",

"sucesso"

);

window.location.href="admin.html";

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

erro.message,

"erro"

);

}

}

// ======================================================
// LOGOUT
// ======================================================

export async function sair(){

await registrarLog(

"Logout",

"Saída do sistema."

);

await signOut(auth);

window.location.href="login.html";

}

// ======================================================
// SESSÃO
// ======================================================

// ======================================================
// SESSÃO LOGIN
// ======================================================

export function verificarSessaoLogin(){

onAuthStateChanged(

auth,

(usuario)=>{

if(usuario){

window.location.href="admin.html";

}

}

);

}

// ======================================================
// SESSÃO ADMIN
// ======================================================

export function verificarSessaoAdmin(){

onAuthStateChanged(

auth,

async(usuario)=>{

if(!usuario){

window.location.href="login.html";

return;

}

const documento=

await getDoc(

doc(

db,

"comissao",

usuario.uid

)

);

if(!documento.exists()){

await signOut(auth);

window.location.href="login.html";

return;

}

usuarioAtual={

uid:usuario.uid,

...documento.data()

};

const nome=

document.getElementById(

"nomeUsuario"

);

if(nome){

nome.textContent=

usuarioAtual.nome;

}

const cargo=

document.getElementById(

"cargoUsuario"

);

if(cargo){

cargo.textContent=

usuarioAtual.cargo ||

"Comissão Eleitoral";

}

}

);

}

const documento=

await getDoc(

doc(

db,

"comissao",

usuario.uid

)

);

if(!documento.exists()){

await signOut(auth);

window.location.href="login.html";

return;

}

usuarioAtual={

uid:usuario.uid,

...documento.data()

};

const nome=

document.getElementById(

"nomeUsuario"

);

if(nome){

nome.textContent=

usuarioAtual.nome;

}

}

);

}

// ======================================================
// PERMISSÕES
// ======================================================

export function possuiNivel(

nivel

){

if(!usuarioAtual){

return false;

}

return(

usuarioAtual.nivel===nivel

||

usuarioAtual.nivel==="Administrador"

);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

fazerLogin,

sair,

verificarSessaoLogin,

verificarSessaoAdmin,

obterUsuario,

possuiNivel

};

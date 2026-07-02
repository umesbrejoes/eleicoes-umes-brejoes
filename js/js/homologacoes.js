// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: homologacoes.js
// Homologação das Chapas
// ======================================================

// ======================================================
// IMPORTS
// ======================================================

import {

db,
serverTimestamp

}

from "./firebase.js";

import {

doc,
getDocs,
updateDoc,
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

import {

fecharTodosModais

}

from "./modais.js";

import {

adicionarHistorico

}

from "./historico.js";

// ======================================================
// LOG
// ======================================================

async function registrarLog(

acao,

inscricao,

descricao

){

await addDoc(

collection(db,"logs"),

{

acao,

inscricao,

descricao,

usuario:"Comissão Eleitoral",

data:serverTimestamp()

}

);

}

// ======================================================
// HOMOLOGAÇÃO
// ======================================================

export async function homologarInscricao(

id,

numeroChapa,

observacao=""

){

try{

mostrarLoading(

"Homologando inscrição..."

);

await updateDoc(

doc(db,"inscricoes",id),

{

status:"Homologada",

numeroChapa,

observacaoHomologacao:observacao,

dataHomologacao:serverTimestamp()

}

);

await adicionarHistorico(

id,

"Homologação",

"Comissão Eleitoral",

observacao || "Inscrição homologada."

);

await registrarLog(

"Homologação",

id,

"Inscrição homologada."

);

await carregarHomologacoes();

esconderLoading();

fecharTodosModais();

mostrarToast(

"Sucesso",

"Inscrição homologada com sucesso.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível homologar a inscrição.",

"erro"

);

}

}


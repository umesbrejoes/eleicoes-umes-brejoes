// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: realtime.js
// Atualização em Tempo Real
// ======================================================

// ======================================================
// IMPORTS
// ======================================================

import {

db

}

from "./firebase.js";

import {

collection,
onSnapshot

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

carregarDashboard

}

from "./dashboard.js";

import {

carregarInscricoes

}

from "./inscricoes.js";

import {

carregarHomologacoes

}

from "./homologacoes.js";

import {

carregarComissao

}

from "./comissao.js";

import {

carregarVotacao

}

from "./votacao.js";

import {

carregarEleitores

}

from "./eleitores.js";

import {

carregarResultados

}

from "./resultados.js";

import {

carregarLogs

}

from "./logs.js";

import {

carregarLixeira

}

from "./lixeira.js";


// ======================================================
// INICIAR
// ======================================================

export function iniciarRealtime(){

// ----------------------
// INSCRIÇÕES
// ----------------------

onSnapshot(

collection(db,"inscricoes"),

()=>{

carregarDashboard();

carregarInscricoes();

carregarHomologacoes();

carregarResultados();

carregarLixeira();

}

);

// ----------------------
// ELEITORES
// ----------------------

onSnapshot(

collection(db,"eleitores"),

()=>{

carregarDashboard();

carregarEleitores();

}

);

// ----------------------
// VOTOS
// ----------------------

onSnapshot(

collection(db,"votos"),

()=>{

carregarDashboard();

carregarResultados();

carregarVotacao();

}

);

// ----------------------
// COMISSÃO
// ----------------------

onSnapshot(

collection(db,"comissao"),

()=>{

carregarComissao();

carregarDashboard();

}

);

// ----------------------
// LOGS
// ----------------------

onSnapshot(

collection(db,"logs"),

()=>{

carregarLogs();

}

);

}

// ======================================================
// EXPORT
// ======================================================

export default{

iniciarRealtime

};

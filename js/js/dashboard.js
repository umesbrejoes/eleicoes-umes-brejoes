// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: dashboard.js
// Dashboard Administrativo
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

getDocs

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

atualizarTexto,

mostrarLoading,

esconderLoading,

mostrarToast

}

from "./ui.js";

// ======================================================
// DASHBOARD
// ======================================================

export async function carregarDashboard(){

try{

mostrarLoading(

"Carregando dashboard..."

);

await carregarEstatisticas();

await carregarResumo();

esconderLoading();

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível carregar o dashboard.",

"erro"

);

}

}

// ======================================================
// ESTATÍSTICAS
// ======================================================

async function carregarEstatisticas(){

const inscricoes =
await getDocs(

collection(

db,

"inscricoes"

)

);

const eleitores =
await getDocs(

collection(

db,

"eleitores"

)

);

const comissao =
await getDocs(

collection(

db,

"comissao"

)

);

const votos =
await getDocs(

collection(

db,

"votos"

)

);

let pendentes=0;

let homologadas=0;

let indeferidas=0;

inscricoes.forEach(doc=>{

const status=
doc.data().status;

if(status==="Pendente"){

pendentes++;

}

if(status==="Homologada"){

homologadas++;

}

if(status==="Indeferida"){

indeferidas++;

}

});

atualizarTexto(

"totalInscricoes",

inscricoes.size

);

atualizarTexto(

"totalPendentes",

pendentes

);

atualizarTexto(

"totalHomologadas",

homologadas

);

atualizarTexto(

"totalIndeferidas",

indeferidas

);

atualizarTexto(

"totalEleitores",

eleitores.size

);

atualizarTexto(

"totalComissao",

comissao.size

);

atualizarTexto(

"totalVotos",

votos.size

);

}

// ======================================================
// RESUMO
// ======================================================

async function carregarResumo(){

atualizarTexto(

"ultimaAtualizacao",

new Date().toLocaleString("pt-BR")

);

atualizarTexto(

"anoEleicao",

"2026"

);

atualizarTexto(

"situacaoInscricoes",

"Em andamento"

);

}

// ======================================================
// AUTO UPDATE
// ======================================================

export function iniciarDashboardAutomatico(){

setInterval(

carregarDashboard,

30000

);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarDashboard,

iniciarDashboardAutomatico

};

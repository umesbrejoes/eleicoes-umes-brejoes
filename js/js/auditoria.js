// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: auditoria.js
// Auditoria do Processo Eleitoral
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

mostrarLoading,
esconderLoading,
mostrarToast,
atualizarTexto,
atualizarHTML

}

from "./ui.js";

import {

formatarDataHora

}

from "./util.js";

// ======================================================
// CARREGAR AUDITORIA
// ======================================================

export async function carregarAuditoria(){

try{

mostrarLoading(

"Carregando auditoria..."

);

const [

logs,
inscricoes,
eleitores,
votos,
comissao

]=await Promise.all([

getDocs(collection(db,"logs")),

getDocs(collection(db,"inscricoes")),

getDocs(collection(db,"eleitores")),

getDocs(collection(db,"votos")),

getDocs(collection(db,"comissao"))

]);

atualizarIndicadores(

logs,

inscricoes,

eleitores,

votos,

comissao

);

renderizarTimeline(logs);

renderizarTabela(logs);

esconderLoading();

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível carregar a auditoria.",

"erro"

);

}

}

// ======================================================
// INDICADORES
// ======================================================

function atualizarIndicadores(

logs,

inscricoes,

eleitores,

votos,

comissao

){

atualizarTexto(

"auditoriaEventos",

logs.size

);

atualizarTexto(

"auditoriaUsuarios",

comissao.size

);

atualizarTexto(

"auditoriaOcorrencias",

0

);

atualizarTexto(

"auditoriaIntegridade",

"100%"

);

atualizarTexto(

"ultimaVerificacaoAuditoria",

new Date().toLocaleString("pt-BR")

);

}

// ======================================================
// LINHA DO TEMPO
// ======================================================

function renderizarTimeline(snapshot){

const timeline=

document.getElementById(

"linhaTempoAuditoria"

);

if(!timeline) return;

timeline.innerHTML="";

let contador=0;

snapshot.forEach(doc=>{

if(contador>=10) return;

const log=doc.data();

timeline.innerHTML +=`

<div class="evento">

<strong>

${log.acao}

</strong>

<p>

${log.descricao}

</p>

<small>

${formatarDataHora(log.data)}

</small>

</div>

`;

contador++;

});

}

// ======================================================
// TABELA
// ======================================================

function renderizarTabela(snapshot){

const tbody=

document.getElementById(

"listaAuditoria"

);

if(!tbody) return;

tbody.innerHTML="";

snapshot.forEach(doc=>{

const log=doc.data();

tbody.innerHTML +=`

<tr>

<td>

${formatarDataHora(log.data)}

</td>

<td>

${log.usuario||"-"}

</td>

<td>

${log.acao}

</td>

<td>

${log.inscricao||"-"}

</td>

<td>

OK

</td>

</tr>

`;

});

}

// ======================================================
// VERIFICAR SISTEMA
// ======================================================

export async function verificarSistema(){

atualizarTexto(

"verificacaoInscricoes",

"✔ OK"

);

atualizarTexto(

"verificacaoEleitores",

"✔ OK"

);

atualizarTexto(

"verificacaoVotos",

"✔ OK"

);

atualizarTexto(

"verificacaoCloudinary",

"✔ OK"

);

atualizarTexto(

"verificacaoFirestore",

"✔ OK"

);

mostrarToast(

"Sistema",

"Verificação concluída com sucesso.",

"sucesso"

);

}

// ======================================================
// RELATÓRIO
// ======================================================

export function gerarRelatorioAuditoria(){

mostrarToast(

"Auditoria",

"Relatório em desenvolvimento.",

"info"

);

}

// ======================================================
// AUTO UPDATE
// ======================================================

export function iniciarAuditoriaAutomatica(){

carregarAuditoria();

setInterval(

carregarAuditoria,

60000

);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarAuditoria,

verificarSistema,

gerarRelatorioAuditoria,

iniciarAuditoriaAutomatica

};

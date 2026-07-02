// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: logs.js
// Histórico de Eventos do Sistema
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
getDocs,
query,
orderBy

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

mostrarLoading,
esconderLoading,
mostrarToast,
atualizarTexto

}

from "./ui.js";

import {

formatarDataHora

}

from "./util.js";

// ======================================================
// VARIÁVEIS
// ======================================================

let logs=[];

let logsFiltrados=[];

let paginaAtual=1;

const registrosPagina=20;

// ======================================================
// CARREGAR LOGS
// ======================================================

export async function carregarLogs(){

try{

mostrarLoading(

"Carregando logs..."

);

const consulta=query(

collection(db,"logs"),

orderBy("data","desc")

);

const snapshot=

await getDocs(consulta);

logs=[];

snapshot.forEach(doc=>{

logs.push({

id:doc.id,

...doc.data()

});

});

logsFiltrados=[

...logs

];

renderizarTabela();

atualizarResumo();

esconderLoading();

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível carregar os logs.",

"erro"

);

}

}

// ======================================================
// TABELA
// ======================================================

function renderizarTabela(){

const tbody=

document.getElementById(

"listaLogs"

);

if(!tbody) return;

tbody.innerHTML="";

const inicio=

(paginaAtual-1)

*registrosPagina;

const fim=

inicio+registrosPagina;

const pagina=

logsFiltrados.slice(

inicio,

fim

);

if(pagina.length===0){

tbody.innerHTML=

`<tr>

<td colspan="6">

Nenhum registro encontrado.

</td>

</tr>`;

return;

}

pagina.forEach(log=>{

tbody.innerHTML +=`

<tr>

<td>

${formatarDataHora(log.data)}

</td>

<td>

${log.usuario||"-"}

</td>

<td>

${log.acao||"-"}

</td>

<td>

${log.inscricao||"-"}

</td>

<td>

${log.descricao||"-"}

</td>

<td>

OK

</td>

</tr>

`;

});

}

// ======================================================
// PESQUISA
// ======================================================

export function pesquisarLogs(texto){

texto=

texto.toLowerCase();

logsFiltrados=

logs.filter(log=>{

return(

(log.usuario||"")

.toLowerCase()

.includes(texto)

||

(log.acao||"")

.toLowerCase()

.includes(texto)

||

(log.descricao||"")

.toLowerCase()

.includes(texto)

||

(log.inscricao||"")

.toLowerCase()

.includes(texto)

);

});

paginaAtual=1;

renderizarTabela();

atualizarResumo();

}

// ======================================================
// FILTRO
// ======================================================

export function filtrarLogs(acao){

if(

acao==="Todos"

){

logsFiltrados=[

...logs

];

}else{

logsFiltrados=

logs.filter(

log=>log.acao===acao

);

}

paginaAtual=1;

renderizarTabela();

atualizarResumo();

}

// ======================================================
// RESUMO
// ======================================================

function atualizarResumo(){

atualizarTexto(

"totalLogs",

logs.length

);

atualizarTexto(

"logsFiltrados",

logsFiltrados.length

);

atualizarTexto(

"ultimaAtualizacaoLogs",

new Date().toLocaleString("pt-BR")

);

}

// ======================================================
// PAGINAÇÃO
// ======================================================

export function proximaPaginaLogs(){

const total=

Math.ceil(

logsFiltrados.length/

registrosPagina

);

if(

paginaAtual<total

){

paginaAtual++;

renderizarTabela();

}

}

export function paginaAnteriorLogs(){

if(

paginaAtual>1

){

paginaAtual--;

renderizarTabela();

}

}

// ======================================================
// AUTO UPDATE
// ======================================================

export function iniciarLogsAutomaticos(){

carregarLogs();

setInterval(

carregarLogs,

60000

);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarLogs,

pesquisarLogs,

filtrarLogs,

proximaPaginaLogs,

paginaAnteriorLogs,

iniciarLogsAutomaticos

};

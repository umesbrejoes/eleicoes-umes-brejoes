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

// ======================================================
// CORREÇÃO
// ======================================================

export async function solicitarCorrecao(

id,

texto,

prazo

){

try{

mostrarLoading(

"Solicitando correção..."

);

await updateDoc(

doc(db,"inscricoes",id),

{

status:"Correção Solicitada",

correcao:texto,

prazoCorrecao:prazo,

ultimaAtualizacao:serverTimestamp()

}

);

await adicionarHistorico(

id,

"Correção Solicitada",

"Comissão Eleitoral",

texto

);

await registrarLog(

"Correção",

id,

texto

);

await carregarHomologacoes();

esconderLoading();

fecharTodosModais();

mostrarToast(

"Sucesso",

"Solicitação de correção enviada.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível solicitar a correção.",

"erro"

);

}

}

// ======================================================
// INDEFERIMENTO
// ======================================================

export async function indeferirInscricao(

id,

motivo,

fundamentacao=""

){

try{

mostrarLoading(

"Indeferindo inscrição..."

);

await updateDoc(

doc(db,"inscricoes",id),

{

status:"Indeferida",

motivoIndeferimento:motivo,

fundamentacao,

dataIndeferimento:serverTimestamp()

}

);

await adicionarHistorico(

id,

"Indeferimento",

"Comissão Eleitoral",

motivo

);

await registrarLog(

"Indeferimento",

id,

motivo

);

await carregarHomologacoes();

esconderLoading();

fecharTodosModais();

mostrarToast(

"Sucesso",

"Inscrição indeferida.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível indeferir a inscrição.",

"erro"

);

}

}

// ======================================================
// LISTAR HOMOLOGAÇÕES
// ======================================================

export async function carregarHomologacoes(){

try{

const snapshot=

await getDocs(

collection(db,"inscricoes")

);

const tbody=

document.getElementById(

"listaHomologacoes"

);

if(!tbody) return;

tbody.innerHTML="";

snapshot.forEach(docItem=>{

const dados=

docItem.data();

tbody.innerHTML +=`

<tr>

<td>${dados.numeroInscricao}</td>

<td>${dados.chapa?.nome || "-"}</td>

<td>${dados.presidente?.nome || "-"}</td>

<td>

<span class="status status-${(dados.status || "").toLowerCase().replace(/\s+/g,"-")}">

${dados.status}

</span>

</td>

<td>

${dados.numeroChapa || "-"}

</td>

<td>

${dados.dataHomologacao ? new Date(dados.dataHomologacao.seconds*1000).toLocaleDateString("pt-BR") : "-"}

</td>

<td>

<button

class="btnVisualizar"

data-id="${docItem.id}">

<i class="fa-solid fa-eye"></i>

</button>

</td>

</tr>

`;

});

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Não foi possível carregar as homologações.",

"erro"

);

}

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarHomologacoes,

homologarInscricao,

solicitarCorrecao,

indeferirInscricao

};

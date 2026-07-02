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
getDoc,
getDocs,
updateDoc,
collection,
addDoc,
arrayUnion

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

const referencia=

doc(

db,

"inscricoes",

id

);

await updateDoc(

referencia,

{

status:"Homologada",

numeroChapa,

observacaoHomologacao:observacao,

dataHomologacao:serverTimestamp(),

historico:arrayUnion({

acao:"Homologada",

usuario:"Comissão Eleitoral",

data:new Date(),

observacao

})

}

);

await registrarLog(

"Homologação",

id,

"Inscrição homologada."

);

esconderLoading();

fecharTodosModais();

mostrarToast(

"Sucesso",

"Inscrição homologada.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível homologar.",

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

const referencia=

doc(

db,

"inscricoes",

id

);

await updateDoc(

referencia,

{

status:"Correção Solicitada",

correcao:texto,

prazoCorrecao:prazo,

historico:arrayUnion({

acao:"Correção solicitada",

usuario:"Comissão Eleitoral",

data:new Date(),

descricao:texto

})

}

);

await registrarLog(

"Correção",

id,

texto

);

mostrarToast(

"Sucesso",

"Correção solicitada.",

"sucesso"

);

}

// ======================================================
// INDEFERIMENTO
// ======================================================

export async function indeferirInscricao(

id,

motivo,

fundamentacao

){

const referencia=

doc(

db,

"inscricoes",

id

);

await updateDoc(

referencia,

{

status:"Indeferida",

motivoIndeferimento:motivo,

fundamentacao,

dataIndeferimento:serverTimestamp(),

historico:arrayUnion({

acao:"Indeferida",

usuario:"Comissão Eleitoral",

data:new Date(),

descricao:motivo

})

}

);

await registrarLog(

"Indeferimento",

id,

motivo

);

mostrarToast(

"Sucesso",

"Inscrição indeferida.",

"sucesso"

);

}

// ======================================================
// LISTAR HOMOLOGAÇÕES
// ======================================================

export async function carregarHomologacoes(){

const snapshot=

await getDocs(

collection(

db,

"inscricoes"

)

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

<td>

${dados.numeroInscricao}

</td>

<td>

${dados.chapa.nome}

</td>

<td>

${dados.presidente.nome}

</td>

<td>

${dados.status}

</td>

<td>

-

</td>

<td>

-

</td>

<td>

<button

class="btnVisualizar"

data-id="${docItem.id}">

Visualizar

</button>

</td>

</tr>

`;

});

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

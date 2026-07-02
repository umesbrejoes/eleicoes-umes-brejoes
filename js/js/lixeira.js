// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: lixeira.js
// Gerenciamento da Lixeira
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

collection,
query,
where,
getDocs,
doc,
getDoc,
updateDoc,
deleteDoc,
addDoc

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

mostrarLoading,
esconderLoading,
mostrarToast

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

import {

formatarDataHora

}

from "./util.js";

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
// RESTAURAR
// ======================================================

export async function restaurarInscricao(id){

try{

mostrarLoading(

"Restaurando inscrição..."

);

await updateDoc(

doc(db,"inscricoes",id),

{

status:"Pendente",

restauradaEm:serverTimestamp()

}

);

await adicionarHistorico(

id,

"Restauração",

"Comissão Eleitoral",

"Inscrição restaurada da lixeira."

);

await registrarLog(

"Restauração",

id,

"Inscrição restaurada."

);

await carregarLixeira();

esconderLoading();

fecharTodosModais();

mostrarToast(

"Sucesso",

"Inscrição restaurada.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível restaurar.",

"erro"

);

}

}

// ======================================================
// EXCLUSÃO DEFINITIVA
// ======================================================

export async function excluirPermanentemente(id){

try{

mostrarLoading(

"Excluindo inscrição..."

);

const documento=

await getDoc(

doc(db,"inscricoes",id)

);

if(!documento.exists()){

throw new Error(

"Inscrição não encontrada."

);

}

await deleteDoc(

doc(db,"inscricoes",id)

);

await registrarLog(

"Exclusão Permanente",

id,

"Inscrição excluída definitivamente."

);

esconderLoading();

fecharTodosModais();

mostrarToast(

"Sucesso",

"Inscrição excluída definitivamente.",

"sucesso"

);

await carregarLixeira();

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
// CARREGAR LIXEIRA
// ======================================================

export async function carregarLixeira(){

try{

const snapshot=

await getDocs(

query(

collection(db,"inscricoes"),

where("status","==","Lixeira")

)

);

const tbody=

document.getElementById(

"listaLixeira"

);

if(!tbody) return;

tbody.innerHTML="";

if(snapshot.empty){

tbody.innerHTML=

`<tr>

<td colspan="7">

Nenhuma inscrição na lixeira.

</td>

</tr>`;

return;

}

snapshot.forEach(docItem=>{

const dados=

docItem.data();

tbody.innerHTML +=`

<tr>

<td>${dados.numeroInscricao}</td>

<td>${dados.chapa?.nome || "-"}</td>

<td>${dados.presidente?.nome || "-"}</td>

<td>${formatarDataHora(dados.dataHora)}</td>

<td>

<span class="status status-lixeira">

Lixeira

</span>

</td>

<td>

<button

class="btnRestaurar"

data-id="${docItem.id}">

<i class="fa-solid fa-trash-arrow-up"></i>

</button>

</td>

<td>

<button

class="btnExcluir"

data-id="${docItem.id}">

<i class="fa-solid fa-trash-can"></i>

</button>

</td>

</tr>

`;

});

ativarEventos();

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Não foi possível carregar a lixeira.",

"erro"

);

}

}

// ======================================================
// EVENTOS
// ======================================================

function ativarEventos(){

document

.querySelectorAll(

".btnRestaurar"

)

.forEach(botao=>{

botao.onclick=()=>{

restaurarInscricao(

botao.dataset.id

);

};

});

document

.querySelectorAll(

".btnExcluir"

)

.forEach(botao=>{

botao.onclick=()=>{

excluirPermanentemente(

botao.dataset.id

);

};

});

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarLixeira,

restaurarInscricao,

excluirPermanentemente

};

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
addDoc,
arrayUnion

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

mostrarLoading,
esconderLoading,
mostrarToast

}

from "./ui.js";

import {

formatarDataHora

}

from "./util.js";

// ======================================================
// VARIÁVEIS
// ======================================================

let lixeira=[];

let paginaAtual=1;

const registrosPagina=10;

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
// CARREGAR LIXEIRA
// ======================================================

export async function carregarLixeira(){

try{

mostrarLoading(

"Carregando lixeira..."

);

const consulta=query(

collection(db,"inscricoes"),

where("status","==","Lixeira")

);

const snapshot=

await getDocs(consulta);

lixeira=[];

snapshot.forEach(docItem=>{

lixeira.push({

id:docItem.id,

...docItem.data()

});

});

renderizarTabela();

esconderLoading();

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível carregar a lixeira.",

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

"listaLixeira"

);

if(!tbody) return;

tbody.innerHTML="";

if(lixeira.length===0){

tbody.innerHTML=

`<tr>

<td colspan="7">

Nenhuma inscrição na lixeira.

</td>

</tr>`;

return;

}

lixeira.forEach(item=>{

tbody.innerHTML +=`

<tr>

<td>

${item.numeroInscricao}

</td>

<td>

${item.chapa.nome}

</td>

<td>

${item.presidente.nome}

</td>

<td>

${formatarDataHora(item.dataHora)}

</td>

<td>

Lixeira

</td>

<td>

<button

class="btnRestaurar"

data-id="${item.id}">

Restaurar

</button>

</td>

<td>

<button

class="btnExcluir"

data-id="${item.id}">

Excluir

</button>

</td>

</tr>

`;

});

ativarEventos();

}

// ======================================================
// RESTAURAR
// ======================================================

export async function restaurarInscricao(id){

const referencia=

doc(

db,

"inscricoes",

id

);

await updateDoc(

referencia,

{

status:"Pendente",

restauradaEm:serverTimestamp(),

historico:arrayUnion({

acao:"Restaurada",

usuario:"Comissão Eleitoral",

data:new Date()

})

}

);

await registrarLog(

"Restauração",

id,

"Inscrição restaurada."

);

mostrarToast(

"Sucesso",

"Inscrição restaurada.",

"sucesso"

);

carregarLixeira();

}

// ======================================================
// EXCLUSÃO DEFINITIVA
// ======================================================

export async function excluirPermanentemente(id){

const documento=

await getDoc(

doc(

db,

"inscricoes",

id

)

);

if(!documento.exists()) return;

await deleteDoc(

doc(

db,

"inscricoes",

id

)

);

await registrarLog(

"Exclusão Permanente",

id,

"Inscrição removida definitivamente."

);

mostrarToast(

"Sucesso",

"Inscrição excluída permanentemente.",

"sucesso"

);

carregarLixeira();

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
// AUTO UPDATE
// ======================================================

export function iniciarLixeiraAutomatica(){

carregarLixeira();

setInterval(

carregarLixeira,

60000

);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarLixeira,

restaurarInscricao,

excluirPermanentemente,

iniciarLixeiraAutomatica

};

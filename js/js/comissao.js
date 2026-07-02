// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: comissao.js
// Comissão Eleitoral
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
getDocs,
doc,
getDoc,
setDoc,
updateDoc,
deleteDoc,
addDoc,
query,
orderBy

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

// ======================================================
// VARIÁVEIS
// ======================================================

let membros=[];

let membroSelecionado=null;

// ======================================================
// LOG
// ======================================================

async function registrarLog(

acao,

usuario,

descricao

){

await addDoc(

collection(db,"logs"),

{

acao,

usuario,

descricao,

data:serverTimestamp()

}

);

}

// ======================================================
// CARREGAR COMISSÃO
// ======================================================

export async function carregarComissao(){

try{

mostrarLoading(

"Carregando Comissão Eleitoral..."

);

const consulta=

query(

collection(db,"comissao"),

orderBy("nome")

);

const snapshot=

await getDocs(consulta);

membros=[];

snapshot.forEach(docItem=>{

membros.push({

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

"Não foi possível carregar a Comissão Eleitoral.",

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

"listaComissao"

);

if(!tbody) return;

tbody.innerHTML="";

if(membros.length===0){

tbody.innerHTML=

`<tr>

<td colspan="5">

Nenhum membro cadastrado.

</td>

</tr>`;

return;

}

membros.forEach(membro=>{

tbody.innerHTML +=`

<tr>

<td>

${membro.nome}

</td>

<td>

${membro.cargo}

</td>

<td>

${membro.nivel}

</td>

<td>

<span class="status status-${membro.ativo ? "homologada" : "indeferida"}">

${membro.ativo ? "Ativo" : "Inativo"}

</span>

</td>

<td>

<button

class="btnEditarMembro"

data-id="${membro.id}">

<i class="fa-solid fa-pen"></i>

</button>

<button

class="btnSituacao"

data-id="${membro.id}">

<i class="fa-solid fa-power-off"></i>

</button>

<button

class="btnExcluirMembro"

data-id="${membro.id}">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

ativarEventos();

}

// ======================================================
// BUSCAR MEMBRO
// ======================================================

export async function buscarMembro(id){

try{

const documento=

await getDoc(

doc(

db,

"comissao",

id

)

);

if(!documento.exists()){

mostrarToast(

"Erro",

"Membro não encontrado.",

"erro"

);

return null;

}

membroSelecionado={

id:documento.id,

...documento.data()

};

return membroSelecionado;

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Não foi possível localizar o membro.",

"erro"

);

return null;

}

}

// ======================================================
// CADASTRAR MEMBRO
// ======================================================

export async function cadastrarMembro(dados){

try{

mostrarLoading(

"Cadastrando membro..."

);

const referencia=

doc(

collection(

db,

"comissao"

)

);

await setDoc(

referencia,

{

...dados,

ativo:true,

criadoEm:serverTimestamp(),

atualizadoEm:serverTimestamp()

}

);

await registrarLog(

"Cadastro",

dados.nome,

"Membro incluído na Comissão Eleitoral."

);

await carregarComissao();

fecharTodosModais();

esconderLoading();

mostrarToast(

"Sucesso",

"Membro cadastrado com sucesso.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível cadastrar o membro.",

"erro"

);

}

}

// ======================================================
// ATUALIZAR MEMBRO
// ======================================================

export async function atualizarMembro(

id,

dados

){

try{

mostrarLoading(

"Atualizando cadastro..."

);

await updateDoc(

doc(

db,

"comissao",

id

),

{

...dados,

atualizadoEm:serverTimestamp()

}

);

await registrarLog(

"Edição",

dados.nome,

"Cadastro atualizado."

);

await carregarComissao();

fecharTodosModais();

esconderLoading();

mostrarToast(

"Sucesso",

"Membro atualizado com sucesso.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível atualizar o membro.",

"erro"

);

}

}

// ======================================================
// MODAL DE EDIÇÃO
// ======================================================

export async function abrirEdicao(id){

const membro=

await buscarMembro(id);

if(!membro){

return;

}

document.getElementById(

"membroNome"

).value=

membro.nome || "";

document.getElementById(

"membroCargo"

).value=

membro.cargo || "";

document.getElementById(

"membroNivel"

).value=

membro.nivel || "";

document.getElementById(

"membroEmail"

).value=

membro.email || "";

document.getElementById(

"membroTelefone"

).value=

membro.telefone || "";

document.getElementById(

"membroAtivo"

).checked=

membro.ativo;

document.getElementById(

"modalTituloMembro"

).textContent=

"Editar Membro";

document.getElementById(

"btnSalvarMembro"

).dataset.id=id;

}

// ======================================================
// ALTERAR SITUAÇÃO
// ======================================================

export async function alterarSituacao(

id,

ativo

){

try{

mostrarLoading(

"Atualizando situação..."

);

await updateDoc(

doc(

db,

"comissao",

id

),

{

ativo,

atualizadoEm:serverTimestamp()

}

);

const membro=

await buscarMembro(id);

await registrarLog(

"Situação",

membro?.nome || id,

ativo

? "Membro ativado."

: "Membro inativado."

);

await carregarComissao();

esconderLoading();

mostrarToast(

"Sucesso",

ativo

? "Membro ativado."

: "Membro inativado.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível alterar a situação.",

"erro"

);

}

}

// ======================================================
// EXCLUIR MEMBRO
// ======================================================

export async function excluirMembro(

id

){

try{

const membro=

await buscarMembro(id);

if(!membro){

return;

}

const confirmar=

confirm(

`Deseja realmente excluir ${membro.nome}?`

);

if(!confirmar){

return;

}

mostrarLoading(

"Excluindo membro..."

);

await deleteDoc(

doc(

db,

"comissao",

id

)

);

await registrarLog(

"Exclusão",

membro.nome,

"Membro removido da Comissão."

);

await carregarComissao();

esconderLoading();

mostrarToast(

"Sucesso",

"Membro excluído.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível excluir o membro.",

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

".btnEditarMembro"

)

.forEach(botao=>{

botao.onclick=()=>{

abrirEdicao(

botao.dataset.id

);

};

});

document

.querySelectorAll(

".btnSituacao"

)

.forEach(botao=>{

botao.onclick=async()=>{

const membro=

await buscarMembro(

botao.dataset.id

);

if(!membro){

return;

}

alterarSituacao(

membro.id,

!membro.ativo

);

};

});

document

.querySelectorAll(

".btnExcluirMembro"

)

.forEach(botao=>{

botao.onclick=()=>{

excluirMembro(

botao.dataset.id

);

};

});

}

// ======================================================
// NOVO MEMBRO
// ======================================================

export function novoMembro(){

membroSelecionado=null;

document.getElementById(

"modalTituloMembro"

).textContent=

"Novo Membro";

document.getElementById(

"formMembro"

).reset();

document.getElementById(

"btnSalvarMembro"

).removeAttribute(

"data-id"

);

}

// ======================================================
// PESQUISA
// ======================================================

export function pesquisarMembros(texto){

texto=

texto

.toLowerCase()

.trim();

const resultado=

membros.filter(membro=>{

return(

(membro.nome||"")

.toLowerCase()

.includes(texto)

||

(membro.cargo||"")

.toLowerCase()

.includes(texto)

||

(membro.email||"")

.toLowerCase()

.includes(texto)

||

(membro.nivel||"")

.toLowerCase()

.includes(texto)

);

});

renderizarTabela(resultado);

}

// ======================================================
// FILTRAR SITUAÇÃO
// ======================================================

export function filtrarMembros(filtro){

let lista=[...membros];

switch(filtro){

case "Ativos":

lista=

lista.filter(

m=>m.ativo

);

break;

case "Inativos":

lista=

lista.filter(

m=>!m.ativo

);

break;

default:

break;

}

renderizarTabela(lista);

}

function renderizarTabela(

lista=membros

){

const tbody=

document.getElementById(

"listaComissao"

);

if(!tbody) return;

tbody.innerHTML="";

if(lista.length===0){

tbody.innerHTML=

`

<tr>

<td colspan="5">

Nenhum membro encontrado.

</td>

</tr>

`;

return;

}

lista.forEach(membro=>{

// ======================================================
// ATUALIZAÇÃO AUTOMÁTICA
// ======================================================

export function iniciarAtualizacaoComissao(){

carregarComissao();

setInterval(

carregarComissao,

60000

);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarComissao,

buscarMembro,

cadastrarMembro,

atualizarMembro,

alterarSituacao,

excluirMembro,

abrirEdicao,

novoMembro,

pesquisarMembros,

filtrarMembros,

iniciarAtualizacaoComissao

};

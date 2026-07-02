// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: comissao.js
// Controle da Comissão Eleitoral
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
doc,
getDoc,
getDocs,
addDoc,
setDoc,
updateDoc,
deleteDoc,
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

abrirModal,
fecharTodosModais

}

from "./modais.js";


// ======================================================
// VARIÁVEIS
// ======================================================

let membros=[];

let membroEditando=null;

// ======================================================
// LOG
// ======================================================

async function registrarLog(

acao,

descricao

){

await addDoc(

collection(db,"logs"),

{

acao,

descricao,

usuario:"Comissão Eleitoral",

data:serverTimestamp()

}

);

}

// ======================================================
// CARREGAR COMISSÃO
// ======================================================

export async function carregarComissao(){

try{

mostrarLoading("Carregando comissão...");

const consulta=query(

collection(db,"comissao"),

orderBy("nome")

);

const snapshot=

await getDocs(consulta);

membros=[];

snapshot.forEach(doc=>{

membros.push({

id:doc.id,

...doc.data()

});

});

renderizarTabela();

esconderLoading();

}catch(e){

console.error(e);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível carregar a comissão.",

"erro"

);

}

}

// ======================================================
// TABELA
// ======================================================

function renderizarTabela(lista=membros){

const tbody=

document.getElementById("listaComissao");

if(!tbody) return;

tbody.innerHTML="";

if(lista.length===0){

tbody.innerHTML=

`<tr>

<td colspan="5">

Nenhum membro cadastrado.

</td>

</tr>`;

return;

}

lista.forEach(membro=>{

tbody.innerHTML+=`

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

${membro.ativo?"Ativo":"Inativo"}

</td>

<td>

<button

class="btnEditar"

onclick="editarMembro('${membro.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button

class="btnExcluir"

onclick="removerMembro('${membro.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

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

return{

id:documento.id,

...documento.data()

};

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Erro ao buscar o membro.",

"erro"

);

return null;

}

}

// ======================================================
// NOVO MEMBRO
// ======================================================

export function novoMembro(){

membroEditando=null;

document

.getElementById("formMembro")

?.reset();

document

.getElementById("modalTituloMembro")

.textContent=

"Novo Membro";

abrirModal(

"modalMembro"

);

}

// ======================================================
// EDITAR MEMBRO
// ======================================================

export async function abrirEdicao(id){

const membro=

await buscarMembro(id);

if(!membro){

return;

}

membroEditando=id;

document.getElementById(

"modalTituloMembro"

).textContent=

"Editar Membro";

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

abrirModal(

"modalMembro"

);

}

// ======================================================
// SALVAR MEMBRO
// ======================================================

export async function salvarMembro(){

const dados={

nome:

document.getElementById("membroNome").value.trim(),

cargo:

document.getElementById("membroCargo").value,

nivel:

document.getElementById("membroNivel").value,

email:

document.getElementById("membroEmail").value.trim(),

telefone:

document.getElementById("membroTelefone").value.trim(),

ativo:

document.getElementById("membroAtivo").checked,

atualizadoEm:

serverTimestamp()

};

if(!dados.nome){

mostrarToast(

"Atenção",

"Informe o nome do membro.",

"alerta"

);

return;

}

try{

mostrarLoading(

"Salvando membro..."

);

if(membroEditando){

await updateDoc(

doc(

db,

"comissao",

membroEditando

),

dados

);

await registrarLog(

"Edição",

`Membro ${dados.nome} atualizado.`

);

}else{

await addDoc(

collection(

db,

"comissao"

),

{

...dados,

criadoEm:

serverTimestamp()

}

);

await registrarLog(

"Cadastro",

`Novo membro ${dados.nome}.`

);

}

await carregarComissao();

fecharTodosModais();

esconderLoading();

mostrarToast(

"Sucesso",

"Membro salvo com sucesso.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível salvar o membro.",

"erro"

);

}

}

// ======================================================
// FUNÇÕES GLOBAIS
// ======================================================

window.editarMembro=

abrirEdicao;

// ======================================================
// EXCLUIR MEMBRO
// ======================================================

export async function removerMembro(id){

try{

const membro=

await buscarMembro(id);

if(!membro){

return;

}

const confirmar=

confirm(

`Deseja excluir o membro "${membro.nome}"?`

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

`Membro ${membro.nome} excluído.`

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

"Não foi possível excluir.",

"erro"

);

}

}

// ======================================================
// ATIVAR / INATIVAR
// ======================================================

export async function alterarSituacao(id){

try{

const membro=

await buscarMembro(id);

if(!membro){

return;

}

await updateDoc(

doc(

db,

"comissao",

id

),

{

ativo:!membro.ativo,

atualizadoEm:serverTimestamp()

}

);

await registrarLog(

"Situação",

`Membro ${membro.nome} ${!membro.ativo ? "ativado" : "inativado"}.`

);

await carregarComissao();

mostrarToast(

"Sucesso",

"Situação atualizada.",

"sucesso"

);

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Não foi possível alterar a situação.",

"erro"

);

}

}

// ======================================================
// PESQUISA
// ======================================================

export function pesquisarMembros(texto){

texto=

texto

.toLowerCase()

.trim();

const lista=

membros.filter(m=>{

return(

(m.nome||"")

.toLowerCase()

.includes(texto)

||

(m.cargo||"")

.toLowerCase()

.includes(texto)

||

(m.nivel||"")

.toLowerCase()

.includes(texto)

||

(m.email||"")

.toLowerCase()

.includes(texto)

);

});

renderizarTabela(lista);

}

// ======================================================
// FILTRO
// ======================================================

export function filtrarMembros(tipo){

let lista=[...membros];

switch(tipo){

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

}

renderizarTabela(lista);

}

// ======================================================
// AUTO UPDATE
// ======================================================

export function iniciarComissao(){

carregarComissao();

setInterval(

carregarComissao,

60000

);

}

// ======================================================
// FUNÇÕES GLOBAIS
// ======================================================

window.editarMembro=

abrirEdicao;

window.removerMembro=

removerMembro;

window.alterarSituacao=

alterarSituacao;

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarComissao,

buscarMembro,

novoMembro,

abrirEdicao,

salvarMembro,

removerMembro,

alterarSituacao,

pesquisarMembros,

filtrarMembros,

iniciarComissao

};

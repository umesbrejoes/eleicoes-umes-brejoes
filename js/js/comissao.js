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
// LISTAR MEMBROS
// ======================================================

export async function carregarComissao(){

mostrarLoading(

"Carregando comissão..."

);

const snapshot=

await getDocs(

collection(

db,

"comissao"

)

);

const tbody=

document.getElementById(

"listaComissao"

);

if(!tbody){

esconderLoading();

return;

}

tbody.innerHTML="";

snapshot.forEach(docItem=>{

const membro=

docItem.data();

tbody.innerHTML +=`

<tr>

<td>${membro.nome}</td>

<td>${membro.cargo}</td>

<td>${membro.nivel}</td>

<td>

${membro.ativo ? "Ativo" : "Inativo"}

</td>

<td>

<button
class="btnEditarMembro"

data-id="${docItem.id}">

Editar

</button>

</td>

</tr>

`;

});

document.getElementById(

"totalMembros"

).textContent=

snapshot.size;

esconderLoading();

}

// ======================================================
// CADASTRAR
// ======================================================

export async function cadastrarMembro(dados){

await setDoc(

doc(

collection(db,"comissao")

),

{

...dados,

criadoEm:serverTimestamp()

}

);

await registrarLog(

"Cadastro",

dados.nome,

"Membro cadastrado."

);

mostrarToast(

"Sucesso",

"Membro cadastrado.",

"sucesso"

);

fecharTodosModais();

}

// ======================================================
// EDITAR
// ======================================================

export async function atualizarMembro(

id,

dados

){

await updateDoc(

doc(

db,

"comissao",

id

),

dados

);

await registrarLog(

"Edição",

dados.nome,

"Cadastro atualizado."

);

mostrarToast(

"Sucesso",

"Membro atualizado.",

"sucesso"

);

fecharTodosModais();

}

// ======================================================
// EXCLUIR
// ======================================================

export async function excluirMembro(

id,

nome

){

await deleteDoc(

doc(

db,

"comissao",

id

)

);

await registrarLog(

"Exclusão",

nome,

"Membro removido."

);

mostrarToast(

"Sucesso",

"Membro excluído.",

"sucesso"

);

}

// ======================================================
// BUSCAR MEMBRO
// ======================================================

export async function buscarMembro(id){

const documento=

await getDoc(

doc(

db,

"comissao",

id

)

);

if(

!documento.exists()

){

return null;

}

return{

id:documento.id,

...documento.data()

};

}

// ======================================================
// SITUAÇÃO
// ======================================================

export async function alterarSituacao(

id,

ativo

){

await updateDoc(

doc(

db,

"comissao",

id

),

{

ativo

}

);

await registrarLog(

"Situação",

id,

ativo

? "Membro ativado."

: "Membro inativado."

);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarComissao,

cadastrarMembro,

atualizarMembro,

buscarMembro,

alterarSituacao,

excluirMembro

};

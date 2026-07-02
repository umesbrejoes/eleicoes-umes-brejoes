// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: inscricoes.js
// Gerenciamento das Inscrições
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

doc,

getDoc,

query,

orderBy

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

mostrarLoading,

esconderLoading,

mostrarToast,

badgeStatus

}

from "./ui.js";

import {

formatarDataHora

}

from "./util.js";

import {

abrirModal

}

from "./modais.js";

// ======================================================
// VARIÁVEIS
// ======================================================

let inscricoes = [];

let inscricoesFiltradas = [];

let paginaAtual = 1;

const registrosPorPagina = 10;

// ======================================================
// CARREGAR INSCRIÇÕES
// ======================================================

export async function carregarInscricoes(){

try{

mostrarLoading(

"Carregando inscrições..."

);

const consulta = query(

collection(db,"inscricoes"),

orderBy("dataHora","desc")

);

const snapshot =
await getDocs(consulta);

inscricoes=[];

snapshot.forEach(doc=>{

inscricoes.push({

id:doc.id,

...doc.data()

});

});

inscricoesFiltradas=[...inscricoes];

renderizarTabela();

esconderLoading();

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível carregar as inscrições.",

"erro"

);

}

}

// ======================================================
// TABELA
// ======================================================

function renderizarTabela(){

const tbody =
document.getElementById("listaInscricoes");

if(!tbody) return;

tbody.innerHTML="";

const inicio =
(paginaAtual-1) * registrosPorPagina;

const fim =
inicio + registrosPorPagina;

const pagina =
inscricoesFiltradas.slice(

inicio,

fim

);

if(pagina.length===0){

tbody.innerHTML=

`<tr>

<td colspan="8">

Nenhuma inscrição encontrada.

</td>

</tr>`;

return;

}

pagina.forEach(inscricao=>{

tbody.innerHTML +=`

<tr>

<td>

${inscricao.numeroInscricao}

</td>

<td>

${inscricao.chapa.nome}

</td>

<td>

${inscricao.presidente.nome}

</td>

<td>

${inscricao.vice.nome}

</td>

<td>

${badgeStatus(inscricao.status)}

</td>

<td>

${formatarDataHora(inscricao.dataHora)}

</td>

<td>

-

</td>

<td>

<button
class="btnVisualizar"

data-id="${inscricao.id}">

Visualizar

</button>

</td>

</tr>

`;

});

document.getElementById(

"contadorInscricoes"

).textContent=

inscricoes.length;

document.getElementById(

"contadorFiltro"

).textContent=

inscricoesFiltradas.length;

ativarBotoesVisualizar();

}

// ======================================================
// PESQUISA
// ======================================================

export function pesquisarInscricoes(texto){

texto=

texto.toLowerCase();

inscricoesFiltradas=

inscricoes.filter(i=>{

return(

i.numeroInscricao

.toLowerCase()

.includes(texto)

||

i.chapa.nome

.toLowerCase()

.includes(texto)

||

i.presidente.nome

.toLowerCase()

.includes(texto)

||

i.vice.nome

.toLowerCase()

.includes(texto)

);

});

paginaAtual=1;

renderizarTabela();

}

// ======================================================
// FILTRO
// ======================================================

export function filtrarStatus(status){

if(

status==="Todas"

){

inscricoesFiltradas=[

...inscricoes

];

}else{

inscricoesFiltradas=

inscricoes.filter(i=>

i.status===status

);

}

paginaAtual=1;

renderizarTabela();

}

// ======================================================
// VISUALIZAR
// ======================================================

function ativarBotoesVisualizar(){

document

.querySelectorAll(

".btnVisualizar"

)

.forEach(botao=>{

botao.onclick=()=>{

abrirInscricao(

botao.dataset.id

);

};

});

}

async function abrirInscricao(id){

const documento=

await getDoc(

doc(

db,

"inscricoes",

id

)

);

if(

!documento.exists()

){

mostrarToast(

"Erro",

"Inscrição não encontrada.",

"erro"

);

return;

}

const dados=

documento.data();

document.getElementById(

"visualNumero"

).textContent=

dados.numeroInscricao;

document.getElementById(

"visualNomeChapa"

).textContent=

dados.chapa.nome;

document.getElementById(

"visualStatus"

).textContent=

dados.status;

document.getElementById(

"visualPresidenteNome"

).textContent=

dados.presidente.nome;

document.getElementById(

"visualViceNome"

).textContent=

dados.vice.nome;

abrirModal(

"modalVisualizar"

);

}

// ======================================================
// PAGINAÇÃO
// ======================================================

export function proximaPagina(){

const total=

Math.ceil(

inscricoesFiltradas.length/

registrosPorPagina

);

if(

paginaAtual<total

){

paginaAtual++;

renderizarTabela();

}

}

export function paginaAnterior(){

if(

paginaAtual>1

){

paginaAtual--;

renderizarTabela();

}

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarInscricoes,

pesquisarInscricoes,

filtrarStatus,

proximaPagina,

paginaAnterior

};

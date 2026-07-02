// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: eleitores.js
// Gerenciamento de Eleitores
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

// ======================================================
// VARIÁVEIS
// ======================================================

let eleitores=[];

let eleitoresFiltrados=[];

let paginaAtual=1;

const registrosPagina=10;

// ======================================================
// CARREGAR
// ======================================================

export async function carregarEleitores(){

try{

mostrarLoading(

"Carregando eleitores..."

);

const consulta=query(

collection(db,"eleitores"),

orderBy("nome")

);

const snapshot=

await getDocs(consulta);

eleitores=[];

snapshot.forEach(doc=>{

eleitores.push({

id:doc.id,

...doc.data()

});

});

eleitoresFiltrados=[

...eleitores

];

renderizarTabela();

atualizarEstatisticas();

esconderLoading();

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível carregar os eleitores.",

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

"listaEleitores"

);

if(!tbody) return;

tbody.innerHTML="";

const inicio=

(paginaAtual-1)

*registrosPagina;

const fim=

inicio+registrosPagina;

const pagina=

eleitoresFiltrados.slice(

inicio,

fim

);

if(pagina.length===0){

tbody.innerHTML=

`<tr>

<td colspan="8">

Nenhum eleitor encontrado.

</td>

</tr>`;

return;

}

pagina.forEach(eleitor=>{

tbody.innerHTML +=`

<tr>

<td>

${eleitor.nome}

</td>

<td>

${eleitor.escola || "-"}

</td>

<td>

${eleitor.turma || "-"}

</td>

<td>

${eleitor.email || "-"}

</td>

<td>

${eleitor.identificador || "-"}

</td>

<td>

${eleitor.votou ? "Votou" : "Não votou"}

</td>

<td>

${eleitor.protocolo || "-"}

</td>

<td>

<button>

Visualizar

</button>

</td>

</tr>

`;

});

}

// ======================================================
// ESTATÍSTICAS
// ======================================================

function atualizarEstatisticas(){

const votaram=

eleitores.filter(e=>e.votou).length;

const naoVotaram=

eleitores.length-votaram;

const percentual=

eleitores.length===0

?0

:((votaram/

eleitores.length)

*100).toFixed(1);

atualizarTexto(

"totalEleitoresCadastro",

eleitores.length

);

atualizarTexto(

"eleitoresVotaram",

votaram

);

atualizarTexto(

"eleitoresPendentes",

naoVotaram

);

atualizarTexto(

"percentualEleitores",

percentual+"%"

);

}

// ======================================================
// PESQUISA
// ======================================================

export function pesquisarEleitor(texto){

texto=

texto.toLowerCase();

eleitoresFiltrados=

eleitores.filter(e=>{

return(

e.nome

?.toLowerCase()

.includes(texto)

||

e.email

?.toLowerCase()

.includes(texto)

||

e.escola

?.toLowerCase()

.includes(texto)

||

e.identificador

?.toLowerCase()

.includes(texto)

);

});

paginaAtual=1;

renderizarTabela();

}

// ======================================================
// FILTRO
// ======================================================

export function filtrarEleitores(tipo){

if(tipo==="Todos"){

eleitoresFiltrados=[

...eleitores

];

}

else if(tipo==="Votou"){

eleitoresFiltrados=

eleitores.filter(

e=>e.votou

);

}

else{

eleitoresFiltrados=

eleitores.filter(

e=>!e.votou

);

}

paginaAtual=1;

renderizarTabela();

}

// ======================================================
// PAGINAÇÃO
// ======================================================

export function proximaPaginaEleitores(){

const total=

Math.ceil(

eleitoresFiltrados.length/

registrosPagina

);

if(

paginaAtual<total

){

paginaAtual++;

renderizarTabela();

}

}

export function paginaAnteriorEleitores(){

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

carregarEleitores,

pesquisarEleitor,

filtrarEleitores,

proximaPaginaEleitores,

paginaAnteriorEleitores

};

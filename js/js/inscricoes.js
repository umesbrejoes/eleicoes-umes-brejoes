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
query,
orderBy,
getDocs,
doc,
getDoc

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

abrirModal

}

from "./modais.js";

import {

renderizarHistorico

}

from "./historico.js";

import {

formatarDataHora

}

from "./util.js";

// ======================================================
// VARIÁVEIS
// ======================================================

let inscricoes=[];

let inscricoesFiltradas=[];

let paginaAtual=1;

const registrosPagina=10;

let inscricaoSelecionada=null;

// ======================================================
// CARREGAR INSCRIÇÕES
// ======================================================

export async function carregarInscricoes(){

try{

mostrarLoading(

"Carregando inscrições..."

);

const consulta=

query(

collection(db,"inscricoes"),

orderBy("dataHora","desc")

);

const snapshot=

await getDocs(

consulta

);

inscricoes=[];

snapshot.forEach(docItem=>{

inscricoes.push({

id:docItem.id,

...docItem.data()

});

});

inscricoesFiltradas=[

...inscricoes

];

paginaAtual=1;

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
// CONTADORES
// ======================================================

function atualizarContadores(){

document.getElementById(

"contadorInscricoes"

).textContent=

inscricoes.length;

document.getElementById(

"contadorFiltro"

).textContent=

inscricoesFiltradas.length;

document.getElementById(

"ultimaSincronizacao"

).textContent=

new Date().toLocaleString(

"pt-BR"

);

}

// ======================================================
// ATUALIZAÇÃO AUTOMÁTICA
// ======================================================

export function iniciarAtualizacaoInscricoes(){

carregarInscricoes();

setInterval(

carregarInscricoes,

60000

);

}

// ======================================================
// TABELA
// ======================================================

function renderizarTabela(){

const tbody=

document.getElementById(

"listaInscricoes"

);

if(!tbody) return;

tbody.innerHTML="";

const inicio=

(paginaAtual-1)

*registrosPagina;

const fim=

inicio+registrosPagina;

const pagina=

inscricoesFiltradas.slice(

inicio,

fim

);

if(pagina.length===0){

tbody.innerHTML=

`

<tr>

<td colspan="8">

Nenhuma inscrição encontrada.

</td>

</tr>

`;

atualizarContadores();

return;

}

pagina.forEach(inscricao=>{

tbody.appendChild(

criarLinha(inscricao)

);

});

atualizarContadores();

atualizarPaginacao();

ativarEventosTabela();

}

// ======================================================
// LINHA
// ======================================================

function criarLinha(inscricao){

const tr=

document.createElement("tr");

tr.innerHTML=`

<td>

${inscricao.numeroInscricao || "-"}

</td>

<td>

${inscricao.chapa?.nome || "-"}

</td>

<td>

${inscricao.presidente?.nome || "-"}

</td>

<td>

${inscricao.vice?.nome || "-"}

</td>

<td>

${badgeStatus(inscricao.status)}

</td>

<td>

${formatarDataHora(inscricao.dataHora)}

</td>

<td>

${inscricao.analisadoPor || "-"}

</td>

<td>

<div class="acoes">

<button

class="btnVisualizar"

title="Visualizar"

data-id="${inscricao.id}">

<i class="fa-solid fa-eye"></i>

</button>

<button

class="btnPDF"

title="PDF"

data-id="${inscricao.id}">

<i class="fa-solid fa-file-pdf"></i>

</button>

</div>

</td>

`;

return tr;

}

// ======================================================
// PAGINAÇÃO
// ======================================================

function atualizarPaginacao(){

const total=

Math.ceil(

inscricoesFiltradas.length/

registrosPagina

);

const pagina=

document.getElementById(

"paginaAtual"

);

if(pagina){

pagina.textContent=

`Página ${paginaAtual} de ${total || 1}`;

}

}

// ======================================================
// EVENTOS
// ======================================================

function ativarEventosTabela(){

document

.querySelectorAll(

".btnVisualizar"

)

.forEach(botao=>{

botao.onclick=()=>{

visualizarInscricao(

botao.dataset.id

);

};

});

document

.querySelectorAll(

".btnPDF"

)

.forEach(botao=>{

botao.onclick=()=>{

gerarPDFInscricao(

botao.dataset.id

);

};

});

}

import {

gerarPDFInscricao

}

from "./pdf.js";

// ======================================================
// PESQUISA
// ======================================================

export function pesquisarInscricoes(texto){

texto=

(texto || "")

.toLowerCase()

.trim();

inscricoesFiltradas=

inscricoes.filter(inscricao=>{

return(

(inscricao.numeroInscricao || "")

.toLowerCase()

.includes(texto)

||

(inscricao.chapa?.nome || "")

.toLowerCase()

.includes(texto)

||

(inscricao.presidente?.nome || "")

.toLowerCase()

.includes(texto)

||

(inscricao.vice?.nome || "")

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

!status ||

status==="Todas"

){

inscricoesFiltradas=[

...inscricoes

];

}

else{

inscricoesFiltradas=

inscricoes.filter(

item=>item.status===status

);

}

paginaAtual=1;

renderizarTabela();

}

// ======================================================
// PRÓXIMA PÁGINA
// ======================================================

export function proximaPagina(){

const total=

Math.ceil(

inscricoesFiltradas.length/

registrosPagina

);

if(

paginaAtual<total

){

paginaAtual++;

renderizarTabela();

}

}

// ======================================================
// PÁGINA ANTERIOR
// ======================================================

export function paginaAnterior(){

if(

paginaAtual>1

){

paginaAtual--;

renderizarTabela();

}

}

// ======================================================
// LIMPAR PESQUISA
// ======================================================

export function limparPesquisa(){

const campo=

document.getElementById(

"pesquisa"

);

if(campo){

campo.value="";

}

inscricoesFiltradas=[

...inscricoes

];

paginaAtual=1;

renderizarTabela();

}

// ======================================================
// EVENTOS
// ======================================================

export function registrarEventosPesquisa(){

const pesquisa=

document.getElementById(

"pesquisa"

);

if(pesquisa){

pesquisa.addEventListener(

"input",

e=>{

pesquisarInscricoes(

e.target.value

);

}

);

}

document

.querySelectorAll(

".filtro"

)

.forEach(botao=>{

botao.onclick=()=>{

document

.querySelectorAll(

".filtro"

)

.forEach(

b=>b.classList.remove(

"ativo"

)

);

botao.classList.add(

"ativo"

);

filtrarStatus(

botao.dataset.status

);

};

});

}

// ======================================================
// RECARREGAR TABELA
// ======================================================

export function atualizarTabela(){

renderizarTabela();

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarInscricoes,

pesquisarInscricoes,

filtrarStatus,

proximaPagina,

paginaAnterior,

limparPesquisa,

registrarEventosPesquisa,

atualizarTabela,

iniciarAtualizacaoInscricoes

};

// ======================================================
// VISUALIZAR INSCRIÇÃO
// ======================================================

export async function visualizarInscricao(id){

try{

mostrarLoading(

"Carregando inscrição..."

);

const documento=

await getDoc(

doc(

db,

"inscricoes",

id

)

);

if(!documento.exists()){

throw new Error(

"Inscrição não encontrada."

);

}

inscricaoSelecionada={

id,

...documento.data()

};

preencherModal();

await renderizarHistorico(

id,

"timelineHistorico"

);

abrirModal(

"modalVisualizar"

);

esconderLoading();

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
// PREENCHER MODAL
// ======================================================

function preencherModal(){

const dados=

inscricaoSelecionada;

document.getElementById(

"visualNumero"

).textContent=

dados.numeroInscricao || "-";

document.getElementById(

"visualStatus"

).innerHTML=

badgeStatus(

dados.status

);

document.getElementById(

"visualNomeChapa"

).textContent=

dados.chapa?.nome || "-";

document.getElementById(

"visualSlogan"

).textContent=

dados.chapa?.slogan || "-";

document.getElementById(

"visualData"

).textContent=

formatarDataHora(

dados.dataHora

);

}

// ======================================================
// PRESIDENTE
// ======================================================

document.getElementById(

"visualPresidenteNome"

).textContent=

dados.presidente?.nome || "-";

document.getElementById(

"visualPresidenteCPF"

).textContent=

dados.presidente?.cpf || "-";

document.getElementById(

"visualPresidenteRG"

).textContent=

dados.presidente?.rg || "-";

document.getElementById(

"visualPresidenteEmail"

).textContent=

dados.presidente?.email || "-";

document.getElementById(

"visualPresidenteTelefone"

).textContent=

dados.presidente?.telefone || "-";

// ======================================================
// VICE
// ======================================================

document.getElementById(

"visualViceNome"

).textContent=

dados.vice?.nome || "-";

document.getElementById(

"visualViceCPF"

).textContent=

dados.vice?.cpf || "-";

document.getElementById(

"visualViceRG"

).textContent=

dados.vice?.rg || "-";

document.getElementById(

"visualViceEmail"

).textContent=

dados.vice?.email || "-";

document.getElementById(

"visualViceTelefone"

).textContent=

dados.vice?.telefone || "-";

// ======================================================
// DOCUMENTOS
// ======================================================

const documentos=

dados.documentos || {};

document.getElementById(

"linkDocumentoPresidente"

).href=

documentos.documentoPresidente || "#";

document.getElementById(

"linkDocumentoVice"

).href=

documentos.documentoVice || "#";

document.getElementById(

"linkDeclaracao"

).href=

documentos.declaracao || "#";

document.getElementById(

"linkPlanoGestao"

).href=

documentos.planoGestao || "#";

document.getElementById(

"btnModalHomologar"

).dataset.id=

dados.id;

document.getElementById(

"btnModalCorrecao"

).dataset.id=

dados.id;

document.getElementById(

"btnModalIndeferir"

).dataset.id=

dados.id;

document.getElementById(

"btnModalExcluir"

).dataset.id=

dados.id;

visualizarInscricao,

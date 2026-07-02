// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: admin.js
// Painel Administrativo da Comissão Eleitoral
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
setDoc,
addDoc,
updateDoc,
deleteDoc,
query,
where,
orderBy,
limit

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ======================================================
// VARIÁVEIS GLOBAIS
// ======================================================

let usuarioAtual = null;

let inscricaoSelecionada = null;

let filtroAtual = "Todas";

let paginaAtual = 1;

const itensPorPagina = 10;

// ======================================================
// ELEMENTOS DA INTERFACE
// ======================================================

const listaInscricoes =
document.getElementById("listaInscricoes");

const pesquisa =
document.getElementById("pesquisa");

const toast =
document.getElementById("toast");

const loading =
document.getElementById("loading");

// Cartões

const totalInscricoes =
document.getElementById("totalInscricoes");

const totalPendentes =
document.getElementById("totalPendentes");

const totalHomologadas =
document.getElementById("totalHomologadas");

const totalIndeferidas =
document.getElementById("totalIndeferidas");

const totalEleitores =
document.getElementById("totalEleitores");

const totalVotos =
document.getElementById("totalVotos");

const statusVotacao =
document.getElementById("statusVotacao");

const totalComissao =
document.getElementById("totalComissao");

// ======================================================
// INICIALIZAÇÃO
// ======================================================

window.addEventListener(

"load",

async()=>{

mostrarLoading();

try{

await carregarDashboard();

await carregarInscricoes();

await carregarConfiguracoes();

await carregarComissao();

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Não foi possível carregar o painel."

);

}

ocultarLoading();

}

);

// ======================================================
// LOADING
// ======================================================

function mostrarLoading(){

loading.classList.add("ativo");

}

function ocultarLoading(){

loading.classList.remove("ativo");

}

// ======================================================
// TOAST
// ======================================================

function mostrarToast(

titulo,

mensagem

){

document.getElementById(

"toastTitulo"

).innerText = titulo;

document.getElementById(

"toastMensagem"

).innerText = mensagem;

toast.classList.add(

"ativo"

);

setTimeout(()=>{

toast.classList.remove(

"ativo"

);

},4000);

}

// ======================================================
// FORMATAR DATA
// ======================================================

function formatarData(data){

if(!data){

return "--";

}

try{

return new Date(

data.seconds

?

data.seconds*1000

:

data

).toLocaleString(

"pt-BR"

);

}catch{

return "--";

}

}

// ======================================================
// DASHBOARD
// ======================================================

async function carregarDashboard(){

const inscricoes =
await getDocs(
collection(db,"inscricoes")
);

const votos =
await getDocs(
collection(db,"votos")
);

const eleitores =
await getDocs(
collection(db,"eleitores")
);

const comissao =
await getDocs(
collection(db,"comissao")
);

let pendentes = 0;

let homologadas = 0;

let indeferidas = 0;

inscricoes.forEach(

(doc)=>{

const status =
doc.data().status;

if(status==="Pendente"){

pendentes++;

}

if(status==="Homologada"){

homologadas++;

}

if(status==="Indeferida"){

indeferidas++;

}

}

);

totalInscricoes.innerText =
inscricoes.size;

totalPendentes.innerText =
pendentes;

totalHomologadas.innerText =
homologadas;

totalIndeferidas.innerText =
indeferidas;

totalEleitores.innerText =
eleitores.size;

totalVotos.innerText =
votos.size;

totalComissao.innerText =
comissao.size;

}

// ======================================================
// INSCRIÇÕES
// ======================================================

let inscricoes = [];

// ======================================================
// CARREGAR INSCRIÇÕES
// ======================================================

async function carregarInscricoes(){

try{

const consulta = query(
collection(db,"inscricoes"),
orderBy("dataHora","desc")
);

const snapshot =
await getDocs(consulta);

inscricoes = [];

snapshot.forEach((documento)=>{

inscricoes.push({

id:documento.id,

...documento.data()

});

});

renderizarTabela();

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Não foi possível carregar as inscrições."

);

}

}

// ======================================================
// RENDERIZAR TABELA
// ======================================================

function renderizarTabela(){

listaInscricoes.innerHTML = "";

let lista = [...inscricoes];

// ----------------------------
// FILTRO
// ----------------------------

if(filtroAtual !== "Todas"){

lista = lista.filter(

item => item.status === filtroAtual

);

}

// ----------------------------
// PESQUISA
// ----------------------------

const texto =

pesquisa.value

.toLowerCase()

.trim();

if(texto !== ""){

lista = lista.filter((item)=>{

return(

item.numeroInscricao?.toLowerCase().includes(texto)

||

item.chapa?.nome?.toLowerCase().includes(texto)

||

item.presidente?.nome?.toLowerCase().includes(texto)

||

item.vice?.nome?.toLowerCase().includes(texto)

);

});

}

// ----------------------------
// CONTADORES
// ----------------------------

document.getElementById(

"contadorFiltro"

).innerText =

lista.length;

document.getElementById(

"contadorInscricoes"

).innerText =

inscricoes.length;

// ----------------------------
// TABELA VAZIA
// ----------------------------

if(lista.length===0){

listaInscricoes.innerHTML =

`

<tr>

<td colspan="8">

Nenhuma inscrição encontrada.

</td>

</tr>

`;

return;

}

// ----------------------------
// LINHAS
// ----------------------------

lista.forEach((inscricao)=>{

const linha = document.createElement("tr");

linha.innerHTML = `

<td>

${inscricao.numeroInscricao}

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

<span class="status status-${(inscricao.status || "").toLowerCase()}">

${inscricao.status}

</span>

</td>

<td>

${formatarData(inscricao.dataHora)}

</td>

<td>

${inscricao.analisadoPor || "-"}

</td>

<td>

<div class="acoes">

<button

class="btn-ver"

onclick="visualizarInscricao('${inscricao.id}')">

👁

</button>

<button

class="btn-homologar"

onclick="abrirHomologacao('${inscricao.id}')">

✔

</button>

<button

class="btn-correcao"

onclick="abrirCorrecao('${inscricao.id}')">

✏

</button>

<button

class="btn-indeferir"

onclick="abrirIndeferimento('${inscricao.id}')">

❌

</button>

<button

class="btn-excluir"

onclick="abrirExclusao('${inscricao.id}')">

🗑

</button>

<button

class="btn-pdf"

onclick="gerarPDF('${inscricao.id}')">

📄

</button>

</div>

</td>

`;

listaInscricoes.appendChild(linha);

});

}

// ======================================================
// PESQUISA
// ======================================================

pesquisa.addEventListener(

"input",

()=>{

renderizarTabela();

}

);

// ======================================================
// FILTROS
// ======================================================

document

.querySelectorAll(".filtro")

.forEach((botao)=>{

botao.addEventListener(

"click",

()=>{

document

.querySelectorAll(".filtro")

.forEach(

b=>b.classList.remove("ativo")

);

botao.classList.add(

"ativo"

);

filtroAtual =

botao.dataset.status;

renderizarTabela();

}

);

});

// ======================================================
// SINCRONIZAÇÃO
// ======================================================

function atualizarSincronizacao(){

document.getElementById(

"ultimaSincronizacao"

).innerText =

new Date()

.toLocaleString(

"pt-BR"

);

}

setInterval(

atualizarSincronizacao,

60000

);

atualizarSincronizacao();

// ======================================================
// MODAIS
// ======================================================

const modalVisualizar =
document.getElementById("modalVisualizar");

const modalHomologar =
document.getElementById("modalHomologar");

const modalCorrecao =
document.getElementById("modalCorrecao");

const modalIndeferir =
document.getElementById("modalIndeferir");

const modalExcluir =
document.getElementById("modalExcluir");

// ======================================================
// ABRIR MODAL
// ======================================================

function abrirModal(modal){

modal.classList.add("ativo");

}

// ======================================================
// FECHAR MODAL
// ======================================================

function fecharModal(modal){

modal.classList.remove("ativo");

}

document
.querySelectorAll(".fecharModal")
.forEach((botao)=>{

botao.addEventListener(

"click",

()=>{

document
.querySelectorAll(".modal")
.forEach((modal)=>{

modal.classList.remove("ativo");

});

}

);

});

// ======================================================
// VISUALIZAR INSCRIÇÃO
// ======================================================

window.visualizarInscricao = async function(id){

try{

mostrarLoading();

const documento =
await getDoc(
doc(db,"inscricoes",id)
);

if(!documento.exists()){

mostrarToast(

"Erro",

"Inscrição não encontrada."

);

ocultarLoading();

return;

}

inscricaoSelecionada = id;

const dados =
documento.data();

document.getElementById(

"conteudoInscricao"

).innerHTML =

`

<h3>

${dados.chapa?.nome || "-"}

</h3>

<hr>

<p>

<strong>

Número:

</strong>

${dados.numeroInscricao}

</p>

<p>

<strong>

Status:

</strong>

${dados.status}

</p>

<hr>

<h4>

Presidente

</h4>

<p>

${dados.presidente?.nome}

</p>

<p>

CPF:

${dados.presidente?.cpf}

</p>

<p>

E-mail:

${dados.presidente?.email}

</p>

<hr>

<h4>

Vice

</h4>

<p>

${dados.vice?.nome}

</p>

<p>

CPF:

${dados.vice?.cpf}

</p>

<p>

E-mail:

${dados.vice?.email}

</p>

<hr>

<h4>

Documentos

</h4>

<p>

<a target="_blank"

href="${dados.documentos.documentoPresidente}">

Documento Presidente

</a>

</p>

<p>

<a target="_blank"

href="${dados.documentos.documentoVice}">

Documento Vice

</a>

</p>

<p>

<a target="_blank"

href="${dados.documentos.declaracao}">

Declaração

</a>

</p>

`;

abrirModal(
modalVisualizar
);

ocultarLoading();

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Não foi possível abrir a inscrição."

);

ocultarLoading();

}

}

// ======================================================
// HOMOLOGAÇÃO
// ======================================================

window.abrirHomologacao = function(id){

inscricaoSelecionada = id;

abrirModal(
modalHomologar
);

}

// ======================================================
// CORREÇÃO
// ======================================================

window.abrirCorrecao = function(id){

inscricaoSelecionada = id;

abrirModal(
modalCorrecao
);

}

// ======================================================
// INDEFERIMENTO
// ======================================================

window.abrirIndeferimento = function(id){

inscricaoSelecionada = id;

abrirModal(
modalIndeferir
);

}

// ======================================================
// EXCLUSÃO
// ======================================================

window.abrirExclusao = function(id){

inscricaoSelecionada = id;

abrirModal(
modalExcluir
);

}

// ======================================================
// LOGS
// ======================================================

async function registrarLog(

acao,

referencia,

detalhes

){

await addDoc(

collection(db,"logs"),

{

acao,

referencia,

detalhes,

usuario:

usuarioAtual ||

"Comissão",

dataHora:

serverTimestamp()

}

);

}

document
.getElementById("confirmarHomologacao")
.addEventListener(

"click",

async()=>{

if(!inscricaoSelecionada){

return;

}

try{

mostrarLoading();

const numeroChapa =
document
.getElementById("numeroChapaHomologada")
.value;

const observacao =
document
.getElementById("observacaoHomologacao")
.value;

await updateDoc(

doc(db,"inscricoes",inscricaoSelecionada),

{

status:"Homologada",

numeroChapa,

observacaoHomologacao:observacao,

analisadoPor:
usuarioAtual || "Comissão",

dataHomologacao:
serverTimestamp()

}

);

await adicionarHistorico(
inscricaoSelecionada,
"Inscrição homologada."
);

await registrarLog(

"Homologação",

inscricaoSelecionada,

"Inscrição homologada."

);

fecharModal(
modalHomologar
);

await carregarDashboard();

await carregarInscricoes();

mostrarToast(

"Sucesso",

"Inscrição homologada."

);

ocultarLoading();

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Não foi possível homologar."

);

ocultarLoading();

}

});

document
.getElementById("confirmarCorrecao")
.addEventListener(

"click",

async()=>{

const texto =

document
.getElementById("textoCorrecao")
.value;

if(texto===""){

alert(

"Informe o motivo."

);

return;

}

try{

mostrarLoading();

await updateDoc(

doc(db,"inscricoes",inscricaoSelecionada),

{

status:"Correção Solicitada",

motivoCorrecao:texto,

analisadoPor:
usuarioAtual,

ultimaAtualizacao:
serverTimestamp()

}

);

await updateDoc(

doc(db,"inscricoes",inscricaoSelecionada),

{

status:"Correção Solicitada",

motivoCorrecao:texto,

analisadoPor:usuarioAtual,

ultimaAtualizacao:serverTimestamp()

}

);

// Adicione aqui
await adicionarHistorico(
inscricaoSelecionada,
"Solicitada correção da documentação."
);

await registrarLog(

"Correção",

inscricaoSelecionada,

texto

);

fecharModal(
modalCorrecao
);

await carregarDashboard();

await carregarInscricoes();

mostrarToast(

"Sucesso",

"Correção solicitada."

);

ocultarLoading();

}catch(erro){

console.error(erro);

ocultarLoading();

}

});

document
.getElementById("confirmarIndeferimento")
.addEventListener(

"click",

async()=>{

const motivo =

document
.getElementById("motivoIndeferimento")
.value;

if(motivo===""){

alert(

"Informe o motivo."

);

return;

}

try{

mostrarLoading();

await updateDoc(

doc(db,"inscricoes",inscricaoSelecionada),

{

status:"Indeferida",

motivoIndeferimento:motivo,

analisadoPor:
usuarioAtual,

dataIndeferimento:
serverTimestamp()

}

);

await adicionarHistorico(
inscricaoSelecionada,
"Inscrição indeferida."
);

await registrarLog(

"Indeferimento",

inscricaoSelecionada,

motivo

);

fecharModal(
modalIndeferir
);

await carregarDashboard();

await carregarInscricoes();

mostrarToast(

"Sucesso",

"Inscrição indeferida."

);

ocultarLoading();

}catch(erro){

console.error(erro);

ocultarLoading();

}

});

document
.getElementById("confirmarExclusao")
.addEventListener(

"click",

async()=>{

try{

mostrarLoading();

const documento =
await getDoc(
doc(db,"inscricoes",inscricaoSelecionada)
);

if(!documento.exists()){

return;

}

await setDoc(

doc(

db,

"lixeira",

inscricaoSelecionada

),

{

...documento.data(),

dataExclusao:
serverTimestamp()

}

);

await adicionarHistorico(
inscricaoSelecionada,
"Inscrição enviada para a lixeira."
);

await deleteDoc(

doc(

db,

"inscricoes",

inscricaoSelecionada

)

);

await registrarLog(

"Lixeira",

inscricaoSelecionada,

"Inscrição enviada para a lixeira."

);

fecharModal(
modalExcluir
);

await carregarDashboard();

await carregarInscricoes();

mostrarToast(

"Sucesso",

"Inscrição enviada para a lixeira."

);

ocultarLoading();

}catch(erro){

console.error(erro);

ocultarLoading();

}

});

// ======================================================
// RESTAURAR INSCRIÇÃO
// ======================================================

window.restaurarInscricao = async function(id){

try{

mostrarLoading();

const documento =
await getDoc(
doc(db,"lixeira",id)
);

if(!documento.exists()){

mostrarToast(
"Erro",
"Inscrição não encontrada."
);

ocultarLoading();

return;

}

await setDoc(

doc(db,"inscricoes",id),

documento.data()

);

await deleteDoc(

doc(db,"lixeira",id)

);

await registrarLog(

"Restauração",

id,

"Inscrição restaurada da lixeira."

);

await carregarDashboard();

await carregarInscricoes();

mostrarToast(

"Sucesso",

"Inscrição restaurada."

);

ocultarLoading();

}catch(erro){

console.error(erro);

ocultarLoading();

}

}

// ======================================================
// EXCLUSÃO DEFINITIVA
// ======================================================

window.excluirPermanentemente = async function(id){

const confirmar =
confirm(

"Esta ação é irreversível.\n\nDeseja excluir definitivamente?"

);

if(!confirmar){

return;

}

try{

mostrarLoading();

await deleteDoc(

doc(db,"lixeira",id)

);

await registrarLog(

"Exclusão Permanente",

id,

"Registro removido definitivamente."

);

mostrarToast(

"Sucesso",

"Registro excluído."

);

ocultarLoading();

}catch(erro){

console.error(erro);

ocultarLoading();

}

}

// ======================================================
// PDF DA INSCRIÇÃO
// ======================================================

window.gerarPDF = async function(id){

const documento =
await getDoc(
doc(db,"inscricoes",id)
);

if(!documento.exists()){

return;

}

const dados =
documento.data();

const { jsPDF } = window.jspdf;

const pdf =
new jsPDF();

pdf.setFontSize(18);

pdf.text(

"UMES BREJÕES",

20,

20

);

pdf.setFontSize(12);

pdf.text(

"INSCRIÇÃO DE CHAPA",

20,

30

);

pdf.text(

"Número: " +
dados.numeroInscricao,

20,

45

);

pdf.text(

"Status: " +
dados.status,

20,

55

);

pdf.text(

"Chapa: " +
dados.chapa.nome,

20,

65

);

pdf.text(

"Presidente: " +
dados.presidente.nome,

20,

75

);

pdf.text(

"Vice: " +
dados.vice.nome,

20,

85

);

pdf.save(

dados.numeroInscricao + ".pdf"

);

}

// ======================================================
// ATA DE HOMOLOGAÇÃO
// ======================================================

window.gerarAtaHomologacao =
async function(){

const snapshot =
await getDocs(
collection(db,"inscricoes")
);

const { jsPDF } =
window.jspdf;

const pdf =
new jsPDF();

let y = 20;

pdf.setFontSize(18);

pdf.text(

"ATA DE HOMOLOGAÇÃO",

20,

y

);

y += 15;

snapshot.forEach((doc)=>{

const dados =
doc.data();

if(dados.status==="Homologada"){

pdf.text(

dados.numeroInscricao +

" - " +

dados.chapa.nome,

20,

y

);

y += 10;

}

});

pdf.save(

"Ata-Homologacao.pdf"

);

}

// ======================================================
// RELATÓRIO DE AUDITORIA
// ======================================================

window.gerarRelatorioAuditoria =
async function(){

const logs =
await getDocs(
collection(db,"logs")
);

const { jsPDF } =
window.jspdf;

const pdf =
new jsPDF();

let y = 20;

pdf.setFontSize(18);

pdf.text(

"RELATÓRIO DE AUDITORIA",

20,

20

);

y += 15;

logs.forEach((doc)=>{

const log =
doc.data();

pdf.setFontSize(10);

pdf.text(

`${log.acao} - ${log.referencia}`,

20,

y

);

y += 8;

if(y > 270){

pdf.addPage();

y = 20;

}

});

pdf.save(

"Relatorio-Auditoria.pdf"

);

}

import {
collection,
doc,
getDoc,
getDocs,
setDoc,
addDoc,
updateDoc,
deleteDoc,
query,
where,
orderBy,
limit,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ======================================================
// ATUALIZAÇÃO EM TEMPO REAL
// ======================================================

function iniciarTempoReal(){

onSnapshot(

collection(db,"inscricoes"),

async()=>{

await carregarDashboard();

await carregarInscricoes();

atualizarSincronizacao();

}

);

onSnapshot(

collection(db,"votos"),

async()=>{

await carregarDashboard();

}

);

onSnapshot(

collection(db,"eleitores"),

async()=>{

await carregarDashboard();

}

);

}

iniciarTempoReal();

// ======================================================
// ABRIR VOTAÇÃO
// ======================================================

window.abrirVotacao = async function(){

try{

await setDoc(

doc(db,"configuracoes","eleicao"),

{

aberta:true,

ultimaAlteracao:serverTimestamp()

},

{merge:true}

);

await registrarLog(

"Votação",

"Eleição",

"Votação aberta."

);

mostrarToast(

"Sucesso",

"Votação aberta."

);

}catch(erro){

console.error(erro);

}

}

// ======================================================
// ENCERRAR VOTAÇÃO
// ======================================================

window.encerrarVotacao = async function(){

const confirmar =
confirm(

"Deseja realmente encerrar a votação?"

);

if(!confirmar){

return;

}

try{

await setDoc(

doc(db,"configuracoes","eleicao"),

{

aberta:false,

ultimaAlteracao:serverTimestamp()

},

{merge:true}

);

await registrarLog(

"Votação",

"Eleição",

"Votação encerrada."

);

mostrarToast(

"Sucesso",

"Votação encerrada."

);

}catch(erro){

console.error(erro);

}

}

// ======================================================
// CONFIGURAÇÃO
// ======================================================

async function carregarConfiguracoes(){

const configuracao =

await getDoc(

doc(db,"configuracoes","eleicao")

);

if(!configuracao.exists()){

return;

}

const dados =
configuracao.data();

statusVotacao.innerText =

dados.aberta

?

"🟢 Aberta"

:

"🔴 Encerrada";

document.getElementById(

"situacaoVotacao"

).innerText =

statusVotacao.innerText;

}

// ======================================================
// COMISSÃO
// ======================================================

async function carregarComissao(){

const membros =
await getDocs(

collection(db,"comissao")

);

totalComissao.innerText =
membros.size;

}

// ======================================================
// HISTÓRICO
// ======================================================

async function adicionarHistorico(

id,

texto

){

const documento =

await getDoc(

doc(db,"inscricoes",id)

);

if(!documento.exists()){

return;

}

const dados =
documento.data();

const historico =

dados.historico || [];

historico.push({

descricao:texto,

usuario:

usuarioAtual ||

"Comissão",

dataHora:

new Date()

});

await updateDoc(

doc(db,"inscricoes",id),

{

historico

}

);

}


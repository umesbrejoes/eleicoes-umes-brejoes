// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: eventos.js
// Registro de Eventos da Interface
// ======================================================

// ======================================================
// IMPORTS
// ======================================================

import {

abrirModal,

fecharTodosModais

}

from "./modais.js";

import {

carregarDashboard

}

from "./dashboard.js";

import {

pesquisarInscricoes,

filtrarStatus,

proximaPagina,

paginaAnterior

}

from "./inscricoes.js";

import {

homologarInscricao,

solicitarCorrecao,

indeferirInscricao

}

from "./homologacoes.js";

import {

cadastrarMembro,

atualizarMembro,

excluirMembro

}

from "./comissao.js";

import {

abrirVotacao,

encerrarVotacao

}

from "./votacao.js";

import {

salvarConfiguracoes,

restaurarConfiguracoes

}

from "./configuracoes.js";

import {

gerarAtaHomologacao,

gerarRelatorioAuditoria

}

from "./pdf.js";

import {

sair

}

from "./auth.js";

// ======================================================
// REGISTRAR TODOS OS EVENTOS
// ======================================================

export function registrarEventos(){

registrarPesquisa();

registrarFiltros();

registrarPaginacao();

registrarDashboard();

registrarComissao();

registrarHomologacao();

registrarCorrecao();

registrarIndeferimento();

registrarVotacao();

registrarConfiguracoes();

registrarPDF();

registrarLogout();

}

// ======================================================
// PESQUISA
// ======================================================

function registrarPesquisa(){

const pesquisa=

document.getElementById("pesquisa");

if(!pesquisa) return;

pesquisa.addEventListener(

"input",

e=>{

pesquisarInscricoes(

e.target.value

);

}

);

}

// ======================================================
// FILTROS
// ======================================================

function registrarFiltros(){

document

.querySelectorAll(".filtro")

.forEach(botao=>{

botao.addEventListener(

"click",

()=>{

document

.querySelectorAll(".filtro")

.forEach(b=>

b.classList.remove("ativo")

);

botao.classList.add("ativo");

filtrarStatus(

botao.dataset.status

);

}

);

});

}

// ======================================================
// PAGINAÇÃO
// ======================================================

function registrarPaginacao(){

document

.getElementById(

"paginaAnterior"

)

?.addEventListener(

"click",

paginaAnterior

);

document

.getElementById(

"proximaPagina"

)

?.addEventListener(

"click",

proximaPagina

);

}

// ======================================================
// DASHBOARD
// ======================================================

function registrarDashboard(){

// ----------------------------------
// Atualizar Painel
// ----------------------------------

document

.getElementById(

"btnAtualizar"

)

?.addEventListener(

"click",

async()=>{

await carregarDashboard();

}

);

// ----------------------------------
// Abrir Votação
// ----------------------------------

document

.getElementById(

"btnAbrirVotacao"

)

?.addEventListener(

"click",

async()=>{

const confirmar=

confirm(

"Deseja abrir a votação?"

);

if(!confirmar){

return;

}

await abrirVotacao();

});

// ----------------------------------
// Encerrar Votação
// ----------------------------------

document

.getElementById(

"btnEncerrarVotacao"

)

?.addEventListener(

"click",

async()=>{

const confirmar=

confirm(

"Tem certeza que deseja encerrar a votação?\n\nEsta ação impedirá novos votos."

);

if(!confirmar){

return;

}

await encerrarVotacao();

});

// ----------------------------------
// Nova Chapa
// ----------------------------------

document

.getElementById(

"btnNovaChapa"

)

?.addEventListener(

"click",

()=>{

abrirModal(

"modalNovaChapa"

);

});

// ----------------------------------
// Ata Oficial
// ----------------------------------

document

.getElementById(

"btnAta"

)

?.addEventListener(

"click",

gerarAtaHomologacao

);

// ----------------------------------
// Relatório Auditoria
// ----------------------------------

document

.getElementById(

"btnAuditoria"

)

?.addEventListener(

"click",

gerarRelatorioAuditoria

);

}

// ======================================================
// COMISSÃO ELEITORAL
// ======================================================

let membroEditando = null;

function registrarComissao(){

// ----------------------------------
// NOVO MEMBRO
// ----------------------------------

document

.getElementById("btnNovoMembro")

?.addEventListener(

"click",

()=>{

membroEditando = null;

document.getElementById("formMembro")?.reset();

abrirModal("modalMembro");

}

);

// ----------------------------------
// SALVAR MEMBRO
// ----------------------------------

document

.getElementById("btnSalvarMembro")

?.addEventListener(

"click",

async()=>{

const dados={

nome:

document.getElementById("membroNome").value.trim(),

cargo:

document.getElementById("membroCargo").value,

nivel:

document.getElementById("membroNivel").value,

ativo:

document.getElementById("membroAtivo").checked

};

if(!dados.nome){

alert("Informe o nome do membro.");

return;

}

if(membroEditando){

await atualizarMembro(

membroEditando,

dados

);

}else{

await cadastrarMembro(

dados

);

}

fecharTodosModais();

await carregarDashboard();

}

);

}

// ======================================================
// EDITAR MEMBRO
// ======================================================

window.editarMembro = async function(

id

){

membroEditando=id;

const linha=

document

.querySelector(

`button[data-id="${id}"]`

)

?.closest("tr");

if(!linha) return;

document.getElementById("membroNome").value=

linha.cells[0].textContent.trim();

document.getElementById("membroCargo").value=

linha.cells[1].textContent.trim();

document.getElementById("membroNivel").value=

linha.cells[2].textContent.trim();

document.getElementById("membroAtivo").checked=

linha.cells[3].textContent.trim()==="Ativo";

abrirModal(

"modalMembro"

);

};

// ======================================================
// EXCLUIR MEMBRO
// ======================================================

window.excluirMembroSistema = async function(

id,

nome

){

const confirmar=

confirm(

`Deseja excluir o membro "${nome}"?`

);

if(!confirmar){

return;

}

await excluirMembro(

id,

nome

);

await carregarDashboard();

};

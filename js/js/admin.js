// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: admin.js
// Controlador Principal
// ======================================================

// ======================================================
// IMPORTS
// ======================================================

import {

inicializarModais

}

from "./modais.js";

import {

carregarDashboard,
iniciarDashboardAutomatico

}

from "./dashboard.js";

import {

carregarInscricoes,
pesquisarInscricoes,
filtrarStatus,
proximaPagina,
paginaAnterior

}

from "./inscricoes.js";

import {

carregarHomologacoes

}

from "./homologacoes.js";

import {

carregarComissao

}

from "./comissao.js";

import {

carregarVotacao,
abrirVotacao,
encerrarVotacao

}

from "./votacao.js";

import {

carregarEleitores,
pesquisarEleitor

}

from "./eleitores.js";

import {

carregarResultados

}

from "./resultados.js";

import {

carregarAuditoria

}

from "./auditoria.js";

import {

carregarLogs

}

from "./logs.js";

import {

carregarLixeira

}

from "./lixeira.js";

import {

carregarConfiguracoes,
salvarConfiguracoes,
restaurarConfiguracoes

}

from "./configuracoes.js";

import {

mostrarToast

}

from "./ui.js";

import {

verificarSessaoAdmin,
sair

}

from "./auth.js";

import {

iniciarRealtime

}

from "./realtime.js";

// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener(

"DOMContentLoaded",

async ()=>{

try{

verificarSessaoAdmin();
  
inicializarModais();

await carregarDashboard();

await carregarInscricoes();

await carregarHomologacoes();

await carregarComissao();

await carregarVotacao();

await carregarEleitores();

await carregarResultados();

await carregarAuditoria();

await carregarLogs();

await carregarLixeira();

await carregarConfiguracoes();

iniciarDashboardAutomatico();

iniciarRealtime();

registrarEventos();

mostrarToast(

"Sistema",

"Painel carregado com sucesso.",

"sucesso"

);

}catch(erro){

console.error(erro);

mostrarToast(

"Erro",

"Erro ao iniciar o painel.",

"erro"

);

}

}

);

// ======================================================
// EVENTOS DO PAINEL
// ======================================================

function registrarEventos(){

// ==========================================
// PESQUISA DAS INSCRIÇÕES
// ==========================================

const pesquisa =
document.getElementById("pesquisa");

if(pesquisa){

pesquisa.addEventListener(

"input",

(e)=>{

pesquisarInscricoes(

e.target.value

);

}

);

}

// ==========================================
// FILTROS
// ==========================================

document

.querySelectorAll(".filtro")

.forEach(botao=>{

botao.addEventListener(

"click",

()=>{

document

.querySelectorAll(".filtro")

.forEach(item=>{

item.classList.remove("ativo");

});

botao.classList.add("ativo");

filtrarStatus(

botao.dataset.status

);

}

);

});

// ==========================================
// PAGINAÇÃO
// ==========================================

const btnAnterior =
document.getElementById("paginaAnterior");

if(btnAnterior){

btnAnterior.addEventListener(

"click",

paginaAnterior

);

}

const btnProxima =
document.getElementById("proximaPagina");

if(btnProxima){

btnProxima.addEventListener(

"click",

proximaPagina

);

}

// ==========================================
// ATUALIZAR PAINEL
// ==========================================

const btnAtualizar =
document.getElementById("btnAtualizar");

if(btnAtualizar){

btnAtualizar.addEventListener(

"click",

async()=>{

await carregarDashboard();

await carregarInscricoes();

await carregarHomologacoes();

await carregarComissao();

await carregarVotacao();

await carregarEleitores();

await carregarResultados();

await carregarAuditoria();

await carregarLogs();

await carregarLixeira();

mostrarToast(

"Sistema",

"Painel atualizado com sucesso.",

"sucesso"

);

}

);

}

// ==========================================
// ABRIR VOTAÇÃO
// ==========================================

const btnAbrir =
document.getElementById("btnAbrirVotacao");

if(btnAbrir){

btnAbrir.addEventListener(

"click",

abrirVotacao

);

}

// ==========================================
// ENCERRAR VOTAÇÃO
// ==========================================

const btnEncerrar =
document.getElementById("btnEncerrarVotacao");

if(btnEncerrar){

btnEncerrar.addEventListener(

"click",

encerrarVotacao

);

}

// ==========================================
// CONFIGURAÇÕES
// ==========================================

const btnSalvarConfiguracoes =
document.getElementById("btnSalvarConfiguracoes");

if(btnSalvarConfiguracoes){

btnSalvarConfiguracoes.addEventListener(

"click",

salvarConfiguracoes

);

}

const btnRestaurarConfiguracoes =
document.getElementById("btnRestaurarConfiguracoes");

if(btnRestaurarConfiguracoes){

btnRestaurarConfiguracoes.addEventListener(

"click",

restaurarConfiguracoes

);

}

// ==========================================
// PESQUISA DE ELEITORES
// ==========================================

const pesquisaEleitor =
document.getElementById("pesquisaEleitor");

if(pesquisaEleitor){

pesquisaEleitor.addEventListener(

"input",

(e)=>{

pesquisarEleitor(

e.target.value

);

}

);

}

// ==========================================
// BOTÃO SAIR
// ==========================================

const btnSair =
document.getElementById("btnSair");

if(btnSair){

btnSair.addEventListener(

"click",

sair

);

}

}

// ======================================================
// EVENTOS
// ======================================================

function registrarEventos(){

// ==========================================
// PESQUISA DAS INSCRIÇÕES
// ==========================================

const pesquisa =
document.getElementById("pesquisa");

if(pesquisa){

pesquisa.addEventListener(

"input",

(e)=>{

pesquisarInscricoes(

e.target.value

);

}

);

}

// ==========================================
// FILTROS
// ==========================================

document

.querySelectorAll(".filtro")

.forEach(botao=>{

botao.addEventListener(

"click",

()=>{

document

.querySelectorAll(".filtro")

.forEach(b=>{

b.classList.remove("ativo");

});

botao.classList.add("ativo");

filtrarStatus(

botao.dataset.status

);

}

);

});

// ==========================================
// PAGINAÇÃO
// ==========================================

const anterior =
document.getElementById("paginaAnterior");

if(anterior){

anterior.onclick=

paginaAnterior;

}

const proxima =
document.getElementById("proximaPagina");

if(proxima){

proxima.onclick=

proximaPagina;

}

// ==========================================
// VOTAÇÃO
// ==========================================

const abrir =
document.getElementById("btnAbrirVotacao");

if(abrir){

abrir.onclick=

abrirVotacao;

}

const encerrar =
document.getElementById("btnEncerrarVotacao");

if(encerrar){

encerrar.onclick=

encerrarVotacao;

}

// ==========================================
// ATUALIZAR PAINEL
// ==========================================

const atualizar =
document.getElementById("btnAtualizar");

if(atualizar){

atualizar.addEventListener(

"click",

async()=>{

await carregarDashboard();

await carregarInscricoes();

await carregarHomologacoes();

await carregarComissao();

await carregarVotacao();

await carregarEleitores();

await carregarResultados();

await carregarAuditoria();

await carregarLogs();

await carregarLixeira();

mostrarToast(

"Sistema",

"Painel atualizado.",

"sucesso"

);

}

);

}

// ==========================================
// CONFIGURAÇÕES
// ==========================================

const salvar =
document.getElementById("btnSalvarConfiguracoes");

if(salvar){

salvar.onclick=

salvarConfiguracoes;

}

const restaurar =
document.getElementById("btnRestaurarConfiguracoes");

if(restaurar){

restaurar.onclick=

restaurarConfiguracoes;

}

// ==========================================
// LOGOUT
// ==========================================

const sairSistema =
document.getElementById("btnSair");

if(sairSistema){

sairSistema.onclick=

sair;

}

}

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

// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener(

"DOMContentLoaded",

async ()=>{

try{

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

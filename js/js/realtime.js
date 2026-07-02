// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: realtime.js
// Atualizações em Tempo Real
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
doc,
onSnapshot

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

carregarDashboard

}

from "./dashboard.js";

import {

carregarInscricoes

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

carregarVotacao

}

from "./votacao.js";

import {

carregarEleitores

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

carregarConfiguracoes

}

from "./configuracoes.js";

// ======================================================
// LISTENERS
// ======================================================

const listeners=[];

// ======================================================
// DASHBOARD
// ======================================================

function observarDashboard(){

listeners.push(

onSnapshot(

collection(db,"inscricoes"),

()=>{

carregarDashboard();

}

)

);

listeners.push(

onSnapshot(

collection(db,"votos"),

()=>{

carregarDashboard();

}

)

);

listeners.push(

onSnapshot(

collection(db,"eleitores"),

()=>{

carregarDashboard();

}

)

);

}

// ======================================================
// INSCRIÇÕES
// ======================================================

function observarInscricoes(){

listeners.push(

onSnapshot(

collection(db,"inscricoes"),

()=>{

carregarInscricoes();

carregarHomologacoes();

}

)

);

}

// ======================================================
// COMISSÃO
// ======================================================

function observarComissao(){

listeners.push(

onSnapshot(

collection(db,"comissao"),

()=>{

carregarComissao();

}

)

);

}

// ======================================================
// VOTAÇÃO
// ======================================================

function observarVotacao(){

listeners.push(

onSnapshot(

doc(db,"configuracoes","votacao"),

()=>{

carregarVotacao();

}

)

);

listeners.push(

onSnapshot(

collection(db,"votos"),

()=>{

carregarResultados();

}

)

);

}

// ======================================================
// ELEITORES
// ======================================================

function observarEleitores(){

listeners.push(

onSnapshot(

collection(db,"eleitores"),

()=>{

carregarEleitores();

}

)

);

}

// ======================================================
// AUDITORIA
// ======================================================

function observarLogs(){

listeners.push(

onSnapshot(

collection(db,"logs"),

()=>{

carregarLogs();

carregarAuditoria();

}

)

);

}

// ======================================================
// LIXEIRA
// ======================================================

function observarLixeira(){

listeners.push(

onSnapshot(

collection(db,"lixeira"),

()=>{

carregarLixeira();

}

)

);

}

// ======================================================
// CONFIGURAÇÕES
// ======================================================

function observarConfiguracoes(){

listeners.push(

onSnapshot(

doc(db,"configuracoes","sistema"),

()=>{

carregarConfiguracoes();

}

)

);

}

// ======================================================
// INICIAR
// ======================================================

export function iniciarRealtime(){

observarDashboard();

observarInscricoes();

observarComissao();

observarVotacao();

observarEleitores();

observarLogs();

observarLixeira();

observarConfiguracoes();

}

// ======================================================
// FINALIZAR
// ======================================================

export function pararRealtime(){

listeners.forEach(

cancelar=>cancelar()

);

listeners.length=0;

}

// ======================================================
// EXPORTS
// ======================================================

export default{

iniciarRealtime,

pararRealtime

};

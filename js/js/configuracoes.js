// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: configuracoes.js
// Configurações do Sistema
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

doc,
getDoc,
setDoc,
updateDoc,
collection,
addDoc

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

mostrarLoading,
esconderLoading,
mostrarToast

}

from "./ui.js";

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

usuario:"Administrador",

data:serverTimestamp()

});

}

// ======================================================
// CARREGAR CONFIGURAÇÕES
// ======================================================

export async function carregarConfiguracoes(){

try{

mostrarLoading(

"Carregando configurações..."

);

const documento=

await getDoc(

doc(

db,

"configuracoes",

"sistema"

)

);

if(!documento.exists()){

esconderLoading();

return;

}

const dados=

documento.data();

document.getElementById(

"cfgTituloEleicao"

).value=

dados.tituloEleicao || "";

document.getElementById(

"cfgAnoEleicao"

).value=

dados.ano || "";

document.getElementById(

"cfgCloudName"

).value=

dados.cloudName || "";

document.getElementById(

"cfgUploadPreset"

).value=

dados.uploadPreset || "";

document.getElementById(

"cfgLimiteUpload"

).value=

dados.limiteUpload || 10;

document.getElementById(

"cfgTiposArquivos"

).value=

dados.tiposArquivos || "";

document.getElementById(

"cfgPermitirInscricao"

).checked=

dados.permitirInscricao ?? true;

document.getElementById(

"cfgPermitirHomologacao"

).checked=

dados.permitirHomologacao ?? true;

document.getElementById(

"cfgPermitirVotacao"

).checked=

dados.permitirVotacao ?? false;

document.getElementById(

"cfgResultadoAutomatico"

).checked=

dados.resultadoAutomatico ?? false;

document.getElementById(

"cfgAuditoriaAutomatica"

).checked=

dados.auditoriaAutomatica ?? true;

document.getElementById(

"cfgBackupAutomatico"

).checked=

dados.backupAutomatico ?? true;

esconderLoading();

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível carregar as configurações.",

"erro"

);

}

}

// ======================================================
// SALVAR
// ======================================================

export async function salvarConfiguracoes(){

try{

mostrarLoading(

"Salvando configurações..."

);

const dados={

tituloEleicao:

document.getElementById("cfgTituloEleicao").value,

ano:

Number(document.getElementById("cfgAnoEleicao").value),

cloudName:

document.getElementById("cfgCloudName").value,

uploadPreset:

document.getElementById("cfgUploadPreset").value,

limiteUpload:

Number(document.getElementById("cfgLimiteUpload").value),

tiposArquivos:

document.getElementById("cfgTiposArquivos").value,

permitirInscricao:

document.getElementById("cfgPermitirInscricao").checked,

permitirHomologacao:

document.getElementById("cfgPermitirHomologacao").checked,

permitirVotacao:

document.getElementById("cfgPermitirVotacao").checked,

resultadoAutomatico:

document.getElementById("cfgResultadoAutomatico").checked,

auditoriaAutomatica:

document.getElementById("cfgAuditoriaAutomatica").checked,

backupAutomatico:

document.getElementById("cfgBackupAutomatico").checked,

ultimaAtualizacao:

serverTimestamp()

};

await setDoc(

doc(

db,

"configuracoes",

"sistema"

),

dados,

{

merge:true

}

);

await registrarLog(

"Configurações",

"Configurações do sistema atualizadas."

);

esconderLoading();

mostrarToast(

"Sucesso",

"Configurações salvas com sucesso.",

"sucesso"

);

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível salvar as configurações.",

"erro"

);

}

}

// ======================================================
// RESTAURAR PADRÃO
// ======================================================

export async function restaurarConfiguracoes(){

if(!confirm(

"Deseja restaurar as configurações padrão?"

)) return;

await updateDoc(

doc(

db,

"configuracoes",

"sistema"

),

{

permitirInscricao:true,

permitirHomologacao:true,

permitirVotacao:false,

resultadoAutomatico:false,

auditoriaAutomatica:true,

backupAutomatico:true,

ultimaAtualizacao:serverTimestamp()

}

);

await registrarLog(

"Configurações",

"Configurações restauradas."

);

mostrarToast(

"Sucesso",

"Configurações restauradas.",

"sucesso"

);

carregarConfiguracoes();

}

// ======================================================
// AUTO UPDATE
// ======================================================

export function iniciarConfiguracoes(){

carregarConfiguracoes();

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarConfiguracoes,

salvarConfiguracoes,

restaurarConfiguracoes,

iniciarConfiguracoes

};

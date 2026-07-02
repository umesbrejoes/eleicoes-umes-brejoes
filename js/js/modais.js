// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: modais.js
// Controle de Modais
// ======================================================

// ======================================================
// ABRIR MODAL
// ======================================================

export function abrirModal(id){

const modal =
document.getElementById(id);

if(!modal) return;

modal.classList.add("ativo");

document.body.style.overflow="hidden";

}

// ======================================================
// FECHAR MODAL
// ======================================================

export function fecharModal(id){

const modal =
document.getElementById(id);

if(!modal) return;

modal.classList.remove("ativo");

document.body.style.overflow="auto";

}

// ======================================================
// FECHAR TODOS
// ======================================================

export function fecharTodosModais(){

document

.querySelectorAll(".modal")

.forEach(modal=>{

modal.classList.remove("ativo");

});

document.body.style.overflow="auto";

}

// ======================================================
// EVENTOS
// ======================================================

export function inicializarModais(){

document

.querySelectorAll(".fecharModal")

.forEach(botao=>{

botao.addEventListener(

"click",

fecharTodosModais

);

});

document

.querySelectorAll(".modal")

.forEach(modal=>{

modal.addEventListener(

"click",

(e)=>{

if(e.target===modal){

fecharTodosModais();

}

}

);

});

}

// ======================================================
// VISUALIZAR INSCRIÇÃO
// ======================================================

export function abrirVisualizacao(){

abrirModal("modalVisualizar");

}

export function fecharVisualizacao(){

fecharModal("modalVisualizar");

}

// ======================================================
// DOCUMENTOS
// ======================================================

export function visualizarDocumento(url){

const iframe =
document.getElementById("iframeDocumento");

const download =
document.getElementById("baixarDocumento");

if(!iframe) return;

iframe.src=url;

download.href=url;

abrirModal("modalDocumento");

}

// ======================================================
// CONFIRMAÇÃO
// ======================================================

let callbackConfirmacao=null;

export function abrirConfirmacao(

texto,

callback

){

document.getElementById(

"textoConfirmacao"

).textContent=texto;

callbackConfirmacao=callback;

abrirModal(

"modalConfirmacao"

);

}

document

.addEventListener(

"click",

(e)=>{

if(

e.target.id==="btnConfirmarAcao"

){

if(callbackConfirmacao){

callbackConfirmacao();

}

fecharTodosModais();

}

}

);

// ======================================================
// EXPORTS
// ======================================================

export default{

abrirModal,

fecharModal,

fecharTodosModais,

inicializarModais,

abrirVisualizacao,

fecharVisualizacao,

visualizarDocumento,

abrirConfirmacao

};

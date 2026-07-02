// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: ui.js
// Interface do Usuário
// ======================================================

// ======================================================
// TOAST
// ======================================================

export function mostrarToast(

titulo,

mensagem,

tipo = "info"

){

const toast =
document.getElementById("toast");

if(!toast) return;

const icone =
document.getElementById("toastIcone");

const tituloToast =
document.getElementById("toastTitulo");

const mensagemToast =
document.getElementById("toastMensagem");

tituloToast.textContent = titulo;

mensagemToast.textContent = mensagem;

toast.className = "toast";

switch(tipo){

case "sucesso":

icone.className =
"fa-solid fa-circle-check";

toast.classList.add("toast-sucesso");

break;

case "erro":

icone.className =
"fa-solid fa-circle-xmark";

toast.classList.add("toast-erro");

break;

case "alerta":

icone.className =
"fa-solid fa-triangle-exclamation";

toast.classList.add("toast-alerta");

break;

default:

icone.className =
"fa-solid fa-circle-info";

toast.classList.add("toast-info");

}

toast.classList.add("mostrar");

setTimeout(()=>{

toast.classList.remove("mostrar");

},5000);

}

// ======================================================
// LOADING
// ======================================================

export function mostrarLoading(

texto="Carregando..."

){

const loading =
document.getElementById("loading");

const mensagem =
document.getElementById("loadingTexto");

if(!loading) return;

mensagem.textContent = texto;

loading.style.display="flex";

}

export function esconderLoading(){

const loading =
document.getElementById("loading");

if(!loading) return;

loading.style.display="none";

}

// ======================================================
// TEXTO
// ======================================================

export function atualizarTexto(

id,

valor

){

const elemento =
document.getElementById(id);

if(!elemento) return;

elemento.textContent = valor;

}

// ======================================================
// HTML
// ======================================================

export function atualizarHTML(

id,

html

){

const elemento =
document.getElementById(id);

if(!elemento) return;

elemento.innerHTML = html;

}

// ======================================================
// STATUS
// ======================================================

export function badgeStatus(status){

switch(status){

case "Homologada":

return

`<span class="badge badge-verde">

Homologada

</span>`;

case "Indeferida":

return

`<span class="badge badge-vermelho">

Indeferida

</span>`;

case "Correção Solicitada":

return

`<span class="badge badge-amarelo">

Correção

</span>`;

case "Lixeira":

return

`<span class="badge badge-cinza">

Lixeira

</span>`;

default:

return

`<span class="badge badge-azul">

Pendente

</span>`;

}

}

// ======================================================
// BOTÕES
// ======================================================

export function desabilitarBotao(id){

const botao =
document.getElementById(id);

if(botao){

botao.disabled=true;

}

}

export function habilitarBotao(id){

const botao =
document.getElementById(id);

if(botao){

botao.disabled=false;

}

}

// ======================================================
// EXPORTS
// ======================================================

export default{

mostrarToast,

mostrarLoading,

esconderLoading,

atualizarTexto,

atualizarHTML,

badgeStatus,

desabilitarBotao,

habilitarBotao

};

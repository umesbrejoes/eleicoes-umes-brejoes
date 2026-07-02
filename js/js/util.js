// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: util.js
// Funções Utilitárias
// ======================================================

// ======================================================
// DATA
// ======================================================

export function formatarData(data){

if(!data) return "--";

if(data.seconds){

data = new Date(data.seconds * 1000);

}

return data.toLocaleDateString("pt-BR");

}

// ======================================================
// DATA E HORA
// ======================================================

export function formatarDataHora(data){

if(!data) return "--";

if(data.seconds){

data = new Date(data.seconds * 1000);

}

return data.toLocaleString("pt-BR");

}

// ======================================================
// HORA
// ======================================================

export function formatarHora(data){

if(!data) return "--";

if(data.seconds){

data = new Date(data.seconds * 1000);

}

return data.toLocaleTimeString("pt-BR");

}

// ======================================================
// PRIMEIRA LETRA MAIÚSCULA
// ======================================================

export function capitalizar(texto){

if(!texto) return "";

return texto.charAt(0).toUpperCase() +
texto.slice(1).toLowerCase();

}

// ======================================================
// REMOVER ESPAÇOS DUPLOS
// ======================================================

export function limparTexto(texto){

return texto
.trim()
.replace(/\s+/g," ");

}

// ======================================================
// CPF
// ======================================================

export function mascararCPF(cpf){

if(!cpf) return "";

cpf = cpf.replace(/\D/g,"");

return cpf.replace(
/(\d{3})(\d{3})(\d{3})(\d{2})/,
"$1.$2.$3-$4"
);

}

// ======================================================
// TELEFONE
// ======================================================

export function mascararTelefone(numero){

if(!numero) return "";

numero = numero.replace(/\D/g,"");

return numero.replace(
/(\d{2})(\d{5})(\d{4})/,
"($1) $2-$3"
);

}

// ======================================================
// PROTOCOLO
// ======================================================

export function gerarProtocolo(){

return "PRT-" +
Date.now();

}

// ======================================================
// NÚMERO DA INSCRIÇÃO
// ======================================================

export function gerarNumeroInscricao(numero){

return "INS-2026-" +
String(numero).padStart(4,"0");

}

// ======================================================
// DOWNLOAD
// ======================================================

export function baixarArquivo(url){

window.open(url,"_blank");

}

// ======================================================
// COPIAR TEXTO
// ======================================================

export async function copiarTexto(texto){

await navigator.clipboard.writeText(texto);

}

// ======================================================
// STATUS
// ======================================================

export function corStatus(status){

switch(status){

case "Homologada":
return "verde";

case "Indeferida":
return "vermelho";

case "Correção Solicitada":
return "amarelo";

case "Lixeira":
return "cinza";

default:
return "azul";

}

}

// ======================================================
// EXPORTS
// ======================================================

export default{

formatarData,

formatarDataHora,

formatarHora,

capitalizar,

limparTexto,

mascararCPF,

mascararTelefone,

gerarNumeroInscricao,

gerarProtocolo,

baixarArquivo,

copiarTexto,

corStatus

};

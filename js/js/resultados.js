// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: resultados.js
// Apuração e Resultados
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
getDocs

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

mostrarLoading,
esconderLoading,
mostrarToast,
atualizarTexto

}

from "./ui.js";

// ======================================================
// VARIÁVEIS
// ======================================================

let resultados=[];

let totalValidos=0;

let votosBrancos=0;

let votosNulos=0;

// ======================================================
// CARREGAR RESULTADOS
// ======================================================

export async function carregarResultados(){

try{

mostrarLoading(

"Apurando votos..."

);

const votosSnapshot=

await getDocs(

collection(db,"votos")

);

const chapasSnapshot=

await getDocs(

collection(db,"inscricoes")

);

const mapa={};

totalValidos=0;

votosBrancos=0;

votosNulos=0;

chapasSnapshot.forEach(doc=>{

const chapa=doc.data();

if(chapa.status==="Homologada"){

mapa[chapa.numeroChapa]={

numero:chapa.numeroChapa,

nome:chapa.chapa.nome,

presidente:chapa.presidente.nome,

vice:chapa.vice.nome,

votos:0

};

}

});

votosSnapshot.forEach(doc=>{

const voto=doc.data();

if(voto.tipo==="BRANCO"){

votosBrancos++;

return;

}

if(voto.tipo==="NULO"){

votosNulos++;

return;

}

if(mapa[voto.numeroChapa]){

mapa[voto.numeroChapa].votos++;

totalValidos++;

}

});

resultados=Object.values(mapa);

resultados.sort(

(a,b)=>b.votos-a.votos

);

renderizarTabela();

atualizarResumo();

esconderLoading();

}catch(erro){

console.error(erro);

esconderLoading();

mostrarToast(

"Erro",

"Não foi possível apurar os votos.",

"erro"

);

}

}

// ======================================================
// TABELA
// ======================================================

function renderizarTabela(){

const tbody=

document.getElementById(

"listaResultados"

);

if(!tbody) return;

tbody.innerHTML="";

const totalGeral=

totalValidos+

votosBrancos+

votosNulos;

resultados.forEach((chapa,index)=>{

const percentual=

totalGeral===0

?0

:((chapa.votos/

totalGeral)

*100).toFixed(2);

tbody.innerHTML +=`

<tr>

<td>${index+1}º</td>

<td>${chapa.numero}</td>

<td>${chapa.nome}</td>

<td>${chapa.presidente}</td>

<td>${chapa.vice}</td>

<td>${chapa.votos}</td>

<td>${percentual}%</td>

</tr>

`;

});

}

// ======================================================
// RESUMO
// ======================================================

function atualizarResumo(){

const totalGeral=

totalValidos+

votosBrancos+

votosNulos;

atualizarTexto(

"resultadoTotalVotos",

totalGeral

);

atualizarTexto(

"resultadoValidos",

totalValidos

);

atualizarTexto(

"resultadoBrancos",

votosBrancos

);

atualizarTexto(

"resultadoResumoBrancos",

votosBrancos

);

atualizarTexto(

"resultadoNulos",

votosNulos

);

atualizarTexto(

"resultadoResumoNulos",

votosNulos

);

atualizarTexto(

"resultadoTotalChapas",

resultados.length

);

if(resultados.length>0){

atualizarTexto(

"chapaLider",

resultados[0].nome

);

}

}

// ======================================================
// PROCLAMAÇÃO
// ======================================================

export function proclamarResultado(){

const texto=

document.getElementById(

"textoProclamacao"

);

if(!texto) return;

if(resultados.length===0){

texto.textContent=

"Nenhuma chapa homologada foi encontrada.";

return;

}

texto.innerHTML=

`A Comissão Eleitoral proclama como vencedora a chapa <strong>${resultados[0].nome}</strong>, com <strong>${resultados[0].votos}</strong> votos válidos.`;

}

// ======================================================
// AUTO UPDATE
// ======================================================

export function iniciarResultadosAutomaticos(){

carregarResultados();

setInterval(

carregarResultados,

30000

);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarResultados,

proclamarResultado,

iniciarResultadosAutomaticos

};

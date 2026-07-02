// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: votacao.js
// Controle da Votação
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
getDocs,
addDoc

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

usuario:"Comissão Eleitoral",

data:serverTimestamp()

}

);

}

// ======================================================
// CARREGAR VOTAÇÃO
// ======================================================

export async function carregarVotacao(){

const documento=

await getDoc(

doc(

db,

"configuracoes",

"votacao"

)

);

if(!documento.exists()){

return;

}

const dados=

documento.data();

atualizarTexto(

"statusVotacao",

dados.aberta

? "Aberta"

: "Fechada"

);

atualizarTexto(

"statusVotacaoPainel",

dados.aberta

? "Aberta"

: "Fechada"

);

}

// ======================================================
// ABRIR
// ======================================================

export async function abrirVotacao(){

mostrarLoading(

"Abrindo votação..."

);

await setDoc(

doc(

db,

"configuracoes",

"votacao"

),

{

aberta:true,

inicio:serverTimestamp(),

ultimaAtualizacao:serverTimestamp()

}

);

await registrarLog(

"Votação",

"Votação aberta."

);

esconderLoading();

mostrarToast(

"Sucesso",

"Votação aberta.",

"sucesso"

);

carregarVotacao();

}

// ======================================================
// ENCERRAR
// ======================================================

export async function encerrarVotacao(){

mostrarLoading(

"Encerrando votação..."

);

await updateDoc(

doc(

db,

"configuracoes",

"votacao"

),

{

aberta:false,

fim:serverTimestamp(),

ultimaAtualizacao:serverTimestamp()

}

);

await registrarLog(

"Votação",

"Votação encerrada."

);

esconderLoading();

mostrarToast(

"Sucesso",

"Votação encerrada.",

"sucesso"

);

carregarVotacao();

}

// ======================================================
// ESTATÍSTICAS
// ======================================================

export async function atualizarEstatisticasVotacao(){

const votos=

await getDocs(

collection(

db,

"votos"

)

);

const eleitores=

await getDocs(

collection(

db,

"eleitores"

)

);

atualizarTexto(

"votosComputados",

votos.size

);

atualizarTexto(

"eleitoresAptos",

eleitores.size

);

const percentual=

eleitores.size===0

? 0

: (

(votos.size/eleitores.size)

*100

).toFixed(1);

atualizarTexto(

"percentualParticipacao",

percentual+"%"

);

}

// ======================================================
// AUTO UPDATE
// ======================================================

export function iniciarMonitoramentoVotacao(){

carregarVotacao();

atualizarEstatisticasVotacao();

setInterval(()=>{

carregarVotacao();

atualizarEstatisticasVotacao();

},30000);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

carregarVotacao,

abrirVotacao,

encerrarVotacao,

atualizarEstatisticasVotacao,

iniciarMonitoramentoVotacao

};

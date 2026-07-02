// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: historico.js
// Histórico das Inscrições
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
updateDoc,
arrayUnion

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

formatarDataHora

}

from "./util.js";

// ======================================================
// ADICIONAR HISTÓRICO
// ======================================================

export async function adicionarHistorico(

id,

acao,

usuario,

descricao=""

){

const referencia=

doc(

db,

"inscricoes",

id

);

await updateDoc(

referencia,

{

historico:arrayUnion({

acao,

usuario,

descricao,

data:serverTimestamp()

})

}

);

}

// ======================================================
// BUSCAR HISTÓRICO
// ======================================================

export async function buscarHistorico(id){

const documento=

await getDoc(

doc(

db,

"inscricoes",

id

)

);

if(

!documento.exists()

){

return [];

}

const dados=

documento.data();

return dados.historico || [];

}

// ======================================================
// LINHA DO TEMPO
// ======================================================

export async function renderizarHistorico(

id,

elementoId="timelineHistorico"

){

const historico=

await buscarHistorico(id);

const container=

document.getElementById(elementoId);

if(!container) return;

container.innerHTML="";

if(historico.length===0){

container.innerHTML=

`<p>

Nenhum histórico registrado.

</p>`;

return;

}

historico

.sort((a,b)=>{

const dataA=

a.data?.seconds || 0;

const dataB=

b.data?.seconds || 0;

return dataB-dataA;

})

.forEach(item=>{

container.innerHTML +=`

<div class="historico-item">

<div class="historico-topo">

<strong>

${item.acao}

</strong>

<small>

${formatarDataHora(item.data)}

</small>

</div>

<p>

${item.descricao || "-"}

</p>

<span>

${item.usuario}

</span>

</div>

`;

});

}

// ======================================================
// ÚLTIMA AÇÃO
// ======================================================

export async function ultimaAcao(id){

const historico=

await buscarHistorico(id);

if(historico.length===0){

return null;

}

historico.sort((a,b)=>{

const dataA=

a.data?.seconds || 0;

const dataB=

b.data?.seconds || 0;

return dataB-dataA;

});

return historico[0];

}

// ======================================================
// ESTATÍSTICAS
// ======================================================

export async function quantidadeEventos(id){

const historico=

await buscarHistorico(id);

return historico.length;

}

// ======================================================
// LIMPAR HISTÓRICO
// ======================================================

export async function limparHistorico(id){

await updateDoc(

doc(

db,

"inscricoes",

id

),

{

historico:[]

}

);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

adicionarHistorico,

buscarHistorico,

renderizarHistorico,

ultimaAcao,

quantidadeEventos,

limparHistorico

};

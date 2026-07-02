// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: pdf.js
// Geração de Documentos Oficiais
// ======================================================

// ======================================================
// IMPORTS
// ======================================================

import {

db

}

from "./firebase.js";

import {

doc,
getDoc,
getDocs,
collection,
query,
orderBy

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {

formatarDataHora

}

from "./util.js";

import {

mostrarToast

}

from "./ui.js";

// ======================================================
// CABEÇALHO
// ======================================================

function adicionarCabecalho(pdf,titulo){

pdf.setFont("helvetica","bold");

pdf.setFontSize(18);

pdf.text(

"UNIÃO MUNICIPAL DOS E DAS ESTUDANTES DE BREJÕES",

105,

20,

{

align:"center"

}

);

pdf.setFontSize(15);

pdf.text(

"PROCESSO ELEITORAL 2026",

105,

30,

{

align:"center"

}

);

pdf.setFontSize(14);

pdf.text(

titulo,

105,

42,

{

align:"center"

}

);

pdf.setLineWidth(.5);

pdf.line(

20,

48,

190,

48

);

}

// ======================================================
// PDF INSCRIÇÃO
// ======================================================

export async function gerarPDFInscricao(id){

const documento=

await getDoc(

doc(

db,

"inscricoes",

id

)

);

if(!documento.exists()){

mostrarToast(

"Erro",

"Inscrição não encontrada.",

"erro"

);

return;

}

const dados=

documento.data();

const{

jsPDF

}=window.jspdf;

const pdf=

new jsPDF();

adicionarCabecalho(

pdf,

"COMPROVANTE DE INSCRIÇÃO"

);

let y=60;

pdf.setFontSize(12);

pdf.text(

`Número: ${dados.numeroInscricao}`,

20,

y

);

y+=10;

pdf.text(

`Status: ${dados.status}`,

20,

y

);

y+=10;

pdf.text(

`Chapa: ${dados.chapa.nome}`,

20,

y

);

y+=10;

pdf.text(

`Presidente: ${dados.presidente.nome}`,

20,

y

);

y+=10;

pdf.text(

`Vice: ${dados.vice.nome}`,

20,

y

);

y+=10;

pdf.text(

`Data: ${formatarDataHora(dados.dataHora)}`,

20,

y

);

pdf.save(

`${dados.numeroInscricao}.pdf`

);

}

// ======================================================
// ATA DE HOMOLOGAÇÃO
// ======================================================

export async function gerarAtaHomologacao(){

const snapshot=

await getDocs(

query(

collection(db,"inscricoes"),

orderBy("numeroChapa")

)

);

const{

jsPDF

}=window.jspdf;

const pdf=

new jsPDF();

adicionarCabecalho(

pdf,

"ATA DE HOMOLOGAÇÃO"

);

let y=60;

snapshot.forEach(doc=>{

const dados=

doc.data();

if(dados.status!=="Homologada"){

return;

}

pdf.setFontSize(11);

pdf.text(

`${dados.numeroChapa} - ${dados.chapa.nome}`,

20,

y

);

y+=8;

pdf.text(

`Presidente: ${dados.presidente.nome}`,

25,

y

);

y+=8;

pdf.text(

`Vice: ${dados.vice.nome}`,

25,

y

);

y+=12;

if(y>270){

pdf.addPage();

y=20;

}

});

pdf.save(

"Ata-Homologacao.pdf"

);

}

// ======================================================
// AUDITORIA
// ======================================================

export async function gerarRelatorioAuditoria(){

const snapshot=

await getDocs(

query(

collection(db,"logs"),

orderBy("data","desc")

)

);

const{

jsPDF

}=window.jspdf;

const pdf=

new jsPDF();

adicionarCabecalho(

pdf,

"RELATÓRIO DE AUDITORIA"

);

let y=60;

snapshot.forEach(doc=>{

const log=

doc.data();

pdf.setFontSize(10);

pdf.text(

formatarDataHora(log.data),

20,

y

);

pdf.text(

log.acao,

65,

y

);

pdf.text(

log.usuario||"-",

105,

y

);

pdf.text(

log.inscricao||"-",

155,

y

);

y+=7;

if(y>275){

pdf.addPage();

y=20;

}

});

pdf.save(

"Relatorio-Auditoria.pdf"

);

}

// ======================================================
// BOLETIM
// ======================================================

export async function gerarBoletimApuracao(){

const snapshot=

await getDocs(

collection(db,"votos")

);

const{

jsPDF

}=window.jspdf;

const pdf=

new jsPDF();

adicionarCabecalho(

pdf,

"BOLETIM DE APURAÇÃO"

);

let y=60;

pdf.setFontSize(12);

pdf.text(

`Total de votos: ${snapshot.size}`,

20,

y

);

pdf.save(

"Boletim-Apuracao.pdf"

);

}

// ======================================================
// EXPORTS
// ======================================================

export default{

gerarPDFInscricao,

gerarAtaHomologacao,

gerarRelatorioAuditoria,

gerarBoletimApuracao

};

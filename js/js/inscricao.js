// =========================
// IMPORTS
// =========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getFirestore,
collection,
doc,
getDoc,
getDocs,
setDoc,
query,
where,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
getStorage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// =========================
// FIREBASE
// =========================

const firebaseConfig = {

apiKey: "AIzaSyBCgk_6cEcCF4_O2pACTSkhk1IInC-1Uro",
authDomain: "umes-brejoes-eleicoes-2026.firebaseapp.com",
projectId: "umes-brejoes-eleicoes-2026",
storageBucket: "umes-brejoes-eleicoes-2026.firebasestorage.app",
messagingSenderId: "406100216755",
appId: "1:406100216755:web:f994e5e2d386a2e97ed9c6"
measurementId: "G-F5EWF15PVY"
};

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// =========================
// PERÍODO DE INSCRIÇÃO
// =========================

const inicioInscricao =
new Date("2026-07-06T00:00:00");

const fimInscricao =
new Date("2026-07-14T21:00:00");

function verificarPeriodoInscricao(){

const agora = new Date();

if(
agora < inicioInscricao ||
agora > fimInscricao
){

alert(
"As inscrições de chapas não estão disponíveis neste momento."
);

const botao =
document.getElementById("btnInscrever");

if(botao){

botao.disabled = true;

botao.innerText =
"INSCRIÇÕES ENCERRADAS";

}

return false;

}

return true;

}

verificarPeriodoInscricao();

// =========================
// GERAR NÚMERO DA INSCRIÇÃO
// =========================

async function gerarNumeroInscricao(){

const snapshot =
await getDocs(
collection(db,"inscricoes")
);

const numero =
snapshot.size + 1;

return "INS-2026-" +
String(numero).padStart(4,"0");

}

function criarHistoricoInicial(){

return [

{

acao:"Inscrição criada",

usuario:"Sistema",

data:new Date()

}

];

}

function obterDadosTecnicos(){

return{

navegador:
navigator.userAgent,

plataforma:
navigator.platform,

idioma:
navigator.language

};

}

// =========================
// VALIDAÇÃO DO FORMULÁRIO
// =========================

function valor(id){

const elemento =
document.getElementById(id);

return elemento ?
elemento.value.trim() :
"";

}

function arquivo(id){

const elemento =
document.getElementById(id);

if(!elemento){
return null;
}

return elemento.files.length > 0 ?
elemento.files[0] :
null;

}

function marcado(id){

const elemento =
document.getElementById(id);

return elemento ?
elemento.checked :
false;

}

async function prepararDadosInscricao(){

if(!verificarPeriodoInscricao()){
return null;
}

// =========================
// DADOS DA CHAPA
// =========================

const dadosChapa = {

nome:
valor("nomeChapa"),

sigla:
valor("siglaChapa"),

slogan:
valor("slogan"),

tipoPlano:
document.querySelector('input[name="tipoPlano"]:checked')?.value || "texto",

textoPlano:
valor("textoPlano")

};

// =========================
// PRESIDENTE
// =========================

const presidente = {

nome:
valor("presidenteNome"),

nascimento:
valor("presidenteNascimento"),

cpf:
valor("presidenteCPF"),

rg:
valor("presidenteRG"),

cep:
valor("presidenteCEP"),

logradouro:
valor("presidenteLogradouro"),

numero:
valor("presidenteNumero"),

complemento:
valor("presidenteComplemento"),

bairro:
valor("presidenteBairro"),

municipio:
valor("presidenteMunicipio"),

estado:
valor("presidenteEstado"),

escola:
valor("presidenteEscola"),

serie:
valor("presidenteSerie"),

turno:
valor("presidenteTurno"),

matricula:
valor("presidenteMatricula"),

email:
valor("presidenteEmail"),

telefone:
valor("presidenteTelefone")

};

// =========================
// VICE
// =========================

const vice = {

nome:
valor("viceNome"),

nascimento:
valor("viceNascimento"),

cpf:
valor("viceCPF"),

rg:
valor("viceRG"),

cep:
valor("viceCEP"),

logradouro:
valor("viceLogradouro"),

numero:
valor("viceNumero"),

complemento:
valor("viceComplemento"),

bairro:
valor("viceBairro"),

municipio:
valor("viceMunicipio"),

estado:
valor("viceEstado"),

escola:
valor("viceEscola"),

serie:
valor("viceSerie"),

turno:
valor("viceTurno"),

matricula:
valor("viceMatricula"),

email:
valor("viceEmail"),

telefone:
valor("viceTelefone")

};

// =========================
// CAMPOS OBRIGATÓRIOS
// =========================

const obrigatorios = [

dadosChapa.nome,

presidente.nome,
presidente.nascimento,
presidente.cpf,
presidente.rg,
presidente.cep,
presidente.logradouro,
presidente.numero,
presidente.bairro,
presidente.municipio,
presidente.estado,
presidente.escola,
presidente.serie,
presidente.turno,
presidente.email,
presidente.telefone,

vice.nome,
vice.nascimento,
vice.cpf,
vice.rg,
vice.cep,
vice.logradouro,
vice.numero,
vice.bairro,
vice.municipio,
vice.estado,
vice.escola,
vice.serie,
vice.turno,
vice.email,
vice.telefone

];

for(const campo of obrigatorios){

if(campo===""){

alert(
"Preencha todos os campos obrigatórios."
);

return null;

}

}

// =========================
// DECLARAÇÕES
// =========================

if(
!marcado("declaracaoVerdade") ||
!marcado("declaracaoEdital") ||
!marcado("declaracaoLGPD")
){

alert(
"É obrigatório aceitar todas as declarações."
);

return null;

}

// =========================
// DOCUMENTOS
// =========================

const documentos = {

documentoPresidente:
arquivo("docPresidente"),

documentoVice:
arquivo("docVice"),

cpf:
arquivo("cpfDocumento"),

matriculaPresidente:
arquivo("matriculaPresidente"),

matriculaVice:
arquivo("matriculaVice"),

declaracao:
arquivo("declaracao"),

plano:
arquivo("planoGestaoArquivo")

};

if(
!documentos.documentoPresidente ||
!documentos.documentoVice ||
!documentos.matriculaPresidente ||
!documentos.matriculaVice ||
!documentos.declaracao
){

alert(
"Envie todos os documentos obrigatórios."
);

return null;

}

// =========================
// DADOS FINAIS
// =========================

const numeroInscricao =
await gerarNumeroInscricao();

return{

numeroInscricao,

dataHora:
serverTimestamp(),

status:
"Pendente",

chapa:
dadosChapa,

presidente,

vice,

documentos,

historico:
criarHistoricoInicial(),

dadosTecnicos:
obterDadosTecnicos(),

observacoes:
valor("observacoes")

};

}


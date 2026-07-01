// =====================================================
// SISTEMA DE INSCRIÇÃO DE CHAPAS
// ELEIÇÕES UMES BREJÕES 2026
// =====================================================

// =====================================================
// IMPORTS
// =====================================================

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {

getFirestore,

collection,

doc,

getDoc,

getDocs,

setDoc,

addDoc,

query,

where,

serverTimestamp

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { uploadArquivo }

from "./cloudinary.js";

// =====================================================
// FIREBASE
// =====================================================

const firebaseConfig = {

apiKey:"SUA_API_KEY",

authDomain:"umes-brejoes-eleicoes-2026.firebaseapp.com",

projectId:"umes-brejoes-eleicoes-2026",

storageBucket:"umes-brejoes-eleicoes-2026.firebasestorage.app",

messagingSenderId:"406100216755",

appId:"1:406100216755:web:f994e5e2d386a2e97ed9c6"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// =====================================================
// CONFIGURAÇÕES DO SISTEMA
// =====================================================

const CONFIG = {

ANO:2026,

PREFIXO:"INS",

STATUS_INICIAL:"Pendente",

INICIO_INSCRICOES:
new Date("2026-07-06T00:00:00"),

FIM_INSCRICOES:
new Date("2026-07-14T21:00:00"),

TAMANHO_MAXIMO:
10 * 1024 * 1024

};

// =====================================================
// VERIFICA PERÍODO
// =====================================================

function verificarPeriodoInscricao(){

const agora = new Date();

if(

agora < CONFIG.INICIO_INSCRICOES ||

agora > CONFIG.FIM_INSCRICOES

){

const botao =
document.getElementById("btnInscrever");

if(botao){

botao.disabled = true;

botao.innerText =
"INSCRIÇÕES ENCERRADAS";

}

alert(

"As inscrições não estão disponíveis neste momento."

);

return false;

}

return true;

}

verificarPeriodoInscricao();

// =====================================================
// FUNÇÕES UTILITÁRIAS
// =====================================================

// Obtém o valor de um campo
function valor(id){

const elemento =
document.getElementById(id);

if(!elemento){
return "";
}

return elemento.value.trim();

}

// Obtém um arquivo
function arquivo(id){

const elemento =
document.getElementById(id);

if(
!elemento ||
elemento.files.length===0
){

return null;

}

return elemento.files[0];

}

// Checkbox

function marcado(id){

const elemento =
document.getElementById(id);

return elemento ?
elemento.checked :
false;

}

// =====================================================
// FORMATAR DATA
// =====================================================

function formatarData(data){

return new Intl.DateTimeFormat(

"pt-BR",

{

dateStyle:"short",

timeStyle:"short"

}

).format(data);

}

// =====================================================
// VALIDAR E-MAIL
// =====================================================

function emailValido(email){

const regex =

/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

return regex.test(email);

}

// =====================================================
// VALIDAR TELEFONE
// =====================================================

function telefoneValido(telefone){

const numeros =

telefone.replace(/\D/g,"");

return numeros.length>=10;

}

// =====================================================
// VALIDAR CPF
// =====================================================

function cpfValido(cpf){

cpf =

cpf.replace(/\D/g,"");

if(cpf.length!==11){

return false;

}

if(

/^(\d)\1+$/.test(cpf)

){

return false;

}

let soma = 0;

let resto;

for(

let i=1;

i<=9;

i++

){

soma +=

parseInt(cpf.substring(i-1,i))

*

(11-i);

}

resto =

(soma*10)%11;

if(

(resto===10) ||

(resto===11)

){

resto=0;

}

if(

resto!==

parseInt(cpf.substring(9,10))

){

return false;

}

soma=0;

for(

let i=1;

i<=10;

i++

){

soma +=

parseInt(cpf.substring(i-1,i))

*

(12-i);

}

resto =

(soma*10)%11;

if(

(resto===10)||

(resto===11)

){

resto=0;

}

return(

resto===

parseInt(cpf.substring(10,11))

);

}

// =====================================================
// MÁSCARA CPF
// =====================================================

function mascaraCPF(campo){

campo.value =

campo.value

.replace(/\D/g,"")

.replace(/(\d{3})(\d)/,"$1.$2")

.replace(/(\d{3})(\d)/,"$1.$2")

.replace(/(\d{3})(\d{1,2})$/,"$1-$2");

}

// =====================================================
// MÁSCARA CEP
// =====================================================

function mascaraCEP(campo){

campo.value =

campo.value

.replace(/\D/g,"")

.replace(/(\d{5})(\d)/,"$1-$2");

}

// =====================================================
// MÁSCARA TELEFONE
// =====================================================

function mascaraTelefone(campo){

campo.value =

campo.value

.replace(/\D/g,"")

.replace(/^(\d{2})(\d)/,"($1) $2")

.replace(/(\d)(\d{4})$/,"$1-$2");

}

// =====================================================
// APLICAR MÁSCARAS
// =====================================================

document

.querySelectorAll(

"#presidenteCPF,#viceCPF"

)

.forEach((campo)=>{

campo.addEventListener(

"input",

()=>mascaraCPF(campo)

);

});

document

.querySelectorAll(

"#presidenteCEP,#viceCEP"

)

.forEach((campo)=>{

campo.addEventListener(

"input",

()=>mascaraCEP(campo)

);

});

document

.querySelectorAll(

"#presidenteTelefone,#viceTelefone"

)

.forEach((campo)=>{

campo.addEventListener(

"input",

()=>mascaraTelefone(campo)

);

});

// =====================================================
// BUSCA AUTOMÁTICA DE CEP (ViaCEP)
// =====================================================

async function buscarCEP(tipo){

const cep = valor(`${tipo}CEP`)
.replace(/\D/g,"");

if(cep.length !== 8){

return;

}

try{

const resposta =
await fetch(
`https://viacep.com.br/ws/${cep}/json/`
);

const endereco =
await resposta.json();

if(endereco.erro){

alert(
"CEP não encontrado."
);

return;

}

document.getElementById(
`${tipo}Logradouro`
).value =
endereco.logradouro || "";

document.getElementById(
`${tipo}Bairro`
).value =
endereco.bairro || "";

document.getElementById(
`${tipo}Municipio`
).value =
endereco.localidade || "";

document.getElementById(
`${tipo}Estado`
).value =
endereco.uf || "";

}catch(erro){

console.error(erro);

alert(
"Erro ao consultar o CEP."
);

}

}

// =====================================================
// EVENTOS DOS CAMPOS CEP
// =====================================================

document
.getElementById("presidenteCEP")
.addEventListener(

"blur",

()=>buscarCEP("presidente")

);

document
.getElementById("viceCEP")
.addEventListener(

"blur",

()=>buscarCEP("vice")

);

// =====================================================
// VALIDAÇÃO DOS ARQUIVOS
// =====================================================

function validarArquivo(arquivo){

if(!arquivo){

return false;

}

const formatosPermitidos = [

"application/pdf",

"image/jpeg",

"image/jpg",

"image/png"

];

if(

!formatosPermitidos.includes(
arquivo.type
)

){

alert(

`O arquivo "${arquivo.name}" possui um formato não permitido.`

);

return false;

}

if(

arquivo.size >

CONFIG.TAMANHO_MAXIMO

){

alert(

`O arquivo "${arquivo.name}" ultrapassa 10 MB.`

);

return false;

}

return true;

}

// =====================================================
// VALIDAR TODOS OS DOCUMENTOS
// =====================================================

function validarDocumentos(documentos){

for(const chave in documentos){

const arquivoAtual =
documentos[chave];

if(
arquivoAtual &&
!validarArquivo(arquivoAtual)
){

return false;

}

}

return true;

}

// =====================================================
// VERIFICAR DUPLICIDADE
// =====================================================

async function existeCPF(cpf){

const consulta =
query(
collection(db,"inscricoes"),
where("cpfs","array-contains",cpf)
);

const resultado =
await getDocs(consulta);

return !resultado.empty;

}

async function existeEmail(email){

const consulta =
query(
collection(db,"inscricoes"),
where("emails","array-contains",email)
);

const resultado =
await getDocs(consulta);

return !resultado.empty;

}

// =====================================================
// GERAR NÚMERO DA INSCRIÇÃO
// =====================================================

async function gerarNumeroInscricao(){

const snapshot =
await getDocs(
collection(db,"inscricoes")
);

const numero =
snapshot.size + 1;

return `${CONFIG.PREFIXO}-${CONFIG.ANO}-${String(numero).padStart(4,"0")}`;

}

// =====================================================
// PREPARAR DADOS
// =====================================================

async function prepararDadosInscricao(){

if(!verificarPeriodoInscricao()){
return null;
}

// ---------------------
// CHAPA
// ---------------------

const chapa = {

nome:
valor("nomeChapa"),

sigla:
valor("siglaChapa"),

slogan:
valor("slogan"),

planoTexto:
valor("textoPlano")

};

// ---------------------
// PRESIDENTE
// ---------------------

const presidente = {

nome:
valor("presidenteNome"),

cpf:
valor("presidenteCPF"),

rg:
valor("presidenteRG"),

email:
valor("presidenteEmail"),

telefone:
valor("presidenteTelefone"),

escola:
valor("presidenteEscola"),

serie:
valor("presidenteSerie"),

turno:
valor("presidenteTurno"),

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

nascimento:
valor("presidenteNascimento")

};

// ---------------------
// VICE
// ---------------------

const vice = {

nome:
valor("viceNome"),

cpf:
valor("viceCPF"),

rg:
valor("viceRG"),

email:
valor("viceEmail"),

telefone:
valor("viceTelefone"),

escola:
valor("viceEscola"),

serie:
valor("viceSerie"),

turno:
valor("viceTurno"),

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

nascimento:
valor("viceNascimento")

};

// ---------------------
// VALIDAÇÕES
// ---------------------

if(

!cpfValido(presidente.cpf)

){

alert("CPF do Presidente inválido.");

return null;

}

if(

!cpfValido(vice.cpf)

){

alert("CPF do Vice-Presidente inválido.");

return null;

}

if(

presidente.cpf===vice.cpf

){

alert(

"O Presidente e o Vice não podem possuir o mesmo CPF."

);

return null;

}

if(

!emailValido(presidente.email)

){

alert(

"E-mail do Presidente inválido."

);

return null;

}

if(

!emailValido(vice.email)

){

alert(

"E-mail do Vice inválido."

);

return null;

}

// ---------------------
// DUPLICIDADE
// ---------------------

if(

await existeCPF(
presidente.cpf
)

){

alert(

"Já existe uma inscrição com o CPF do Presidente."

);

return null;

}

if(

await existeCPF(
vice.cpf
)

){

alert(

"Já existe uma inscrição com o CPF do Vice."

);

return null;

}

if(

await existeEmail(
presidente.email
)

){

alert(

"Já existe uma inscrição com o e-mail do Presidente."

);

return null;

}

if(

await existeEmail(
vice.email
)

){

alert(

"Já existe uma inscrição com o e-mail do Vice."

);

return null;

}

// ---------------------
// DOCUMENTOS
// ---------------------

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

!validarDocumentos(documentos)

){

return null;

}

// ---------------------
// RETORNO
// ---------------------

return{

numeroInscricao:
await gerarNumeroInscricao(),

status:"Pendente",

dataHora:
serverTimestamp(),

cpfs:[
presidente.cpf,
vice.cpf
],

emails:[
presidente.email,
vice.email
],

chapa,

presidente,

vice,

documentos,

historico:[
{

acao:"Inscrição criada",

usuario:"Sistema",

dataHora:
serverTimestamp()

}

],

dadosTecnicos:
obterDadosTecnicos(),

observacoes:
valor("observacoes")

};

  }

// =====================================================
// ENVIAR DOCUMENTOS PARA O CLOUDINARY
// =====================================================

async function enviarDocumentos(documentos){

return{

documentoPresidente:
documentos.documentoPresidente
? await uploadArquivo(documentos.documentoPresidente)
: null,

documentoVice:
documentos.documentoVice
? await uploadArquivo(documentos.documentoVice)
: null,

cpf:
documentos.cpf
? await uploadArquivo(documentos.cpf)
: null,

matriculaPresidente:
documentos.matriculaPresidente
? await uploadArquivo(documentos.matriculaPresidente)
: null,

matriculaVice:
documentos.matriculaVice
? await uploadArquivo(documentos.matriculaVice)
: null,

declaracao:
documentos.declaracao
? await uploadArquivo(documentos.declaracao)
: null,

plano:
documentos.plano
? await uploadArquivo(documentos.plano)
: null

};

}

// =====================================================
// REGISTRAR LOG
// =====================================================

async function registrarLog(numeroInscricao){

await addDoc(

collection(db,"logs"),

{

acao:"Inscrição criada",

modulo:"Inscrições",

usuario:"Sistema",

referencia:numeroInscricao,

detalhes:"Nova inscrição enviada pelo Portal Oficial.",

sucesso:true,

dataHora:serverTimestamp()

}

);

}

// =====================================================
// SALVAR INSCRIÇÃO
// =====================================================

async function salvarInscricao(){

const dados =
await prepararDadosInscricao();

if(!dados){

return;

}

// Upload dos documentos

const urls =
await enviarDocumentos(
dados.documentos
);

dados.documentos = urls;

// Salvar Firestore

await setDoc(

doc(
db,
"inscricoes",
dados.numeroInscricao
),

dados

);

// Registrar Log

await registrarLog(
dados.numeroInscricao
);

// Mostrar comprovante

mostrarComprovante(dados);

// Limpar formulário

document
.getElementById("formInscricao")
.reset();

}

// =====================================================
// COMPROVANTE
// =====================================================

function mostrarComprovante(dados){

document
.getElementById("comprovanteInscricao")
.style.display = "block";

document
.getElementById("numeroInscricaoGerado")
.innerText =
dados.numeroInscricao;

document
.getElementById("statusInscricao")
.innerText =
dados.status;

document
.getElementById("dataHoraInscricao")
.innerText =
new Date()
.toLocaleString("pt-BR");

window.scrollTo({

top:0,

behavior:"smooth"

});

}

// =====================================================
// ENVIO DO FORMULÁRIO
// =====================================================

const formulario =
document.getElementById(
"formInscricao"
);

formulario.addEventListener(

"submit",

async(e)=>{

e.preventDefault();

try{

await salvarInscricao();

}catch(erro){

console.error(erro);

alert(

"Não foi possível concluir a inscrição."

);

}

}

);



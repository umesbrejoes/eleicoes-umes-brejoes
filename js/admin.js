import{

db,

serverTimestamp

}

from "./firebase.js";

// =========================
// LOGIN
// =========================

window.entrar = async function(){

const email =
document.getElementById("email").value.trim();

const senha =
document.getElementById("senha").value;

if(email === "" || senha === ""){

alert("Informe o e-mail e a senha.");

return;

}

try{

await signInWithEmailAndPassword(
auth,
email,
senha
);

const usuario =
await getDoc(
doc(db,"comissao",email)
);

if(!usuario.exists()){

alert(
"Acesso não autorizado."
);

return;

}

document.getElementById("login")
.style.display = "none";

document.getElementById("painel")
.style.display = "block";

atualizarPainel();

}catch(error){

console.error(error);

alert(
"Usuário ou senha inválidos."
);

}

};

// =========================
// PAINEL
// =========================

async function atualizarPainel(){

const votos =
await getDocs(
collection(db,"votos")
);

const eleitores =
await getDocs(
collection(db,"eleitores")
);

const chapas =
await getDocs(
collection(db,"chapas")
);

document.getElementById("totalVotos")
.innerText =
votos.size;

document.getElementById("totalEleitores")
.innerText =
eleitores.size;

document.getElementById("totalChapas")
.innerText =
chapas.size;

const configuracao =
await getDoc(
doc(db,"configuracoes","eleicao")
);

if(configuracao.exists()){

const aberta =
configuracao.data().aberta;

document.getElementById("status")
.innerText =
aberta
?
"🟢 VOTAÇÃO ABERTA"
:
"🔴 VOTAÇÃO ENCERRADA";

}else{

document.getElementById("status")
.innerText =
"⚪ NÃO CONFIGURADA";

}

// ADICIONE ESTA LINHA
await listarChapas();
  
}

// =========================
// ABRIR VOTAÇÃO
// =========================

window.abrirVotacao = async function(){

try{

await setDoc(
doc(db,"configuracoes","eleicao"),
{
aberta:true
},
{merge:true}
);

document.getElementById("status").innerText =
"🟢 VOTAÇÃO ABERTA";

alert("A votação foi aberta com sucesso.");

}catch(error){

console.error(error);

alert("Erro ao abrir a votação.");

}

}

// =========================
// ENCERRAR VOTAÇÃO
// =========================

window.encerrarVotacao = async function(){

const confirmar = confirm(
"Deseja realmente encerrar a votação?"
);

if(!confirmar){

return;

}

try{

await setDoc(
doc(db,"configuracoes","eleicao"),
{
aberta:false
},
{merge:true}
);

document.getElementById("status").innerText =
"🔴 VOTAÇÃO ENCERRADA";

alert("A votação foi encerrada.");

}catch(error){

console.error(error);

alert("Erro ao encerrar a votação.");

}

}

// =========================
// CADASTRAR CHAPA
// =========================

window.salvarChapa = async function(){

const numero =
document.getElementById("numero").value.trim();

const nome =
document.getElementById("nomeChapa").value.trim();

const presidente =
document.getElementById("presidente").value.trim();

const vice =
document.getElementById("vice").value.trim();

if(
numero==="" ||
nome==="" ||
presidente==="" ||
vice===""){
alert("Preencha todos os campos.");
return;
}

try{

await addDoc(
collection(db,"chapas"),
{

numero:Number(numero),

nome,

presidente,

vice,

status:"Homologada",

criadaEm:new Date()

}

);

alert("Chapa cadastrada com sucesso.");

document.getElementById("numero").value="";
document.getElementById("nomeChapa").value="";
document.getElementById("presidente").value="";
document.getElementById("vice").value="";

listarChapas();

atualizarPainel();

}catch(error){

console.error(error);

alert(error.code + "\n\n" + error.message);

}

}

// =========================
// LISTAR CHAPAS
// =========================

async function listarChapas(){

const lista =
document.getElementById("listaChapas");

lista.innerHTML="";

const snapshot =
await getDocs(
collection(db,"chapas")
);

snapshot.forEach((documento)=>{

const dados =
documento.data();

lista.innerHTML += `

<div class="chapa-card">

<h3>

Chapa ${dados.numero}

</h3>

<p>

<strong>${dados.nome}</strong>

</p>

<p>

Presidente:
${dados.presidente}

</p>

<p>

Vice:
${dados.vice}

</p>

<p>

Status:
${dados.status}

</p>

</div>

`;

});

}

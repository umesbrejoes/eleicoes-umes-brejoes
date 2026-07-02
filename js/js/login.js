// ======================================================
// SISTEMA OFICIAL DAS ELEIÇÕES
// UMES BREJÕES 2026
//
// Arquivo: login.js
// Página de Login
// ======================================================

// ======================================================
// IMPORTS
// ======================================================

import {

fazerLogin,
verificarSessao

}

from "./auth.js";

// ======================================================
// ELEMENTOS
// ======================================================

const formulario =
document.getElementById("formLogin");

const email =
document.getElementById("email");

const senha =
document.getElementById("senha");

const botaoSenha =
document.getElementById("mostrarSenha");

// ======================================================
// VERIFICAR SESSÃO
// ======================================================

verificarSessao();

// ======================================================
// MOSTRAR / OCULTAR SENHA
// ======================================================

if(botaoSenha){

botaoSenha.addEventListener(

"click",

()=>{

if(senha.type==="password"){

senha.type="text";

botaoSenha.innerHTML=

'<i class="fa-solid fa-eye-slash"></i>';

}else{

senha.type="password";

botaoSenha.innerHTML=

'<i class="fa-solid fa-eye"></i>';

}

}

);

}

// ======================================================
// LOGIN
// ======================================================

formulario.addEventListener(

"submit",

async(e)=>{

e.preventDefault();

await fazerLogin(

email.value.trim(),

senha.value

);

}

);

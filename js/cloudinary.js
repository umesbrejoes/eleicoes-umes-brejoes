export async function uploadArquivo(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "umes-eleicoes");

  const resposta = await fetch(
    "https://api.cloudinary.com/v1_1/ysol6tp1/auto/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao enviar arquivo.");
  }

  const dados = await resposta.json();

  return dados.secure_url;
}

const URL_API = "http://127.0.0.1:8000";

const formularioLivro = document.querySelector("#book-form");
const entradaIdLivro = document.querySelector("#book-id");
const entradaTitulo = document.querySelector("#title");
const entradaAutor = document.querySelector("#author");
const entradaAnoPublicacao = document.querySelector("#publication-year");
const entradaDisponivel = document.querySelector("#available");
const botaoEnviar = document.querySelector("#submit-button");
const botaoCancelar = document.querySelector("#cancel-button");
const modoFormulario = document.querySelector("#form-mode");
const mensagemFormulario = document.querySelector("#form-message");
const mensagemLista = document.querySelector("#list-message");
const corpoTabela = document.querySelector("#books-table-body");
const estadoVazio = document.querySelector("#empty-state");
const botaoAtualizar = document.querySelector("#refresh-button");

function mostrarMensagem(elemento, mensagem, tipo = "") {
  elemento.textContent = mensagem;
  elemento.className = `message ${tipo}`.trim();
}

function definirCarregamentoFormulario(estaCarregando) {
  botaoEnviar.disabled = estaCarregando;
  botaoCancelar.disabled = estaCarregando;
  botaoEnviar.textContent = estaCarregando ? "Salvando..." : "Salvar livro";
}

function limparFormulario() {
  formularioLivro.reset();
  entradaIdLivro.value = "";
  entradaDisponivel.checked = true;
  modoFormulario.textContent = "Novo registro";
  botaoCancelar.hidden = true;
  mostrarMensagem(mensagemFormulario);
}

function iniciarEdicao(livro) {
  entradaIdLivro.value = livro.id;
  entradaTitulo.value = livro.titulo;
  entradaAutor.value = livro.autor;
  entradaAnoPublicacao.value = livro.ano_publicacao;
  entradaDisponivel.checked = livro.disponivel;
  modoFormulario.textContent = `Editando livro #${livro.id}`;
  botaoCancelar.hidden = false;
  entradaTitulo.focus();
}

function criarLinhaLivro(livro) {
  const linha = document.createElement("tr");
  const textoDisponibilidade = livro.disponivel ? "Disponível" : "Indisponível";
  const classeDisponibilidade = livro.disponivel ? "" : " unavailable";

  linha.innerHTML = `
    <td>${escaparHtml(livro.titulo)}</td>
    <td>${escaparHtml(livro.autor)}</td>
    <td>${livro.ano_publicacao}</td>
    <td><span class="status${classeDisponibilidade}">${textoDisponibilidade}</span></td>
    <td>
      <div class="row-actions">
        <button class="table-action edit" type="button" data-action="edit">Editar</button>
        <button class="table-action delete" type="button" data-action="delete">Excluir</button>
      </div>
    </td>
  `;

  linha.querySelector('[data-action="edit"]').addEventListener("click", () => {
    iniciarEdicao(livro);
  });

  linha.querySelector('[data-action="delete"]').addEventListener("click", () => {
    excluirLivro(livro.id, livro.titulo);
  });

  return linha;
}

function escaparHtml(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function lerErro(resposta) {
  try {
    const dadosErro = await resposta.json();

    if (Array.isArray(dadosErro.detail)) {
      return dadosErro.detail.map((dado) => dado.msg).join("; ");
    }

    return dadosErro.detail || "Não foi possível concluir a operação.";
  } catch {
    return "Não foi possível concluir a operação.";
  }
}

async function carregarLivros() {
  mostrarMensagem(mensagemLista, "Carregando livros...");
  botaoAtualizar.disabled = true;

  try {
    const resposta = await fetch(`${URL_API}/livros`);

    if (!resposta.ok) {
      throw new Error(await lerErro(resposta));
    }

    const livros = await resposta.json();
    corpoTabela.replaceChildren();

    livros.forEach((livro) => {
      corpoTabela.appendChild(criarLinhaLivro(livro));
    });

    estadoVazio.hidden = livros.length > 0;
    mostrarMensagem(mensagemLista, `${livros.length} livro(s) encontrado(s).`, "success");
  } catch (erro) {
    estadoVazio.hidden = true;
    mostrarMensagem(mensagemLista, `Erro ao carregar livros: ${erro.message}`, "error");
  } finally {
    botaoAtualizar.disabled = false;
  }
}

async function salvarLivro(evento) {
  evento.preventDefault();
  definirCarregamentoFormulario(true);
  mostrarMensagem(mensagemFormulario, "Salvando...");

  const idLivro = entradaIdLivro.value;
  const metodo = idLivro ? "PUT" : "POST";
  const endereco = idLivro ? `${URL_API}/livros/${idLivro}` : `${URL_API}/livros`;
  const dadosLivro = {
    titulo: entradaTitulo.value.trim(),
    autor: entradaAutor.value.trim(),
    ano_publicacao: Number(entradaAnoPublicacao.value),
    disponivel: entradaDisponivel.checked,
  };

  try {
    const resposta = await fetch(endereco, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosLivro),
    });

    if (!resposta.ok) {
      throw new Error(await lerErro(resposta));
    }

    mostrarMensagem(
      mensagemFormulario,
      idLivro ? "Livro atualizado com sucesso." : "Livro cadastrado com sucesso.",
      "success",
    );
    limparFormulario();
    await carregarLivros();
  } catch (erro) {
    mostrarMensagem(mensagemFormulario, `Erro ao salvar livro: ${erro.message}`, "error");
  } finally {
    definirCarregamentoFormulario(false);
  }
}

async function excluirLivro(idLivro, titulo) {
  const confirmou = window.confirm(`Deseja excluir o livro "${titulo}"?`);

  if (!confirmou) {
    return;
  }

  try {
    const resposta = await fetch(`${URL_API}/livros/${idLivro}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      throw new Error(await lerErro(resposta));
    }

    if (entradaIdLivro.value === String(idLivro)) {
      limparFormulario();
    }

    mostrarMensagem(mensagemLista, "Livro excluído com sucesso.", "success");
    await carregarLivros();
  } catch (erro) {
    mostrarMensagem(mensagemLista, `Erro ao excluir livro: ${erro.message}`, "error");
  }
}

formularioLivro.addEventListener("submit", salvarLivro);
botaoCancelar.addEventListener("click", limparFormulario);
botaoAtualizar.addEventListener("click", carregarLivros);

carregarLivros();
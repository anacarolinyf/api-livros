from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from app.database import BaseBanco, mecanismo_banco, obter_sessao_banco
from app.models import Livro
from app.schemas import LivroCriacao, LivroResposta


BaseBanco.metadata.create_all(bind=mecanismo_banco)

app = FastAPI(
    title="API de Livros",
    version="1.0.0",
    description="API didática para gerenciamento de livros.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

@app.post("/livros", response_model=LivroResposta, status_code=201, tags=["Livros"])
def criar_livro(dados_livro: LivroCriacao, sessao_banco: Session = Depends(obter_sessao_banco)):
    novo_livro = Livro(
        titulo=dados_livro.titulo,
        autor=dados_livro.autor,
        ano_publicacao=dados_livro.ano_publicacao,
        disponivel=dados_livro.disponivel,
    )

    sessao_banco.add(novo_livro)
    sessao_banco.commit()
    sessao_banco.refresh(novo_livro)

    return novo_livro


@app.get("/livros", response_model=list[LivroResposta], tags=["Livros"])
def listar_livros(sessao_banco: Session = Depends(obter_sessao_banco)):
    consulta = select(Livro)
    resultado = sessao_banco.execute(consulta)
    livros = resultado.scalars().all()

    return livros


@app.get("/livros/{id_livro}", response_model=LivroResposta, tags=["Livros"])
def obter_livro(id_livro: int, sessao_banco: Session = Depends(obter_sessao_banco)):
    consulta = select(Livro).where(Livro.id == id_livro)
    resultado = sessao_banco.execute(consulta)
    livro = resultado.scalar_one_or_none()

    if livro is None:
        raise HTTPException(status_code=404, detail="Livro não encontrado")

    return livro


@app.put("/livros/{id_livro}", response_model=LivroResposta, tags=["Livros"])
def atualizar_livro(
    id_livro: int,
    dados_livro: LivroCriacao,
    sessao_banco: Session = Depends(obter_sessao_banco),
):
    consulta = select(Livro).where(Livro.id == id_livro)
    resultado = sessao_banco.execute(consulta)
    livro = resultado.scalar_one_or_none()

    if livro is None:
        raise HTTPException(status_code=404, detail="Livro não encontrado")

    livro.titulo = dados_livro.titulo
    livro.autor = dados_livro.autor
    livro.ano_publicacao = dados_livro.ano_publicacao
    livro.disponivel = dados_livro.disponivel

    sessao_banco.commit()
    sessao_banco.refresh(livro)

    return livro


@app.delete("/livros/{id_livro}", tags=["Livros"])
def excluir_livro(
    id_livro: int,
    sessao_banco: Session = Depends(obter_sessao_banco),
):
    consulta = select(Livro).where(Livro.id == id_livro)
    resultado = sessao_banco.execute(consulta)
    livro = resultado.scalar_one_or_none()

    if livro is None:
        raise HTTPException(status_code=404, detail="Livro não encontrado")

    sessao_banco.delete(livro)
    sessao_banco.commit()

    return {"mensagem": "Livro excluído com sucesso"}


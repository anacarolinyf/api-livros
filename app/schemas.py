from pydantic import BaseModel, Field


class LivroCriacao(BaseModel):
    titulo: str = Field(min_length=1, max_length=150)
    autor: str = Field(min_length=1, max_length=120)
    ano_publicacao: int = Field(ge=0, le=2100)
    disponivel: bool = True


class LivroResposta(BaseModel):
    id: int
    titulo: str
    autor: str
    ano_publicacao: int
    disponivel: bool

    class Config:
        from_attributes = True
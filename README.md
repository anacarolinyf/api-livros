📚 API de Livros

Projeto de um site de livros desenvolvido com Python, utilizando uma API criada com FastAPI e banco de dados MySQL. O ambiente de desenvolvimento do banco de dados é realizado através do XAMPP.

💻 Sobre o projeto

O projeto consiste em um sistema para gerenciamento de livros, permitindo consultar e manipular informações armazenadas em um banco de dados.

A aplicação utiliza uma API para fazer a comunicação entre o site e o banco de dados, possibilitando operações como cadastro, consulta, atualização e exclusão de livros.

🛠️ Tecnologias utilizadas

- 🐍 Python
- ⚡ FastAPI
- 🗄️ MySQL
- 🔧 XAMPP
- 🌐 HTML, CSS e JavaScript
- 📡 API REST

📖 Funcionalidades

- Listar livros cadastrados
- Buscar livros
- Cadastrar novos livros
- Atualizar informações dos livros
- Excluir livros
- Armazenar os dados no MySQL
- Comunicação entre o site e a API

🗂️ Estrutura do projeto

📁 projeto-livros
│
├── 📁 backend
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── ...
│
├── 📁 frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── requirements.txt
└── README.md

⚙️ Como executar o projeto

1. Instale os requisitos

Tenha instalado:

- Python
- XAMPP
- MySQL

2. Inicie o MySQL pelo XAMPP

Abra o XAMPP Control Panel e inicie o serviço MySQL.

3. Instale as dependências

No terminal, execute:

pip install -r requirements.txt

4. Execute a API

uvicorn main:app --reload

A API estará disponível em:

http://127.0.0.1:8000

5. Documentação da API

O FastAPI disponibiliza uma documentação automática.

Acesse:

http://127.0.0.1:8000/docs

🗄️ Banco de dados

O projeto utiliza MySQL para armazenar as informações dos livros.

Exemplo de dados armazenados:

Campo| Tipo
id| INT
titulo| VARCHAR
autor| VARCHAR
ano| INT
genero| VARCHAR

O banco de dados pode ser criado e administrado através do phpMyAdmin, disponibilizado pelo XAMPP.

🔗 Principais endpoints

Método| Endpoint| Função
GET| "/livros"| Lista os livros
GET| "/livros/{id}"| Busca um livro
POST| "/livros"| Cadastra um livro
PUT| "/livros/{id}"| Atualiza um livro
DELETE| "/livros/{id}"| Remove um livro

🎯 Objetivo

O objetivo deste projeto é desenvolver uma aplicação web integrada a uma API e a um banco de dados, colocando em prática conceitos de desenvolvimento back-end, APIs REST e bancos de dados relacionais.

👩‍💻 Projeto

Projeto desenvolvido para fins acadêmicos e de aprendizado em desenvolvimento web.
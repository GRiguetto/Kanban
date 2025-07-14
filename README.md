# Projeto Kanban Full Stack (com Autenticação e Multi-Tenancy)

## 📝 Descrição do Projeto

Este é um projeto de um quadro Kanban completo, desenvolvido com Angular para o frontend e NestJS para o backend. A aplicação permite que múltiplos usúarios se registem e criem os seus próprios quadros Kanban, com colunas e cards totalmente isolados e seguros.

O sistema inclui um fluxo de autenticação completo com tokens JWT, persistência de dados num banco de dados relacional e funcionalidades de gestão de perfil de utilizador, demonstrando uma arquitetura robusta e escalável.

---

## ✨ Funcionalidades Implementadas

* **Autenticação Segura de Utilizadores:**
    * Registo de novos utilizadores com encriptação de senha (bcrypt).
    * Login com email e senha.
    * Geração de Tokens de Acesso (JWT) para autorização de requisições.
    * Rotas da API e do frontend protegidas, acessíveis apenas por utilizadores autenticados.

* **Multi-Tenancy (Isolamento de Dados por Utilizador):**
    * Cada utilizador tem o seu próprio ambiente de trabalho.
    * As colunas e os cards criados por um utilizador são **visíveis e modificáveis apenas por ele**.
    * A lógica no backend garante a segregação segura dos dados de cada utilizador.

* **Gestão do Quadro Kanban:**
    * Criação, exclusão e listagem de colunas por utilizador.
    * Criação, exclusão e atualização de cards com título e nível de prioridade (badge).
    * Funcionalidade de "Arrastar e Soltar" (Drag & Drop) para mover cards entre colunas, com a alteração a ser salva permanentemente no banco de dados.

* **Gestão de Perfil:**
    * Um menu de conta para o ulsúario ver os seus dados.
    * Funcionalidade para atualizar a foto de perfil.
    * Sistema de logout seguro que invalida a sessão no frontend.

* **Experiência do Usúario (UX):**
    * Interface limpa e minimalista com um tema de cores coeso.
    * Indicadores de carregamento (spinners) enquanto os dados são buscados.
    * Notificações não-bloqueantes (toasts) para feedback de erros.
    * Design responsivo com barras de rolagem customizadas.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * [Angular](https://angular.io/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Angular CDK (Drag and Drop)](https://material.angular.io/cdk/drag-drop/overview)
    * [RxJS](https://rxjs.dev/) para programação reativa.

* **Backend:**
    * [NestJS](https://nestjs.com/)
    * [TypeORM](https://typeorm.io/) para a comunicação com o banco de dados.
    * [PostgreSQL](https://www.postgresql.org/) (em produção) e [SQLite](https://www.sqlite.org/index.html) (em desenvolvimento).
    * **Segurança:** [Passport.js](http://www.passportjs.org/) com estratégias `passport-jwt` para autenticação baseada em tokens e `bcrypt` para hashing de senhas.

* **Testes (Backend):**
    * [Jest](https://jestjs.io/) para testes unitários e de integração.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de que tem as seguintes ferramentas instaladas:
* [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
* [NestJS CLI](https://docs.nestjs.com/) (`npm install -g @nestjs/cli`)

### 1. Clonar o Repositório

```bash
git clone [https://github.com/GRiguetto/Kanban.git](https://github.com/GRiguetto/Kanban.git)
cd Kanban
```

### 2. Rodar o Backend (NestJS)
Abra um terminal e siga os passos:

```Bash

# Navegue até à pasta do backend
cd kanban-backend

# Instale as dependências
npm install

# Inicie o servidor em modo de desenvolvimento (usará o banco de dados SQLite)
npm run start:dev
```

O servidor do backend estará a rodar em http://localhost:3000.

### 3. Rodar o Frontend (Angular)
Abra um novo terminal (mantenha o terminal do backend a rodar) e siga os passos:

```Bash

# Navegue até à pasta do frontend (a partir da raiz do projeto)
cd kanban-frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
ng serve
```
A aplicação estará disponível em http://localhost:4200.

## 🧪 Como Rodar os Testes
Para executar os testes automatizados do backend, siga os passos:

```Bash

# Navegue até à pasta do backend
cd kanban-backend

# Execute o comando de teste
npm run test
```
Isto irá rodar todos os testes unitários e de integração e exibir um relatório de cobertura no terminal.

# Projeto Kanban Full Stack

## 📝 Descrição do Projeto

Este é um projeto de um quadro Kanban completo, desenvolvido como parte de um desafio de programação. A aplicação permite a criação e gerenciamento de colunas e cards, incluindo funcionalidades de arrastar e soltar (drag and drop), criação, exclusão e atualização de itens, com todas as ações persistidas em um backend.

O objetivo foi construir uma aplicação robusta e bem estruturada, seguindo as melhores práticas de desenvolvimento com Angular para o frontend e NestJS para o backend.

---

## ✨ Funcionalidades Implementadas

* **Gerenciamento de Colunas:**
    * Criação de novas colunas.
    * Exclusão de colunas existentes.
    * Busca de colunas do backend ao carregar a página.
* **Gerenciamento de Cards:**
    * Criação de cards com título e nível de prioridade (badge).
    * Exclusão de cards.
    * Persistência das alterações no backend.
* **Arraste e Solte (Drag and Drop):**
    * Mover cards dentro da mesma coluna.
    * Mover cards entre colunas diferentes, com a alteração sendo salva permanentemente no backend.
* **Testes:**
    * **Backend:** Testes unitários para os serviços (`columns` e `cards`) e testes de integração para os controllers, garantindo a lógica e as rotas da API.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * [Angular](https://angular.io/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Angular CDK (Drag and Drop)](https://material.angular.io/cdk/drag-drop/overview)
* **Backend:**
    * [NestJS](https://nestjs.com/)
    * [TypeScript](https://www.typescriptlang.org/)
* **Testes (Backend):**
    * [Jest](https://jestjs.io/)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:
* [Node.js](https://nodejs.org/en/) (que inclui o npm)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
* [NestJS CLI](https://docs.nestjs.com/) (`npm install -g @nestjs/cli`)

### 1. Clonar o Repositório

```bash
# Clone este repositório
git clone https://github.com/GRiguetto/Kanban.git

```
### 2. Rodando o Backend (NestJS)
Abra um terminal e siga os passos:

```bash

# Navegue até a pasta do backend
cd kanban-backend

# Instale as dependências
npm install

# Inicie o servidor em modo de desenvolvimento
npm run start:dev
```
### 3. Rodando o Frontend (Angular)
Abra um novo terminal (mantenha o terminal do backend rodando) e siga os passos:

```Bash

# Navegue até a pasta do frontend (a partir da raiz do projeto)
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

# Navegue até a pasta do backend
cd kanban-backend

# Execute o comando de teste
npm run test
```
Isso irá rodar todos os testes unitários e de integração que criamos e exibir um relatório de cobertura no terminal.

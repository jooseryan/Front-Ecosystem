# 🌿 FrontEcosystem

Este é o frontend da aplicação **Ecosystem**, desenvolvida em Angular 16+ com **Angular Material**, voltada para o gerenciamento e pesquisa de fontes bibliográficas e dados ambientais/acadêmicos.

O sistema faz parte do projeto de TCC e foi projetado para atender às necessidades de pesquisadores, estudantes e professores da área de Ecologia e áreas correlatas.

---

## 🚀 Funcionalidades Principais

- Interface responsiva e acessível construída com **Angular Standalone Components**
- Cadastro de fontes bibliográficas com múltiplos autores e palavras-chave
- Formulários reativos com validações
- Busca avançada com **filtros dinâmicos** (título, autor, ano, tipo, mídia)
- Autenticação com JWT e proteção de rotas por perfil (user/admin)
- Diálogos de confirmação personalizados
- Integração total com o backend em **Spring Boot**

---

## 🧱 Tecnologias Utilizadas

- Angular CLI 20.0.0
- Angular Standalone Components
- Angular Material
- Reactive Forms
- JWT Interceptor
- `HttpClient`
- HTML
- CSS
- TypeScript

---

## 📁 Estrutura do Projeto

```bash
src/app/
├── home/                  # Layout e navegação principal
├── register/              # Cadastro de fontes bibliográficas
├── search/                # Tela de pesquisa com filtros
├── models/                # Interfaces de dados (Author, Keyword, Source)
├── services/              # Integração com API REST
├── shared/
│   └── components/
│       └── confirmation-dialog/


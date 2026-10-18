# 🍔 FoodyDelivery — Plataforma de Pedidos e Rastreamento em Tempo Real

Projeto desenvolvido como desafio prático full-stack para acompanhamento do ciclo de vida de pedidos gastronômicos.

---

## 📖 Arquitetura e Engenharia (SDD)
Para uma explicação técnica aprofundada, diagramas de arquitetura C4, modelos de dados, contratos de API e regras de negócio para IAs e desenvolvedores, consulte o documento oficial:

👉 **[Software Design Description (SDD)](./SDD.md)**

---

## 🚀 Como Executar

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

### Subir a Aplicação Completa
Execute o comando na raiz do repositório:
```bash
docker compose up -d --build
```

- **Frontend:** Acesse em [http://localhost:3000](http://localhost:3000)
- **Backend API:** Disponível em [http://localhost:8080/api](http://localhost:8080/api)

---

## 🧪 Coleção do Postman
Uma coleção completa de testes com autenticação JWT automática, catálogo de produtos, controle de estoque e simulações está disponível em:
- [`postman-collection.json`](./postman-collection.json)

---

## 🛠️ Tecnologias Utilizadas
- **Backend:** Java 17, Spring Boot 3.3.4, Spring Security 6 (JWT Stateless), Spring Data JPA, SQLite 3.
- **Frontend:** React 18, Vite, React Router DOM v6, Axios, Vanilla CSS (Design System responsivo).
- **Infraestrutura:** Docker, Docker Compose, Nginx (Reverse Proxy).
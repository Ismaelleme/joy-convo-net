# JoyConvo Backend

Backend completo com **NestJS** + **Prisma ORM** + **PostgreSQL**.

## 📦 Módulos

| Módulo | Endpoint | Descrição |
|--------|----------|-----------|
| Auth | `/auth` | Registro, login, JWT |
| Users | `/users` | Perfil, busca, status |
| Chat | `/chat` | Mensagens, grupos, WebSocket |
| Contacts | `/contacts` | CRUD, favoritos, bloqueio |
| Calls | `/calls` | Chamadas voz/vídeo, WebSocket |
| Feed | `/feed` | Posts, likes, comentários |
| Schedule | `/schedule` | Eventos CRUD, status |
| Communities | `/communities` | Criar, entrar, sair |
| Marketplace | `/marketplace` | Produtos CRUD |
| AI | `/ai` | Conversas com assistente |
| Notifications | `/notifications` | Listar, ler, excluir |
| Settings | `/settings` | Preferências do usuário |

## 🚀 Setup

```bash
# 1. Instalar dependências
cd backend && npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Rodar migrations
npx prisma migrate dev --name init

# 4. Seed do banco
npm run prisma:seed

# 5. Iniciar servidor
npm run start:dev
```

## 📚 Documentação API

Após iniciar o servidor, acesse: **http://localhost:3001/api/docs**

## 🔐 Autenticação

Todas as rotas (exceto `/auth/register` e `/auth/login`) requerem JWT Bearer token.

```
Authorization: Bearer <token>
```

## 🧪 Usuários de teste

| Email | Senha |
|-------|-------|
| alice@joyconvo.com | password123 |
| bob@joyconvo.com | password123 |
| carol@joyconvo.com | password123 |

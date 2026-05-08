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

# 2. Configurar variáveis em .env (já existe — preencha as do Twilio)

# 3. Rodar migrations
npx prisma migrate dev --name add_phone_verified

# 4. Seed do banco
npm run prisma:seed

# 5. Iniciar servidor
npm run start:dev
```

> ⚠️ O frontend espera o backend em `http://localhost:3001/api`.
> Para hospedar (Render, Railway, Fly.io etc.), defina `VITE_API_URL` no frontend
> apontando para a URL pública do backend.

## 📚 Documentação API

Após iniciar o servidor: **http://localhost:3001/api/docs**

## 🔐 Verificação de telefone com Twilio Verify

O cadastro exige telefone verificado por SMS real.

1. Crie uma conta em https://console.twilio.com/
2. Em **Verify > Services**, crie um Service e copie o **Service SID** (começa com `VA…`)
3. Pegue **Account SID** e **Auth Token** do dashboard principal
4. Preencha em `backend/.env`:

```env
TWILIO_ACCOUNT_SID="ACxxxxx..."
TWILIO_AUTH_TOKEN="xxxxx..."
TWILIO_VERIFY_SERVICE_SID="VAxxxxx..."
```

5. Reinicie o backend.

> 💡 **Modo mock**: se as variáveis Twilio estiverem vazias, o backend aceita o
> código fixo `123456` para qualquer número — útil para desenvolvimento sem gastar SMS.

### Endpoints de verificação

| Método | Rota | Body | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/send-code` | `{ phone: "+5511..." }` | Dispara SMS com código |
| POST | `/api/auth/verify-code` | `{ phone, code }` | Valida código → retorna `verificationToken` (15min) |
| POST | `/api/auth/register` | `{ email, name, password, phone, verificationToken }` | Cria usuário com telefone verificado |
| POST | `/api/auth/login` | `{ email, password }` | Login (exige telefone já verificado) |

## 🔐 Autenticação

Rotas protegidas exigem `Authorization: Bearer <token>`.

## 🧪 Usuários de teste (seed)

| Email | Senha | Telefone |
|-------|-------|----------|
| alice@joyconvo.com | password123 | +5511911110001 |
| bob@joyconvo.com | password123 | +5511911110002 |
| carol@joyconvo.com | password123 | +5511911110003 |


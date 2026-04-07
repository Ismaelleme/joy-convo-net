# joy-convo-net

Monorepo com:

- `backend/`: API em **NestJS** + **Prisma ORM** com autenticação usando **bcrypt** e módulo completo de **ligações de voz/vídeo**.
- `mobile/`: frontend em **React Native (Expo)** com fluxo completo de chamadas (voz/vídeo) e tempo real.
- `src/`: frontend web legado (mantido para referência durante migração).

## Backend (Nest + Prisma + bcrypt)

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init_calls
npm run start:dev
```

Endpoints principais:

- `POST /users` cria usuário e salva senha com hash bcrypt.
- `POST /auth/login` valida e-mail/senha com bcrypt compare.
- `POST /calls` inicia chamada de voz ou vídeo.
- `GET /calls/user/:userId` lista histórico do usuário.
- `PATCH /calls/:callId/answer` atende chamada.
- `PATCH /calls/:callId/end` encerra chamada.

WebSocket (`/calls`):

- `join-user`
- `call-offer`
- `call-answer`
- `ice-candidate`
- `hangup`

## Mobile (React Native)

```bash
cd mobile
npm install
npm run start
```

Abas disponíveis no app:

- Feed
- Chat
- Ligações
- Explore
- Contatos
- Configurações

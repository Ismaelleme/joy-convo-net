# Mobile (React Native + Expo)

## Rodar localmente

```bash
cd mobile
npm install
npm run start
```

## Fluxo completo de ligações (voz/vídeo)

A tela **Ligações** agora está completa com:

- Botões para iniciar chamada de voz e de vídeo.
- Histórico de chamadas por usuário.
- Ações de atender e encerrar.
- Atualização em tempo real via WebSocket (`socket.io`) para oferta, resposta e hangup.

> Observação: configure `CURRENT_USER` e `CONTACT_USER` em `src/screens/CallsScreen.tsx` com IDs reais existentes no backend.

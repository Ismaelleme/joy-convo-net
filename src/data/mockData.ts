import { User, Chat, Message } from '@/types/chat';

export const currentUser: User = {
  id: 'me',
  name: 'Você',
  avatar: '',
  status: 'online',
};

export const users: User[] = [
  { id: '1', name: 'Ana Silva', avatar: '', status: 'online', bio: 'Disponível' },
  { id: '2', name: 'Carlos Santos', avatar: '', status: 'offline', lastSeen: new Date(Date.now() - 3600000), bio: 'Trabalhando...' },
  { id: '3', name: 'Marina Costa', avatar: '', status: 'online', bio: 'Hey there!' },
  { id: '4', name: 'Pedro Oliveira', avatar: '', status: 'away', bio: 'Em reunião' },
  { id: '5', name: 'Julia Mendes', avatar: '', status: 'online' },
  { id: '6', name: 'Lucas Ferreira', avatar: '', status: 'offline', lastSeen: new Date(Date.now() - 7200000) },
];

const now = Date.now();

export const messages: Record<string, Message[]> = {
  chat1: [
    { id: 'm1', chatId: 'chat1', senderId: '1', content: 'Oi! Tudo bem? 😊', type: 'text', timestamp: new Date(now - 3600000), status: 'read', reactions: [{ emoji: '❤️', users: ['me'] }] },
    { id: 'm2', chatId: 'chat1', senderId: 'me', content: 'Tudo ótimo! E você?', type: 'text', timestamp: new Date(now - 3500000), status: 'read', reactions: [] },
    { id: 'm3', chatId: 'chat1', senderId: '1', content: 'Muito bem! Viu o projeto novo?', type: 'text', timestamp: new Date(now - 3400000), status: 'read', reactions: [] },
    { id: 'm4', chatId: 'chat1', senderId: 'me', content: 'Ainda não, manda pra mim!', type: 'text', timestamp: new Date(now - 3300000), status: 'delivered', reactions: [] },
    { id: 'm5', chatId: 'chat1', senderId: '1', content: 'Vou te mandar agora. É incrível, vai adorar!', type: 'text', timestamp: new Date(now - 3200000), status: 'read', reactions: [{ emoji: '🔥', users: ['me'] }] },
    { id: 'm6', chatId: 'chat1', senderId: 'me', content: 'Mal posso esperar! 🚀', type: 'text', timestamp: new Date(now - 600000), status: 'read', reactions: [] },
    { id: 'm7', chatId: 'chat1', senderId: '1', content: 'Te mandei por email, dá uma olhada quando puder', type: 'text', timestamp: new Date(now - 300000), status: 'read', reactions: [] },
    { id: 'm8', chatId: 'chat1', senderId: 'me', content: 'Perfeito, vou ver agora mesmo!', type: 'text', timestamp: new Date(now - 120000), status: 'delivered', reactions: [] },
  ],
  chat2: [
    { id: 'm9', chatId: 'chat2', senderId: '2', content: 'A reunião vai ser às 15h', type: 'text', timestamp: new Date(now - 7200000), status: 'read', reactions: [] },
    { id: 'm10', chatId: 'chat2', senderId: 'me', content: 'Beleza, estarei lá!', type: 'text', timestamp: new Date(now - 7100000), status: 'read', reactions: [] },
    { id: 'm11', chatId: 'chat2', senderId: '2', content: 'Prepara aquele relatório pfv', type: 'text', timestamp: new Date(now - 1800000), status: 'read', reactions: [] },
  ],
  chat3: [
    { id: 'm12', chatId: 'chat3', senderId: '3', content: 'Bora tomar um café? ☕', type: 'text', timestamp: new Date(now - 900000), status: 'read', reactions: [{ emoji: '☕', users: ['me', '3'] }] },
  ],
  group1: [
    { id: 'mg1', chatId: 'group1', senderId: '1', content: 'Pessoal, atenção ao deadline!', type: 'text', timestamp: new Date(now - 5400000), status: 'read', reactions: [] },
    { id: 'mg2', chatId: 'group1', senderId: '4', content: 'Estou finalizando minha parte', type: 'text', timestamp: new Date(now - 5000000), status: 'read', reactions: [{ emoji: '👍', users: ['1', 'me'] }] },
    { id: 'mg3', chatId: 'group1', senderId: 'me', content: 'Já entreguei a minha!', type: 'text', timestamp: new Date(now - 4800000), status: 'read', reactions: [{ emoji: '🎉', users: ['1', '3'] }] },
    { id: 'mg4', chatId: 'group1', senderId: '3', content: 'Vamos conseguir 💪', type: 'text', timestamp: new Date(now - 4000000), status: 'read', reactions: [] },
  ],
};

export const chats: Chat[] = [
  {
    id: 'chat1', type: 'direct', name: 'Ana Silva', avatar: '',
    participants: [currentUser, users[0]], lastMessage: messages.chat1[messages.chat1.length - 1],
    unreadCount: 2, isFavorite: true, isArchived: false, isMuted: false, typing: [], pinnedMessages: [],
  },
  {
    id: 'chat2', type: 'direct', name: 'Carlos Santos', avatar: '',
    participants: [currentUser, users[1]], lastMessage: messages.chat2[messages.chat2.length - 1],
    unreadCount: 1, isFavorite: false, isArchived: false, isMuted: false, typing: [], pinnedMessages: [],
  },
  {
    id: 'chat3', type: 'direct', name: 'Marina Costa', avatar: '',
    participants: [currentUser, users[2]], lastMessage: messages.chat3[messages.chat3.length - 1],
    unreadCount: 0, isFavorite: true, isArchived: false, isMuted: false, typing: ['3'], pinnedMessages: [],
  },
  {
    id: 'chat4', type: 'direct', name: 'Pedro Oliveira', avatar: '',
    participants: [currentUser, users[3]], unreadCount: 0, isFavorite: false,
    isArchived: true, isMuted: true, typing: [], pinnedMessages: [],
  },
  {
    id: 'group1', type: 'group', name: 'Projeto Alpha 🚀', avatar: '',
    participants: [currentUser, users[0], users[2], users[3]],
    lastMessage: messages.group1[messages.group1.length - 1],
    unreadCount: 3, isFavorite: false, isArchived: false, isMuted: false,
    typing: [], pinnedMessages: [], admins: ['me', '1'], createdBy: 'me',
    description: 'Grupo do projeto Alpha - deadline sexta!',
  },
  {
    id: 'chat5', type: 'direct', name: 'Julia Mendes', avatar: '',
    participants: [currentUser, users[4]], unreadCount: 0, isFavorite: false,
    isArchived: false, isMuted: false, typing: [], pinnedMessages: [],
  },
];

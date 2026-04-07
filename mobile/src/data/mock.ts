import { Contact, Message, Post } from '../types/app';

export const posts: Post[] = [
  { id: 'p1', author: 'Ana', content: 'Nova atualização do projeto 🎉', likes: 12 },
  { id: 'p2', author: 'Carlos', content: 'Backend com Nest + Prisma no ar.', likes: 8 },
];

export const contacts: Contact[] = [
  { id: 'c1', name: 'Marina', online: true },
  { id: 'c2', name: 'Rafa', online: false },
  { id: 'c3', name: 'João', online: true },
];

export const messages: Message[] = [
  { id: 'm1', from: 'Marina', text: 'Você viu a nova versão mobile?', at: '09:10' },
  { id: 'm2', from: 'Você', text: 'Sim! Já está em React Native 🚀', at: '09:12' },
];

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const passwordHash = await hash('password123', 12);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@joyconvo.com' },
    update: {},
    create: {
      email: 'alice@joyconvo.com',
      name: 'Alice Silva',
      passwordHash,
      bio: 'Desenvolvedora frontend apaixonada por UX',
      status: 'ONLINE',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@joyconvo.com' },
    update: {},
    create: {
      email: 'bob@joyconvo.com',
      name: 'Bob Santos',
      passwordHash,
      bio: 'Backend developer & DevOps enthusiast',
      status: 'AWAY',
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: 'carol@joyconvo.com' },
    update: {},
    create: {
      email: 'carol@joyconvo.com',
      name: 'Carol Oliveira',
      passwordHash,
      bio: 'Designer UI/UX e amante de tipografia',
      status: 'OFFLINE',
    },
  });

  // Contacts
  await prisma.contact.createMany({
    data: [
      { userId: alice.id, contactId: bob.id, isFavorite: true },
      { userId: alice.id, contactId: carol.id },
      { userId: bob.id, contactId: alice.id, isFavorite: true },
      { userId: carol.id, contactId: alice.id },
    ],
    skipDuplicates: true,
  });

  // Chat
  const chat = await prisma.chat.create({
    data: {
      isGroup: false,
      members: { create: [{ userId: alice.id }, { userId: bob.id }] },
    },
  });

  await prisma.message.createMany({
    data: [
      { chatId: chat.id, senderId: alice.id, content: 'Oi Bob! Como vai o backend?', status: 'READ' },
      { chatId: chat.id, senderId: bob.id, content: 'Funcionando perfeitamente! 🚀', status: 'READ' },
      { chatId: chat.id, senderId: alice.id, content: 'Ótimo! Vou integrar o frontend agora', status: 'DELIVERED' },
    ],
  });

  // Group chat
  const group = await prisma.chat.create({
    data: {
      name: 'Equipe JoyConvo',
      isGroup: true,
      members: {
        create: [
          { userId: alice.id, isAdmin: true },
          { userId: bob.id },
          { userId: carol.id },
        ],
      },
    },
  });

  await prisma.message.createMany({
    data: [
      { chatId: group.id, senderId: alice.id, content: 'Bem-vindos ao grupo da equipe! 🎉' },
      { chatId: group.id, senderId: carol.id, content: 'Oi pessoal! Acabei de finalizar os mockups' },
      { chatId: group.id, senderId: bob.id, content: 'Show! Vou dar uma olhada' },
    ],
  });

  // Feed posts
  await prisma.feedPost.createMany({
    data: [
      { authorId: alice.id, content: 'Acabei de fazer deploy da v2.0! 🚀 Nova paleta de cores e sistema de temas customizáveis.' },
      { authorId: bob.id, content: 'Backend NestJS + Prisma rodando com zero downtime. PostgreSQL performance is 🔥' },
      { authorId: carol.id, content: 'Novo design system pronto! 36 cores categorizadas com preview em tempo real. ✨' },
    ],
  });

  // Schedule events
  const now = new Date();
  await prisma.scheduleEvent.createMany({
    data: [
      {
        userId: alice.id,
        title: 'Daily Standup',
        description: 'Reunião diária da equipe',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15),
        priority: 'HIGH',
        status: 'CONFIRMED',
        color: '#7c3aed',
      },
      {
        userId: alice.id,
        title: 'Code Review',
        description: 'Revisar PRs pendentes',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0),
        priority: 'MEDIUM',
        color: '#06b6d4',
      },
      {
        userId: bob.id,
        title: 'Deploy Production',
        description: 'Deploy da versão 2.0 em produção',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0),
        priority: 'URGENT',
        color: '#ef4444',
      },
    ],
  });

  // Community
  const community = await prisma.community.create({
    data: {
      name: 'React Developers BR',
      description: 'Comunidade brasileira de desenvolvedores React',
      isPublic: true,
      ownerId: alice.id,
      members: {
        create: [
          { userId: alice.id, role: 'admin' },
          { userId: bob.id, role: 'member' },
          { userId: carol.id, role: 'member' },
        ],
      },
    },
  });

  // Marketplace products
  await prisma.marketProduct.createMany({
    data: [
      {
        sellerId: carol.id,
        title: 'UI Kit Premium',
        description: 'Kit completo com 200+ componentes React',
        price: 49.90,
        category: 'design',
      },
      {
        sellerId: bob.id,
        title: 'API Boilerplate NestJS',
        description: 'Template pronto para APIs profissionais',
        price: 29.90,
        category: 'development',
      },
    ],
  });

  // Settings
  await prisma.userSettings.createMany({
    data: [
      { userId: alice.id, primaryColor: '#7c3aed', accentColor: '#06b6d4', darkMode: true },
      { userId: bob.id, primaryColor: '#2563eb', accentColor: '#f59e0b', darkMode: true },
      { userId: carol.id, primaryColor: '#ec4899', accentColor: '#8b5cf6', darkMode: false },
    ],
    skipDuplicates: true,
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: alice.id, type: 'MESSAGE', title: 'Nova mensagem', body: 'Bob enviou uma mensagem' },
      { userId: alice.id, type: 'SYSTEM', title: 'Bem-vinda!', body: 'Sua conta foi criada com sucesso' },
      { userId: bob.id, type: 'EVENT', title: 'Evento amanhã', body: 'Deploy Production às 10:00' },
    ],
  });

  console.log('✅ Seed concluído!');
  console.log(`   👤 ${alice.email} / password123`);
  console.log(`   👤 ${bob.email} / password123`);
  console.log(`   👤 ${carol.email} / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

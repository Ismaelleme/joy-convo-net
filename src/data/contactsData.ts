export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastSeen?: Date;
  bio?: string;
  isFavorite: boolean;
  mutualFriends: number;
  socialLinks?: { platform: string; url: string }[];
}

const now = Date.now();

export const contacts: Contact[] = [
  {
    id: 'c1',
    name: 'Ana Silva',
    phone: '+55 11 98765-4321',
    email: 'ana.silva@email.com',
    status: 'online',
    bio: 'Designer criativa 🎨 | Amante de café ☕',
    isFavorite: true,
    mutualFriends: 12,
    socialLinks: [
      { platform: 'Instagram', url: '#' },
      { platform: 'LinkedIn', url: '#' },
    ],
  },
  {
    id: 'c2',
    name: 'Carlos Santos',
    phone: '+55 21 99876-5432',
    email: 'carlos@email.com',
    status: 'online',
    bio: 'Dev Full Stack 💻 | Gamer 🎮',
    isFavorite: true,
    mutualFriends: 8,
    socialLinks: [
      { platform: 'GitHub', url: '#' },
    ],
  },
  {
    id: 'c3',
    name: 'Marina Costa',
    phone: '+55 31 97654-3210',
    status: 'away',
    lastSeen: new Date(now - 1800000),
    bio: 'Fotógrafa profissional 📸',
    isFavorite: false,
    mutualFriends: 5,
  },
  {
    id: 'c4',
    name: 'Pedro Oliveira',
    phone: '+55 41 96543-2109',
    email: 'pedro.o@email.com',
    status: 'offline',
    lastSeen: new Date(now - 7200000),
    bio: 'Personal Trainer 💪 | Nutrição esportiva',
    isFavorite: false,
    mutualFriends: 3,
  },
  {
    id: 'c5',
    name: 'Julia Mendes',
    phone: '+55 51 95432-1098',
    status: 'busy',
    bio: 'Advogada ⚖️ | Mãe de pet 🐱',
    isFavorite: true,
    mutualFriends: 15,
    socialLinks: [
      { platform: 'LinkedIn', url: '#' },
    ],
  },
  {
    id: 'c6',
    name: 'Rafael Lima',
    phone: '+55 61 94321-0987',
    email: 'rafa.lima@email.com',
    status: 'online',
    bio: 'Músico 🎸 | Produtor musical',
    isFavorite: false,
    mutualFriends: 7,
  },
  {
    id: 'c7',
    name: 'Camila Ferreira',
    phone: '+55 71 93210-9876',
    status: 'offline',
    lastSeen: new Date(now - 86400000),
    bio: 'Viajante 🌍 | 30 países visitados',
    isFavorite: false,
    mutualFriends: 2,
  },
  {
    id: 'c8',
    name: 'Lucas Rodrigues',
    phone: '+55 81 92109-8765',
    email: 'lucas.r@email.com',
    status: 'online',
    bio: 'Empreendedor 🚀 | Startup founder',
    isFavorite: true,
    mutualFriends: 20,
    socialLinks: [
      { platform: 'Twitter', url: '#' },
      { platform: 'LinkedIn', url: '#' },
    ],
  },
];

export const contactCategories = ['Todos', 'Favoritos', 'Online', 'Recentes'];

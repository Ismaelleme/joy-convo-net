export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  images: string[];
  likes: number;
  comments: FeedComment[];
  shares: number;
  liked: boolean;
  saved: boolean;
  timestamp: Date;
  type: 'photo' | 'video' | 'text';
}

export interface FeedComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  likes: number;
}

const now = Date.now();

export const feedPosts: FeedPost[] = [
  {
    id: 'p1',
    userId: '1',
    userName: 'Ana Silva',
    userAvatar: '',
    content: 'Novo projeto finalizado! 🚀 Orgulho da equipe que fez tudo isso acontecer. #design #tech',
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop'],
    likes: 142,
    comments: [
      { id: 'c1', userId: '3', userName: 'Marina Costa', content: 'Ficou incrível! 🔥', timestamp: new Date(now - 1800000), likes: 5 },
      { id: 'c2', userId: '4', userName: 'Pedro Oliveira', content: 'Parabéns ao time!', timestamp: new Date(now - 1200000), likes: 2 },
    ],
    shares: 23,
    liked: false,
    saved: false,
    timestamp: new Date(now - 3600000),
    type: 'photo',
  },
  {
    id: 'p2',
    userId: '3',
    userName: 'Marina Costa',
    userAvatar: '',
    content: 'Café e código ☕💻 Melhor combinação que existe!',
    images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop'],
    likes: 89,
    comments: [
      { id: 'c3', userId: '1', userName: 'Ana Silva', content: 'Concordo total! ☕', timestamp: new Date(now - 5400000), likes: 3 },
    ],
    shares: 8,
    liked: true,
    saved: true,
    timestamp: new Date(now - 7200000),
    type: 'photo',
  },
  {
    id: 'p3',
    userId: '4',
    userName: 'Pedro Oliveira',
    userAvatar: '',
    content: 'Finalmente terminei o setup do home office! O que acharam? 🖥️',
    images: [
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=600&h=400&fit=crop',
    ],
    likes: 234,
    comments: [
      { id: 'c4', userId: '5', userName: 'Julia Mendes', content: 'Que setup lindo! 😍', timestamp: new Date(now - 10800000), likes: 12 },
      { id: 'c5', userId: '2', userName: 'Carlos Santos', content: 'Qual monitor é esse?', timestamp: new Date(now - 10000000), likes: 1 },
      { id: 'c6', userId: '4', userName: 'Pedro Oliveira', content: 'É o LG UltraWide 34"', timestamp: new Date(now - 9500000), likes: 4 },
    ],
    shares: 45,
    liked: false,
    saved: false,
    timestamp: new Date(now - 14400000),
    type: 'photo',
  },
  {
    id: 'p4',
    userId: '5',
    userName: 'Julia Mendes',
    userAvatar: '',
    content: 'Dica do dia: Nunca subestime o poder de uma boa noite de sono. Sua produtividade agradece! 💤✨',
    images: [],
    likes: 67,
    comments: [],
    shares: 12,
    liked: false,
    saved: false,
    timestamp: new Date(now - 21600000),
    type: 'text',
  },
  {
    id: 'p5',
    userId: '2',
    userName: 'Carlos Santos',
    userAvatar: '',
    content: 'Evento de tech esse fim de semana! Quem vai? 🎉 #tech #meetup #networking',
    images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'],
    likes: 178,
    comments: [
      { id: 'c7', userId: '1', userName: 'Ana Silva', content: 'Eu vou! Bora trocar ideia lá', timestamp: new Date(now - 28000000), likes: 6 },
    ],
    shares: 34,
    liked: true,
    saved: false,
    timestamp: new Date(now - 28800000),
    type: 'photo',
  },
];

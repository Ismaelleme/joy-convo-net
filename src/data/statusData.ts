import status1 from '@/assets/status/status1.jpg';
import status2 from '@/assets/status/status2.jpg';
import status3 from '@/assets/status/status3.jpg';
import status4 from '@/assets/status/status4.jpg';
import thumb1 from '@/assets/videos/thumb1.jpg';
import thumb2 from '@/assets/videos/thumb2.jpg';
import thumb3 from '@/assets/videos/thumb3.jpg';
import thumb4 from '@/assets/videos/thumb4.jpg';
import thumb5 from '@/assets/videos/thumb5.jpg';

export interface Status {
  id: string;
  userId: string;
  userName: string;
  items: StatusItem[];
  seen: boolean;
}

export interface StatusItem {
  id: string;
  type: 'image' | 'text';
  content: string; // image url or text
  bgColor?: string;
  caption?: string;
  timestamp: Date;
  views: number;
}

export interface VideoPost {
  id: string;
  userId: string;
  userName: string;
  thumbnail: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  music?: string;
  tags: string[];
  timestamp: Date;
}

const now = Date.now();

export const statusData: Status[] = [
  {
    id: 'my-status',
    userId: 'me',
    userName: 'Meu status',
    items: [],
    seen: true,
  },
  {
    id: 's1',
    userId: '1',
    userName: 'Ana Silva',
    seen: false,
    items: [
      { id: 'si1', type: 'image', content: status1, caption: 'Que pôr do sol incrível! 🌅', timestamp: new Date(now - 3600000), views: 45 },
      { id: 'si2', type: 'text', content: 'Gratidão por mais um dia! ✨', bgColor: 'from-emerald-600 to-teal-800', timestamp: new Date(now - 1800000), views: 32 },
    ],
  },
  {
    id: 's2',
    userId: '3',
    userName: 'Marina Costa',
    seen: false,
    items: [
      { id: 'si3', type: 'image', content: status2, caption: 'Noite na cidade 🌃', timestamp: new Date(now - 7200000), views: 89 },
    ],
  },
  {
    id: 's3',
    userId: '4',
    userName: 'Pedro Oliveira',
    seen: true,
    items: [
      { id: 'si4', type: 'image', content: status3, caption: 'Café da tarde ☕', timestamp: new Date(now - 14400000), views: 23 },
    ],
  },
  {
    id: 's4',
    userId: '5',
    userName: 'Julia Mendes',
    seen: true,
    items: [
      { id: 'si5', type: 'image', content: status4, caption: 'Trilha demais! 🏔️', timestamp: new Date(now - 10800000), views: 67 },
    ],
  },
];

export const videoData: VideoPost[] = [
  {
    id: 'v1', userId: '1', userName: 'Ana Silva',
    thumbnail: thumb1,
    description: 'Aprendi essa dance nova! 💃 O que acharam?',
    likes: 12400, comments: 342, shares: 89, isLiked: false,
    music: '♪ Remix Tropical - DJ Flow',
    tags: ['dance', 'trending', 'viral'],
    timestamp: new Date(now - 3600000),
  },
  {
    id: 'v2', userId: '2', userName: 'Carlos Santos',
    thumbnail: thumb2,
    description: 'Receita de pasta carbonara que todo mundo pediu! 🍝',
    likes: 45200, comments: 1203, shares: 567, isLiked: true,
    music: '♪ Italian Kitchen - Chef Beats',
    tags: ['cooking', 'recipe', 'pasta'],
    timestamp: new Date(now - 7200000),
  },
  {
    id: 'v3', userId: '3', userName: 'Marina Costa',
    thumbnail: thumb3,
    description: 'Kickflip no pôr do sol 🛹✨ #skate #esporte',
    likes: 8900, comments: 156, shares: 234, isLiked: false,
    music: '♪ Skate Punk - The Riders',
    tags: ['skate', 'sports', 'sunset'],
    timestamp: new Date(now - 14400000),
  },
  {
    id: 'v4', userId: '5', userName: 'Julia Mendes',
    thumbnail: thumb4,
    description: 'Meu dog curtindo a praia 🐕🏖️ Quem mais ama?',
    likes: 98700, comments: 4521, shares: 2340, isLiked: false,
    music: '♪ Happy Vibes - Summer',
    tags: ['pets', 'dog', 'beach', 'funny'],
    timestamp: new Date(now - 21600000),
  },
  {
    id: 'v5', userId: '4', userName: 'Pedro Oliveira',
    thumbnail: thumb5,
    description: 'Treino em casa que funciona! 💪 Salva pra depois',
    likes: 23400, comments: 890, shares: 1234, isLiked: true,
    music: '♪ Beast Mode - Gym Motivation',
    tags: ['fitness', 'workout', 'health'],
    timestamp: new Date(now - 28800000),
  },
];

export interface Community {
  id: string;
  name: string;
  icon: string;
  banner: string;
  description: string;
  memberCount: number;
  onlineCount: number;
  channels: Channel[];
  role: 'admin' | 'mod' | 'member';
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  unread: number;
  lastMessage?: string;
}

export const communities: Community[] = [
  {
    id: 'srv1',
    name: 'Dev Brasil',
    icon: '🇧🇷',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=200&fit=crop',
    description: 'Comunidade de desenvolvedores brasileiros',
    memberCount: 12480,
    onlineCount: 3210,
    role: 'admin',
    channels: [
      { id: 'ch1', name: 'geral', type: 'text', unread: 5, lastMessage: 'Alguém aí manja de React?' },
      { id: 'ch2', name: 'anúncios', type: 'announcement', unread: 1, lastMessage: 'Novo evento dia 15!' },
      { id: 'ch3', name: 'vagas', type: 'text', unread: 12, lastMessage: 'Vaga React Pleno - SP' },
      { id: 'ch4', name: 'off-topic', type: 'text', unread: 0 },
      { id: 'ch5', name: 'voz-geral', type: 'voice', unread: 0 },
      { id: 'ch6', name: 'pair-programming', type: 'voice', unread: 0 },
    ],
  },
  {
    id: 'srv2',
    name: 'Design Hub',
    icon: '🎨',
    banner: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=200&fit=crop',
    description: 'UI/UX designers unidos',
    memberCount: 8750,
    onlineCount: 1890,
    role: 'member',
    channels: [
      { id: 'ch7', name: 'inspiração', type: 'text', unread: 3, lastMessage: 'Olha esse layout!' },
      { id: 'ch8', name: 'feedback', type: 'text', unread: 0 },
      { id: 'ch9', name: 'freelas', type: 'text', unread: 7, lastMessage: 'Preciso de um designer' },
      { id: 'ch10', name: 'voz-design', type: 'voice', unread: 0 },
    ],
  },
  {
    id: 'srv3',
    name: 'Gaming Zone',
    icon: '🎮',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=200&fit=crop',
    description: 'Gamers de plantão',
    memberCount: 23100,
    onlineCount: 5670,
    role: 'mod',
    channels: [
      { id: 'ch11', name: 'geral', type: 'text', unread: 20, lastMessage: 'GG galera!' },
      { id: 'ch12', name: 'valorant', type: 'text', unread: 8 },
      { id: 'ch13', name: 'minecraft', type: 'text', unread: 2 },
      { id: 'ch14', name: 'voz-ranked', type: 'voice', unread: 0 },
      { id: 'ch15', name: 'voz-casual', type: 'voice', unread: 0 },
    ],
  },
  {
    id: 'srv4',
    name: 'Música & Cultura',
    icon: '🎵',
    banner: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=200&fit=crop',
    description: 'Compartilhe e descubra músicas',
    memberCount: 5430,
    onlineCount: 980,
    role: 'member',
    channels: [
      { id: 'ch16', name: 'recomendações', type: 'text', unread: 4 },
      { id: 'ch17', name: 'produções', type: 'text', unread: 0 },
      { id: 'ch18', name: 'jam-session', type: 'voice', unread: 0 },
    ],
  },
];

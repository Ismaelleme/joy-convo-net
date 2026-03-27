export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  accentColor: string;
  features: string[];
}

export const socialPlatforms: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'Instagram',
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
    accentColor: 'hsl(330, 70%, 55%)',
    features: [
      'Postar fotos e vídeos',
      'Stories',
      'Reels',
      'Lives',
      'Direct',
      'Hashtags',
      'Explorar',
      'Loja',
      'Insights',
    ],
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: 'MessageSquare',
    gradient: 'from-indigo-500 to-purple-600',
    accentColor: 'hsl(235, 86%, 65%)',
    features: [
      'Servidores',
      'Canais de texto e voz',
      'Bots',
      'Cargos',
      'Streaming',
      'Threads',
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'Music',
    gradient: 'from-cyan-400 via-black to-pink-500',
    accentColor: 'hsl(174, 80%, 55%)',
    features: [
      'Vídeos curtos',
      'Para Você',
      'Dueto',
      'Stitch',
      'Lives',
      'Efeitos',
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'Phone',
    gradient: 'from-green-400 to-green-600',
    accentColor: 'hsl(142, 70%, 49%)',
    features: [
      'Mensagens',
      'Áudios',
      'Chamadas',
      'Grupos',
      'Status',
      'Comunidades',
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'ThumbsUp',
    gradient: 'from-blue-500 to-blue-700',
    accentColor: 'hsl(220, 80%, 55%)',
    features: [
      'Feed',
      'Grupos',
      'Marketplace',
      'Eventos',
      'Páginas',
      'Messenger',
    ],
  },
];

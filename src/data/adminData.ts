// Mock data for admin panel

export interface BackgroundPattern {
  id: string;
  name: string;
  type: 'raios_azuis' | 'geometrico' | 'ondas' | 'particulas' | 'solido';
  preview: string; // CSS gradient/pattern
}

export const backgroundPatterns: BackgroundPattern[] = [
  {
    id: 'raios',
    name: 'Raios Azuis',
    type: 'raios_azuis',
    preview: 'radial-gradient(ellipse at 50% 50%, hsl(220 90% 56% / 0.3) 0%, transparent 70%)',
  },
  {
    id: 'geometrico',
    name: 'Geométrico',
    type: 'geometrico',
    preview: 'repeating-linear-gradient(45deg, transparent, transparent 20px, hsl(220 90% 56% / 0.05) 20px, hsl(220 90% 56% / 0.05) 40px)',
  },
  {
    id: 'ondas',
    name: 'Ondas',
    type: 'ondas',
    preview: 'radial-gradient(circle at 20% 80%, hsl(200 80% 50% / 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(220 90% 56% / 0.2) 0%, transparent 50%)',
  },
  {
    id: 'particulas',
    name: 'Partículas',
    type: 'particulas',
    preview: 'radial-gradient(circle at 10% 20%, hsl(220 90% 56% / 0.15) 0%, transparent 20%), radial-gradient(circle at 90% 80%, hsl(200 80% 50% / 0.15) 0%, transparent 20%), radial-gradient(circle at 50% 50%, hsl(220 90% 56% / 0.1) 0%, transparent 30%)',
  },
  {
    id: 'solido',
    name: 'Sólido',
    type: 'solido',
    preview: 'none',
  },
];

export interface AdminMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  subject: string;
  content: string;
  attachments: { name: string; type: string; size: string }[];
  read: boolean;
  createdAt: string;
}

export const adminMessages: AdminMessage[] = [
  {
    id: '1',
    senderName: 'Maria Silva',
    senderAvatar: 'MS',
    subject: 'Proposta de parceria',
    content: 'Olá, gostaria de discutir uma possível parceria entre nossas empresas. Segue em anexo o documento com os termos iniciais para sua análise.',
    attachments: [
      { name: 'proposta_parceria.pdf', type: 'application/pdf', size: '2.4 MB' },
      { name: 'termos.pdf', type: 'application/pdf', size: '1.1 MB' },
    ],
    read: false,
    createdAt: '2026-03-28T10:30:00',
  },
  {
    id: '2',
    senderName: 'João Oliveira',
    senderAvatar: 'JO',
    subject: 'Fotos do evento',
    content: 'Segue as fotos do evento da semana passada. Ficaram ótimas! Me avise se precisar de edições.',
    attachments: [
      { name: 'foto_evento_01.jpg', type: 'image/jpeg', size: '4.8 MB' },
      { name: 'foto_evento_02.jpg', type: 'image/jpeg', size: '3.2 MB' },
      { name: 'foto_evento_03.png', type: 'image/png', size: '5.1 MB' },
    ],
    read: true,
    createdAt: '2026-03-27T14:15:00',
  },
  {
    id: '3',
    senderName: 'Ana Costa',
    senderAvatar: 'AC',
    subject: 'Dúvida sobre agendamento',
    content: 'Boa tarde! Tentei agendar uma reunião para sexta-feira, mas não encontrei horários disponíveis. Poderia verificar se há algum slot disponível pela manhã?',
    attachments: [],
    read: true,
    createdAt: '2026-03-26T09:45:00',
  },
  {
    id: '4',
    senderName: 'Carlos Mendes',
    senderAvatar: 'CM',
    subject: 'Relatório mensal',
    content: 'Prezado(a), conforme solicitado, segue o relatório mensal de atividades com os indicadores atualizados.',
    attachments: [
      { name: 'relatorio_marco_2026.pdf', type: 'application/pdf', size: '3.7 MB' },
    ],
    read: false,
    createdAt: '2026-03-25T16:20:00',
  },
  {
    id: '5',
    senderName: 'Fernanda Lima',
    senderAvatar: 'FL',
    subject: 'Feedback do site',
    content: 'O novo layout está incrível! Muito mais moderno. Só sugiro melhorar o contraste do texto na seção de depoimentos.',
    attachments: [],
    read: true,
    createdAt: '2026-03-24T11:00:00',
  },
];

export type AppointmentStatus = 'pendente' | 'confirmado' | 'cancelado' | 'concluido';

export interface Appointment {
  id: string;
  userName: string;
  userAvatar: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
}

export const appointments: Appointment[] = [
  {
    id: '1',
    userName: 'Maria Silva',
    userAvatar: 'MS',
    date: '2026-03-30',
    time: '10:00',
    reason: 'Reunião sobre parceria comercial',
    status: 'pendente',
    createdAt: '2026-03-28T10:30:00',
  },
  {
    id: '2',
    userName: 'João Oliveira',
    userAvatar: 'JO',
    date: '2026-03-29',
    time: '14:00',
    reason: 'Apresentação de portfólio',
    status: 'confirmado',
    createdAt: '2026-03-27T09:00:00',
  },
  {
    id: '3',
    userName: 'Ana Costa',
    userAvatar: 'AC',
    date: '2026-03-28',
    time: '09:00',
    reason: 'Consultoria inicial',
    status: 'concluido',
    createdAt: '2026-03-25T15:20:00',
  },
  {
    id: '4',
    userName: 'Carlos Mendes',
    userAvatar: 'CM',
    date: '2026-04-01',
    time: '11:00',
    reason: 'Revisão de contrato',
    status: 'pendente',
    createdAt: '2026-03-28T08:00:00',
  },
  {
    id: '5',
    userName: 'Fernanda Lima',
    userAvatar: 'FL',
    date: '2026-03-27',
    time: '16:00',
    reason: 'Feedback sobre projeto de design',
    status: 'cancelado',
    createdAt: '2026-03-24T12:00:00',
  },
  {
    id: '6',
    userName: 'Pedro Santos',
    userAvatar: 'PS',
    date: '2026-04-02',
    time: '15:00',
    reason: 'Planejamento estratégico Q2',
    status: 'confirmado',
    createdAt: '2026-03-28T07:30:00',
  },
];

export const availableSlots = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

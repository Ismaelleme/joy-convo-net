export interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: 'call' | 'meeting' | 'reminder' | 'event';
  contactName?: string;
  contactAvatar?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  location?: string;
}

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: 'ev1',
    title: 'Reunião com Ana Silva',
    description: 'Discutir proposta de design para o novo projeto',
    date: '2026-04-01',
    time: '10:00',
    duration: '1h',
    type: 'meeting',
    contactName: 'Ana Silva',
    status: 'upcoming',
    priority: 'high',
    location: 'Sala virtual',
  },
  {
    id: 'ev2',
    title: 'Chamada com Carlos',
    description: 'Review do código do sprint',
    date: '2026-04-01',
    time: '14:00',
    duration: '30min',
    type: 'call',
    contactName: 'Carlos Santos',
    status: 'upcoming',
    priority: 'medium',
  },
  {
    id: 'ev3',
    title: 'Evento da comunidade',
    description: 'Meetup de desenvolvedores - tema: IA generativa',
    date: '2026-04-02',
    time: '19:00',
    duration: '2h',
    type: 'event',
    status: 'upcoming',
    priority: 'low',
    location: 'Hub de inovação',
  },
  {
    id: 'ev4',
    title: 'Lembrete: enviar relatório',
    description: 'Relatório mensal de métricas para o time',
    date: '2026-04-03',
    time: '09:00',
    duration: '15min',
    type: 'reminder',
    status: 'upcoming',
    priority: 'high',
  },
  {
    id: 'ev5',
    title: 'Consulta com Julia',
    description: 'Revisão de contrato de prestação de serviços',
    date: '2026-03-30',
    time: '15:00',
    duration: '45min',
    type: 'meeting',
    contactName: 'Julia Mendes',
    status: 'completed',
    priority: 'medium',
  },
  {
    id: 'ev6',
    title: 'Live no canal',
    description: 'Transmissão ao vivo sobre novas features',
    date: '2026-03-29',
    time: '20:00',
    duration: '1h30',
    type: 'event',
    status: 'completed',
    priority: 'low',
  },
  {
    id: 'ev7',
    title: 'Ligação - Pedro Oliveira',
    description: 'Plano de treino personalizado',
    date: '2026-04-04',
    time: '08:00',
    duration: '30min',
    type: 'call',
    contactName: 'Pedro Oliveira',
    status: 'upcoming',
    priority: 'medium',
  },
];

export const availableSlots = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

export const eventTypeLabels: Record<string, string> = {
  call: 'Ligação',
  meeting: 'Reunião',
  reminder: 'Lembrete',
  event: 'Evento',
};

export const priorityColors: Record<string, string> = {
  low: 'text-muted-foreground',
  medium: 'text-primary',
  high: 'text-destructive',
};

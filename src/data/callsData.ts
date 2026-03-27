export interface CallRecord {
  id: string;
  userId: string;
  userName: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  duration?: number; // seconds
  timestamp: Date;
}

const now = Date.now();

export const callRecords: CallRecord[] = [
  { id: 'call1', userId: '1', userName: 'Ana Silva', type: 'video', direction: 'incoming', duration: 1245, timestamp: new Date(now - 1800000) },
  { id: 'call2', userId: '3', userName: 'Marina Costa', type: 'voice', direction: 'outgoing', duration: 340, timestamp: new Date(now - 7200000) },
  { id: 'call3', userId: '2', userName: 'Carlos Santos', type: 'voice', direction: 'missed', timestamp: new Date(now - 14400000) },
  { id: 'call4', userId: '5', userName: 'Julia Mendes', type: 'video', direction: 'outgoing', duration: 2100, timestamp: new Date(now - 28800000) },
  { id: 'call5', userId: '4', userName: 'Pedro Oliveira', type: 'voice', direction: 'incoming', duration: 890, timestamp: new Date(now - 43200000) },
  { id: 'call6', userId: '1', userName: 'Ana Silva', type: 'voice', direction: 'missed', timestamp: new Date(now - 86400000) },
  { id: 'call7', userId: '6', userName: 'Lucas Ferreira', type: 'video', direction: 'incoming', duration: 560, timestamp: new Date(now - 172800000) },
];

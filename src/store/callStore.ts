import { create } from 'zustand';

export type CallType = 'voice' | 'video';
export type CallStatus = 'ringing' | 'connecting' | 'in-call' | 'ended';

export interface ActiveCall {
  id: string;
  userName: string;
  type: CallType;
  status: CallStatus;
  startedAt: number;
  connectedAt?: number;
}

export interface CallNotification {
  id: string;
  userName: string;
  type: CallType;
  direction: 'incoming' | 'missed';
  timestamp: number;
  read: boolean;
}

interface CallState {
  active: ActiveCall | null;
  notifications: CallNotification[];
  startCall: (userName: string, type: CallType) => void;
  connectCall: () => void;
  endCall: () => void;
  addNotification: (n: Omit<CallNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  active: null,
  notifications: [
    { id: 'n1', userName: 'Ana Silva', type: 'video', direction: 'incoming', timestamp: Date.now() - 1800000, read: false },
    { id: 'n2', userName: 'Carlos Santos', type: 'voice', direction: 'missed', timestamp: Date.now() - 7200000, read: false },
    { id: 'n3', userName: 'Julia Mendes', type: 'video', direction: 'missed', timestamp: Date.now() - 14400000, read: false },
    { id: 'n4', userName: 'Pedro Oliveira', type: 'voice', direction: 'incoming', timestamp: Date.now() - 86400000, read: true },
  ],
  startCall: (userName, type) => {
    set({
      active: {
        id: crypto.randomUUID(),
        userName,
        type,
        status: 'ringing',
        startedAt: Date.now(),
      },
    });
  },
  connectCall: () => {
    const a = get().active;
    if (!a) return;
    set({ active: { ...a, status: 'in-call', connectedAt: Date.now() } });
  },
  endCall: () => {
    const a = get().active;
    if (a && a.status !== 'in-call') {
      // missed/no answer -> add as missed notification
      get().addNotification({ userName: a.userName, type: a.type, direction: 'missed' });
    }
    set({ active: null });
  },
  addNotification: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: crypto.randomUUID(), timestamp: Date.now(), read: false },
        ...s.notifications,
      ],
    })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  clearNotifications: () => set({ notifications: [] }),
}));

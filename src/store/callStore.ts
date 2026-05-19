import { create } from 'zustand';
import { CallSession, getSelfId, getSignalingSocket, type CallMediaType } from '@/lib/webrtc';

export type CallType = CallMediaType;
export type CallStatus = 'ringing' | 'connecting' | 'in-call' | 'ended';

export interface ActiveCall {
  id: string;
  userName: string;
  peerId: string;
  type: CallType;
  status: CallStatus;
  isCaller: boolean;
  startedAt: number;
  connectedAt?: number;
}

export interface IncomingCall {
  callId: string;
  fromUserId: string;
  fromName: string;
  type: CallType;
  sdp: RTCSessionDescriptionInit;
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
  incoming: IncomingCall | null;
  session: CallSession | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  notifications: CallNotification[];
  startCall: (userName: string, type: CallType, peerId?: string) => Promise<void>;
  setIncoming: (i: IncomingCall | null) => void;
  acceptIncoming: () => Promise<void>;
  declineIncoming: () => void;
  endCall: () => void;
  addNotification: (n: Omit<CallNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
}

function slugId(name: string) {
  return 'peer_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export const useCallStore = create<CallState>((set, get) => ({
  active: null,
  incoming: null,
  session: null,
  localStream: null,
  remoteStream: null,
  notifications: [
    { id: 'n1', userName: 'Ana Silva', type: 'video', direction: 'incoming', timestamp: Date.now() - 1800000, read: false },
    { id: 'n2', userName: 'Carlos Santos', type: 'voice', direction: 'missed', timestamp: Date.now() - 7200000, read: false },
    { id: 'n3', userName: 'Julia Mendes', type: 'video', direction: 'missed', timestamp: Date.now() - 14400000, read: false },
  ],

  startCall: async (userName, type, peerId) => {
    const selfId = getSelfId();
    const callId = (crypto as any).randomUUID?.() ?? Math.random().toString(36).slice(2);
    const targetPeer = peerId ?? slugId(userName);

    set({
      active: {
        id: callId,
        userName,
        peerId: targetPeer,
        type,
        status: 'ringing',
        isCaller: true,
        startedAt: Date.now(),
      },
      localStream: null,
      remoteStream: null,
    });

    const session = new CallSession({
      selfId,
      peerId: targetPeer,
      type,
      isCaller: true,
      callId,
      onRemoteStream: (s) => set({ remoteStream: s }),
      onConnected: () => {
        const a = get().active;
        if (!a) return;
        set({ active: { ...a, status: 'in-call', connectedAt: Date.now() } });
      },
      onEnded: () => {
        const a = get().active;
        if (a && a.status !== 'in-call') {
          get().addNotification({ userName: a.userName, type: a.type, direction: 'missed' });
        }
        set({ active: null, session: null, localStream: null, remoteStream: null });
      },
    });

    try {
      await session.start();
      set({ session, localStream: session.localStream });
    } catch (err) {
      console.error('[call] failed to start', err);
      session.end('media-error');
      set({ active: null, session: null });
      throw err;
    }
  },

  setIncoming: (i) => set({ incoming: i }),

  acceptIncoming: async () => {
    const inc = get().incoming;
    if (!inc) return;
    const selfId = getSelfId();
    set({
      incoming: null,
      active: {
        id: inc.callId,
        userName: inc.fromName,
        peerId: inc.fromUserId,
        type: inc.type,
        status: 'connecting',
        isCaller: false,
        startedAt: Date.now(),
      },
    });

    const session = new CallSession({
      selfId,
      peerId: inc.fromUserId,
      type: inc.type,
      isCaller: false,
      callId: inc.callId,
      onRemoteStream: (s) => set({ remoteStream: s }),
      onConnected: () => {
        const a = get().active;
        if (!a) return;
        set({ active: { ...a, status: 'in-call', connectedAt: Date.now() } });
      },
      onEnded: () => set({ active: null, session: null, localStream: null, remoteStream: null }),
    });

    try {
      await session.start(inc.sdp);
      set({ session, localStream: session.localStream });
    } catch (err) {
      console.error('[call] failed to accept', err);
      session.end('media-error');
      set({ active: null, session: null });
    }
  },

  declineIncoming: () => {
    const inc = get().incoming;
    if (!inc) return;
    getSignalingSocket().emit('hangup', {
      fromUserId: getSelfId(),
      toUserId: inc.fromUserId,
      callId: inc.callId,
    });
    get().addNotification({ userName: inc.fromName, type: inc.type, direction: 'missed' });
    set({ incoming: null });
  },

  endCall: () => {
    const s = get().session;
    if (s) {
      s.end('local-hangup');
    } else {
      const a = get().active;
      if (a && a.status !== 'in-call') {
        get().addNotification({ userName: a.userName, type: a.type, direction: 'missed' });
      }
      set({ active: null, localStream: null, remoteStream: null });
    }
  },

  addNotification: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: (crypto as any).randomUUID?.() ?? Math.random().toString(36).slice(2), timestamp: Date.now(), read: false },
        ...s.notifications,
      ],
    })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  clearNotifications: () => set({ notifications: [] }),
}));

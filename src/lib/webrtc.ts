import { io, Socket } from 'socket.io-client';

const SIGNALING_URL =
  (import.meta.env.VITE_SIGNALING_URL as string) ||
  (import.meta.env.VITE_API_URL as string)?.replace(/\/api\/?$/, '') ||
  'http://localhost:3001';

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

let _socket: Socket | null = null;
let _selfId: string | null = null;

export function getSelfId(): string {
  if (_selfId) return _selfId;
  const KEY = 'iSync_user_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'u_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(KEY, id);
  }
  _selfId = id;
  return id;
}

export function getSignalingSocket(): Socket {
  if (_socket) return _socket;
  _socket = io(`${SIGNALING_URL}/calls`, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1500,
    timeout: 4000,
  });
  _socket.on('connect', () => {
    _socket?.emit('join-user', { userId: getSelfId() });
  });
  return _socket;
}

export type CallMediaType = 'voice' | 'video';

export interface CallSessionOptions {
  selfId: string;
  peerId: string;
  type: CallMediaType;
  isCaller: boolean;
  callId: string;
  onRemoteStream: (s: MediaStream) => void;
  onConnected: () => void;
  onEnded: (reason?: string) => void;
}

export class CallSession {
  pc: RTCPeerConnection;
  localStream: MediaStream | null = null;
  remoteStream: MediaStream = new MediaStream();
  socket: Socket;
  opts: CallSessionOptions;
  ended = false;
  private offHandlers: Array<() => void> = [];

  constructor(opts: CallSessionOptions) {
    this.opts = opts;
    this.socket = getSignalingSocket();
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    this.pc.ontrack = (e) => {
      e.streams[0]?.getTracks().forEach((t) => this.remoteStream.addTrack(t));
      this.opts.onRemoteStream(this.remoteStream);
    };

    this.pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.socket.emit('ice-candidate', {
          fromUserId: opts.selfId,
          toUserId: opts.peerId,
          callId: opts.callId,
          candidate: e.candidate,
        });
      }
    };

    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === 'connected') this.opts.onConnected();
      if (['failed', 'disconnected', 'closed'].includes(this.pc.connectionState)) {
        this.end('connection-' + this.pc.connectionState);
      }
    };

    this.bindSignaling();
  }

  private bindSignaling() {
    const onAnswer = async (p: any) => {
      if (p.callId !== this.opts.callId) return;
      if (p.sdp) await this.pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
    };
    const onOffer = async (p: any) => {
      if (p.callId !== this.opts.callId) return;
      if (p.sdp) {
        await this.pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        this.socket.emit('call-answer', {
          fromUserId: this.opts.selfId,
          toUserId: this.opts.peerId,
          callId: this.opts.callId,
          sdp: answer,
        });
      }
    };
    const onIce = async (p: any) => {
      if (p.callId !== this.opts.callId || !p.candidate) return;
      try {
        await this.pc.addIceCandidate(new RTCIceCandidate(p.candidate));
      } catch {}
    };
    const onHangup = (p: any) => {
      if (p.callId === this.opts.callId) this.end('remote-hangup');
    };

    this.socket.on('call-answer', onAnswer);
    this.socket.on('call-offer', onOffer);
    this.socket.on('ice-candidate', onIce);
    this.socket.on('hangup', onHangup);

    this.offHandlers.push(
      () => this.socket.off('call-answer', onAnswer),
      () => this.socket.off('call-offer', onOffer),
      () => this.socket.off('ice-candidate', onIce),
      () => this.socket.off('hangup', onHangup),
    );
  }

  async start(remoteOffer?: RTCSessionDescriptionInit) {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: this.opts.type === 'video',
    });
    this.localStream.getTracks().forEach((t) => this.pc.addTrack(t, this.localStream!));

    if (this.opts.isCaller) {
      const offer = await this.pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.opts.type === 'video',
      });
      await this.pc.setLocalDescription(offer);
      this.socket.emit('call-offer', {
        fromUserId: this.opts.selfId,
        toUserId: this.opts.peerId,
        callId: this.opts.callId,
        type: this.opts.type,
        sdp: offer,
      });
    } else if (remoteOffer) {
      await this.pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);
      this.socket.emit('call-answer', {
        fromUserId: this.opts.selfId,
        toUserId: this.opts.peerId,
        callId: this.opts.callId,
        sdp: answer,
      });
    }
  }

  toggleMic(): boolean {
    const t = this.localStream?.getAudioTracks()[0];
    if (!t) return false;
    t.enabled = !t.enabled;
    return !t.enabled; // returns true if muted
  }

  toggleCamera(): boolean {
    const t = this.localStream?.getVideoTracks()[0];
    if (!t) return false;
    t.enabled = !t.enabled;
    return !t.enabled; // returns true if off
  }

  end(reason?: string) {
    if (this.ended) return;
    this.ended = true;
    this.socket.emit('hangup', {
      fromUserId: this.opts.selfId,
      toUserId: this.opts.peerId,
      callId: this.opts.callId,
    });
    this.offHandlers.forEach((off) => off());
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.remoteStream.getTracks().forEach((t) => t.stop());
    try {
      this.pc.close();
    } catch {}
    this.opts.onEnded(reason);
  }
}

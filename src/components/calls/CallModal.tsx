import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, Mic, MicOff, VideoOff, Volume2, VolumeX, MonitorUp, MonitorOff } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { toast } from 'sonner';

function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function CallModal() {
  const { active, session, localStream, remoteStream, endCall } = useCallStore();
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [elapsed, setElapsed] = useState(0);


  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  // Bind streams to media elements
  useEffect(() => {
    if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
    if (remoteAudioRef.current && remoteStream) remoteAudioRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  // Timer
  useEffect(() => {
    if (!active || active.status !== 'in-call' || !active.connectedAt) return;
    const i = setInterval(() => {
      setElapsed(Math.floor((Date.now() - active.connectedAt!) / 1000));
    }, 500);
    return () => clearInterval(i);
  }, [active?.status, active?.connectedAt]);

  // Ringtone (WebAudio beep loop while ringing)
  useEffect(() => {
    if (!active || active.status !== 'ringing' || !active.isCaller) return;
    let ctx: AudioContext | null = null;
    let interval: number | null = null;
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const beep = () => {
        if (!ctx) return;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = 440;
        g.gain.value = 0.04;
        o.connect(g).connect(ctx.destination);
        o.start();
        setTimeout(() => o.stop(), 350);
      };
      beep();
      interval = window.setInterval(beep, 1500);
    } catch {}
    return () => {
      if (interval) clearInterval(interval);
      ctx?.close().catch(() => {});
    };
  }, [active?.status, active?.isCaller]);

  // Auto-cancel if call hasn't connected after 35s (caller side, no peer answered)
  useEffect(() => {
    if (!active || !active.isCaller || active.status !== 'ringing') return;
    const t = setTimeout(() => {
      toast.info(`${active.userName} não atendeu`);
      endCall();
    }, 35000);
    return () => clearTimeout(t);
  }, [active?.id, active?.status, active?.isCaller, endCall]);

  useEffect(() => {
    if (!active) {
      setElapsed(0);
      setMuted(false);
      setVideoOff(false);
    }
  }, [active]);

  if (!active) return null;

  const initials = active.userName.split(' ').map(n => n[0]).join('').slice(0, 2);
  const isVideo = active.type === 'video';

  const handleToggleMic = () => {
    const isMuted = session?.toggleMic() ?? !muted;
    setMuted(isMuted);
  };

  const handleToggleCam = () => {
    const isOff = session?.toggleCamera() ?? !videoOff;
    setVideoOff(isOff);
  };

  const handleToggleSpeaker = () => {
    const next = !speaker;
    setSpeaker(next);
    if (remoteAudioRef.current) remoteAudioRef.current.muted = !next;
  };

  const handleToggleShare = async () => {
    if (!session) return;
    if (sharing) {
      await session.stopScreenShare();
      setSharing(false);
      toast.info('Compartilhamento encerrado');
    } else {
      const ok = await session.startScreenShare();
      if (ok) {
        setSharing(true);
        toast.success('Compartilhando tela');
      } else {
        toast.error('Não foi possível compartilhar a tela');
      }
    }
  };

  const handleEnd = () => {
    const wasInCall = active.status === 'in-call';
    endCall();
    toast.info(wasInCall ? `Chamada encerrada (${fmt(elapsed)})` : 'Chamada cancelada');
  };


  const hasRemoteVideo = !!remoteStream && remoteStream.getVideoTracks().length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />

        <motion.div
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          className="relative w-full max-w-md mx-4 flex flex-col items-center text-center p-8"
        >
          {/* Hidden audio sink for voice calls */}
          <audio ref={remoteAudioRef} autoPlay playsInline muted={!speaker} />

          {/* Remote video (visible when peer streams video and we're in call) */}
          {isVideo && active.status === 'in-call' && hasRemoteVideo ? (
            <div className="w-full aspect-video rounded-3xl glow-lg mb-6 relative overflow-hidden bg-black">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Self preview (picture-in-picture) */}
              <div className="absolute bottom-3 right-3 w-24 h-32 rounded-2xl overflow-hidden glass-border bg-muted">
                {localStream && !videoOff ? (
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    Você
                  </div>
                )}
              </div>
            </div>
          ) : isVideo && localStream && !videoOff ? (
            // Caller view before remote answers — show own camera big like WhatsApp
            <div className="w-full aspect-video rounded-3xl glow-lg mb-6 relative overflow-hidden bg-black">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-medium text-white">
                Sua câmera
              </div>
            </div>
          ) : (
            <motion.div
              animate={active.status === 'ringing' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-32 h-32 rounded-full bg-gradient-brand flex items-center justify-center text-4xl font-bold text-primary-foreground glow-lg mb-6 relative"
            >
              {active.status === 'ringing' && (
                <>
                  <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                  <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                </>
              )}
              <span className="relative z-10">{initials}</span>
            </motion.div>
          )}

          <h2 className="text-2xl font-bold text-foreground">{active.userName}</h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            {isVideo ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
            {active.status === 'ringing' && (isVideo ? 'Chamando vídeo…' : 'Chamando…')}
            {active.status === 'connecting' && 'Conectando…'}
            {active.status === 'in-call' && (
              <span className="text-online font-mono">{fmt(elapsed)}</span>
            )}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={handleToggleMic}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                muted ? 'bg-destructive text-destructive-foreground' : 'glass glass-border text-foreground'
              }`}
            >
              {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {isVideo && (
              <button
                onClick={handleToggleCam}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  videoOff ? 'bg-destructive text-destructive-foreground' : 'glass glass-border text-foreground'
                }`}
              >
                {videoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={handleToggleSpeaker}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                speaker ? 'bg-primary/20 text-primary' : 'glass glass-border text-muted-foreground'
              }`}
            >
              {speaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={handleToggleShare}
              disabled={active.status !== 'in-call'}
              title="Compartilhar tela"
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                sharing ? 'bg-primary text-primary-foreground' : 'glass glass-border text-foreground'
              }`}
            >
              {sharing ? <MonitorOff className="w-5 h-5" /> : <MonitorUp className="w-5 h-5" />}
            </button>

            <button
              onClick={handleEnd}
              className="w-16 h-16 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-105 transition-transform glow-lg"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


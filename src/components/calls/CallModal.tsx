import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, Mic, MicOff, VideoOff, Volume2 } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { toast } from 'sonner';

function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function CallModal() {
  const { active, connectCall, endCall } = useCallStore();
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  // Auto-connect after 3s of ringing (simulated answer)
  useEffect(() => {
    if (!active) return;
    if (active.status === 'ringing') {
      const t = setTimeout(() => {
        connectCall();
        toast.success(`${active.userName} atendeu`);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [active?.id, active?.status, connectCall]);

  // Timer
  useEffect(() => {
    if (!active || active.status !== 'in-call' || !active.connectedAt) return;
    const i = setInterval(() => {
      setElapsed(Math.floor((Date.now() - active.connectedAt!) / 1000));
    }, 500);
    return () => clearInterval(i);
  }, [active?.status, active?.connectedAt]);

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

  const handleEnd = () => {
    const wasInCall = active.status === 'in-call';
    endCall();
    toast.info(wasInCall ? `Chamada encerrada (${fmt(elapsed)})` : 'Chamada cancelada');
  };

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
          {/* Video preview area */}
          {isVideo && active.status === 'in-call' && !videoOff ? (
            <div className="w-full aspect-video rounded-3xl bg-gradient-brand glow-lg mb-6 flex items-center justify-center text-5xl font-bold text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
              <span className="relative z-10">{initials}</span>
              <div className="absolute bottom-3 right-3 w-20 h-28 rounded-2xl bg-muted glass-border flex items-center justify-center text-xs text-muted-foreground">
                Você
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
            {active.status === 'in-call' && <span className="text-online font-mono">{fmt(elapsed)}</span>}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={() => setMuted((m) => !m)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                muted ? 'bg-destructive text-destructive-foreground' : 'glass glass-border text-foreground'
              }`}
            >
              {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {isVideo && (
              <button
                onClick={() => setVideoOff((v) => !v)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  videoOff ? 'bg-destructive text-destructive-foreground' : 'glass glass-border text-foreground'
                }`}
              >
                {videoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={() => setSpeaker((s) => !s)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                speaker ? 'bg-primary/20 text-primary' : 'glass glass-border text-foreground'
              }`}
            >
              <Volume2 className="w-5 h-5" />
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

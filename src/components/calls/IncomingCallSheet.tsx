import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { getSignalingSocket, getSelfId } from '@/lib/webrtc';

export function IncomingCallListener() {
  const setIncoming = useCallStore((s) => s.setIncoming);

  useEffect(() => {
    const socket = getSignalingSocket();
    getSelfId(); // ensure registered

    const onOffer = (p: any) => {
      // Ignore if this user initiated this call (echo)
      if (p.fromUserId === getSelfId()) return;
      if (!p.sdp) return;
      setIncoming({
        callId: p.callId,
        fromUserId: p.fromUserId,
        fromName: p.fromName || p.fromUserId,
        type: p.type === 'video' || p.type === 'VIDEO' ? 'video' : 'voice',
        sdp: p.sdp,
      });
    };

    socket.on('call-offer', onOffer);
    return () => {
      socket.off('call-offer', onOffer);
    };
  }, [setIncoming]);

  return <IncomingCallSheet />;
}

function IncomingCallSheet() {
  const { incoming, acceptIncoming, declineIncoming, active } = useCallStore();

  // Hide if there's already an active call
  if (!incoming || active) return null;

  const isVideo = incoming.type === 'video';
  const initials = incoming.fromName.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] w-[min(420px,calc(100vw-2rem))]"
      >
        <div className="glass-strong glass-border rounded-3xl p-4 flex items-center gap-3 glow-lg">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-sm font-bold text-primary-foreground relative flex-shrink-0"
          >
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            <span className="relative z-10">{initials}</span>
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{incoming.fromName}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              {isVideo ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
              {isVideo ? 'Chamada de vídeo' : 'Chamada de voz'}
            </p>
          </div>
          <button
            onClick={declineIncoming}
            className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-105 transition-transform"
            aria-label="Recusar"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
          <button
            onClick={acceptIncoming}
            className="w-10 h-10 rounded-full bg-online text-white flex items-center justify-center hover:scale-105 transition-transform glow-lg"
            aria-label="Atender"
          >
            {isVideo ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

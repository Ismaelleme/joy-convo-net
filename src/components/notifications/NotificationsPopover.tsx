import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, PhoneMissed, X, Check } from 'lucide-react';
import { useCallStore } from '@/store/callStore';

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m}m atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationsPopover({ open, onClose }: Props) {
  const { notifications, markAllRead, clearNotifications, startCall } = useCallStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            className="absolute right-2 top-12 z-50 w-80 max-h-[70vh] glass-strong glass-border rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground">Notificações</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={markAllRead}
                  title="Marcar todas como lidas"
                  className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="text-center py-10 text-sm text-muted-foreground">Nenhuma notificação</div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.direction === 'missed' ? PhoneMissed : n.type === 'video' ? Video : Phone;
                  const color = n.direction === 'missed' ? 'text-destructive' : 'text-primary';
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        startCall(n.userName, n.type);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors border-b border-border/20 last:border-0 ${
                        !n.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl glass glass-border flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{n.userName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {n.direction === 'missed'
                            ? `Chamada de ${n.type === 'video' ? 'vídeo' : 'voz'} perdida`
                            : `${n.type === 'video' ? 'Chamada de vídeo' : 'Ligação'} recebida`}
                          {' · '}{timeAgo(n.timestamp)}
                        </p>
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground border-t border-border/40 hover:bg-muted/30 transition-colors"
              >
                Limpar tudo
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { useState } from 'react';
import { statusData } from '@/data/statusData';
import { UserAvatar } from '@/components/chat/UserAvatar';
import { StatusViewer } from './StatusViewer';
import { Plus, Camera, PenLine } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';

export function StatusPage() {
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const [statuses, setStatuses] = useState(statusData);

  const myStatus = statuses[0];
  const unseenStatuses = statuses.filter((s, i) => i > 0 && !s.seen);
  const seenStatuses = statuses.filter((s, i) => i > 0 && s.seen);

  const openStatus = (index: number) => {
    setViewingIndex(index);
    setStatuses((prev) =>
      prev.map((s, i) => (i === index ? { ...s, seen: true } : s))
    );
  };

  return (
    <div className="flex flex-col h-full bg-background bg-noise">
      <div className="p-5 border-b border-border/30">
        <h1 className="text-xl font-bold text-gradient">Stories</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* My status */}
        <div className="p-4">
          <button className="flex items-center gap-3 w-full text-left group">
            <div className="relative">
              <UserAvatar name="Você" size="lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-brand rounded-lg flex items-center justify-center border-2 border-background glow-sm">
                <Plus className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
            <div>
              <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">Meu status</p>
              <p className="text-xs text-muted-foreground">
                {myStatus.items.length > 0
                  ? `${myStatus.items.length} atualização(ões)`
                  : 'Toque para adicionar'}
              </p>
            </div>
          </button>
        </div>

        {/* Unseen */}
        {unseenStatuses.length > 0 && (
          <div>
            <p className="px-5 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Recentes
            </p>
            {unseenStatuses.map((status) => {
              const globalIndex = statuses.findIndex((s) => s.id === status.id);
              return (
                <motion.button
                  key={status.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => openStatus(globalIndex)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/30 transition-all text-left rounded-2xl mx-1"
                >
                  <div className="relative">
                    <div className="rounded-2xl p-[2px] bg-gradient-brand glow-sm">
                      <div className="rounded-[14px] p-[2px] bg-background">
                        <UserAvatar name={status.userName} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{status.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(status.items[status.items.length - 1].timestamp, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Seen */}
        {seenStatuses.length > 0 && (
          <div>
            <p className="px-5 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Visualizados
            </p>
            {seenStatuses.map((status) => {
              const globalIndex = statuses.findIndex((s) => s.id === status.id);
              return (
                <button
                  key={status.id}
                  onClick={() => openStatus(globalIndex)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/30 transition-all text-left rounded-2xl mx-1"
                >
                  <div className="rounded-2xl p-[2px] border-2 border-muted/50">
                    <UserAvatar name={status.userName} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{status.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(status.items[status.items.length - 1].timestamp, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-3">
        <button className="w-11 h-11 rounded-2xl glass glass-border flex items-center justify-center shadow-lg hover:brightness-110 transition-all">
          <PenLine className="w-5 h-5 text-foreground" />
        </button>
        <button className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-lg hover:brightness-110 transition-all glow-lg">
          <Camera className="w-6 h-6 text-primary-foreground" />
        </button>
      </div>

      {/* Viewer overlay */}
      <AnimatePresence>
        {viewingIndex !== null && statuses[viewingIndex]?.items.length > 0 && (
          <StatusViewer
            status={statuses[viewingIndex]}
            onClose={() => setViewingIndex(null)}
            onNext={() => {
              const nextUnseen = statuses.findIndex((s, i) => i > viewingIndex && s.items.length > 0);
              if (nextUnseen > 0) {
                openStatus(nextUnseen);
              } else {
                setViewingIndex(null);
              }
            }}
            onPrev={() => {
              const prevStatus = statuses.slice(1, viewingIndex).reverse().findIndex((s) => s.items.length > 0);
              if (prevStatus >= 0) {
                const actualIndex = viewingIndex - 1 - prevStatus;
                openStatus(actualIndex);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

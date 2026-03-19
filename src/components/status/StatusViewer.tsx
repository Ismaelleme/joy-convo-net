import { useState, useEffect, useCallback } from 'react';
import { Status, StatusItem } from '@/data/statusData';
import { UserAvatar } from '@/components/chat/UserAvatar';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StatusViewerProps {
  status: Status;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function StatusViewer({ status, onClose, onNext, onPrev }: StatusViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const item = status.items[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < status.items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onNext ? onNext() : onClose();
    }
  }, [currentIndex, status.items.length, onNext, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    } else {
      onPrev?.();
    }
  }, [currentIndex, onPrev]);

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + (interval / duration) * 100;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [currentIndex, goNext]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center"
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 px-3 pt-3">
        {status.items.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all duration-100"
              style={{
                width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 z-10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={status.userName} size="sm" />
          <div>
            <p className="text-sm font-semibold text-foreground">{status.userName}</p>
            <p className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-foreground hover:bg-accent rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="w-full h-full flex items-center justify-center">
        {item.type === 'image' ? (
          <img
            src={item.content}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${item.bgColor || 'from-primary to-emerald-800'} p-8`}>
            <p className="text-2xl md:text-4xl font-bold text-center leading-relaxed text-foreground">
              {item.content}
            </p>
          </div>
        )}
      </div>

      {/* Caption */}
      {item.caption && (
        <div className="absolute bottom-16 left-0 right-0 z-10 px-6">
          <p className="text-sm text-center text-foreground drop-shadow-lg bg-background/30 backdrop-blur-sm rounded-lg px-4 py-2">
            {item.caption}
          </p>
        </div>
      )}

      {/* Views */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center">
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <Eye className="w-3 h-3" />
          {item.views} visualizações
        </div>
      </div>

      {/* Navigation zones */}
      <button onClick={goPrev} className="absolute left-0 top-0 bottom-0 w-1/3 z-10" />
      <button onClick={goNext} className="absolute right-0 top-0 bottom-0 w-1/3 z-10" />
    </motion.div>
  );
}

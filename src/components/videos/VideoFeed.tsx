import { useState, useRef, useCallback } from 'react';
import { videoData, VideoPost } from '@/data/statusData';
import { UserAvatar } from '@/components/chat/UserAvatar';
import { Heart, MessageCircle, Share2, Bookmark, Music, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function VideoCard({ video, isActive }: { video: VideoPost; isActive: boolean }) {
  const [liked, setLiked] = useState(video.isLiked);
  const [likes, setLikes] = useState(video.likes);
  const [saved, setSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikes((l) => l + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikes((l) => (liked ? l - 1 : l + 1));
  };

  return (
    <div className="relative w-full h-full snap-start snap-always flex-shrink-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${video.thumbnail})` }}
        onDoubleClick={handleDoubleTap}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      {/* Double-tap heart */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <Heart className="w-24 h-24 fill-red-500 text-red-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right actions */}
      <div className="absolute right-3 bottom-32 z-10 flex flex-col items-center gap-5">
        <div className="relative">
          <UserAvatar name={video.userName} size="md" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-brand rounded-lg flex items-center justify-center border border-background">
            <Plus className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>

        <button onClick={toggleLike} className="flex flex-col items-center gap-1">
          <div className={`p-2 rounded-2xl ${liked ? 'bg-red-500/20' : 'glass glass-border'} transition-all`}>
            <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-foreground'} transition-colors`} />
          </div>
          <span className="text-[11px] font-semibold text-foreground">{formatCount(likes)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-2xl glass glass-border">
            <MessageCircle className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-[11px] font-semibold text-foreground">{formatCount(video.comments)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-2xl glass glass-border">
            <Share2 className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-[11px] font-semibold text-foreground">{formatCount(video.shares)}</span>
        </button>

        <button onClick={() => setSaved(!saved)} className="flex flex-col items-center gap-1">
          <div className={`p-2 rounded-2xl ${saved ? 'bg-amber-400/20' : 'glass glass-border'} transition-all`}>
            <Bookmark className={`w-6 h-6 ${saved ? 'fill-amber-400 text-amber-400' : 'text-foreground'} transition-colors`} />
          </div>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-6 left-3 right-16 z-10">
        <p className="font-bold text-sm text-foreground mb-1 drop-shadow-lg">@{video.userName.toLowerCase().replace(' ', '_')}</p>
        <p className="text-sm text-foreground/90 leading-relaxed mb-2 drop-shadow">{video.description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {video.tags.map((tag) => (
            <span key={tag} className="text-xs text-primary font-semibold drop-shadow">#{tag}</span>
          ))}
        </div>
        {video.music && (
          <div className="flex items-center gap-2 glass glass-border rounded-full px-3 py-1 w-fit">
            <Music className="w-3 h-3 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            <p className="text-xs text-foreground/80 truncate">{video.music}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function VideoFeed() {
  const [videos] = useState(videoData);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    setActiveIndex(index);
  }, []);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center pt-4 pb-2">
        <h1 className="text-lg font-bold text-gradient drop-shadow-lg">Explorar</h1>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-thin"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {videos.map((video, i) => (
          <div key={video.id} className="h-full w-full" style={{ minHeight: '100%' }}>
            <VideoCard video={video} isActive={i === activeIndex} />
          </div>
        ))}
      </div>
    </div>
  );
}

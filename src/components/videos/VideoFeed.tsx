import { useState, useRef, useCallback, useMemo } from 'react';
import { UserAvatar } from '@/components/chat/UserAvatar';
import { Heart, MessageCircle, Share2, Bookmark, Music, Plus, Upload, Send, X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/store/profileStore';
import { useVideoStore, type LocalVideo } from '@/store/videoStore';

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

type FeedMode = 'foryou' | 'saved' | 'liked';

interface VideoCardProps {
  video: LocalVideo;
  isActive: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onComment: (id: string, text: string) => void;
  comments: { id: string; user: string; text: string }[];
}

function VideoCard({ video, isActive, muted, onToggleMute, onComment, comments }: VideoCardProps) {
  const { toggleLike, toggleSave, incrementShare, likedIds, savedIds } = useVideoStore();
  const liked = likedIds.includes(video.id);
  const saved = savedIds.includes(video.id);
  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  const handleDoubleTap = () => {
    if (!liked) toggleLike(video.id);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleShare = async () => {
    const data = { title: 'iSync', text: video.description, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
        toast.success('Compartilhado!');
      } else {
        await navigator.clipboard.writeText(`${video.description} — @${video.userName}\n${window.location.href}`);
        toast.success('Link copiado para a área de transferência');
      }
      incrementShare(video.id);
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(`${video.description} — @${video.userName}`);
          toast.success('Link copiado');
          incrementShare(video.id);
        } catch {
          toast.error('Não foi possível compartilhar');
        }
      }
    }
  };

  const handleSave = () => {
    toggleSave(video.id);
    toast.success(saved ? 'Removido dos salvos' : 'Vídeo salvo');
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    onComment(video.id, comment.trim());
    setComment('');
  };

  return (
    <div className="relative w-full h-full snap-start snap-always flex-shrink-0">
      {video.videoUrl ? (
        <video
          src={video.videoUrl}
          poster={video.thumbnail || undefined}
          autoPlay={isActive}
          loop
          muted={muted}
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover bg-black"
          onDoubleClick={handleDoubleTap}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-black"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
          onDoubleClick={handleDoubleTap}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 pointer-events-none" />

      <AnimatePresence>
        {showHeart && (
          <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <Heart className="w-24 h-24 fill-red-500 text-red-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute toggle */}
      <button onClick={onToggleMute} className="absolute top-16 right-3 z-10 p-2 rounded-full glass glass-border">
        {muted ? <VolumeX className="w-4 h-4 text-foreground" /> : <Volume2 className="w-4 h-4 text-foreground" />}
      </button>

      {/* Right actions */}
      <div className="absolute right-3 bottom-32 z-10 flex flex-col items-center gap-5">
        <div className="relative">
          <UserAvatar name={video.userName} size="md" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-brand rounded-lg flex items-center justify-center border border-background">
            <Plus className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>

        <button onClick={() => toggleLike(video.id)} className="flex flex-col items-center gap-1">
          <div className={`p-2 rounded-2xl ${liked ? 'bg-red-500/20' : 'glass glass-border'} transition-all`}>
            <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
          </div>
          <span className="text-[11px] font-semibold text-foreground">{formatCount(video.likes)}</span>
        </button>

        <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-2xl glass glass-border">
            <MessageCircle className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-[11px] font-semibold text-foreground">{formatCount(video.comments + comments.length)}</span>
        </button>

        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-2xl glass glass-border">
            <Share2 className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-[11px] font-semibold text-foreground">{formatCount(video.shares)}</span>
        </button>

        <button onClick={handleSave} className="flex flex-col items-center gap-1">
          <div className={`p-2 rounded-2xl ${saved ? 'bg-amber-400/20' : 'glass glass-border'} transition-all`}>
            <Bookmark className={`w-6 h-6 ${saved ? 'fill-amber-400 text-amber-400' : 'text-foreground'}`} />
          </div>
          <span className="text-[11px] font-semibold text-foreground">{saved ? 'Salvo' : 'Salvar'}</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-6 left-3 right-16 z-10">
        <p className="font-bold text-sm text-foreground mb-1 drop-shadow-lg">@{video.userName.toLowerCase().replace(/\s+/g, '_')}</p>
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

      {/* Comments sheet */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28 }} className="absolute inset-x-0 bottom-0 top-1/3 z-30 glass-strong glass-border rounded-t-3xl flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-border/30">
              <p className="text-sm font-bold text-foreground">{comments.length} comentários</p>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowComments(false)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
              {comments.length === 0 && <p className="text-xs text-center text-muted-foreground py-4">Seja o primeiro a comentar</p>}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">{c.user[0]}</div>
                  <div className="flex-1"><p className="text-xs"><span className="font-semibold text-foreground">{c.user}</span> <span className="text-foreground/80">{c.text}</span></p></div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-3 border-t border-border/30">
              <input value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitComment()} placeholder="Adicione um comentário..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
              <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" disabled={!comment.trim()} onClick={submitComment}><Send className="w-4 h-4" /></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function VideoFeed() {
  const { videos, likedIds, savedIds, addVideo } = useVideoStore();
  const [mode, setMode] = useState<FeedMode>('foryou');
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [commentsByVideo, setCommentsByVideo] = useState<Record<string, { id: string; user: string; text: string }[]>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const me = useProfileStore((s) => s.profile);

  const filtered = useMemo(() => {
    if (mode === 'saved') return videos.filter((v) => savedIds.includes(v.id));
    if (mode === 'liked') return videos.filter((v) => likedIds.includes(v.id));
    return videos;
  }, [videos, mode, likedIds, savedIds]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    setActiveIndex(Math.round(scrollTop / clientHeight));
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) return toast.error('Vídeo muito grande (máx 50MB)');
    const url = URL.createObjectURL(f);
    addVideo({
      id: 'v_' + Date.now(),
      userId: 'me',
      userName: me.name || 'Você',
      thumbnail: '',
      videoUrl: url,
      description: 'Meu novo vídeo 🎬',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      tags: ['novo'],
      timestamp: new Date(),
    });
    setMode('foryou');
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success('Vídeo publicado!');
  };

  const addComment = (id: string, text: string) => {
    setCommentsByVideo((s) => ({
      ...s,
      [id]: [...(s[id] ?? []), { id: 'c_' + Date.now(), user: me.name || 'Você', text }],
    }));
  };

  const tabs: { key: FeedMode; label: string; count?: number }[] = [
    { key: 'foryou', label: 'Para você' },
    { key: 'saved', label: 'Salvos', count: savedIds.length },
    { key: 'liked', label: 'Curtidos', count: likedIds.length },
  ];

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="absolute top-0 left-0 right-0 z-20 px-3 pt-3 pb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 glass glass-border rounded-full p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setMode(t.key); setActiveIndex(0); containerRef.current?.scrollTo({ top: 0 }); }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                mode === t.key ? 'bg-gradient-brand text-primary-foreground glow-xs' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              {t.label}{typeof t.count === 'number' ? ` · ${t.count}` : ''}
            </button>
          ))}
        </div>
        <input ref={fileRef} type="file" accept="video/*" hidden onChange={handleUpload} />
        <Button size="sm" className="rounded-xl gap-1.5 bg-gradient-brand border-0 glow-xs" onClick={() => fileRef.current?.click()}>
          <Upload className="w-4 h-4" /> Postar
        </Button>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-thin"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {filtered.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-center px-8 gap-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-brand flex items-center justify-center glow-xs">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <p className="text-base font-bold text-foreground">
              {mode === 'saved' ? 'Nenhum vídeo salvo ainda' : mode === 'liked' ? 'Nenhum vídeo curtido' : 'Sem vídeos'}
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              {mode === 'saved'
                ? 'Toque no marcador em qualquer vídeo para guardar aqui.'
                : mode === 'liked'
                ? 'Os vídeos que você curtir aparecem nesta aba.'
                : 'Volte mais tarde para descobrir novos conteúdos.'}
            </p>
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setMode('foryou')}>
              Explorar vídeos
            </Button>
          </div>
        ) : (
          filtered.map((video, i) => (
            <div key={video.id} className="h-full w-full" style={{ minHeight: '100%' }}>
              <VideoCard
                video={video}
                isActive={i === activeIndex}
                muted={muted}
                onToggleMute={() => setMuted((m) => !m)}
                comments={commentsByVideo[video.id] ?? []}
                onComment={addComment}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

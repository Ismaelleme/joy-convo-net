import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Image as ImageIcon, Smile, MapPin, TrendingUp, Flame, X, Link2, EyeOff, Flag, Trash2, Plus, Camera, Type as TypeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFeedStore } from '@/store/feedStore';
import { useProfileStore } from '@/store/profileStore';
import { useStoryStore } from '@/store/storyStore';
import { StatusViewer } from '@/components/status/StatusViewer';
import { UserAvatar } from '@/components/chat/UserAvatar';
import { toast } from 'sonner';
import type { FeedPost } from '@/data/feedData';

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const PostCard = ({ post, index }: { post: FeedPost; index: number }) => {
  const { toggleLike, toggleSave, sharePost, addComment, removePost, hidePost } = useFeedStore();
  const me = useProfileStore((s) => s.profile);
  const [showComments, setShowComments] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [comment, setComment] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  const handleDoubleTap = () => {
    if (!post.liked) toggleLike(post.id);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    addComment(post.id, me.name || 'Você', comment.trim());
    setComment('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4">
        <UserAvatar user={{ id: post.userId, name: post.userName, avatar: post.userAvatar, status: 'online' as const }} size="sm" showStatus />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-foreground">{post.userName}</p>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <p className="text-[11px] text-muted-foreground">{timeAgo(post.timestamp)}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => { toggleSave(post.id); toast.success(post.saved ? 'Removido dos salvos' : 'Post salvo'); }}>
              <Bookmark className="w-4 h-4 mr-2" /> {post.saved ? 'Remover dos salvos' : 'Salvar post'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => { await navigator.clipboard.writeText(`${post.content}\n— ${post.userName} no iSync`); toast.success('Link copiado'); }}>
              <Link2 className="w-4 h-4 mr-2" /> Copiar link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { sharePost(post.id); }}>
              <Share2 className="w-4 h-4 mr-2" /> Compartilhar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {post.userId === 'me' ? (
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { removePost(post.id); toast.success('Post excluído'); }}>
                <Trash2 className="w-4 h-4 mr-2" /> Excluir post
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onClick={() => { hidePost(post.id); toast.success('Post ocultado'); }}>
                  <EyeOff className="w-4 h-4 mr-2" /> Ocultar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => toast.success('Denúncia enviada')}>
                  <Flag className="w-4 h-4 mr-2" /> Denunciar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {post.content && (
        <p className="px-4 pb-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
      )}

      {post.images.length > 0 && (
        <div className="relative" onDoubleClick={handleDoubleTap}>
          <img src={post.images[imageIndex]} alt="" className="w-full aspect-[4/3] object-cover" />
          <AnimatePresence>
            {showHeart && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              >
                <Heart className="w-20 h-20 fill-destructive text-destructive drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
          {post.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === imageIndex ? 'bg-primary w-5' : 'bg-primary-foreground/50 w-1.5'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <motion.button whileTap={{ scale: 1.3 }} onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 group">
            <Heart className={`w-5 h-5 transition-all ${post.liked ? 'text-destructive fill-destructive scale-110' : 'text-muted-foreground group-hover:text-foreground'}`} />
            <span className={`text-xs font-medium ${post.liked ? 'text-destructive' : 'text-muted-foreground'}`}>{post.likes}</span>
          </motion.button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 group">
            <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-xs text-muted-foreground font-medium">{post.comments.length}</span>
          </button>
          <button onClick={() => sharePost(post.id).then(() => toast.success('Post compartilhado'))} className="flex items-center gap-1.5 group">
            <Share2 className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-xs text-muted-foreground font-medium">{post.shares}</span>
          </button>
        </div>
        <motion.button whileTap={{ scale: 1.2 }} onClick={() => toggleSave(post.id)}>
          <Bookmark className={`w-5 h-5 transition-all ${post.saved ? 'text-primary fill-primary' : 'text-muted-foreground hover:text-foreground'}`} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/30 overflow-hidden"
          >
            <div className="p-4 space-y-3 max-h-48 overflow-y-auto scrollbar-thin">
              {post.comments.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">Seja o primeiro a comentar</p>
              )}
              {post.comments.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                    {c.userName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs leading-relaxed">
                      <span className="font-semibold text-foreground">{c.userName}</span>{' '}
                      <span className="text-foreground/80">{c.content}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-muted-foreground">{timeAgo(c.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border/30">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                placeholder="Adicione um comentário..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" disabled={!comment.trim()} onClick={submitComment}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CreatePost = () => {
  const { addPost } = useFeedStore();
  const me = useProfileStore((s) => s.profile);
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return toast.error('Imagem muito grande (máx 10MB)');
    const r = new FileReader();
    r.onload = () => setPendingImage(String(r.result));
    r.readAsDataURL(f);
  };

  const handlePublish = () => {
    if (!content.trim() && !pendingImage) return;
    addPost({
      userName: me.name || 'Você',
      userAvatar: me.avatar,
      content: content.trim(),
      images: pendingImage ? [pendingImage] : [],
    });
    setContent('');
    setPendingImage(null);
    setFocused(false);
    toast.success('Publicado no feed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-4 transition-all duration-300 ${focused ? 'glass-border-bright glow-xs' : 'glass-border'}`}
    >
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
      <div className="flex items-start gap-3">
        {me.avatar ? (
          <img src={me.avatar} alt="" className="w-10 h-10 rounded-2xl object-cover glow-xs" />
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-sm glow-xs">
            {(me.name || 'V')[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="O que você está pensando?"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none min-h-[50px]"
            rows={2}
          />
          {pendingImage && (
            <div className="relative mt-2 rounded-xl overflow-hidden">
              <img src={pendingImage} alt="" className="w-full max-h-64 object-cover" />
              <button
                onClick={() => setPendingImage(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <AnimatePresence>
            {(focused || content || pendingImage) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex items-center justify-between mt-2 pt-2 border-t border-border/30"
              >
                <div className="flex items-center gap-1">
                  <button onClick={() => fileRef.current?.click()} className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                    <ImageIcon className="w-5 h-5 text-primary" />
                  </button>
                  <button onClick={() => setContent((c) => c + ' 😀')} className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                    <Smile className="w-5 h-5 text-primary" />
                  </button>
                  <button onClick={() => toast.info('Localização em breve')} className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </button>
                </div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button size="sm" disabled={!content.trim() && !pendingImage} className="rounded-xl" onClick={handlePublish}>
                    Publicar
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const STORY_BG_OPTIONS = [
  'from-violet-600 to-fuchsia-700',
  'from-emerald-600 to-teal-800',
  'from-rose-500 to-orange-600',
  'from-sky-600 to-indigo-800',
];

const StoriesBar = () => {
  const stories = useStoryStore((s) => s.stories);
  const addMyStory = useStoryStore((s) => s.addMyStory);
  const markSeen = useStoryStore((s) => s.markSeen);
  const me = useProfileStore((s) => s.profile);
  const fileRef = useRef<HTMLInputElement>(null);
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [storyBg, setStoryBg] = useState(STORY_BG_OPTIONS[0]);

  const myStory = stories.find((x) => x.userId === 'me');
  const others = stories.filter((x) => x.userId !== 'me');
  const ordered = myStory ? [myStory, ...others] : others;

  const openViewer = (storyId: string) => {
    const story = ordered.find((x) => x.id === storyId);
    if (!story) return;
    if (story.userId === 'me' && story.items.length === 0) {
      setComposerOpen(true);
      return;
    }
    setViewerIdx(ordered.findIndex((x) => x.id === storyId));
    markSeen(storyId);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return toast.error('Imagem muito grande (máx 10MB)');
    const reader = new FileReader();
    reader.onload = () => {
      addMyStory({ type: 'image', content: String(reader.result), caption: '' });
      toast.success('Story publicado!');
      setComposerOpen(false);
    };
    reader.readAsDataURL(f);
  };

  const publishText = () => {
    if (!storyText.trim()) return;
    addMyStory({ type: 'text', content: storyText.trim(), bgColor: storyBg });
    setStoryText('');
    setComposerOpen(false);
    toast.success('Story publicado!');
  };

  const active = viewerIdx !== null ? ordered[viewerIdx] : null;

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 overflow-x-auto scrollbar-thin pb-1">
        {ordered.map((s, i) => {
          const isMe = s.userId === 'me';
          const hasNew = !s.seen && s.items.length > 0;
          const firstImage = s.items.find((it) => it.type === 'image')?.content;
          return (
            <motion.button
              key={s.id}
              onClick={() => openViewer(s.id)}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <div className={`relative rounded-2xl p-[2px] ${hasNew ? 'bg-gradient-brand glow-xs' : 'bg-border/50'}`}>
                <div className="rounded-[14px] p-[2px] bg-background">
                  <div className="w-14 h-14 rounded-xl bg-secondary overflow-hidden flex items-center justify-center text-sm font-bold text-muted-foreground">
                    {firstImage ? (
                      <img src={firstImage} alt="" className="w-full h-full object-cover" />
                    ) : isMe && me.avatar ? (
                      <img src={me.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{(isMe ? me.name || 'V' : s.userName)[0].toUpperCase()}</span>
                    )}
                  </div>
                </div>
                {isMe && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setComposerOpen(true); }}
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-brand rounded-lg flex items-center justify-center border-2 border-background"
                  >
                    <Plus className="w-3 h-3 text-primary-foreground" />
                  </button>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium max-w-[64px] truncate">{isMe ? 'Você' : s.userName.split(' ')[0]}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {active && (
          <StatusViewer
            status={active}
            onClose={() => setViewerIdx(null)}
            onNext={() => setViewerIdx((i) => (i !== null && i < ordered.length - 1 ? i + 1 : null))}
            onPrev={() => setViewerIdx((i) => (i !== null && i > 0 ? i - 1 : i))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {composerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setComposerOpen(false)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass-strong glass-border rounded-3xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Novo Story</h3>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setComposerOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <button
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-3 p-3 rounded-2xl glass glass-border hover:glow-xs transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Enviar foto</p>
                  <p className="text-[11px] text-muted-foreground">Da galeria (máx 10MB)</p>
                </div>
              </button>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TypeIcon className="w-3.5 h-3.5" /> Story de texto
                </div>
                <div className={`rounded-2xl p-4 bg-gradient-to-br ${storyBg} min-h-[120px] flex items-center justify-center`}>
                  <textarea
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    placeholder="Escreva algo..."
                    className="w-full bg-transparent text-center font-bold text-lg text-foreground placeholder:text-foreground/60 outline-none resize-none"
                    rows={3}
                    maxLength={140}
                  />
                </div>
                <div className="flex gap-2">
                  {STORY_BG_OPTIONS.map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setStoryBg(bg)}
                      className={`flex-1 h-8 rounded-lg bg-gradient-to-br ${bg} ${storyBg === bg ? 'ring-2 ring-primary' : ''}`}
                    />
                  ))}
                </div>
                <Button className="w-full rounded-xl" disabled={!storyText.trim()} onClick={publishText}>
                  Publicar story
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export function FeedPage() {
  const posts = useFeedStore((s) => s.posts);
  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Feed</h1>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary" /> {posts.length} posts
            </p>
          </div>
          <Badge variant="destructive" className="gap-1">
            <Flame className="w-3 h-3" /> Em alta
          </Badge>
        </motion.div>

        <StoriesBar />
        <CreatePost />

        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}

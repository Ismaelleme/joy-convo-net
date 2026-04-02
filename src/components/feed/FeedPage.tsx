import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Image as ImageIcon, Smile, MapPin, TrendingUp, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { feedPosts, type FeedPost } from '@/data/feedData';
import { UserAvatar } from '@/components/chat/UserAvatar';

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const PostCard = ({ post, index }: { post: FeedPost; index: number }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved);
  const [showComments, setShowComments] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [comment, setComment] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikes(l => l + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <UserAvatar user={{ id: post.userId, name: post.userName, avatar: post.userAvatar, status: 'online' as const }} size="sm" showStatus />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-foreground">{post.userName}</p>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <p className="text-[11px] text-muted-foreground">{timeAgo(post.timestamp)}</p>
          </div>
          {post.type === 'photo' && (
            <p className="text-[10px] text-primary/70 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" /> São Paulo, BR
            </p>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.content}</p>
      )}

      {/* Images */}
      {post.images.length > 0 && (
        <div className="relative" onDoubleClick={handleDoubleTap}>
          <img
            src={post.images[imageIndex]}
            alt=""
            className="w-full aspect-[4/3] object-cover"
          />
          {/* Double tap heart */}
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

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 1.3 }}
            onClick={handleLike}
            className="flex items-center gap-1.5 group"
          >
            <Heart className={`w-5 h-5 transition-all ${liked ? 'text-destructive fill-destructive scale-110' : 'text-muted-foreground group-hover:text-foreground'}`} />
            <span className={`text-xs font-medium ${liked ? 'text-destructive' : 'text-muted-foreground'}`}>{likes}</span>
          </motion.button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 group">
            <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-xs text-muted-foreground font-medium">{post.comments.length}</span>
          </button>
          <button className="flex items-center gap-1.5 group">
            <Share2 className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-xs text-muted-foreground font-medium">{post.shares}</span>
          </button>
        </div>
        <motion.button whileTap={{ scale: 1.2 }} onClick={() => setSaved(!saved)}>
          <Bookmark className={`w-5 h-5 transition-all ${saved ? 'text-primary fill-primary' : 'text-muted-foreground hover:text-foreground'}`} />
        </motion.button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/30 overflow-hidden"
          >
            <div className="p-4 space-y-3 max-h-48 overflow-y-auto scrollbar-thin">
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
                      <button className="text-[10px] text-muted-foreground hover:text-primary font-medium transition-colors">Curtir</button>
                      <button className="text-[10px] text-muted-foreground hover:text-primary font-medium transition-colors">Responder</button>
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
                placeholder="Adicione um comentário..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" disabled={!comment.trim()}>
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
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-4 transition-all duration-300 ${focused ? 'glass-border-bright glow-xs' : 'glass-border'}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-sm glow-xs">V</div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="O que você está pensando?"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none min-h-[50px]"
            rows={2}
          />
          <AnimatePresence>
            {(focused || content) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex items-center justify-between mt-2 pt-2 border-t border-border/30"
              >
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                    <ImageIcon className="w-5 h-5 text-primary" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                    <Smile className="w-5 h-5 text-primary" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </button>
                </div>
                <motion.div whileTap={{ scale: 0.95 }}>
                <Button size="sm" disabled={!content.trim()} className="rounded-xl">
                  Publicar
                </Button>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Stories bar
const StoriesBar = () => {
  const stories = [
    { name: 'Você', hasNew: false, isMe: true },
    { name: 'Ana', hasNew: true },
    { name: 'Carlos', hasNew: true },
    { name: 'Marina', hasNew: true },
    { name: 'Pedro', hasNew: false },
    { name: 'Julia', hasNew: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 overflow-x-auto scrollbar-thin pb-1"
    >
      {stories.map((s, i) => (
        <motion.button
          key={s.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="flex flex-col items-center gap-1.5 flex-shrink-0"
        >
          <div className={`relative rounded-2xl p-[2px] ${s.hasNew ? 'bg-gradient-brand glow-xs' : 'bg-border/50'}`}>
            <div className="rounded-[14px] p-[2px] bg-background">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground">
                {s.name[0]}
              </div>
            </div>
            {s.isMe && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-brand rounded-lg flex items-center justify-center border-2 border-background">
                <span className="text-primary-foreground text-[10px] font-bold">+</span>
              </div>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{s.name}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export function FeedPage() {
  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-bold text-foreground">Feed</h1>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary" /> 5 novos posts
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-xl bg-destructive/15 text-destructive text-[10px] font-bold flex items-center gap-1">
              <Flame className="w-3 h-3" /> Em alta
            </span>
          </div>
        </motion.div>

        <StoriesBar />
        <CreatePost />

        {feedPosts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}

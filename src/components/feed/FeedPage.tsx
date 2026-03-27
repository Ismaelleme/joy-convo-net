import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Image as ImageIcon } from 'lucide-react';
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

const PostCard = ({ post }: { post: FeedPost }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glass-border rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <UserAvatar user={{ id: post.userId, name: post.userName, avatar: post.userAvatar, status: 'online' as const }} size="sm" showStatus />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{post.userName}</p>
          <p className="text-[10px] text-muted-foreground">{timeAgo(post.timestamp)}</p>
        </div>
        <button className="p-1.5 rounded-xl hover:bg-muted/50 transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.content}</p>
      )}

      {/* Images */}
      {post.images.length > 0 && (
        <div className="relative">
          <img
            src={post.images[imageIndex]}
            alt=""
            className="w-full aspect-[4/3] object-cover"
            onDoubleClick={handleLike}
          />
          {post.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === imageIndex ? 'bg-primary w-4' : 'bg-white/50'}`}
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
            className="flex items-center gap-1.5"
          >
            <Heart className={`w-5 h-5 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">{likes}</span>
          </motion.button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{post.comments.length}</span>
          </button>
          <button className="flex items-center gap-1.5">
            <Share2 className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{post.shares}</span>
          </button>
        </div>
        <motion.button whileTap={{ scale: 1.2 }} onClick={() => setSaved(!saved)}>
          <Bookmark className={`w-5 h-5 transition-colors ${saved ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
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
                <div key={c.id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                    {c.userName[0]}
                  </div>
                  <div>
                    <p className="text-xs">
                      <span className="font-semibold text-foreground">{c.userName}</span>{' '}
                      <span className="text-muted-foreground">{c.content}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{timeAgo(c.timestamp)}</span>
                      <button className="text-[10px] text-muted-foreground hover:text-foreground">Curtir</button>
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
              <button className="text-primary text-sm font-semibold disabled:opacity-40" disabled={!comment.trim()}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Create Post Box
const CreatePost = () => {
  const [content, setContent] = useState('');

  return (
    <div className="glass glass-border rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">V</div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que você está pensando?"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none min-h-[60px]"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
                <ImageIcon className="w-5 h-5 text-primary" />
              </button>
            </div>
            <button className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40" disabled={!content.trim()}>
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function FeedPage() {
  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Feed</h1>
        </div>

        <CreatePost />

        {feedPosts.map((post, i) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

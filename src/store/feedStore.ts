import { create } from 'zustand';
import { feedPosts as seed, type FeedPost, type FeedComment } from '@/data/feedData';

interface FeedState {
  posts: FeedPost[];
  addPost: (input: { userName: string; userAvatar?: string; content: string; images?: string[] }) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  sharePost: (id: string) => Promise<void>;
  addComment: (id: string, userName: string, content: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: seed,
  addPost: ({ userName, userAvatar = '', content, images = [] }) => {
    const post: FeedPost = {
      id: 'p_' + Date.now(),
      userId: 'me',
      userName,
      userAvatar,
      content,
      images,
      likes: 0,
      comments: [],
      shares: 0,
      liked: false,
      saved: false,
      timestamp: new Date(),
      type: images.length ? 'photo' : 'text',
    };
    set((s) => ({ posts: [post, ...s.posts] }));
  },
  toggleLike: (id) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
      ),
    })),
  toggleSave: (id) =>
    set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)) })),
  sharePost: async (id) => {
    const p = get().posts.find((x) => x.id === id);
    if (!p) return;
    const shareData = { title: 'iSync', text: p.content, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(`${p.content}\n— ${p.userName} no iSync`);
    } catch {
      /* user cancelled */
    }
    set((s) => ({ posts: s.posts.map((x) => (x.id === id ? { ...x, shares: x.shares + 1 } : x)) }));
  },
  addComment: (id, userName, content) => {
    const c: FeedComment = {
      id: 'c_' + Date.now(),
      userId: 'me',
      userName,
      content,
      timestamp: new Date(),
      likes: 0,
    };
    set((s) => ({
      posts: s.posts.map((p) => (p.id === id ? { ...p, comments: [...p.comments, c] } : p)),
    }));
  },
}));

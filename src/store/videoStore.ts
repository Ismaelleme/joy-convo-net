import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { videoData, type VideoPost } from '@/data/statusData';

export interface LocalVideo extends VideoPost {
  videoUrl?: string;
}

// Free CDN sample videos so the feed actually plays content out of the box
const SAMPLE_URLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
];

const seeded: LocalVideo[] = videoData.map((v, i) => ({
  ...v,
  videoUrl: SAMPLE_URLS[i % SAMPLE_URLS.length],
}));

interface VideoState {
  videos: LocalVideo[];
  likedIds: string[];
  savedIds: string[];
  addVideo: (v: LocalVideo) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  incrementShare: (id: string) => void;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set) => ({
      videos: seeded,
      likedIds: [],
      savedIds: [],
      addVideo: (v) => set((s) => ({ videos: [v, ...s.videos] })),
      toggleLike: (id) =>
        set((s) => {
          const liked = s.likedIds.includes(id);
          return {
            likedIds: liked ? s.likedIds.filter((x) => x !== id) : [...s.likedIds, id],
            videos: s.videos.map((v) =>
              v.id === id ? { ...v, isLiked: !liked, likes: v.likes + (liked ? -1 : 1) } : v,
            ),
          };
        }),
      toggleSave: (id) =>
        set((s) => ({
          savedIds: s.savedIds.includes(id) ? s.savedIds.filter((x) => x !== id) : [...s.savedIds, id],
        })),
      incrementShare: (id) =>
        set((s) => ({ videos: s.videos.map((v) => (v.id === id ? { ...v, shares: v.shares + 1 } : v)) })),
    }),
    {
      name: 'isync-videos',
      partialize: (s) => ({ likedIds: s.likedIds, savedIds: s.savedIds }),
    },
  ),
);

import { create } from 'zustand';
import { statusData, type Status, type StatusItem } from '@/data/statusData';
import { useProfileStore } from '@/store/profileStore';

interface StoryState {
  stories: Status[];
  addMyStory: (item: Omit<StatusItem, 'id' | 'timestamp' | 'views'>) => void;
  markSeen: (storyId: string) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  stories: statusData,
  addMyStory: (item) =>
    set((s) => {
      const profile = useProfileStore.getState().profile;
      const newItem: StatusItem = {
        ...item,
        id: 'si_' + Date.now(),
        timestamp: new Date(),
        views: 0,
      };
      const stories = [...s.stories];
      const meIdx = stories.findIndex((x) => x.userId === 'me');
      if (meIdx >= 0) {
        stories[meIdx] = {
          ...stories[meIdx],
          userName: profile.name || 'Meu status',
          items: [...stories[meIdx].items, newItem],
          seen: false,
        };
      } else {
        stories.unshift({
          id: 'my-status',
          userId: 'me',
          userName: profile.name || 'Meu status',
          items: [newItem],
          seen: false,
        });
      }
      return { stories };
    }),
  markSeen: (storyId) =>
    set((s) => ({ stories: s.stories.map((x) => (x.id === storyId ? { ...x, seen: true } : x)) })),
}));

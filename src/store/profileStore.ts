import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  email: string;
  phone: string;
  avatar: string; // dataURL or http url
}

interface ProfileState {
  profile: UserProfile;
  setProfile: (patch: Partial<UserProfile>) => void;
  setAvatarFromFile: (file: File) => Promise<void>;
}

const DEFAULT: UserProfile = {
  id: 'me',
  name: 'Você',
  bio: 'Olá! Estou usando o iSync 🚀',
  email: '',
  phone: '',
  avatar: '',
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT,
      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      setAvatarFromFile: async (file) => {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.onerror = reject;
          r.readAsDataURL(file);
        });
        set((s) => ({ profile: { ...s.profile, avatar: dataUrl } }));
      },
    }),
    { name: 'isync_profile' },
  ),
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Convert HEX to HSL string (e.g. "263 70% 58%")
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Derive a full palette from primary + accent hex colors
function buildPalette(primary: string, accent: string) {
  const pHsl = hexToHsl(primary);
  const aHsl = hexToHsl(accent);
  // Extract hue from primary for bg tones
  const pH = parseInt(pHsl.split(' ')[0]);

  return {
    '--primary': pHsl,
    '--ring': pHsl,
    '--typing': pHsl,
    '--sidebar-primary': pHsl,
    '--sidebar-ring': pHsl,
    '--glow-primary': pHsl,
    '--gradient-start': pHsl,
    '--glow-accent': aHsl,
    '--gradient-end': aHsl,
    // Derived backgrounds using primary hue
    '--background': `${pH} 30% 5%`,
    '--foreground': `${pH} 10% 95%`,
    '--card': `${pH} 25% 8%`,
    '--card-foreground': `${pH} 10% 95%`,
    '--popover': `${pH} 28% 10%`,
    '--popover-foreground': `${pH} 10% 95%`,
    '--secondary': `${pH} 20% 12%`,
    '--secondary-foreground': `${pH} 10% 72%`,
    '--muted': `${pH} 16% 15%`,
    '--muted-foreground': `${pH} 10% 50%`,
    '--accent': `${pH} 22% 16%`,
    '--accent-foreground': `${pH} 15% 88%`,
    '--border': `${pH} 16% 13%`,
    '--input': `${pH} 18% 11%`,
    '--chat-outgoing': `${pH} 40% 14%`,
    '--chat-incoming': `${pH} 20% 9%`,
    '--chat-bg': `${pH} 30% 3%`,
    '--chat-hover': `${pH} 18% 12%`,
    '--chat-active': `${pH} 28% 14%`,
    '--sidebar-background': `${pH} 25% 6%`,
    '--sidebar-foreground': `${pH} 10% 95%`,
    '--sidebar-accent': `${pH} 18% 12%`,
    '--sidebar-accent-foreground': `${pH} 10% 72%`,
    '--sidebar-border': `${pH} 16% 11%`,
    '--glass': `${pH} 25% 8% / 0.6`,
    '--glass-strong': `${pH} 25% 6% / 0.88`,
  };
}

export interface ThemeState {
  primaryColor: string;
  accentColor: string;
  setPrimaryColor: (c: string) => void;
  setAccentColor: (c: string) => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      primaryColor: '#8B5CF6',
      accentColor: '#D946EF',
      setPrimaryColor: (c) => set({ primaryColor: c }),
      setAccentColor: (c) => set({ accentColor: c }),
      applyTheme: () => {
        const { primaryColor, accentColor } = get();
        const palette = buildPalette(primaryColor, accentColor);
        const root = document.documentElement;
        Object.entries(palette).forEach(([key, value]) => {
          root.style.setProperty(key, value);
        });
      },
    }),
    { name: 'isync-theme' }
  )
);

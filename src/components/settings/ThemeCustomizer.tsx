import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette, Sparkles, RotateCcw, Eye, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useThemeStore } from '@/store/themeStore';
import { toast } from 'sonner';

const presetPalettes = [
  { name: 'Violeta & Magenta', primary: '#8B5CF6', accent: '#D946EF' },
  { name: 'Azul & Ciano', primary: '#3B82F6', accent: '#06B6D4' },
  { name: 'Índigo & Violeta', primary: '#6366F1', accent: '#8B5CF6' },
  { name: 'Esmeralda & Teal', primary: '#10B981', accent: '#14B8A6' },
  { name: 'Rosa & Laranja', primary: '#EC4899', accent: '#F97316' },
  { name: 'Âmbar & Vermelho', primary: '#F59E0B', accent: '#EF4444' },
  { name: 'Ciano & Azul', primary: '#06B6D4', accent: '#3B82F6' },
  { name: 'Roxo & Rosa', primary: '#7C3AED', accent: '#EC4899' },
  { name: 'Lima & Esmeralda', primary: '#84CC16', accent: '#10B981' },
  { name: 'Coral & Dourado', primary: '#F43F5E', accent: '#EAB308' },
];

const colorCategories = [
  {
    label: 'Roxos & Violetas',
    colors: [
      { name: 'Lavanda', value: '#A78BFA' },
      { name: 'Violeta', value: '#8B5CF6' },
      { name: 'Roxo', value: '#7C3AED' },
      { name: 'Índigo', value: '#6366F1' },
      { name: 'Fúcsia', value: '#A855F7' },
      { name: 'Uva', value: '#9333EA' },
    ],
  },
  {
    label: 'Azuis',
    colors: [
      { name: 'Sky', value: '#0EA5E9' },
      { name: 'Azul', value: '#3B82F6' },
      { name: 'Marinho', value: '#2563EB' },
      { name: 'Royal', value: '#4F46E5' },
      { name: 'Safira', value: '#1D4ED8' },
      { name: 'Cobalto', value: '#1E40AF' },
    ],
  },
  {
    label: 'Cianos & Teais',
    colors: [
      { name: 'Ciano', value: '#06B6D4' },
      { name: 'Teal', value: '#14B8A6' },
      { name: 'Turquesa', value: '#2DD4BF' },
      { name: 'Aqua', value: '#22D3EE' },
      { name: 'Menta', value: '#34D399' },
      { name: 'Oceano', value: '#0891B2' },
    ],
  },
  {
    label: 'Verdes',
    colors: [
      { name: 'Esmeralda', value: '#10B981' },
      { name: 'Verde', value: '#22C55E' },
      { name: 'Lima', value: '#84CC16' },
      { name: 'Floresta', value: '#16A34A' },
      { name: 'Jade', value: '#059669' },
      { name: 'Oliva', value: '#65A30D' },
    ],
  },
  {
    label: 'Quentes',
    colors: [
      { name: 'Âmbar', value: '#F59E0B' },
      { name: 'Laranja', value: '#F97316' },
      { name: 'Coral', value: '#FB923C' },
      { name: 'Dourado', value: '#EAB308' },
      { name: 'Tangerina', value: '#EA580C' },
      { name: 'Mel', value: '#D97706' },
    ],
  },
  {
    label: 'Rosas & Vermelhos',
    colors: [
      { name: 'Rosa', value: '#EC4899' },
      { name: 'Magenta', value: '#D946EF' },
      { name: 'Vermelho', value: '#EF4444' },
      { name: 'Cereja', value: '#F43F5E' },
      { name: 'Framboesa', value: '#E11D48' },
      { name: 'Salmão', value: '#FB7185' },
    ],
  },
];

interface ThemeCustomizerProps {
  onBack: () => void;
}

export function ThemeCustomizer({ onBack }: ThemeCustomizerProps) {
  const { primaryColor, accentColor, setPrimaryColor, setAccentColor } = useThemeStore();
  const [localPrimary, setLocalPrimary] = useState(primaryColor);
  const [localAccent, setLocalAccent] = useState(accentColor);
  const [selecting, setSelecting] = useState<'primary' | 'accent'>('primary');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleColorSelect = (color: string) => {
    if (selecting === 'primary') setLocalPrimary(color);
    else setLocalAccent(color);
  };

  const handlePreset = (primary: string, accent: string) => {
    setLocalPrimary(primary);
    setLocalAccent(accent);
  };

  const handleSave = () => {
    setPrimaryColor(localPrimary);
    setAccentColor(localAccent);
    setTimeout(() => {
      useThemeStore.getState().applyTheme();
      toast.success('Tema aplicado com sucesso! 🎨');
    }, 50);
  };

  const handleReset = () => {
    setLocalPrimary('#8B5CF6');
    setLocalAccent('#D946EF');
  };

  const toggleCategory = (label: string) => {
    setExpandedCategory(prev => prev === label ? null : label);
  };

  // Flat list of all colors for quick access
  const allColors = colorCategories.flatMap(c => c.colors);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-1">
          ← Voltar
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center glow-sm">
            <Palette className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Personalizar Cores</h2>
            <p className="text-xs text-muted-foreground">Escolha 2 cores para o seu app</p>
          </div>
        </div>

        {/* Live preview */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${localPrimary}, ${localAccent})` }}>
              <Sparkles className="w-5 h-5 text-white" />
              <div>
                <p className="text-sm font-bold text-white">Preview do Tema</p>
                <p className="text-[11px] text-white/80">Assim ficará o seu app</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="h-8 flex-1 rounded-lg flex items-center justify-center text-xs font-medium text-white" style={{ backgroundColor: localPrimary }}>
                  Primário
                </div>
                <div className="h-8 flex-1 rounded-lg flex items-center justify-center text-xs font-medium text-white" style={{ backgroundColor: localAccent }}>
                  Destaque
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: localPrimary }} />
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-2/3 rounded-full" style={{ background: `linear-gradient(90deg, ${localPrimary}, ${localAccent})` }} />
                </div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: localAccent }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color selection tabs */}
        <div className="flex gap-2">
          {(['primary', 'accent'] as const).map((type) => {
            const isActive = selecting === type;
            const color = type === 'primary' ? localPrimary : localAccent;
            return (
              <motion.button
                key={type}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelecting(type)}
                className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  isActive ? 'border-foreground/30 bg-accent' : 'border-border/50 hover:border-border'
                }`}
              >
                <div className="w-8 h-8 rounded-lg border-2 border-foreground/10" style={{ backgroundColor: color }} />
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">{type === 'primary' ? 'Cor Principal' : 'Cor Destaque'}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">{color}</p>
                </div>
                {isActive && <Eye className="w-3.5 h-3.5 text-primary ml-auto" />}
              </motion.button>
            );
          })}
        </div>

        {/* Preset palettes */}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Paletas Prontas</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {presetPalettes.map((palette) => {
              const isSelected = localPrimary === palette.primary && localAccent === palette.accent;
              return (
                <motion.button
                  key={palette.name}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePreset(palette.primary, palette.accent)}
                  className={`relative flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                    isSelected ? 'border-foreground/30 bg-accent' : 'border-border/50 hover:border-border'
                  }`}
                >
                  <div className="flex -space-x-1.5">
                    <div className="w-7 h-7 rounded-lg border-2 border-background" style={{ backgroundColor: palette.primary }} />
                    <div className="w-7 h-7 rounded-lg border-2 border-background" style={{ backgroundColor: palette.accent }} />
                  </div>
                  <span className="text-[11px] font-medium text-foreground truncate">{palette.name}</span>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="w-3.5 h-3.5 text-primary ml-auto flex-shrink-0" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quick color picker - top favorites */}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {selecting === 'primary' ? 'Escolher Cor Principal' : 'Escolher Cor Destaque'}
          </Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {allColors.slice(0, 18).map((color) => {
              const currentSelected = selecting === 'primary' ? localPrimary : localAccent;
              const isSelected = currentSelected === color.value;
              return (
                <motion.button
                  key={color.value}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleColorSelect(color.value)}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border-2 transition-all ${
                      isSelected ? 'border-foreground scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-full h-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white drop-shadow-md" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground">{color.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Categorized colors - expandable */}
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Todas as Cores por Categoria</Label>
          {colorCategories.map((cat) => {
            const isExpanded = expandedCategory === cat.label;
            return (
              <div key={cat.label} className="border border-border/50 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategory(cat.label)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-accent/50 transition-all"
                >
                  <div className="flex -space-x-1">
                    {cat.colors.slice(0, 3).map(c => (
                      <div key={c.value} className="w-4 h-4 rounded-full border border-background" style={{ backgroundColor: c.value }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-foreground flex-1 text-left">{cat.label}</span>
                  <span className="text-[10px] text-muted-foreground">{cat.colors.length}</span>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 px-3 pb-3">
                        {cat.colors.map((color) => {
                          const currentSelected = selecting === 'primary' ? localPrimary : localAccent;
                          const isSelected = currentSelected === color.value;
                          return (
                            <motion.button
                              key={color.value}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => handleColorSelect(color.value)}
                              className="flex flex-col items-center gap-1"
                            >
                              <div
                                className={`w-10 h-10 rounded-xl border-2 transition-all ${
                                  isSelected ? 'border-foreground scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                                }`}
                                style={{ backgroundColor: color.value }}
                              >
                                {isSelected && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-full h-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white drop-shadow-md" />
                                  </motion.div>
                                )}
                              </div>
                              <span className="text-[9px] text-muted-foreground">{color.name}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Custom hex input */}
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Personalizada:</Label>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="color"
                value={selecting === 'primary' ? localPrimary : localAccent}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={selecting === 'primary' ? localPrimary : localAccent}
                onChange={(e) => {
                  if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                    handleColorSelect(e.target.value);
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg bg-input border border-border text-xs font-mono text-foreground"
                placeholder="#8B5CF6"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-2 pb-6">
          <Button variant="outline" className="gap-1.5" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5" />
            Resetar
          </Button>
          <Button className="flex-1 gap-1.5" onClick={handleSave}>
            <Check className="w-4 h-4" />
            Salvar Tema
          </Button>
        </div>
      </div>
    </div>
  );
}

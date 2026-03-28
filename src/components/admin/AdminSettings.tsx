import { useState } from 'react';
import { backgroundPatterns, BackgroundPattern } from '@/data/adminData';
import { Check, Palette, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function AdminSettings() {
  const [selectedPattern, setSelectedPattern] = useState<string>('raios');
  const [accentColor, setAccentColor] = useState('#3b82f6');

  const colors = [
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Ciano', value: '#06b6d4' },
    { name: 'Violeta', value: '#8b5cf6' },
    { name: 'Indigo', value: '#4f46e5' },
  ];

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-[Space_Grotesk] text-foreground flex items-center gap-3">
          <Palette className="w-7 h-7 text-primary" />
          Configurações Visuais
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Personalize a aparência do seu site</p>
      </div>

      {/* Background Patterns */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold font-[Space_Grotesk] text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Padrão de Fundo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {backgroundPatterns.map((pattern) => {
            const isSelected = selectedPattern === pattern.id;
            return (
              <motion.button
                key={pattern.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPattern(pattern.id)}
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${
                  isSelected ? 'border-primary glow-sm' : 'border-border/50 hover:border-muted-foreground/30'
                }`}
              >
                <div
                  className="absolute inset-0 bg-background"
                  style={{ backgroundImage: pattern.preview }}
                />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </motion.div>
                )}
                <span className="absolute bottom-2 left-2 text-[10px] font-medium text-foreground/80 bg-background/60 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                  {pattern.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Accent Color */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold font-[Space_Grotesk] text-foreground">Cor de Destaque</h2>
        <div className="flex gap-3">
          {colors.map((color) => {
            const isSelected = accentColor === color.value;
            return (
              <button
                key={color.value}
                onClick={() => setAccentColor(color.value)}
                className={`flex flex-col items-center gap-1.5`}
              >
                <div
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${
                    isSelected ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-[10px] text-muted-foreground">{color.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold font-[Space_Grotesk] text-foreground">Pré-visualização</h2>
        <div
          className="relative h-48 rounded-2xl border border-border/50 overflow-hidden bg-background"
          style={{
            backgroundImage: backgroundPatterns.find(p => p.id === selectedPattern)?.preview || 'none',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass glass-border rounded-2xl px-8 py-4 text-center">
              <p className="text-sm font-semibold text-foreground">Seu site ficará assim</p>
              <p className="text-xs text-muted-foreground mt-1">Com o padrão selecionado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Save */}
      <button
        onClick={handleSave}
        className="px-6 py-3 bg-gradient-brand text-primary-foreground rounded-xl font-medium text-sm hover:brightness-110 transition-all glow-sm"
      >
        Salvar Configurações
      </button>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Lock, Palette, Moon, Globe, HelpCircle, LogOut,
  ChevronRight, Camera, Check, Shield, Eye, EyeOff, Smartphone, Clock,
  Volume2, MessageCircle, Star, Info
} from 'lucide-react';
import { UserAvatar } from '@/components/chat/UserAvatar';
import { backgroundPatterns, type BackgroundPattern } from '@/data/adminData';
import { toast } from 'sonner';

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
}

const SettingItem = ({ icon: Icon, label, description, onClick, trailing, destructive }: SettingItemProps) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-all text-left rounded-xl"
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
      destructive ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'
    }`}>
      <Icon className="w-4.5 h-4.5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium ${destructive ? 'text-destructive' : 'text-foreground'}`}>{label}</p>
      {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
    </div>
    {trailing || <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
  </button>
);

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${
      enabled ? 'bg-primary' : 'bg-muted'
    }`}
  >
    <motion.div
      animate={{ x: enabled ? 20 : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="w-5 h-5 rounded-full bg-white shadow-sm"
    />
  </button>
);

type SettingsView = 'main' | 'appearance' | 'notifications' | 'privacy' | 'profile';

export function SettingsPage() {
  const [view, setView] = useState<SettingsView>('main');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [messagePreview, setMessagePreview] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState('raios');
  const [accentColor, setAccentColor] = useState('#3b82f6');

  const colors = [
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Ciano', value: '#06b6d4' },
    { name: 'Violeta', value: '#8b5cf6' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Esmeralda', value: '#10b981' },
  ];

  if (view === 'profile') {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
          <button onClick={() => setView('main')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar
          </button>

          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-brand flex items-center justify-center text-3xl font-bold text-primary-foreground glow-lg">
                V
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-primary flex items-center justify-center border-2 border-background">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-foreground mt-4">Você</h2>
            <p className="text-sm text-muted-foreground">+55 11 98765-4321</p>
          </div>

          <div className="glass glass-border rounded-2xl p-4 space-y-4">
            <div>
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Nome</p>
              <input defaultValue="Você" className="w-full bg-transparent text-sm text-foreground outline-none mt-1 border-b border-border/30 pb-2 focus:border-primary/50 transition-colors" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Bio</p>
              <input defaultValue="Olá! Estou usando o iSync 🚀" className="w-full bg-transparent text-sm text-foreground outline-none mt-1 border-b border-border/30 pb-2 focus:border-primary/50 transition-colors" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Email</p>
              <input defaultValue="voce@email.com" className="w-full bg-transparent text-sm text-foreground outline-none mt-1 border-b border-border/30 pb-2 focus:border-primary/50 transition-colors" />
            </div>
          </div>

          <button
            onClick={() => { toast.success('Perfil atualizado!'); setView('main'); }}
            className="w-full py-3 bg-gradient-brand text-primary-foreground rounded-xl font-medium text-sm hover:brightness-110 transition-all glow-sm"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    );
  }

  if (view === 'appearance') {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
          <button onClick={() => setView('main')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar
          </button>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Aparência
          </h2>

          {/* Theme */}
          <div className="glass glass-border rounded-2xl overflow-hidden">
            <SettingItem icon={Moon} label="Modo Escuro" description="Tema escuro ativado" trailing={<Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />} />
          </div>

          {/* Patterns */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Padrão de Fundo</p>
            <div className="grid grid-cols-3 gap-2">
              {backgroundPatterns.map((pattern) => {
                const isSelected = selectedPattern === pattern.id;
                return (
                  <motion.button
                    key={pattern.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPattern(pattern.id)}
                    className={`relative aspect-[3/2] rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected ? 'border-primary glow-sm' : 'border-border/50 hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="absolute inset-0 bg-background" style={{ backgroundImage: pattern.preview }} />
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </motion.div>
                    )}
                    <span className="absolute bottom-1 left-1 text-[9px] font-medium text-foreground/80 bg-background/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                      {pattern.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Cor de Destaque</p>
            <div className="flex gap-3">
              {colors.map((color) => {
                const isSelected = accentColor === color.value;
                return (
                  <button key={color.value} onClick={() => setAccentColor(color.value)} className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-xl border-2 transition-all ${
                      isSelected ? 'border-foreground scale-110 glow-sm' : 'border-transparent hover:scale-105'
                    }`} style={{ backgroundColor: color.value }} />
                    <span className="text-[9px] text-muted-foreground">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => { toast.success('Aparência atualizada!'); setView('main'); }}
            className="w-full py-3 bg-gradient-brand text-primary-foreground rounded-xl font-medium text-sm hover:brightness-110 transition-all glow-sm"
          >
            Aplicar
          </button>
        </div>
      </div>
    );
  }

  if (view === 'notifications') {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          <button onClick={() => setView('main')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar
          </button>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notificações
          </h2>
          <div className="glass glass-border rounded-2xl overflow-hidden">
            <SettingItem icon={Bell} label="Notificações" description="Receber notificações push" trailing={<Toggle enabled={notifications} onChange={() => setNotifications(!notifications)} />} />
            <SettingItem icon={MessageCircle} label="Pré-visualização" description="Mostrar conteúdo da mensagem" trailing={<Toggle enabled={messagePreview} onChange={() => setMessagePreview(!messagePreview)} />} />
            <SettingItem icon={Volume2} label="Sons" description="Reproduzir sons de notificação" trailing={<Toggle enabled={sounds} onChange={() => setSounds(!sounds)} />} />
          </div>
        </div>
      </div>
    );
  }

  if (view === 'privacy') {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          <button onClick={() => setView('main')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar
          </button>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Privacidade
          </h2>
          <div className="glass glass-border rounded-2xl overflow-hidden">
            <SettingItem icon={Eye} label="Confirmação de Leitura" description="Mostrar quando leu as mensagens" trailing={<Toggle enabled={readReceipts} onChange={() => setReadReceipts(!readReceipts)} />} />
            <SettingItem icon={Globe} label="Status Online" description="Mostrar quando está online" trailing={<Toggle enabled={onlineStatus} onChange={() => setOnlineStatus(!onlineStatus)} />} />
            <SettingItem icon={Clock} label="Visto por Último" description="Mostrar quando ficou online" trailing={<Toggle enabled={lastSeen} onChange={() => setLastSeen(!lastSeen)} />} />
          </div>
        </div>
      </div>
    );
  }

  // Main settings view
  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <h1 className="text-xl font-bold text-foreground">Configurações</h1>

        {/* Profile card */}
        <button
          onClick={() => setView('profile')}
          className="w-full glass glass-border rounded-2xl p-4 flex items-center gap-3 hover:bg-muted/30 transition-all text-left"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-xl font-bold text-primary-foreground glow-sm">
            V
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground">Você</p>
            <p className="text-xs text-muted-foreground">Olá! Estou usando o iSync 🚀</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Settings sections */}
        <div className="glass glass-border rounded-2xl overflow-hidden">
          <SettingItem icon={Palette} label="Aparência" description="Tema, cores e padrões de fundo" onClick={() => setView('appearance')} />
          <SettingItem icon={Bell} label="Notificações" description="Sons, pré-visualização" onClick={() => setView('notifications')} />
          <SettingItem icon={Lock} label="Privacidade" description="Confirmações de leitura, status" onClick={() => setView('privacy')} />
        </div>

        <div className="glass glass-border rounded-2xl overflow-hidden">
          <SettingItem icon={Smartphone} label="Dispositivos Conectados" description="Gerencie seus dispositivos" />
          <SettingItem icon={Globe} label="Idioma" description="Português (BR)" />
          <SettingItem icon={HelpCircle} label="Ajuda e Suporte" description="FAQ, fale conosco" />
          <SettingItem icon={Info} label="Sobre" description="iSync v1.0.0" />
        </div>

        <div className="glass glass-border rounded-2xl overflow-hidden">
          <SettingItem icon={Star} label="iSync Premium" description="Desbloqueie recursos exclusivos" />
        </div>

        <div className="glass glass-border rounded-2xl overflow-hidden">
          <SettingItem icon={LogOut} label="Sair da Conta" destructive />
        </div>

        <p className="text-center text-[10px] text-muted-foreground py-4">
          iSync v1.0.0 · Feito com 💙
        </p>
      </div>
    </div>
  );
}

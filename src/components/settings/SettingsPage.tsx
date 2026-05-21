import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Lock, Palette, Moon, Globe, HelpCircle, LogOut,
  ChevronRight, Camera, Check, Shield, Eye, Clock,
  Volume2, MessageCircle, Star, Info, Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { backgroundPatterns } from '@/data/adminData';
import { toast } from 'sonner';
import { ThemeCustomizer } from './ThemeCustomizer';
import { useProfileStore } from '@/store/profileStore';


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
    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-all text-left"
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
      destructive ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'
    }`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium ${destructive ? 'text-destructive' : 'text-foreground'}`}>{label}</p>
      {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
    </div>
    {trailing || <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
  </button>
);

type SettingsView = 'main' | 'appearance' | 'notifications' | 'privacy' | 'profile' | 'theme';

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
    { name: 'Violeta', value: '#8b5cf6' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Índigo', value: '#6366f1' },
    { name: 'Ciano', value: '#06b6d4' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Esmeralda', value: '#10b981' },
    { name: 'Verde', value: '#22c55e' },
    { name: 'Âmbar', value: '#f59e0b' },
    { name: 'Laranja', value: '#f97316' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Magenta', value: '#d946ef' },
    { name: 'Vermelho', value: '#ef4444' },
  ];

  const BackButton = () => (
    <Button variant="ghost" size="sm" onClick={() => setView('main')} className="mb-2">
      ← Voltar
    </Button>
  );

  if (view === 'theme') {
    return <ThemeCustomizer onBack={() => setView('main')} />;
  }

  if (view === 'profile') {
    return <ProfileEditor onBack={() => setView('main')} />;
  }


  if (view === 'appearance') {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
          <BackButton />
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" /> Aparência
          </h2>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Modo Escuro</p>
                  <p className="text-[11px] text-muted-foreground">Tema escuro ativado</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </CardContent>
          </Card>

          <div>
            <Label className="text-xs uppercase tracking-wider">Padrão de Fundo</Label>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {backgroundPatterns.map((pattern) => {
                const isSelected = selectedPattern === pattern.id;
                return (
                  <button
                    key={pattern.id}
                    onClick={() => setSelectedPattern(pattern.id)}
                    className={`relative aspect-[3/2] rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected ? 'border-primary shadow-md' : 'border-border/50 hover:border-muted-foreground/30'
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
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider">Cor de Destaque</Label>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {colors.map((color) => {
                const isSelected = accentColor === color.value;
                return (
                  <motion.button key={color.value} whileTap={{ scale: 0.85 }} onClick={() => setAccentColor(color.value)} className="flex flex-col items-center gap-1">
                    <div className={`w-9 h-9 rounded-xl border-2 transition-all ${
                      isSelected ? 'border-foreground scale-110 shadow-md' : 'border-transparent hover:scale-105'
                    }`} style={{ backgroundColor: color.value }}>
                      {isSelected && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground">{color.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <Button className="w-full" onClick={() => { toast.success('Aparência atualizada!'); setView('main'); }}>
            Aplicar
          </Button>
        </div>
      </div>
    );
  }

  if (view === 'notifications') {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          <BackButton />
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Notificações
          </h2>
          <Card>
            <CardContent className="p-0 divide-y divide-border/50">
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center"><Bell className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-sm font-medium">Notificações</p><p className="text-[11px] text-muted-foreground">Push notifications</p></div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center"><MessageCircle className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-sm font-medium">Pré-visualização</p><p className="text-[11px] text-muted-foreground">Mostrar conteúdo</p></div>
                </div>
                <Switch checked={messagePreview} onCheckedChange={setMessagePreview} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center"><Volume2 className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-sm font-medium">Sons</p><p className="text-[11px] text-muted-foreground">Sons de notificação</p></div>
                </div>
                <Switch checked={sounds} onCheckedChange={setSounds} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'privacy') {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          <BackButton />
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Privacidade
          </h2>
          <Card>
            <CardContent className="p-0 divide-y divide-border/50">
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center"><Eye className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-sm font-medium">Confirmação de Leitura</p><p className="text-[11px] text-muted-foreground">Mostrar quando leu</p></div>
                </div>
                <Switch checked={readReceipts} onCheckedChange={setReadReceipts} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center"><Globe className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-sm font-medium">Status Online</p><p className="text-[11px] text-muted-foreground">Mostrar quando online</p></div>
                </div>
                <Switch checked={onlineStatus} onCheckedChange={setOnlineStatus} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center"><Clock className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-sm font-medium">Visto por Último</p><p className="text-[11px] text-muted-foreground">Quando ficou online</p></div>
                </div>
                <Switch checked={lastSeen} onCheckedChange={setLastSeen} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <h1 className="text-xl font-bold text-foreground">Configurações</h1>

        {/* Profile card */}
        <ProfileSummaryCard onClick={() => setView('profile')} />


        <Card>
          <CardContent className="p-0 divide-y divide-border/50">
            <SettingItem icon={Palette} label="Personalizar Cores" description="Escolha as cores do seu app" onClick={() => setView('theme')} />
            <SettingItem icon={Bell} label="Notificações" description="Sons, pré-visualização" onClick={() => setView('notifications')} />
            <SettingItem icon={Lock} label="Privacidade" description="Leitura, status" onClick={() => setView('privacy')} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 divide-y divide-border/50">
            <SettingItem icon={Smartphone} label="Dispositivos Conectados" description="Gerencie seus dispositivos" onClick={() => toast.info('Em breve!')} />
            <SettingItem icon={Globe} label="Idioma" description="Português (BR)" onClick={() => toast.info('Em breve!')} />
            <SettingItem icon={HelpCircle} label="Ajuda e Suporte" description="FAQ, fale conosco" onClick={() => toast.info('Em breve!')} />
            <SettingItem icon={Info} label="Sobre" description="iSync v1.0.0" onClick={() => toast.info('iSync v1.0.0 — Feito com 💙')} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <SettingItem icon={Star} label="iSync Premium" description="Desbloqueie recursos exclusivos" onClick={() => toast.info('Premium chegando em breve! ⭐')} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <SettingItem icon={LogOut} label="Sair da Conta" destructive onClick={() => toast.success('Desconectado com sucesso!')} />
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground py-4">iSync v1.0.0 · Feito com 💙</p>
      </div>
    </div>
  );
}


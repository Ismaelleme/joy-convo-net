import { useState } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatView } from '@/components/chat/ChatView';
import { StatusPage } from '@/components/status/StatusPage';
import { VideoFeed } from '@/components/videos/VideoFeed';
import { FeedPage } from '@/components/feed/FeedPage';
import { CommunitiesPage } from '@/components/communities/CommunitiesPage';

import { CallsPage } from '@/components/calls/CallsPage';
import { ContactsPage } from '@/components/contacts/ContactsPage';
import { SchedulePage } from '@/components/schedule/SchedulePage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { AIAssistantPage } from '@/components/ai/AIAssistantPage';
import { useChatStore } from '@/store/chatStore';
import {
  MessageCircle, Circle, Compass, Home, Users,
  PhoneCall, Contact2, CalendarDays, Settings, Bell, Search, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { CallModal } from '@/components/calls/CallModal';
import { IncomingCallListener } from '@/components/calls/IncomingCallSheet';
import { NotificationsPopover } from '@/components/notifications/NotificationsPopover';
import { useCallStore } from '@/store/callStore';

type Tab = 'feed' | 'chat' | 'ai' | 'contacts' | 'schedule' | 'settings' | 'communities' | 'explore';

const Index = () => {
  const { activeChatId, showMobileSidebar } = useChatStore();
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [exploreSubTab, setExploreSubTab] = useState<'videos' | 'status' | 'calls'>('videos');
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = useCallStore((s) => s.notifications.filter((n) => !n.read).length);
  const markAllRead = useCallStore((s) => s.markAllRead);

  const bottomTabs: { key: Tab; label: string; icon: React.ElementType; badge?: number; gradient?: boolean }[] = [
    { key: 'feed', label: 'Feed', icon: Home },
    { key: 'chat', label: 'Chat', icon: MessageCircle, badge: 3 },
    { key: 'ai', label: 'IA', icon: Sparkles, gradient: true },
    { key: 'schedule', label: 'Agenda', icon: CalendarDays },
    { key: 'settings', label: 'Config', icon: Settings },
  ];

  const topTabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'contacts', label: 'Contatos', icon: Contact2 },
    { key: 'communities', label: 'Comunidades', icon: Users },
    { key: 'explore', label: 'Explorar', icon: Compass },
  ];

  const handleTabChange = (key: Tab) => {
    setActiveTab(key);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background bg-noise">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2.5 glass-strong glass-border flex-shrink-0 z-20 relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />
        <h1 className="text-lg font-bold text-gradient tracking-tight relative z-10">iSync</h1>
        <div className="flex items-center gap-0.5 relative z-10">
          {topTabs.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <motion.button
                key={key}
                onClick={() => handleTabChange(key)}
                whileTap={{ scale: 0.92 }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="top-tab-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
          <div className="w-px h-5 bg-border/50 mx-1" />
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => toast.info('Busca em breve!')} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
            <Search className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              setNotifOpen((o) => {
                const next = !o;
                if (next) markAllRead();
                return next;
              });
            }}
            className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </motion.button>
          <NotificationsPopover open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
      </header>
      <CallModal />
      <IncomingCallListener />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full h-full flex"
          >
            {activeTab === 'feed' && <FeedPage />}

            {activeTab === 'chat' && (
              <>
                <div className={`w-full md:w-[360px] md:min-w-[360px] flex-shrink-0 ${
                  !showMobileSidebar && activeChatId ? 'hidden md:flex' : 'flex'
                }`}>
                  <div className="w-full h-full"><ChatSidebar /></div>
                </div>
                <div className={`flex-1 relative ${
                  showMobileSidebar && !activeChatId ? 'hidden md:flex' : 'flex'
                }`}>
                  <ChatView />
                </div>
              </>
            )}

            {activeTab === 'ai' && <AIAssistantPage />}
            {activeTab === 'communities' && <CommunitiesPage />}
            {activeTab === 'contacts' && <ContactsPage />}
            {activeTab === 'schedule' && <SchedulePage />}
            {activeTab === 'settings' && <SettingsPage />}

            {activeTab === 'explore' && (
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <VideoFeed />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <nav className="glass-strong glass-border flex items-center justify-around px-2 py-2 flex-shrink-0 relative z-30">
        <div className="absolute inset-0 bg-gradient-mesh opacity-15 pointer-events-none" />
        {bottomTabs.map(({ key, label, icon: Icon, badge, gradient }) => {
          const isActive = activeTab === key;
          return (
            <motion.button
              key={key}
              onClick={() => handleTabChange(key)}
              whileTap={{ scale: 0.88 }}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                {gradient && isActive ? (
                  <div className="w-5 h-5 relative z-10">
                    <div className="w-full h-full bg-gradient-brand rounded-md flex items-center justify-center glow-xs">
                      <Icon className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  </div>
                ) : (
                  <Icon
                    className={`w-5 h-5 transition-all relative z-10 ${
                      isActive ? 'text-primary' : gradient ? 'text-primary/70' : 'text-muted-foreground'
                    }`}
                    fill={isActive && !gradient ? 'currentColor' : 'none'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                )}
                {badge && badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground px-1 z-20">
                    {badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-all relative z-10 ${
                  isActive ? (gradient ? 'text-gradient font-bold' : 'text-primary') : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default Index;

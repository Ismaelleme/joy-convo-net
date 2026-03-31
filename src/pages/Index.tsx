import { useState } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatView } from '@/components/chat/ChatView';
import { StatusPage } from '@/components/status/StatusPage';
import { VideoFeed } from '@/components/videos/VideoFeed';
import { FeedPage } from '@/components/feed/FeedPage';
import { CommunitiesPage } from '@/components/communities/CommunitiesPage';
import { MarketplacePage } from '@/components/marketplace/MarketplacePage';
import { CallsPage } from '@/components/calls/CallsPage';
import { ContactsPage } from '@/components/contacts/ContactsPage';
import { SchedulePage } from '@/components/schedule/SchedulePage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { useChatStore } from '@/store/chatStore';
import {
  MessageCircle, Circle, Compass, Home, Users, ShoppingBag,
  PhoneCall, Contact2, CalendarDays, Settings, Bell, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'feed' | 'chat' | 'communities' | 'explore' | 'marketplace' | 'contacts' | 'schedule' | 'settings';

const Index = () => {
  const { activeChatId, showMobileSidebar } = useChatStore();
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [exploreSubTab, setExploreSubTab] = useState<'videos' | 'status' | 'calls'>('videos');

  const bottomTabs: { key: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: 'feed', label: 'Feed', icon: Home },
    { key: 'chat', label: 'Chat', icon: MessageCircle, badge: 3 },
    { key: 'contacts', label: 'Contatos', icon: Contact2 },
    { key: 'schedule', label: 'Agenda', icon: CalendarDays },
    { key: 'settings', label: 'Config', icon: Settings },
  ];

  const topTabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'communities', label: 'Comunidades', icon: Users },
    { key: 'explore', label: 'Explorar', icon: Compass },
    { key: 'marketplace', label: 'Loja', icon: ShoppingBag },
  ];

  const isTopTab = topTabs.some(t => t.key === activeTab);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background bg-noise">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2.5 glass glass-border flex-shrink-0 z-20">
        <h1 className="text-lg font-bold text-gradient tracking-tight">iSync</h1>
        <div className="flex items-center gap-1">
          {topTabs.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
          <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all ml-1">
            <Search className="w-4.5 h-4.5" />
          </button>
          <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
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

        {activeTab === 'communities' && <CommunitiesPage />}

        {activeTab === 'contacts' && <ContactsPage />}

        {activeTab === 'schedule' && <SchedulePage />}

        {activeTab === 'settings' && <SettingsPage />}

        {activeTab === 'explore' && (
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center gap-1 px-4 py-2 glass glass-border">
              {([
                { key: 'videos' as const, label: 'Vídeos', icon: Compass },
                { key: 'status' as const, label: 'Stories', icon: Circle },
                { key: 'calls' as const, label: 'Chamadas', icon: PhoneCall },
              ]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setExploreSubTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    exploreSubTab === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden">
              {exploreSubTab === 'videos' && <VideoFeed />}
              {exploreSubTab === 'status' && <StatusPage />}
              {exploreSubTab === 'calls' && <CallsPage />}
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && <MarketplacePage />}
      </div>

      {/* Bottom navigation */}
      <nav className="glass glass-border flex items-center justify-around px-2 py-2 flex-shrink-0 relative z-30">
        {bottomTabs.map(({ key, label, icon: Icon, badge }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all relative z-10 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  fill={isActive ? 'currentColor' : 'none'}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                {badge && badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white px-1 z-20">
                    {badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-all relative z-10 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Index;

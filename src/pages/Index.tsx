import { useState } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatView } from '@/components/chat/ChatView';
import { StatusPage } from '@/components/status/StatusPage';
import { VideoFeed } from '@/components/videos/VideoFeed';
import { useChatStore } from '@/store/chatStore';
import { MessageCircle, Circle, Play, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

type Tab = 'chat' | 'status' | 'videos';

const Index = () => {
  const { activeChatId, showMobileSidebar } = useChatStore();
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'chat', label: 'Chat', icon: MessageCircle },
    { key: 'status', label: 'Stories', icon: Circle },
    { key: 'videos', label: 'Explorar', icon: Compass },
  ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background bg-noise">
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'chat' && (
          <>
            <div
              className={`w-full md:w-[360px] md:min-w-[360px] flex-shrink-0 ${
                !showMobileSidebar && activeChatId ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className="w-full h-full">
                <ChatSidebar />
              </div>
            </div>
            <div
              className={`flex-1 relative ${
                showMobileSidebar && !activeChatId ? 'hidden md:flex' : 'flex'
              }`}
            >
              <ChatView />
            </div>
          </>
        )}

        {activeTab === 'status' && (
          <div className="w-full h-full relative">
            <StatusPage />
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="w-full h-full relative">
            <VideoFeed />
          </div>
        )}
      </div>

      {/* Bottom navigation — glassmorphism */}
      <nav className="glass glass-border flex items-center justify-around px-6 py-2 flex-shrink-0 relative z-30">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="relative flex flex-col items-center gap-0.5 px-5 py-1.5 transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-all relative z-10 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                fill={isActive ? 'currentColor' : 'none'}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
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

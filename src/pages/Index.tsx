import { useState } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatView } from '@/components/chat/ChatView';
import { StatusPage } from '@/components/status/StatusPage';
import { VideoFeed } from '@/components/videos/VideoFeed';
import { useChatStore } from '@/store/chatStore';
import { MessageCircle, Circle, Play } from 'lucide-react';
import { motion } from 'framer-motion';

type Tab = 'chat' | 'status' | 'videos';

const Index = () => {
  const { activeChatId, showMobileSidebar } = useChatStore();
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'chat', label: 'Conversas', icon: MessageCircle },
    { key: 'status', label: 'Status', icon: Circle },
    { key: 'videos', label: 'Explorar', icon: Play },
  ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'chat' && (
          <>
            {/* Sidebar */}
            <div
              className={`w-full md:w-[380px] md:min-w-[380px] flex-shrink-0 ${
                !showMobileSidebar && activeChatId ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className="w-full h-full">
                <ChatSidebar />
              </div>
            </div>
            {/* Chat view */}
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

      {/* Bottom navigation */}
      <nav className="flex items-center justify-around border-t border-border bg-card px-4 py-2 flex-shrink-0">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="relative flex flex-col items-center gap-1 px-4 py-1 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                fill={key === 'videos' && isActive ? 'currentColor' : 'none'}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
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

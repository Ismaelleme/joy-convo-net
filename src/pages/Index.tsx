import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatView } from '@/components/chat/ChatView';
import { useChatStore } from '@/store/chatStore';

const Index = () => {
  const { activeChatId, showMobileSidebar } = useChatStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={`w-full md:w-[380px] md:min-w-[380px] flex-shrink-0 ${
        !showMobileSidebar && activeChatId ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="w-full h-full">
          <ChatSidebar />
        </div>
      </div>

      {/* Chat view */}
      <div className={`flex-1 relative ${
        showMobileSidebar && !activeChatId ? 'hidden md:flex' : 'flex'
      }`}>
        <ChatView />
      </div>
    </div>
  );
};

export default Index;

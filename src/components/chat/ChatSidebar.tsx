import { Search, MessageCircle, Users, Star, Archive, Filter } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { UserAvatar } from './UserAvatar';
import { TypingIndicator } from './TypingIndicator';
import { ChatFilter } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const filters: { key: ChatFilter; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'Todos', icon: MessageCircle },
  { key: 'unread', label: 'Não lidos', icon: Filter },
  { key: 'favorites', label: 'Favoritos', icon: Star },
  { key: 'groups', label: 'Grupos', icon: Users },
  { key: 'archived', label: 'Arquivados', icon: Archive },
];

export function ChatSidebar() {
  const {
    activeChatId, setActiveChatId, filter, setFilter,
    searchQuery, setSearchQuery, getFilteredChats,
  } = useChatStore();

  const filteredChats = getFilteredChats();

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 pb-2">
        <h1 className="text-xl font-bold text-foreground mb-3">Mensagens</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 px-4 py-2 overflow-x-auto scrollbar-thin">
        {filters.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <AnimatePresence>
          {filteredChats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const otherUser = chat.participants.find((p) => p.id !== 'me');
            const isTyping = chat.typing && chat.typing.length > 0;

            return (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                  isActive ? 'bg-chat-active' : 'hover:bg-chat-hover'
                }`}
              >
                <UserAvatar
                  user={otherUser}
                  name={chat.name}
                  showStatus={chat.type === 'direct'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground truncate flex items-center gap-1">
                      {chat.name}
                      {chat.isFavorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    </span>
                    {chat.lastMessage && (
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(chat.lastMessage.timestamp, { addSuffix: false, locale: ptBR })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {isTyping ? (
                        <span className="flex items-center gap-1 text-typing">
                          digitando <TypingIndicator />
                        </span>
                      ) : chat.lastMessage ? (
                        <>
                          {chat.lastMessage.senderId === 'me' && (
                            <span className="text-primary">Você: </span>
                          )}
                          {chat.lastMessage.content}
                        </>
                      ) : (
                        'Nenhuma mensagem'
                      )}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">Nenhuma conversa encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Search, MessageCircle, Users, Star, Archive, SlidersHorizontal } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { UserAvatar } from './UserAvatar';
import { TypingIndicator } from './TypingIndicator';
import { ChatFilter } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const filters: { key: ChatFilter; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'Todos', icon: MessageCircle },
  { key: 'unread', label: 'Não lidos', icon: SlidersHorizontal },
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
    <div className="flex flex-col h-full bg-sidebar border-r border-border/50">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gradient tracking-tight">Mensagens</h1>
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass glass-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Filters — pill style */}
      <div className="flex gap-1.5 px-5 py-2 overflow-x-auto scrollbar-thin">
        {filters.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
              filter === key
                ? 'bg-gradient-brand text-primary-foreground shadow-lg glow-sm'
                : 'glass glass-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2">
        <AnimatePresence>
          {filteredChats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const otherUser = chat.participants.find((p) => p.id !== 'me');
            const isTyping = chat.typing && chat.typing.length > 0;

            return (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left mb-1 ${
                  isActive
                    ? 'glass glass-border glow-sm bg-chat-active'
                    : 'hover:bg-muted/40'
                }`}
              >
                <UserAvatar
                  user={otherUser}
                  name={chat.name}
                  showStatus={chat.type === 'direct'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground truncate flex items-center gap-1.5">
                      {chat.name}
                      {chat.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
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
                        <span className="flex items-center gap-1 text-primary">
                          digitando <TypingIndicator />
                        </span>
                      ) : chat.lastMessage ? (
                        <>
                          {chat.lastMessage.senderId === 'me' && (
                            <span className="text-primary/70">Você: </span>
                          )}
                          {chat.lastMessage.content}
                        </>
                      ) : (
                        'Nenhuma mensagem'
                      )}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="bg-gradient-brand text-primary-foreground text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 glow-sm">
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
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl glass glass-border flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 opacity-40" />
            </div>
            <p className="text-sm">Nenhuma conversa encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}

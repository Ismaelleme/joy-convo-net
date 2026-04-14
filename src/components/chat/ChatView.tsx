import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { UserAvatar } from './UserAvatar';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '@/types/chat';
import { ArrowLeft, Phone, Video, Search, Star, Archive, Users, Pin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function ChatView() {
  const {
    getActiveChat, getActiveMessages, setActiveChatId, setShowMobileSidebar,
    toggleFavorite, toggleArchive, messageSearchQuery, setMessageSearchQuery,
  } = useChatStore();

  const chat = getActiveChat();
  const messages = getActiveMessages();
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-chat-bg bg-noise text-muted-foreground">
        <div className="w-20 h-20 rounded-3xl glass glass-border flex items-center justify-center mb-5 glow-lg">
          <svg className="w-9 h-9 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gradient mb-1">iSync Messenger</h2>
        <p className="text-sm text-muted-foreground">Selecione uma conversa para começar</p>
      </div>
    );
  }

  const otherUser = chat.participants.find((p) => p.id !== 'me');
  const isTyping = chat.typing && chat.typing.length > 0;
  const pinnedMsgs = messages.filter((m) => m.isPinned);
  const filteredMessages = messageSearchQuery
    ? messages.filter((m) => m.content.toLowerCase().includes(messageSearchQuery.toLowerCase()))
    : messages;

  const handleBack = () => {
    setActiveChatId(null);
    setShowMobileSidebar(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-chat-bg bg-noise">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 glass glass-border">
        <button onClick={handleBack} className="md:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-3 flex-1 min-w-0">
          <UserAvatar user={otherUser} name={chat.name} showStatus={chat.type === 'direct'} />
          <div className="min-w-0">
            <h2 className="font-bold text-sm text-foreground truncate">{chat.name}</h2>
            <p className="text-xs text-muted-foreground">
              {isTyping ? (
                <span className="flex items-center gap-1 text-primary">digitando <TypingIndicator /></span>
              ) : otherUser?.status === 'online' ? (
                <span className="text-online">online</span>
              ) : chat.type === 'group' ? (
                `${chat.participants.length} membros`
              ) : (
                'offline'
              )}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-0.5">
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={() => toast.info(`Ligando para ${chat.name}...`)} className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all">
            <Phone className="w-5 h-5" />
          </button>
          <button onClick={() => toast.info(`Chamada de vídeo com ${chat.name}...`)} className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all">
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 glass border-b border-border/30"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar mensagens..."
                value={messageSearchQuery}
                onChange={(e) => setMessageSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 glass glass-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none"
                autoFocus
              />
              <button onClick={() => { setShowSearch(false); setMessageSearchQuery(''); }} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned messages banner */}
      {pinnedMsgs.length > 0 && (
        <div className="px-4 py-2 glass border-b border-border/30 flex items-center gap-2 text-xs text-muted-foreground">
          <Pin className="w-3 h-3 text-primary" />
          <span className="truncate">{pinnedMsgs.length} mensagem(ns) fixada(s)</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-1">
        {filteredMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            chatId={chat.id}
            onReply={(m) => setReplyTo(m)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput chatId={chat.id} replyTo={replyTo} onClearReply={() => setReplyTo(null)} />

      {/* Info panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute right-0 top-0 bottom-0 w-80 glass glass-border z-50 flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-bold text-foreground">Detalhes</h3>
              <button onClick={() => setShowInfo(false)} className="p-1.5 rounded-xl hover:bg-muted/50 transition-all">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex flex-col items-center text-center">
                <UserAvatar user={otherUser} name={chat.name} size="lg" showStatus />
                <h3 className="font-bold text-foreground mt-3">{chat.name}</h3>
                {chat.description && <p className="text-xs text-muted-foreground mt-1">{chat.description}</p>}
              </div>

              <div className="space-y-1">
                <button onClick={() => toggleFavorite(chat.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-muted/40 transition-all text-sm">
                  <Star className={`w-4 h-4 ${chat.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                  {chat.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                </button>
                <button onClick={() => toggleArchive(chat.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-muted/40 transition-all text-sm">
                  <Archive className="w-4 h-4 text-muted-foreground" />
                  {chat.isArchived ? 'Desarquivar' : 'Arquivar'}
                </button>
              </div>

              {chat.type === 'group' && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Membros ({chat.participants.length})
                  </h4>
                  <div className="space-y-1">
                    {chat.participants.map((p) => (
                      <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-xl">
                        <UserAvatar user={p} size="sm" showStatus />
                        <div className="min-w-0">
                          <p className="text-sm text-foreground truncate">
                            {p.id === 'me' ? 'Você' : p.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {chat.admins?.includes(p.id) && 'Admin • '}
                            {p.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

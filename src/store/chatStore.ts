import { create } from 'zustand';
import { Chat, Message, ChatFilter } from '@/types/chat';
import { chats as mockChats, messages as mockMessages, currentUser } from '@/data/mockData';

interface ChatStore {
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChatId: string | null;
  filter: ChatFilter;
  searchQuery: string;
  messageSearchQuery: string;
  showMobileSidebar: boolean;

  setActiveChatId: (id: string | null) => void;
  setFilter: (filter: ChatFilter) => void;
  setSearchQuery: (query: string) => void;
  setMessageSearchQuery: (query: string) => void;
  setShowMobileSidebar: (show: boolean) => void;

  sendMessage: (chatId: string, content: string, replyTo?: Message) => void;
  editMessage: (chatId: string, messageId: string, newContent: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  toggleReaction: (chatId: string, messageId: string, emoji: string) => void;
  togglePin: (chatId: string, messageId: string) => void;
  toggleFavorite: (chatId: string) => void;
  toggleArchive: (chatId: string) => void;

  getActiveChat: () => Chat | undefined;
  getActiveMessages: () => Message[];
  getFilteredChats: () => Chat[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: mockChats,
  messages: mockMessages,
  activeChatId: null,
  filter: 'all',
  searchQuery: '',
  messageSearchQuery: '',
  showMobileSidebar: true,

  setActiveChatId: (id) => set({ activeChatId: id, showMobileSidebar: false }),
  setFilter: (filter) => set({ filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setMessageSearchQuery: (query) => set({ messageSearchQuery: query }),
  setShowMobileSidebar: (show) => set({ showMobileSidebar: show }),

  sendMessage: (chatId, content, replyTo) => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: 'me',
      content,
      type: 'text',
      timestamp: new Date(),
      status: 'sent',
      reactions: [],
      replyTo,
    };
    set((state) => {
      const chatMsgs = [...(state.messages[chatId] || []), msg];
      const chats = state.chats.map((c) =>
        c.id === chatId ? { ...c, lastMessage: msg, unreadCount: 0 } : c
      );
      return { messages: { ...state.messages, [chatId]: chatMsgs }, chats };
    });
    // Simulate delivery
    setTimeout(() => {
      set((state) => {
        const chatMsgs = (state.messages[chatId] || []).map((m) =>
          m.id === msg.id ? { ...m, status: 'delivered' as const } : m
        );
        return { messages: { ...state.messages, [chatId]: chatMsgs } };
      });
    }, 1000);
  },

  editMessage: (chatId, messageId, newContent) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map((m) =>
          m.id === messageId ? { ...m, content: newContent, isEdited: true } : m
        ),
      },
    })),

  deleteMessage: (chatId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map((m) =>
          m.id === messageId ? { ...m, isDeleted: true, content: 'Mensagem apagada' } : m
        ),
      },
    })),

  toggleReaction: (chatId, messageId, emoji) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map((m) => {
          if (m.id !== messageId) return m;
          const existing = m.reactions.find((r) => r.emoji === emoji);
          let reactions;
          if (existing) {
            if (existing.users.includes('me')) {
              reactions = m.reactions
                .map((r) => r.emoji === emoji ? { ...r, users: r.users.filter((u) => u !== 'me') } : r)
                .filter((r) => r.users.length > 0);
            } else {
              reactions = m.reactions.map((r) => r.emoji === emoji ? { ...r, users: [...r.users, 'me'] } : r);
            }
          } else {
            reactions = [...m.reactions, { emoji, users: ['me'] }];
          }
          return { ...m, reactions };
        }),
      },
    })),

  togglePin: (chatId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map((m) =>
          m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
        ),
      },
    })),

  toggleFavorite: (chatId) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, isFavorite: !c.isFavorite } : c
      ),
    })),

  toggleArchive: (chatId) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, isArchived: !c.isArchived } : c
      ),
    })),

  getActiveChat: () => get().chats.find((c) => c.id === get().activeChatId),
  getActiveMessages: () => get().messages[get().activeChatId || ''] || [],

  getFilteredChats: () => {
    const { chats, filter, searchQuery } = get();
    let filtered = chats;

    switch (filter) {
      case 'favorites': filtered = chats.filter((c) => c.isFavorite); break;
      case 'archived': filtered = chats.filter((c) => c.isArchived); break;
      case 'groups': filtered = chats.filter((c) => c.type === 'group'); break;
      case 'unread': filtered = chats.filter((c) => c.unreadCount > 0); break;
      default: filtered = chats.filter((c) => !c.isArchived);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastMessage?.content.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp.getTime() || 0;
      const bTime = b.lastMessage?.timestamp.getTime() || 0;
      return bTime - aTime;
    });
  },
}));

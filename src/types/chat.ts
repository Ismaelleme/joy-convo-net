export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  bio?: string;
}

export interface Reaction {
  emoji: string;
  users: string[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: Message;
  reactions: Reaction[];
  isEdited?: boolean;
  isDeleted?: boolean;
  isPinned?: boolean;
  isTemporary?: boolean;
  expiresAt?: Date;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  imageUrl?: string;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isFavorite: boolean;
  isArchived: boolean;
  isMuted: boolean;
  typing?: string[];
  pinnedMessages: Message[];
  admins?: string[];
  createdBy?: string;
  description?: string;
}

export type ChatFilter = 'all' | 'favorites' | 'archived' | 'groups' | 'unread';

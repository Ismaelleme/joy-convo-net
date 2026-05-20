import { useState, useRef } from 'react';
import { Message } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';
import { Check, CheckCheck, Reply, Pencil, Trash2, Pin, SmilePlus, X } from 'lucide-react';
import { motion } from 'framer-motion';

const quickEmojis = ['👍', '❤️', '😂', '🔥', '😢', '🎉'];

interface MessageBubbleProps {
  message: Message;
  chatId: string;
  onReply: (msg: Message) => void;
}

export function MessageBubble({ message, chatId, onReply }: MessageBubbleProps) {
  const { toggleReaction, togglePin, deleteMessage, editMessage } = useChatStore();
  const [showActions, setShowActions] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const editRef = useRef<HTMLInputElement>(null);

  const isMine = message.senderId === 'me';
  const isDeleted = message.isDeleted;

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      editMessage(chatId, message.id, editContent);
    }
    setIsEditing(false);
  };

  const StatusIcon = message.status === 'read' ? CheckCheck :
                     message.status === 'delivered' ? CheckCheck : Check;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} group mb-1`}
      onMouseEnter={() => !isDeleted && setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowEmojis(false); }}
    >
      <div className="relative max-w-[75%] sm:max-w-[65%]">
        {/* Reply context */}
        {message.replyTo && (
          <div className={`text-[11px] px-3 py-1 mb-0.5 rounded-t-2xl border-l-2 border-primary ${
            isMine ? 'bg-chat-outgoing/70' : 'bg-chat-incoming/70'
          } text-muted-foreground`}>
            <span className="font-medium text-primary">{message.replyTo.senderId === 'me' ? 'Você' : 'Contato'}</span>
            <p className="truncate">{message.replyTo.content}</p>
          </div>
        )}

        <div
          className={`px-3.5 py-2 ${
            isDeleted
              ? 'glass glass-border italic text-muted-foreground rounded-2xl'
              : isMine
                ? 'bg-gradient-to-br from-primary/20 to-primary/10 glass-border text-foreground rounded-2xl rounded-br-md'
                : 'glass glass-border text-foreground rounded-2xl rounded-bl-md'
          }`}
        >
          {message.isPinned && (
            <Pin className="w-3 h-3 text-primary inline mr-1" />
          )}

          {isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="flex gap-1">
              <input
                ref={editRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="bg-input rounded-lg px-2 py-1 text-sm flex-1 outline-none"
                autoFocus
              />
              <button type="submit" className="text-primary text-xs">✓</button>
              <button type="button" onClick={() => setIsEditing(false)} className="text-muted-foreground text-xs">
                <X className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <>
              {message.imageUrl && (
                <a href={message.imageUrl} target="_blank" rel="noreferrer" className="block mb-1">
                  <img
                    src={message.imageUrl}
                    alt="anexo"
                    className="rounded-xl max-h-64 object-cover w-full"
                  />
                </a>
              )}
              {message.fileUrl && !message.imageUrl && (
                <a
                  href={message.fileUrl}
                  download={message.fileName ?? 'arquivo'}
                  className="flex items-center gap-2 p-2 rounded-xl bg-background/40 hover:bg-background/60 transition-all mb-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs">📎</div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{message.fileName ?? 'Arquivo'}</p>
                    {message.fileSize && (
                      <p className="text-[10px] text-muted-foreground">
                        {(message.fileSize / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                </a>
              )}
              {message.content && message.type !== 'image' && (
                <p className="text-sm leading-relaxed break-words">{message.content}</p>
              )}
            </>
          )}


          <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
            {message.isEdited && <span className="text-[10px] text-muted-foreground">editada</span>}
            <span className="text-[10px] text-muted-foreground">
              {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isMine && !isDeleted && (
              <StatusIcon className={`w-3 h-3 ${message.status === 'read' ? 'text-primary' : 'text-muted-foreground'}`} />
            )}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className={`flex gap-1 mt-0.5 flex-wrap ${isMine ? 'justify-end' : 'justify-start'}`}>
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => toggleReaction(chatId, message.id, r.emoji)}
                className={`text-xs px-1.5 py-0.5 rounded-full glass glass-border ${
                  r.users.includes('me') ? 'ring-1 ring-primary' : ''
                }`}
              >
                {r.emoji} {r.users.length > 1 && r.users.length}
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className={`absolute top-0 ${isMine ? '-left-2 -translate-x-full' : '-right-2 translate-x-full'} flex items-center gap-0.5 glass glass-border rounded-2xl p-0.5 shadow-lg`}>
            <button onClick={() => setShowEmojis(!showEmojis)} className="p-1.5 hover:bg-muted/50 rounded-xl transition-all">
              <SmilePlus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={() => onReply(message)} className="p-1.5 hover:bg-muted/50 rounded-xl transition-all">
              <Reply className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            {isMine && (
              <>
                <button onClick={() => { setIsEditing(true); setEditContent(message.content); }} className="p-1.5 hover:bg-muted/50 rounded-xl transition-all">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => deleteMessage(chatId, message.id)} className="p-1.5 hover:bg-muted/50 rounded-xl transition-all">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </>
            )}
            <button onClick={() => togglePin(chatId, message.id)} className="p-1.5 hover:bg-muted/50 rounded-xl transition-all">
              <Pin className={`w-3.5 h-3.5 ${message.isPinned ? 'text-primary' : 'text-muted-foreground'}`} />
            </button>
          </div>
        )}

        {/* Emoji picker */}
        {showEmojis && (
          <div className={`absolute -top-8 ${isMine ? 'right-0' : 'left-0'} flex gap-1 glass glass-border rounded-2xl px-2 py-1 shadow-lg`}>
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => { toggleReaction(chatId, message.id, emoji); setShowEmojis(false); }}
                className="hover:scale-125 transition-transform text-sm"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

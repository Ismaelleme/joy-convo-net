import { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Mic, X, Reply } from 'lucide-react';
import { Message } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';
import { motion, AnimatePresence } from 'framer-motion';

const emojiList = ['😀', '😂', '❤️', '🔥', '👍', '👋', '🎉', '😢', '🤔', '😎', '🥳', '💯', '✨', '🚀', '💪', '☕'];

interface ChatInputProps {
  chatId: string;
  replyTo: Message | null;
  onClearReply: () => void;
}

export function ChatInput({ chatId, replyTo, onClearReply }: ChatInputProps) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChatStore();

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(chatId, text.trim(), replyTo || undefined);
    setText('');
    onClearReply();
    inputRef.current?.focus();
  };

  return (
    <div className="glass glass-border p-3 mx-3 mb-3 rounded-2xl">
      {/* Reply preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 mb-2 px-3 py-2 bg-muted/40 rounded-xl border-l-2 border-primary"
          >
            <Reply className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-primary">
                {replyTo.senderId === 'me' ? 'Você' : 'Contato'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{replyTo.content}</p>
            </div>
            <button onClick={onClearReply} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap gap-2 mb-2 p-3 bg-muted/30 rounded-xl"
          >
            {emojiList.map((emoji) => (
              <button
                key={emoji}
                onClick={() => { setText((t) => t + emoji); setShowEmoji(false); inputRef.current?.focus(); }}
                className="text-xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className={`p-2 rounded-xl transition-all ${showEmoji ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}
        >
          <Smile className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all">
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Mensagem..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />

        {text.trim() ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleSend}
            className="p-2.5 bg-gradient-brand rounded-xl text-primary-foreground hover:brightness-110 transition-all glow-sm"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        ) : (
          <button className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all">
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

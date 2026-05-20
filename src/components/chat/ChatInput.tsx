import { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Mic, X, Reply, Image as ImageIcon, FileText, StopCircle } from 'lucide-react';
import { Message } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const emojiList = ['😀', '😂', '❤️', '🔥', '👍', '👋', '🎉', '😢', '🤔', '😎', '🥳', '💯', '✨', '🚀', '💪', '☕'];

interface ChatInputProps {
  chatId: string;
  replyTo: Message | null;
  onClearReply: () => void;
}

export function ChatInput({ chatId, replyTo, onClearReply }: ChatInputProps) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<number | null>(null);
  const recordChunksRef = useRef<Blob[]>([]);
  const { sendMessage } = useChatStore();

  const readAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(chatId, text.trim(), replyTo || undefined);
    setText('');
    onClearReply();
    inputRef.current?.focus();
  };

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    setShowAttach(false);
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error('Imagem muito grande (máx 10MB)');
    const url = await readAsDataURL(file);
    sendMessage(chatId, text.trim(), replyTo || undefined, { type: 'image', url, name: file.name });
    setText('');
    onClearReply();
  };

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    setShowAttach(false);
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) return toast.error('Arquivo muito grande (máx 20MB)');
    const url = await readAsDataURL(file);
    sendMessage(chatId, file.name, replyTo || undefined, {
      type: 'file',
      url,
      name: file.name,
      size: file.size,
    });
    onClearReply();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      recordChunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size && recordChunksRef.current.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(recordChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        const url = await new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result));
          r.readAsDataURL(blob);
        });
        sendMessage(chatId, `Áudio (${recordSecs}s)`, replyTo || undefined, {
          type: 'file',
          url,
          name: 'audio.webm',
          size: blob.size,
        });
        onClearReply();
        setRecordSecs(0);
      };
      mr.start();
      setIsRecording(true);
      let s = 0;
      recordTimerRef.current = window.setInterval(() => {
        s += 1;
        setRecordSecs(s);
      }, 1000);
    } catch {
      toast.error('Não foi possível acessar o microfone');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    recordTimerRef.current = null;
    setIsRecording(false);
  };

  return (
    <div className="glass glass-border p-3 mx-3 mb-3 rounded-2xl">
      {/* hidden file inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={handleImagePick} />
      <input ref={fileInputRef} type="file" hidden onChange={handleFilePick} />

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

      <AnimatePresence>
        {showAttach && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-2 mb-2 p-3 bg-muted/30 rounded-xl"
          >
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all"
            >
              <ImageIcon className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-foreground">Foto</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all"
            >
              <FileText className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-foreground">Arquivo</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

      {isRecording ? (
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm text-foreground font-mono">{recordSecs}s</span>
          <span className="text-xs text-muted-foreground flex-1">Gravando áudio…</span>
          <button
            onClick={stopRecording}
            className="p-2.5 bg-destructive rounded-xl text-destructive-foreground"
          >
            <StopCircle className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }}
            className={`p-2 rounded-xl transition-all ${showEmoji ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }}
            className={`p-2 rounded-xl transition-all ${showAttach ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}
          >
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
            <button
              onClick={startRecording}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

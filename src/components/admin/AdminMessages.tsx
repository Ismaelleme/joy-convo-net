import { useState } from 'react';
import { adminMessages, AdminMessage } from '@/data/adminData';
import { Mail, MailOpen, Paperclip, FileText, Image, ArrowLeft, Download, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AdminMessages() {
  const [messages, setMessages] = useState(adminMessages);
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = messages.filter(
    m => m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (msg: AdminMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4 text-primary" />;
    return <FileText className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold font-[Space_Grotesk] text-foreground">Mensagens</h1>
        <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">
          {messages.filter(m => !m.read).length} não lidas
        </span>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* List */}
        <div className={`w-full md:w-96 flex-shrink-0 flex flex-col gap-3 overflow-hidden ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar mensagens..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass glass-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1.5">
            {filtered.map((msg) => (
              <motion.button
                key={msg.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(msg)}
                className={`w-full text-left p-3.5 rounded-xl transition-all ${
                  selectedMessage?.id === msg.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'glass glass-border hover:bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
                    {msg.senderAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${!msg.read ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {format(new Date(msg.createdAt), 'dd/MM', { locale: ptBR })}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${!msg.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {msg.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {msg.attachments.length > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Paperclip className="w-3 h-3" />
                          {msg.attachments.length}
                        </span>
                      )}
                      {!msg.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <AnimatePresence mode="wait">
          {selectedMessage ? (
            <motion.div
              key={selectedMessage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex-1 glass glass-border rounded-2xl p-6 overflow-y-auto scrollbar-thin ${!selectedMessage ? 'hidden md:block' : ''}`}
            >
              <button
                onClick={() => setSelectedMessage(null)}
                className="md:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {selectedMessage.senderAvatar}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{selectedMessage.senderName}</h2>
                  <p className="text-sm text-muted-foreground">{selectedMessage.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(selectedMessage.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="text-sm text-foreground/90 leading-relaxed mb-6">
                {selectedMessage.content}
              </div>

              {selectedMessage.attachments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Anexos ({selectedMessage.attachments.length})
                  </h3>
                  {selectedMessage.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{file.size}</p>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center glass glass-border rounded-2xl">
              <div className="text-center">
                <MailOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Selecione uma mensagem</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

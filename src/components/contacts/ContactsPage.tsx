import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Phone, Mail, Video, ExternalLink, UserPlus, X, Circle, Clock, Ban, MessageCircle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { contacts, contactCategories, type Contact } from '@/data/contactsData';
import { UserAvatar } from '@/components/chat/UserAvatar';
import { useCallStore } from '@/store/callStore';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  online: { label: 'Online', color: 'bg-online' },
  offline: { label: 'Offline', color: 'bg-muted-foreground' },
  away: { label: 'Ausente', color: 'bg-amber-400' },
  busy: { label: 'Ocupado', color: 'bg-destructive' },
};

const ContactCard = ({ contact, onSelect, index }: { contact: Contact; onSelect: (c: Contact) => void; index: number }) => {
  const statusCfg = statusConfig[contact.status];

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onSelect(contact)}
      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/30 hover:glass-border-bright transition-all text-left group"
    >
      <div className="relative">
        <UserAvatar name={contact.name} size="md" />
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background ${statusCfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-foreground truncate">{contact.name}</p>
          {contact.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground truncate">{contact.bio || contact.phone}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-primary/15 transition-colors">
          <Phone className="w-4 h-4 text-primary" />
        </div>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-primary/15 transition-colors">
          <MessageCircle className="w-4 h-4 text-primary" />
        </div>
      </div>
    </motion.button>
  );
};

const ContactDetail = ({ contact, onClose }: { contact: Contact; onClose: () => void }) => {
  const statusCfg = statusConfig[contact.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute inset-0 z-20 bg-background bg-noise flex flex-col"
    >
      {/* Header gradient */}
      <div className="relative h-36 bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-xl glass flex items-center justify-center z-10">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Avatar overlapping */}
      <div className="px-5 -mt-14 relative z-10">
        <div className="w-24 h-24 rounded-3xl bg-gradient-brand flex items-center justify-center text-3xl font-bold text-primary-foreground glow-lg border-4 border-background">
          {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 pb-6">
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">{contact.name}</h2>
            {contact.isFavorite && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${statusCfg.color}`} />
            {statusCfg.label}
            {contact.lastSeen && contact.status !== 'online' && (
              <span className="text-muted-foreground"> · visto {formatDistanceToNow(contact.lastSeen, { addSuffix: true, locale: ptBR })}</span>
            )}
          </p>
        </div>

        {contact.bio && (
          <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{contact.bio}</p>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { icon: Phone, label: 'Ligar', action: () => useCallStore.getState().startCall(contact.name, 'voice') },
            { icon: Video, label: 'Vídeo', action: () => useCallStore.getState().startCall(contact.name, 'video') },
            { icon: Mail, label: 'Mensagem', action: () => toast.info(`Abrindo chat com ${contact.name}...`) },
          ].map(({ icon: Icon, label, action }) => (
            <button key={label} onClick={action} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl glass glass-border hover:glow-xs transition-all">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-[11px] font-medium text-foreground">{label}</span>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="mt-5 space-y-3">
          <div className="glass glass-border rounded-2xl overflow-hidden divide-y divide-border/30">
            <div className="px-4 py-3">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Telefone</p>
              <p className="text-sm text-foreground mt-0.5">{contact.phone}</p>
            </div>
            {contact.email && (
              <div className="px-4 py-3">
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Email</p>
                <p className="text-sm text-foreground mt-0.5">{contact.email}</p>
              </div>
            )}
            <div className="px-4 py-3">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Amigos em comum</p>
              <p className="text-sm text-foreground mt-0.5">{contact.mutualFriends} amigos</p>
            </div>
          </div>

          {contact.socialLinks && contact.socialLinks.length > 0 && (
            <div className="glass glass-border rounded-2xl p-4">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold mb-2">Redes Sociais</p>
              <div className="flex flex-wrap gap-2">
                  {contact.socialLinks.map((link) => (
                    <button key={link.platform} onClick={() => toast.info(`Abrindo ${link.platform}...`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass glass-border text-xs text-foreground hover:glow-xs transition-all">
                      <ExternalLink className="w-3 h-3 text-primary" />
                      {link.platform}
                    </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function ContactsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filtered = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchCat =
      activeCategory === 'Todos' ||
      (activeCategory === 'Favoritos' && c.isFavorite) ||
      (activeCategory === 'Online' && c.status === 'online') ||
      (activeCategory === 'Recentes' && c.lastSeen);
    return matchSearch && matchCat;
  });

  const onlineCount = contacts.filter(c => c.status === 'online').length;

  // Group by first letter
  const grouped = filtered.reduce<Record<string, Contact[]>>((acc, c) => {
    const letter = c.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(c);
    return acc;
  }, {});
  const letters = Object.keys(grouped).sort();

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Contatos</h1>
              <p className="text-xs text-muted-foreground">
                <span className="text-online font-medium">{onlineCount} online</span> · {contacts.length} total
              </p>
            </div>
            <button onClick={() => toast.info('Adicionar contato em breve!')} className="w-10 h-10 rounded-2xl glass glass-border flex items-center justify-center hover:glow-xs transition-all">
              <UserPlus className="w-5 h-5 text-primary" />
            </button>
          </motion.div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar contato..."
              className="w-full pl-10 pr-4 py-2.5 glass glass-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30 focus:glow-xs transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {contactCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat ? 'bg-primary text-primary-foreground glow-xs' : 'glass glass-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Contact list grouped by letter */}
          {letters.map(letter => (
            <div key={letter}>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 px-1">{letter}</p>
              <div className="space-y-0.5">
                {grouped[letter].map((contact, i) => (
                  <ContactCard key={contact.id} contact={contact} onSelect={setSelectedContact} index={i} />
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">Nenhum contato encontrado</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedContact && (
          <ContactDetail contact={selectedContact} onClose={() => setSelectedContact(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

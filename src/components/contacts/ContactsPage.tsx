import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Phone, Mail, ExternalLink, UserPlus, X, Circle, Clock, Ban } from 'lucide-react';
import { contacts, contactCategories, type Contact } from '@/data/contactsData';
import { UserAvatar } from '@/components/chat/UserAvatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  online: { label: 'Online', icon: Circle, color: 'text-green-400 fill-green-400' },
  offline: { label: 'Offline', icon: Circle, color: 'text-muted-foreground' },
  away: { label: 'Ausente', icon: Clock, color: 'text-amber-400' },
  busy: { label: 'Ocupado', icon: Ban, color: 'text-destructive' },
};

const ContactCard = ({ contact, onSelect }: { contact: Contact; onSelect: (c: Contact) => void }) => {
  const statusCfg = statusConfig[contact.status];
  const StatusIcon = statusCfg.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(contact)}
      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/30 transition-all text-left group"
    >
      <div className="relative">
        <UserAvatar name={contact.name} size="md" />
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background flex items-center justify-center ${
          contact.status === 'online' ? 'bg-green-400' : contact.status === 'busy' ? 'bg-destructive' : contact.status === 'away' ? 'bg-amber-400' : 'bg-muted-foreground'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-foreground truncate">{contact.name}</p>
          {contact.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground truncate">{contact.bio || contact.phone}</p>
      </div>
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-primary/15 transition-colors">
          <Phone className="w-4 h-4 text-primary" />
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
      <div className="relative h-32 bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-background/20" />
        <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-xl glass flex items-center justify-center z-10">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Avatar overlapping */}
      <div className="px-5 -mt-12 relative z-10">
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
            <span className={`w-2 h-2 rounded-full ${contact.status === 'online' ? 'bg-green-400' : contact.status === 'busy' ? 'bg-destructive' : contact.status === 'away' ? 'bg-amber-400' : 'bg-muted-foreground'}`} />
            {statusCfg.label}
            {contact.lastSeen && contact.status !== 'online' && (
              <span className="text-muted-foreground"> · visto {formatDistanceToNow(contact.lastSeen, { addSuffix: true, locale: ptBR })}</span>
            )}
          </p>
        </div>

        {contact.bio && (
          <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{contact.bio}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl glass glass-border text-sm font-medium text-foreground hover:bg-muted/30 transition-all">
            <Phone className="w-4 h-4 text-primary" />
            Ligar
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl glass glass-border text-sm font-medium text-foreground hover:bg-muted/30 transition-all">
            <Mail className="w-4 h-4 text-primary" />
            Mensagem
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 space-y-3">
          <div className="glass glass-border rounded-2xl p-4 space-y-3">
            <div>
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Telefone</p>
              <p className="text-sm text-foreground mt-0.5">{contact.phone}</p>
            </div>
            {contact.email && (
              <div>
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Email</p>
                <p className="text-sm text-foreground mt-0.5">{contact.email}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Amigos em comum</p>
              <p className="text-sm text-foreground mt-0.5">{contact.mutualFriends} amigos</p>
            </div>
          </div>

          {contact.socialLinks && contact.socialLinks.length > 0 && (
            <div className="glass glass-border rounded-2xl p-4">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold mb-2">Redes Sociais</p>
              <div className="flex flex-wrap gap-2">
                {contact.socialLinks.map((link) => (
                  <button key={link.platform} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass glass-border text-xs text-foreground hover:bg-muted/30 transition-all">
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

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Contatos</h1>
              <p className="text-xs text-muted-foreground">{onlineCount} online de {contacts.length}</p>
            </div>
            <button className="w-10 h-10 rounded-2xl glass glass-border flex items-center justify-center hover:bg-muted/30 transition-all">
              <UserPlus className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar contato..."
              className="w-full pl-10 pr-4 py-2.5 glass glass-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {contactCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat ? 'bg-primary text-primary-foreground' : 'glass glass-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Contact list */}
          <div className="space-y-0.5">
            {filtered.map((contact) => (
              <ContactCard key={contact.id} contact={contact} onSelect={setSelectedContact} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">Nenhum contato encontrado</div>
            )}
          </div>
        </div>
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {selectedContact && (
          <ContactDetail contact={selectedContact} onClose={() => setSelectedContact(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

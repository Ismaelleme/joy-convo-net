import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Volume2, Megaphone, Users, ChevronDown, Plus, Settings, Crown, Shield, Circle } from 'lucide-react';
import { communities, type Community, type Channel } from '@/data/communityData';

const ChannelItem = ({ channel, active, onClick }: { channel: Channel; active: boolean; onClick: () => void }) => {
  const icons = { text: Hash, voice: Volume2, announcement: Megaphone };
  const Icon = icons[channel.type];

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
        active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate flex-1 text-left">{channel.name}</span>
      {channel.unread > 0 && (
        <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
          {channel.unread}
        </span>
      )}
    </button>
  );
};

const ServerIcon = ({ community, active, onClick }: { community: Community; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all hover:rounded-xl ${
      active ? 'bg-primary text-primary-foreground rounded-xl' : 'glass glass-border text-foreground hover:bg-primary/20'
    }`}
  >
    {community.icon}
    {active && (
      <motion.div
        layoutId="server-indicator"
        className="absolute -left-3 w-1 h-8 bg-primary rounded-r-full"
      />
    )}
  </button>
);

const ChatArea = ({ channel, community }: { channel: Channel; community: Community }) => {
  const [message, setMessage] = useState('');

  const mockMessages = [
    { id: '1', user: 'Ana Silva', content: channel.lastMessage || 'Olá pessoal! 👋', time: '14:30', role: 'admin' as const },
    { id: '2', user: 'Carlos Santos', content: 'Fala galera!', time: '14:32', role: 'member' as const },
    { id: '3', user: 'Marina Costa', content: 'Alguém tem dúvidas?', time: '14:35', role: 'mod' as const },
  ];

  const icons = { text: Hash, voice: Volume2, announcement: Megaphone };
  const Icon = icons[channel.type];

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Channel header */}
      <div className="flex items-center gap-2 px-4 py-3 glass glass-border">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <h2 className="font-semibold text-foreground text-sm">{channel.name}</h2>
        <div className="flex-1" />
        <button className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <Users className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-4">
        {mockMessages.map((msg) => (
          <div key={msg.id} className="flex gap-3 group">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
              {msg.user[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{msg.user}</span>
                {msg.role === 'admin' && <Crown className="w-3 h-3 text-amber-400" />}
                {msg.role === 'mod' && <Shield className="w-3 h-3 text-primary" />}
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 glass glass-border rounded-2xl px-4 py-2.5">
          <Plus className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Mensagem em #${channel.name}`}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export function CommunitiesPage() {
  const [activeServerId, setActiveServerId] = useState(communities[0].id);
  const [activeChannelId, setActiveChannelId] = useState(communities[0].channels[0].id);
  const [showChannels, setShowChannels] = useState(true);

  const activeServer = communities.find((s) => s.id === activeServerId)!;
  const activeChannel = activeServer.channels.find((c) => c.id === activeChannelId) || activeServer.channels[0];

  const textChannels = activeServer.channels.filter((c) => c.type !== 'voice');
  const voiceChannels = activeServer.channels.filter((c) => c.type === 'voice');

  return (
    <div className="flex h-full">
      {/* Server list */}
      <div className="w-[72px] flex-shrink-0 glass glass-border flex flex-col items-center gap-2 py-3 overflow-y-auto scrollbar-thin">
        {communities.map((c) => (
          <ServerIcon
            key={c.id}
            community={c}
            active={activeServerId === c.id}
            onClick={() => {
              setActiveServerId(c.id);
              setActiveChannelId(c.channels[0].id);
            }}
          />
        ))}
        <button className="w-12 h-12 rounded-2xl glass glass-border flex items-center justify-center text-primary hover:bg-primary/20 hover:rounded-xl transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Channel list - hidden on small mobile */}
      <div className={`w-60 flex-shrink-0 glass border-r border-border/30 flex-col ${showChannels ? 'hidden md:flex' : 'hidden'}`}>
        {/* Server header */}
        <button className="flex items-center justify-between px-4 py-3 border-b border-border/30 hover:bg-muted/30 transition-colors">
          <h2 className="font-bold text-foreground text-sm truncate">{activeServer.name}</h2>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-3">
          {/* Text channels */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-1">Canais de texto</p>
            {textChannels.map((ch) => (
              <ChannelItem key={ch.id} channel={ch} active={activeChannelId === ch.id} onClick={() => setActiveChannelId(ch.id)} />
            ))}
          </div>

          {/* Voice channels */}
          {voiceChannels.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-1">Canais de voz</p>
              {voiceChannels.map((ch) => (
                <ChannelItem key={ch.id} channel={ch} active={activeChannelId === ch.id} onClick={() => setActiveChannelId(ch.id)} />
              ))}
            </div>
          )}
        </div>

        {/* User bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-t border-border/30 glass">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">V</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">Você</p>
            <p className="text-[10px] text-online flex items-center gap-1"><Circle className="w-2 h-2 fill-current" /> Online</p>
          </div>
          <button className="p-1 rounded hover:bg-muted/50"><Settings className="w-4 h-4 text-muted-foreground" /></button>
        </div>
      </div>

      {/* Chat area */}
      <ChatArea channel={activeChannel} community={activeServer} />
    </div>
  );
}

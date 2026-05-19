import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Search, PhoneCall } from 'lucide-react';
import { callRecords, type CallRecord } from '@/data/callsData';
import { useCallStore } from '@/store/callStore';

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return `${Math.floor(diff / 60000)}m atrás`;
  if (hrs < 24) return `${hrs}h atrás`;
  const days = Math.floor(hrs / 24);
  return `${days}d atrás`;
}

const dirIcons = {
  incoming: PhoneIncoming,
  outgoing: PhoneOutgoing,
  missed: PhoneMissed,
};

const CallItem = ({ call }: { call: CallRecord }) => {
  const DirIcon = dirIcons[call.direction];
  const isMissed = call.direction === 'missed';
  const startCall = useCallStore((s) => s.startCall);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 rounded-2xl transition-all cursor-pointer"
    >
      <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground flex-shrink-0">
        {call.userName[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${isMissed ? 'text-destructive' : 'text-foreground'}`}>{call.userName}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <DirIcon className={`w-3 h-3 ${isMissed ? 'text-destructive' : 'text-muted-foreground'}`} />
          <span>{call.direction === 'incoming' ? 'Recebida' : call.direction === 'outgoing' ? 'Realizada' : 'Perdida'}</span>
          <span>•</span>
          <span>{timeAgo(call.timestamp)}</span>
          {call.duration && (
            <>
              <span>•</span>
              <span>{formatDuration(call.duration)}</span>
            </>
          )}
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); startCall(call.userName, call.type).catch(() => {}); }} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
        {call.type === 'video' ? (
          <Video className="w-5 h-5 text-primary" />
        ) : (
          <Phone className="w-5 h-5 text-primary" />
        )}
      </button>
    </motion.div>
  );
};

export function CallsPage() {
  const [filter, setFilter] = useState<'all' | 'missed'>('all');
  const [search, setSearch] = useState('');

  const filtered = callRecords.filter((c) => {
    const matchFilter = filter === 'all' || c.direction === 'missed';
    const matchSearch = c.userName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-primary" />
            Chamadas
          </h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar chamadas..."
            className="w-full pl-10 pr-4 py-2.5 glass glass-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(['all', 'missed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === f ? 'bg-primary text-primary-foreground' : 'glass glass-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'Todas' : 'Perdidas'}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-1">
          {filtered.map((call) => (
            <CallItem key={call.id} call={call} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Nenhuma chamada encontrada</div>
        )}
      </div>
    </div>
  );
}

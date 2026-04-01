import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, Phone, Users, Bell, MapPin, Plus, AlertCircle, CheckCircle2, XCircle, Send, Zap } from 'lucide-react';
import { scheduleEvents, availableSlots, eventTypeLabels, type ScheduleEvent } from '@/data/scheduleData';
import { toast } from 'sonner';

const typeIcons: Record<string, React.ElementType> = {
  call: Phone,
  meeting: Users,
  reminder: Bell,
  event: CalendarDays,
};

const typeColors: Record<string, string> = {
  call: 'bg-online/15 text-online',
  meeting: 'bg-primary/15 text-primary',
  reminder: 'bg-amber-500/15 text-amber-400',
  event: 'bg-purple-500/15 text-purple-400',
};

const statusIcons: Record<string, React.ElementType> = {
  upcoming: Clock,
  completed: CheckCircle2,
  cancelled: XCircle,
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.getTime() === today.getTime()) return 'Hoje';
  if (d.getTime() === tomorrow.getTime()) return 'Amanhã';
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '');
}

const EventCard = ({ event, index }: { event: ScheduleEvent; index: number }) => {
  const Icon = typeIcons[event.type] || CalendarDays;
  const StatusIcon = statusIcons[event.status] || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass glass-border rounded-2xl p-4 transition-all hover:glass-border-bright hover:glow-xs ${
        event.status === 'cancelled' ? 'opacity-50' : ''
      }`}
    >
      <div className="flex gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[event.type]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`text-sm font-semibold text-foreground ${event.status === 'cancelled' ? 'line-through' : ''}`}>
                {event.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{event.description}</p>
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-lg flex items-center gap-1 flex-shrink-0 ${
              event.status === 'upcoming' ? 'bg-primary/15 text-primary' :
              event.status === 'completed' ? 'bg-online/15 text-online' : 'bg-destructive/15 text-destructive'
            }`}>
              <StatusIcon className="w-2.5 h-2.5" />
              {event.status === 'upcoming' ? 'Pendente' : event.status === 'completed' ? 'Concluído' : 'Cancelado'}
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-3 mt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {event.time} · {event.duration}
            </span>
            {event.contactName && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" /> {event.contactName}
              </span>
            )}
            {event.location && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {event.location}
              </span>
            )}
          </div>

          {event.priority === 'high' && event.status === 'upcoming' && (
            <div className="flex items-center gap-1 mt-2">
              <AlertCircle className="w-3 h-3 text-destructive" />
              <span className="text-[10px] text-destructive font-medium">Alta prioridade</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const NewEventForm = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [type, setType] = useState<string>('meeting');

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const handleSubmit = () => {
    if (!title.trim() || !selectedDate || !selectedTime) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    toast.success('Agendamento criado com sucesso!');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Novo Agendamento</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título do agendamento"
        className="w-full bg-muted/20 rounded-xl border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30 transition-all"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição (opcional)"
        rows={2}
        className="w-full bg-muted/20 rounded-xl border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30 resize-none transition-all"
      />

      {/* Type selector */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(eventTypeLabels).map(([key, label]) => {
          const Icon = typeIcons[key];
          return (
            <button
              key={key}
              onClick={() => setType(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                type === key ? 'bg-primary text-primary-foreground glow-xs' : 'glass glass-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Date picker */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Data</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {dates.map((d) => {
            const dateStr = d.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            return (
              <button
                key={dateStr}
                onClick={() => !isWeekend && setSelectedDate(dateStr)}
                disabled={isWeekend}
                className={`flex-shrink-0 w-14 py-2.5 rounded-xl text-center transition-all ${
                  isWeekend ? 'opacity-30 cursor-not-allowed' :
                  isSelected ? 'bg-primary text-primary-foreground glow-sm' : 'glass glass-border text-foreground hover:bg-muted/30'
                }`}
              >
                <p className="text-[9px] uppercase">{dayName}</p>
                <p className="text-base font-bold">{d.getDate()}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time picker */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Horário</p>
        <div className="grid grid-cols-5 gap-2">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedTime(slot)}
              className={`py-2 rounded-xl text-xs font-medium transition-all ${
                selectedTime === slot ? 'bg-primary text-primary-foreground glow-xs' : 'glass glass-border text-foreground hover:bg-muted/30'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-brand text-primary-foreground rounded-xl font-medium text-sm hover:brightness-110 transition-all glow-sm"
      >
        <Send className="w-4 h-4" />
        Criar Agendamento
      </button>
    </motion.div>
  );
};

export function SchedulePage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [showNewEvent, setShowNewEvent] = useState(false);

  const filtered = scheduleEvents.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const grouped = filtered.reduce<Record<string, ScheduleEvent[]>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();
  const upcomingCount = scheduleEvents.filter(e => e.status === 'upcoming').length;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Agenda</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" />
              {upcomingCount} compromissos pendentes
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNewEvent(true)}
            className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center glow-sm hover:brightness-110 transition-all"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Pendentes', value: upcomingCount, color: 'text-primary' },
            { label: 'Concluídos', value: scheduleEvents.filter(e => e.status === 'completed').length, color: 'text-online' },
            { label: 'Cancelados', value: scheduleEvents.filter(e => e.status === 'cancelled').length, color: 'text-destructive' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass glass-border rounded-xl p-3 text-center"
            >
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { key: 'all' as const, label: 'Todos' },
            { key: 'upcoming' as const, label: 'Pendentes' },
            { key: 'completed' as const, label: 'Concluídos' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === key ? 'bg-primary text-primary-foreground glow-xs' : 'glass glass-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showNewEvent && (
            <div className="glass glass-border rounded-2xl p-5">
              <NewEventForm onClose={() => setShowNewEvent(false)} />
            </div>
          )}
        </AnimatePresence>

        {sortedDates.map((date) => (
          <div key={date}>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 px-1">
              {formatDate(date)}
            </p>
            <div className="space-y-2">
              {grouped[date].map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum agendamento encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

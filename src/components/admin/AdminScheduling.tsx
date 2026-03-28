import { useState } from 'react';
import { appointments as initialAppointments, Appointment, AppointmentStatus } from '@/data/adminData';
import { CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const statusConfig: Record<AppointmentStatus, { label: string; color: string; icon: React.ElementType }> = {
  pendente: { label: 'Pendente', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', icon: AlertCircle },
  confirmado: { label: 'Confirmado', color: 'bg-green-500/15 text-green-400 border-green-500/20', icon: CheckCircle2 },
  cancelado: { label: 'Cancelado', color: 'bg-red-500/15 text-red-400 border-red-500/20', icon: XCircle },
  concluido: { label: 'Concluído', color: 'bg-primary/15 text-primary border-primary/20', icon: CheckCircle2 },
};

export function AdminScheduling() {
  const [items, setItems] = useState<Appointment[]>(initialAppointments);
  const [filter, setFilter] = useState<AppointmentStatus | 'todos'>('todos');

  const filtered = filter === 'todos' ? items : items.filter(a => a.status === filter);

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(`Agendamento ${statusConfig[status].label.toLowerCase()}`);
  };

  const stats = {
    pendente: items.filter(a => a.status === 'pendente').length,
    confirmado: items.filter(a => a.status === 'confirmado').length,
    concluido: items.filter(a => a.status === 'concluido').length,
    cancelado: items.filter(a => a.status === 'cancelado').length,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <CalendarDays className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold font-[Space_Grotesk] text-foreground">Agendamentos</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.entries(stats) as [AppointmentStatus, number][]).map(([key, count]) => {
          const cfg = statusConfig[key];
          const Icon = cfg.icon;
          return (
            <div key={key} className="glass glass-border rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{count}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {['todos', 'pendente', 'confirmado', 'concluido', 'cancelado'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            {f === 'todos' ? 'Todos' : statusConfig[f as AppointmentStatus].label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((apt, i) => {
          const cfg = statusConfig[apt.status];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass glass-border rounded-2xl p-4"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
                    {apt.userAvatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{apt.userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{apt.reason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {format(new Date(apt.date), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {apt.time}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </span>

                  {apt.status === 'pendente' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateStatus(apt.id, 'confirmado')}
                        className="p-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateStatus(apt.id, 'cancelado')}
                        className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {apt.status === 'confirmado' && (
                    <button
                      onClick={() => updateStatus(apt.id, 'concluido')}
                      className="px-2.5 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 transition-colors"
                    >
                      Concluir
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

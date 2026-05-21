import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, Plus, Zap } from 'lucide-react';
import { scheduleEvents as initialEvents, type ScheduleEvent } from '@/data/scheduleData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from './EventCard';
import { EventFormDialog } from './EventFormDialog';
import { toast } from 'sonner';

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

export function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>(initialEvents);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

  const filtered = events.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const grouped = filtered.reduce<Record<string, ScheduleEvent[]>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();
  const upcomingCount = events.filter(e => e.status === 'upcoming').length;
  const completedCount = events.filter(e => e.status === 'completed').length;
  const cancelledCount = events.filter(e => e.status === 'cancelled').length;

  const handleSave = (event: ScheduleEvent) => {
    setEvents(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) return prev.map(e => e.id === event.id ? event : e);
      return [...prev, event];
    });
    setEditingEvent(null);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    toast.success('Agendamento excluído');
  };

  const handleComplete = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'completed' as const } : e));
    toast.success('Agendamento concluído!');
  };

  const handleCancel = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'cancelled' as const } : e));
    toast.success('Compromisso cancelado');
  };

  const handleEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  };

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
          <Button size="sm" className="gap-1.5 rounded-xl" onClick={() => { setEditingEvent(null); setShowForm(true); }}>
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Pendentes', value: upcomingCount, variant: 'default' as const },
            { label: 'Concluídos', value: completedCount, variant: 'secondary' as const },
            { label: 'Cancelados', value: cancelledCount, variant: 'destructive' as const },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <Badge variant={stat.variant} className="text-[10px] mt-1">{stat.label}</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1">Pendentes</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">Concluídos</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Events grouped by date */}
        {sortedDates.map((date) => (
          <div key={date}>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 px-1">
              {formatDate(date)}
            </p>
            <div className="space-y-2">
              {grouped[date].map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={i}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
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

      {/* Form Dialog */}
      <EventFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
        editingEvent={editingEvent}
      />
    </div>
  );
}

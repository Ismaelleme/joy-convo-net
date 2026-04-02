import { useState, useEffect } from 'react';
import { Send, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { availableSlots, eventTypeLabels, type ScheduleEvent } from '@/data/scheduleData';
import { toast } from 'sonner';

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: ScheduleEvent) => void;
  editingEvent?: ScheduleEvent | null;
}

export function EventFormDialog({ open, onOpenChange, onSave, editingEvent }: EventFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [type, setType] = useState<string>('meeting');
  const [priority, setPriority] = useState<string>('medium');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description);
      setSelectedDate(editingEvent.date);
      setSelectedTime(editingEvent.time);
      setType(editingEvent.type);
      setPriority(editingEvent.priority);
      setLocation(editingEvent.location || '');
      setContactName(editingEvent.contactName || '');
    } else {
      setTitle('');
      setDescription('');
      setSelectedDate('');
      setSelectedTime('');
      setType('meeting');
      setPriority('medium');
      setLocation('');
      setContactName('');
    }
  }, [editingEvent, open]);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const handleSubmit = () => {
    if (!title.trim() || !selectedDate || !selectedTime) {
      toast.error('Preencha título, data e horário');
      return;
    }

    const event: ScheduleEvent = {
      id: editingEvent?.id || `ev-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      date: selectedDate,
      time: selectedTime,
      duration: '30min',
      type: type as ScheduleEvent['type'],
      status: editingEvent?.status || 'upcoming',
      priority: priority as ScheduleEvent['priority'],
      location: location.trim() || undefined,
      contactName: contactName.trim() || undefined,
    };

    onSave(event);
    onOpenChange(false);
    toast.success(editingEvent ? 'Agendamento atualizado!' : 'Agendamento criado!');
  };

  const isEditing = !!editingEvent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Altere os dados do agendamento.' : 'Preencha os dados para criar um novo agendamento.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do agendamento" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição (opcional)" rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contact">Contato</Label>
              <Input id="contact" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Nome do contato" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Local</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Local ou link" />
            </div>
          </div>

          {/* Date picker */}
          <div className="space-y-2">
            <Label>Data *</Label>
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
                    className={`flex-shrink-0 w-14 py-2.5 rounded-xl text-center transition-all border ${
                      isWeekend ? 'opacity-30 cursor-not-allowed border-transparent' :
                      isSelected ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'border-border/50 text-foreground hover:bg-accent'
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
          <div className="space-y-2">
            <Label>Horário *</Label>
            <div className="grid grid-cols-5 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 rounded-xl text-xs font-medium transition-all border ${
                    selectedTime === slot ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'border-border/50 text-foreground hover:bg-accent'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} className="gap-1.5">
            <Send className="w-4 h-4" />
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

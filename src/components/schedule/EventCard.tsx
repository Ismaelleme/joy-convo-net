import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Phone, Users, Bell, CalendarDays, MapPin, AlertCircle, CheckCircle2, XCircle, Pencil, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { type ScheduleEvent } from '@/data/scheduleData';

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

interface EventCardProps {
  event: ScheduleEvent;
  index: number;
  onEdit: (event: ScheduleEvent) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function EventCard({ event, index, onEdit, onDelete, onComplete }: EventCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const Icon = typeIcons[event.type] || CalendarDays;

  const statusVariant = event.status === 'upcoming' ? 'default' : event.status === 'completed' ? 'secondary' : 'destructive';
  const statusLabel = event.status === 'upcoming' ? 'Pendente' : event.status === 'completed' ? 'Concluído' : 'Cancelado';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
      >
        <Card className={`border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group ${
          event.status === 'cancelled' ? 'opacity-50' : ''
        }`}>
          <CardContent className="p-4">
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
                  <Badge variant={statusVariant} className="text-[10px] flex-shrink-0">
                    {statusLabel}
                  </Badge>
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

                {/* Action buttons - visible on hover or always on mobile */}
                <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-border/20">
                  {event.status === 'upcoming' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs gap-1 text-online hover:text-online hover:bg-online/10"
                      onClick={() => onComplete(event.id)}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Concluir
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs gap-1 hover:bg-primary/10"
                    onClick={() => onEdit(event)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir agendamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir "{event.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(event.id);
                setShowDeleteDialog(false);
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

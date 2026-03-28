import { useState } from 'react';
import { CalendarDays, Clock, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { availableSlots } from '@/data/adminData';
import { toast } from 'sonner';

const UserSchedule = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }
    setSubmitted(true);
    toast.success('Agendamento solicitado com sucesso!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background bg-noise flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass glass-border rounded-3xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </motion.div>
          <h2 className="text-xl font-bold font-[Space_Grotesk] text-foreground mb-2">
            Agendamento Solicitado!
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Você receberá uma confirmação em breve.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-brand text-primary-foreground rounded-xl font-medium text-sm hover:brightness-110 transition-all glow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-noise">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-[Space_Grotesk] text-foreground">Agendar</h1>
            <p className="text-sm text-muted-foreground">Escolha uma data e horário disponível</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Date picker */}
          <section className="glass glass-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-primary" />
              Selecione a Data
            </h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
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
                    className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                      isWeekend
                        ? 'opacity-30 cursor-not-allowed'
                        : isSelected
                        ? 'bg-primary text-primary-foreground glow-sm'
                        : 'hover:bg-muted/30 text-foreground'
                    }`}
                  >
                    <p className="text-[10px] uppercase">{dayName}</p>
                    <p className="text-lg font-bold">{d.getDate()}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Time slots */}
          <section className="glass glass-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              Selecione o Horário
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground glow-sm'
                        : 'glass glass-border text-foreground hover:bg-muted/30'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Reason */}
          <section className="glass glass-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Motivo</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva brevemente o motivo do agendamento..."
              rows={3}
              className="w-full bg-muted/20 rounded-xl border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            />
          </section>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-brand text-primary-foreground rounded-xl font-medium text-sm hover:brightness-110 transition-all glow-sm"
          >
            <Send className="w-4 h-4" />
            Solicitar Agendamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSchedule;

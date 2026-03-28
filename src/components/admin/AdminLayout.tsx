import { useState } from 'react';
import { Settings, Mail, CalendarDays, ArrowLeft, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'configuracoes' | 'mensagens' | 'agendamentos';
  onTabChange: (tab: 'configuracoes' | 'mensagens' | 'agendamentos') => void;
  unreadMessages?: number;
  pendingAppointments?: number;
}

const navItems = [
  { key: 'configuracoes' as const, label: 'Configurações', icon: Settings },
  { key: 'mensagens' as const, label: 'Mensagens', icon: Mail },
  { key: 'agendamentos' as const, label: 'Agendamentos', icon: CalendarDays },
];

export function AdminLayout({ children, activeTab, onTabChange, unreadMessages = 0, pendingAppointments = 0 }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const badges: Record<string, number> = {
    mensagens: unreadMessages,
    agendamentos: pendingAppointments,
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background bg-noise">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 glass glass-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center glow-sm">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-[Space_Grotesk] text-foreground">Painel Admin</h2>
              <p className="text-[10px] text-muted-foreground">iSync Management</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            const badge = badges[key] || 0;
            return (
              <button
                key={key}
                onClick={() => { onTabChange(key); setSidebarOpen(false); }}
                className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-nav-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {badge > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao App
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex items-center gap-3 p-4 glass glass-border md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold font-[Space_Grotesk] text-foreground">
            {navItems.find(n => n.key === activeTab)?.label}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

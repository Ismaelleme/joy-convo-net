import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminMessages } from '@/components/admin/AdminMessages';
import { AdminScheduling } from '@/components/admin/AdminScheduling';
import { adminMessages, appointments } from '@/data/adminData';

type AdminTab = 'configuracoes' | 'mensagens' | 'agendamentos';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('configuracoes');

  const unreadMessages = adminMessages.filter(m => !m.read).length;
  const pendingAppointments = appointments.filter(a => a.status === 'pendente').length;

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      unreadMessages={unreadMessages}
      pendingAppointments={pendingAppointments}
    >
      {activeTab === 'configuracoes' && <AdminSettings />}
      {activeTab === 'mensagens' && <AdminMessages />}
      {activeTab === 'agendamentos' && <AdminScheduling />}
    </AdminLayout>
  );
};

export default AdminPanel;

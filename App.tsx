
// @google/genai coding guidelines followed.
import React, { useState, useEffect, useCallback } from 'react';
import { CustomerApp } from './views/CustomerApp';
import { DriverApp } from './views/DriverApp';
import { ManagerApp } from './views/ManagerApp';
import { OwnerApp } from './views/OwnerApp';
import { UserRole, Order, AppNotification, ActivityLog, Restaurant, SystemUser } from './types';
import { MOCK_RESTAURANTS } from './constants';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('OWNER');
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  // Simplified initialization since MOCK_RESTAURANTS is already Restaurant[]
  const [partners, setPartners] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [users, setUsers] = useState<SystemUser[]>([
    { id: 'u1', name: 'Nunes Junior', role: 'OWNER', status: 'ACTIVE', email: 'nunes@moz.com' },
    { id: 'u2', name: 'João Estafeta', role: 'DRIVER', status: 'ACTIVE', email: 'joao@moz.com' },
    { id: 'u3', name: 'Maria Gestora', role: 'MANAGER', status: 'ACTIVE', email: 'maria@moz.com' },
  ]);

  const addLog = useCallback((user: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      user,
      action,
      details,
      timestamp: Date.now()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  }, []);

  const notify = useCallback((targetRole: UserRole, title: string, message: string, type: AppNotification['type'] = 'INFO') => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      targetRole,
      timestamp: Date.now()
    };
    setNotifications(prev => [newNotif, ...prev]);
    
    if (targetRole === role || role === 'OWNER') {
      setActiveToast(newNotif);
      setTimeout(() => setActiveToast(null), 5000);
    }
  }, [role]);

  const updateOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (updates.status) addLog(role, 'ALTEROU STATUS', `Pedido #${orderId} para ${updates.status}`);
        return { ...o, ...updates };
      }
      return o;
    }));
  }, [role, addLog]);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isDeletedByCustomer: true } : o));
    addLog(role, 'ELIMINAR PEDIDO', `Cliente ocultou pedido #${orderId}`);
  }, [role, addLog]);

  const addOrder = useCallback((order: Order) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const orderWithCode = { ...order, confirmationCode: code };
    setOrders(prev => [orderWithCode, ...prev]);
    addLog('CLIENTE', 'NOVO PEDIDO', `Pedido #${order.id} no ${order.restaurantName}`);
    notify('MANAGER', 'Novo Pedido!', `Cliente ${order.customerName} fez um pedido. Cód: ${code}`, 'SUCCESS');
  }, [notify, addLog]);

  const managePartner = (action: 'ADD' | 'DELETE', partner: Restaurant) => {
    if (action === 'ADD') {
      setPartners(prev => [...prev, partner]);
      addLog('OWNER', 'ADICIONAR PARCEIRO', `Novo ${partner.type}: ${partner.name}`);
    } else {
      setPartners(prev => prev.filter(p => p.id !== partner.id));
      addLog('OWNER', 'REMOVER PARCEIRO', `Removeu ${partner.name}`);
    }
  };

  const manageUser = (action: 'ADD' | 'STATUS', user: SystemUser) => {
    if (action === 'ADD') {
      setUsers(prev => [...prev, user]);
      addLog('OWNER', 'NOVO USUÁRIO', `Adicionou ${user.name} como ${user.role}`);
    } else {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u));
      addLog('OWNER', 'ALTERAR STATUS USUÁRIO', `Mudou status de ${user.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-2 flex items-center justify-between shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <h1 className="font-bold text-gray-800 hidden sm:block">Moz Delivery <span className="text-orange-500">Owner</span></h1>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {['CUSTOMER', 'DRIVER', 'MANAGER', 'OWNER'].map((r) => (
            <button 
              key={r}
              onClick={() => setRole(r as UserRole)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${role === r ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700 uppercase'}`}
            >
              {r === 'CUSTOMER' ? 'Cliente' : r === 'DRIVER' ? 'Staff' : r === 'MANAGER' ? 'Gestão' : '👑 Admin'}
            </button>
          ))}
        </div>
      </div>

      {activeToast && (
        <div className="fixed top-16 right-4 z-[60] animate-bounce-in max-w-xs w-full">
          <div className={`p-4 rounded-xl shadow-2xl border-l-4 ${
            activeToast.type === 'SUCCESS' ? 'bg-green-50 border-green-500 text-green-800' : 
            activeToast.type === 'WARNING' ? 'bg-orange-50 border-orange-500 text-orange-800' : 
            'bg-blue-50 border-blue-500 text-blue-800'
          }`}>
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-sm">{activeToast.title}</h4>
              <button onClick={() => setActiveToast(null)} className="text-lg leading-none">&times;</button>
            </div>
            <p className="text-xs mt-1">{activeToast.message}</p>
          </div>
        </div>
      )}

      <main className="pt-16 px-4">
        {role === 'CUSTOMER' && (
          <CustomerApp 
            globalOrders={orders} 
            onPlaceOrder={addOrder} 
            onDeleteOrder={deleteOrder} 
            onUpdateOrder={updateOrder}
            onNotify={notify}
          />
        )}
        {role === 'DRIVER' && <DriverApp globalOrders={orders} onUpdateOrder={updateOrder} onNotify={notify} />}
        {role === 'MANAGER' && <ManagerApp globalOrders={orders} onUpdateOrder={updateOrder} onNotify={notify} />}
        {role === 'OWNER' && (
          <OwnerApp 
            orders={orders} 
            logs={activityLogs} 
            partners={partners} 
            users={users}
            onManagePartner={managePartner}
            onManageUser={manageUser}
          />
        )}
      </main>

      <footer className="text-center py-8 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
        <p>© 2024 Inovação Delivery Moz • Auditado & Seguro</p>
      </footer>
    </div>
  );
};

export default App;

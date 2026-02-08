
import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Order, ActivityLog, Restaurant, SystemUser, UserRole } from '../types';

interface OwnerAppProps {
  orders: Order[];
  logs: ActivityLog[];
  partners: Restaurant[];
  users: SystemUser[];
  onManagePartner: (action: 'ADD' | 'DELETE', partner: Restaurant) => void;
  onManageUser: (action: 'ADD' | 'STATUS', user: SystemUser) => void;
}

export const OwnerApp: React.FC<OwnerAppProps> = ({ orders, logs, partners, users, onManagePartner, onManageUser }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PARTNERS' | 'TEAM' | 'LOGS'>('DASHBOARD');

  const stats = {
    revenue: orders.filter(o => o.status === 'DELIVERED').reduce((acc, curr) => acc + curr.total, 0),
    orderCount: orders.length,
    activeDrivers: users.filter(u => u.role === 'DRIVER' && u.status === 'ACTIVE').length,
    partnerCount: partners.length
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Painel de Controle <span className="text-orange-600">Admin</span></h1>
          <p className="text-gray-500 text-sm font-medium">Moz Delivery - Supervisão Geral de Nampula</p>
        </div>
        <div className="flex bg-white rounded-2xl shadow-sm border p-1 gap-1 w-full md:w-auto overflow-x-auto no-scrollbar">
          {(['DASHBOARD', 'PARTNERS', 'TEAM', 'LOGS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {tab === 'TEAM' ? 'Equipa' : tab === 'PARTNERS' ? 'Parceiros' : tab === 'LOGS' ? 'Atividade' : 'Geral'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'DASHBOARD' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 border-none shadow-xl shadow-orange-100 bg-orange-600 text-white">
              <p className="text-[10px] font-black uppercase opacity-80 mb-1">Receita Total</p>
              <p className="text-3xl font-black">{stats.revenue} <span className="text-sm font-normal">MT</span></p>
            </Card>
            <Card className="p-6 bg-white border-none shadow-xl shadow-gray-200/50">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Pedidos Totais</p>
              <p className="text-3xl font-black text-gray-800">{stats.orderCount}</p>
            </Card>
            <Card className="p-6 bg-white border-none shadow-xl shadow-gray-200/50">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Parceiros Ativos</p>
              <p className="text-3xl font-black text-gray-800">{stats.partnerCount}</p>
            </Card>
            <Card className="p-6 bg-white border-none shadow-xl shadow-gray-200/50">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Staff Online</p>
              <p className="text-3xl font-black text-green-600">{stats.activeDrivers}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-6 bg-white rounded-3xl border-none shadow-xl shadow-gray-200/50">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-orange-600 rounded-full"></span>
                Últimos Pedidos do Sistema
              </h3>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-center py-12 text-gray-300 font-bold">Sem pedidos recentes.</p>
                ) : orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex gap-3 items-center">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">🍔</div>
                       <div>
                         <p className="font-black text-xs text-gray-800">{order.restaurantName}</p>
                         <p className="text-[10px] text-gray-400">Cliente: {order.customerName}</p>
                       </div>
                    </div>
                    <Badge color={order.status === 'DELIVERED' ? 'green' : 'orange'}>{order.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-indigo-900 text-white rounded-3xl border-none shadow-xl">
               <h3 className="font-black mb-4">Meta Diária Nampula</h3>
               <div className="space-y-4">
                 <div className="flex justify-between text-xs font-bold">
                   <span>Volume de Vendas</span>
                   <span>75%</span>
                 </div>
                 <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-orange-500"></div>
                 </div>
                 <p className="text-[10px] opacity-70">Expandindo para 12 novos bairros no próximo mês.</p>
               </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'PARTNERS' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900">Gestão de Parceiros</h3>
            <Button className="text-[10px] py-2 px-6" onClick={() => {
              const name = prompt('Nome do parceiro?');
              const type = prompt('Tipo? (RESTAURANT, MARKET, TAKEAWAY)') as any;
              if(name && type) {
                onManagePartner('ADD', {
                  id: Math.random().toString(),
                  name,
                  type,
                  category: 'Geral',
                  rating: 5,
                  deliveryTime: '30 min',
                  image: 'https://picsum.photos/seed/new/400/250',
                  menu: []
                });
              }
            }}>+ Adicionar Parceiro</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map(p => (
              <Card key={p.id} className="p-6 border-none shadow-xl shadow-gray-200/50 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <Badge color="blue">{p.type}</Badge>
                </div>
                <h4 className="font-black text-gray-900 text-lg group-hover:text-orange-600 transition-colors">{p.name}</h4>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{p.category}</p>
                <div className="mt-6 flex gap-2">
                   <Button variant="outline" className="flex-1 py-1 text-[10px]">Editar Menu</Button>
                   <Button variant="danger" className="p-2" onClick={() => onManagePartner('DELETE', p)}>🗑️</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'TEAM' && (
        <Card className="p-8 bg-white border-none shadow-xl shadow-gray-200/50 rounded-[2rem]">
          <h3 className="text-xl font-black text-gray-900 mb-8">Controle de Equipa (Staff & Gestão)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-4">Nome</th>
                  <th className="pb-4">Papel</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="group">
                    <td className="py-4 font-bold text-gray-800 text-sm">{u.name}</td>
                    <td className="py-4">
                      <Badge color={u.role === 'OWNER' ? 'orange' : u.role === 'DRIVER' ? 'green' : 'blue'}>{u.role}</Badge>
                    </td>
                    <td className="py-4 text-xs text-gray-500 font-medium">{u.email}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black uppercase ${u.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>{u.status}</span>
                    </td>
                    <td className="py-4 text-right">
                       <button 
                        onClick={() => onManageUser('STATUS', u)}
                        className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${u.status === 'ACTIVE' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                       >
                         {u.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'LOGS' && (
        <Card className="p-8 bg-white border-none shadow-xl shadow-gray-200/50 rounded-[2rem]">
          <h3 className="text-xl font-black text-gray-900 mb-8">Auditoria de Atividade em Tempo Real</h3>
          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-center py-20 text-gray-300 font-bold uppercase tracking-widest">Aguardando novos eventos...</p>
            ) : logs.map(log => (
              <div key={log.id} className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors border-l-4 border-orange-500">
                <div className="text-[10px] font-black text-gray-400 w-24 pt-1">{new Date(log.timestamp).toLocaleTimeString()}</div>
                <div>
                  <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{log.user} • {log.action}</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { MOCK_RESTAURANTS } from '../constants';
import { Order, OrderStatus, UserRole } from '../types';

interface ManagerAppProps {
  globalOrders: Order[];
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onNotify: (role: UserRole, title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING') => void;
}

export const ManagerApp: React.FC<ManagerAppProps> = ({ globalOrders, onUpdateOrder, onNotify }) => {
  const [selectedRest] = useState(MOCK_RESTAURANTS[0]);
  const [confirmRefuseId, setConfirmRefuseId] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, newStatus: OrderStatus, time?: string) => {
    onUpdateOrder(id, { status: newStatus, prepTime: time });
    setConfirmRefuseId(null);
    
    if (newStatus === 'PREPARING') {
      onNotify('CUSTOMER', 'Pedido Confirmado!', `Seu prato começou a ser preparado. Tempo estimado: ${time}`, 'SUCCESS');
    } else if (newStatus === 'READY_FOR_PICKUP') {
      onNotify('DRIVER', 'Coleta em Nampula', `Pedido do ${selectedRest.name} pronto para coleta.`, 'WARNING');
    } else if (newStatus === 'REFUSED') {
      onNotify('CUSTOMER', 'Lamentamos', 'O restaurante não pôde processar o pedido neste momento.', 'WARNING');
    }
  };

  const stats = {
    total: globalOrders.filter(o => o.status === 'DELIVERED').reduce((acc, curr) => acc + curr.total, 0),
    pending: globalOrders.filter(o => o.status === 'PENDING').length,
    active: globalOrders.filter(o => o.status !== 'DELIVERED' && o.status !== 'REFUSED').length
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Gestão Nampula <span className="text-orange-600">HUB</span></h1>
          <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
            🏢 {selectedRest.name} <span className="w-1 h-1 bg-gray-300 rounded-full"></span> 📡 Sistema de Segurança Ativo
          </p>
        </div>
        <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
           <div className="px-4 py-2 border-r border-gray-50">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pendentes</p>
             <p className="text-xl font-black text-orange-600">{stats.pending}</p>
           </div>
           <div className="px-4 py-2">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Hoje</p>
             <p className="text-xl font-black text-gray-900">{stats.total} MT</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 bg-white min-h-[500px] border-none shadow-xl shadow-gray-200/50 rounded-[2rem]">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-sm">⚡</span>
              Monitor de Pedidos e Códigos
            </h3>
            
            <div className="space-y-6">
              {globalOrders.length === 0 ? (
                <div className="text-center py-24 opacity-30">
                  <p className="text-7xl mb-4">🛸</p>
                  <p className="font-bold">Aguardando novos pedidos em Nampula...</p>
                </div>
              ) : globalOrders.map(order => (
                <div key={order.id} className={`group p-6 rounded-3xl border-2 transition-all duration-300 ${order.status === 'PENDING' ? 'bg-orange-50/30 border-orange-200 ring-4 ring-orange-50' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:bg-white transition-colors">🍱</div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg leading-tight">{order.customerName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{order.id}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span className="text-[10px] font-bold text-blue-500 uppercase">{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                    
                    {order.status !== 'REFUSED' && (
                      <div className="bg-blue-600 px-6 py-3 rounded-2xl text-center shadow-lg shadow-blue-100 w-full md:w-auto">
                        <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1">Código de Segurança</p>
                        <p className="font-mono text-2xl font-black text-white tracking-[0.2em]">{order.confirmationCode}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                       <Badge color={
                         order.status === 'DELIVERED' ? 'green' : 
                         order.status === 'OUT_FOR_DELIVERY' ? 'blue' : 'orange'
                       }>
                         {order.status.replace(/_/g, ' ')}
                       </Badge>
                       {order.status === 'OUT_FOR_DELIVERY' && (
                         <span className="text-[10px] font-black text-orange-600 animate-pulse uppercase tracking-tighter">Aguardando Cliente...</span>
                       )}
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      {order.status === 'PENDING' && (
                        <>
                          <select id={`t-${order.id}`} className="text-xs font-bold p-3 rounded-xl border-2 border-gray-100 bg-white outline-none focus:border-orange-500" defaultValue="20 min">
                            <option value="15 min">15 min</option>
                            <option value="20 min">20 min</option>
                            <option value="30 min">30 min</option>
                          </select>
                          <Button variant="secondary" className="flex-1 sm:flex-none px-8 py-3 rounded-xl shadow-lg shadow-green-100" onClick={() => handleUpdateStatus(order.id, 'PREPARING', (document.getElementById(`t-${order.id}`) as HTMLSelectElement).value)}>Aceitar</Button>
                        </>
                      )}
                      {order.status === 'PREPARING' && (
                        <Button className="w-full sm:w-auto px-8 py-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-100 font-bold" onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}>📦 Pronto p/ Estafeta</Button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest">
                          <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-[10px]">✔</span>
                          Pagamento Confirmado
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-8 bg-gradient-to-br from-blue-700 to-indigo-900 text-white shadow-2xl rounded-[2.5rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">🛡️</div>
             <h4 className="font-black text-xl mb-4 uppercase tracking-tighter">Protocolo de Confirmação</h4>
             <p className="text-sm opacity-90 leading-relaxed font-medium mb-6">
               Para garantir a segurança das transações em Nampula, cada pedido gera um código único. 
               O estafeta só será liberado após o cliente inserir este código no App, confirmando a recepção e o pagamento.
             </p>
             <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1 text-orange-300">Dica do Gestor</p>
                <p className="text-xs font-bold">Comunique o código via WhatsApp se o cliente tiver dificuldades de rede.</p>
             </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-100 rounded-3xl">
             <h4 className="font-black text-gray-800 text-xs uppercase tracking-widest mb-4">Links Rápidos</h4>
             <div className="space-y-2">
                <button className="w-full p-3 bg-gray-50 rounded-xl text-left text-xs font-bold hover:bg-orange-50 hover:text-orange-600 transition-all flex justify-between items-center">
                   Suporte Moz Delivery 💬 <span>→</span>
                </button>
                <button className="w-full p-3 bg-gray-50 rounded-xl text-left text-xs font-bold hover:bg-orange-50 hover:text-orange-600 transition-all flex justify-between items-center">
                   Relatório de Vendas 📊 <span>→</span>
                </button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

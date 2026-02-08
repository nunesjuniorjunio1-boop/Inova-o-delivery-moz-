
import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Order, OrderStatus, UserRole } from '../types';
// Fix: Import CONTACTS from constants.ts to resolve usage in line 103
import { CONTACTS } from '../constants';

interface DriverAppProps {
  globalOrders: Order[];
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onNotify: (role: UserRole, title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING') => void;
}

export const DriverApp: React.FC<DriverAppProps> = ({ globalOrders, onUpdateOrder, onNotify }) => {
  const [online, setOnline] = useState(false);
  const [earnings, setEarnings] = useState(1250);

  const availableOrders = globalOrders.filter(o => o.status === 'READY_FOR_PICKUP' && !o.driverId);
  const myActiveOrders = globalOrders.filter(o => o.driverId === 'joao_123' && o.status !== 'DELIVERED');

  const handleAcceptOrder = (order: Order) => {
    onUpdateOrder(order.id, { driverId: 'joao_123', status: 'OUT_FOR_DELIVERY' });
    
    // Notify Manager and Customer simultaneously
    onNotify('MANAGER', 'Estafeta a caminho!', `O estafeta João aceitou o pedido #${order.id} e está a caminho da recolha.`, 'INFO');
    onNotify('CUSTOMER', 'Estafeta alocado!', 'O João aceitou seu pedido e já está a caminho do restaurante.', 'SUCCESS');
  };

  const handleConfirmPickup = (order: Order) => {
    onUpdateOrder(order.id, { status: 'OUT_FOR_DELIVERY' }); // Already set in accept for speed, but formally updated here if needed
    onNotify('MANAGER', 'Recolha Concluída', `O estafeta João recolheu o pedido #${order.id}.`, 'SUCCESS');
    onNotify('CUSTOMER', 'Pedido a Caminho!', 'O estafeta acabou de recolher sua refeição no restaurante.', 'SUCCESS');
  };

  const handleDeliver = (order: Order) => {
    onUpdateOrder(order.id, { status: 'DELIVERED' });
    setEarnings(prev => prev + 150);
    
    onNotify('MANAGER', 'Pedido Entregue', `O estafeta João entregou o pedido #${order.id}.`, 'SUCCESS');
    onNotify('CUSTOMER', 'Chegamos!', 'Seu pedido foi entregue. Bom apetite!', 'SUCCESS');
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold">Olá, João! 🛵</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Nampula Central</p>
        </div>
        <div className="flex flex-col items-end">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={online} onChange={() => setOnline(!online)} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            <span className="ml-2 text-sm font-medium text-gray-900">{online ? 'Online' : 'Offline'}</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-orange-500 text-white shadow-lg shadow-orange-100">
          <p className="text-[10px] opacity-80 font-bold uppercase">Ganhos Hoje</p>
          <p className="text-2xl font-black">{earnings} <span className="text-sm font-normal">MT</span></p>
        </Card>
        <Card className="p-4 bg-white border border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Entregas</p>
          <p className="text-2xl font-black text-gray-800">12</p>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          Pedidos Disponíveis 
          {availableOrders.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{availableOrders.length}</span>}
        </h3>
        
        {!online ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
             <p className="text-gray-400 text-sm">Fique Online para ver as oportunidades em Nampula.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myActiveOrders.map(order => (
              <Card key={order.id} className="p-6 border-2 border-orange-500 bg-white animate-fadeIn shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge color="blue">Pedido Ativo #{order.id}</Badge>
                    <h3 className="text-xl font-bold mt-2">{order.restaurantName}</h3>
                    <p className="text-sm text-gray-500">Destino: {order.neighborhood}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-orange-600">150 MT</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mt-4">
                   {order.status === 'OUT_FOR_DELIVERY' ? (
                     <Button className="w-full py-4 shadow-lg shadow-green-100" variant="secondary" onClick={() => handleDeliver(order)}>
                       🏁 Confirmar Entrega
                     </Button>
                   ) : (
                     <Button className="w-full py-4" onClick={() => handleConfirmPickup(order)}>
                       📦 Recolher Pedido
                     </Button>
                   )}
                   <Button variant="outline" className="w-full text-xs" onClick={() => window.open(`tel:${CONTACTS.WHATSAPP}`)}>Ligar para Cliente</Button>
                </div>
              </Card>
            ))}

            {availableOrders.map(order => (
              <Card key={order.id} className="p-4 flex justify-between items-center border-l-4 border-blue-500 bg-white shadow-sm hover:shadow-md transition-all">
                <div>
                  <h4 className="font-bold text-gray-800">{order.restaurantName}</h4>
                  <p className="text-xs text-gray-500">📍 Para: {order.neighborhood}</p>
                  <p className="text-sm font-bold text-green-600 mt-1">+150 MT</p>
                </div>
                <Button onClick={() => handleAcceptOrder(order)} className="px-5 py-2 text-xs">Aceitar</Button>
              </Card>
            ))}
            
            {availableOrders.length === 0 && myActiveOrders.length === 0 && (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">📍</p>
                <p className="text-gray-400">Procurando pedidos perto de você...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

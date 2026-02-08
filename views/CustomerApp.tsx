
import React, { useState } from 'react';
import { MOCK_RESTAURANTS, CONTACTS, NAMPULA_LANDMARKS } from '../constants';
import { Card, Button, Badge } from '../components/UI';
import { Restaurant, MenuItem, CartItem, Order, UserRole } from '../types';

interface CustomerAppProps {
  globalOrders: Order[];
  onPlaceOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onNotify: (role: UserRole, title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING') => void;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({ globalOrders, onPlaceOrder, onDeleteOrder, onUpdateOrder, onNotify }) => {
  const [view, setView] = useState<'home' | 'restaurant' | 'cart' | 'tracking' | 'history'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState(false);

  const activeOrder = globalOrders.find(o => o.id === activeOrderId);
  const visibleHistory = globalOrders.filter(o => !o.isDeletedByCustomer);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const shareToWhatsApp = (order: Order) => {
    const text = `*Moz Delivery Nampula*%0A%0A*Pedido:* #${order.id}%0A*Restaurante:* ${order.restaurantName}%0A*Status:* ${order.status}%0A*Total:* ${order.total} MT%0A%0A_Acompanhe pelo app!_`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handlePlaceOrder = (method: 'MPESA' | 'EMOLA' | 'CASH' | 'CARD') => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      customerName: 'Cliente Nampula',
      restaurantName: selectedRestaurant?.name || 'Restaurante',
      items: cart,
      total: cartTotal + 50,
      status: 'PENDING',
      paymentMethod: method,
      neighborhood: 'Central',
      timestamp: Date.now()
    };
    onPlaceOrder(newOrder);
    setActiveOrderId(newOrder.id);
    setCart([]);
    setView('tracking');
  };

  const handleConfirmDelivery = () => {
    if (activeOrder && inputCode === activeOrder.confirmationCode) {
      onUpdateOrder(activeOrder.id, { status: 'DELIVERED' });
      onNotify('MANAGER', 'Entrega Confirmada pelo Cliente', `O cliente confirmou a recepção do pedido #${activeOrder.id} e validou o pagamento.`, 'SUCCESS');
      onNotify('DRIVER', 'Entrega Finalizada', `O cliente validou o código para o pedido #${activeOrder.id}. Bom trabalho!`, 'SUCCESS');
      setInputCode('');
      setCodeError(false);
    } else {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 2000);
    }
  };

  const renderHome = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Olá, Nampula! 👋</h2>
          <p className="text-gray-500 text-sm flex items-center gap-1 font-medium">
            📍 <span className="font-bold text-orange-600 underline decoration-orange-200">{NAMPULA_LANDMARKS[0]}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('history')} className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-xl hover:bg-gray-50 transition-colors">
            📜
          </button>
          {activeOrderId && (
            <button onClick={() => setView('tracking')} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg animate-pulse text-xl">
              🛰️
            </button>
          )}
          <button onClick={() => setView('cart')} className="relative p-3 bg-white rounded-xl shadow-sm border border-orange-200 text-xl hover:bg-orange-50 transition-colors">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="O que deseja hoje? (Refeição, Mercado...)"
          className="w-full p-4 pl-12 rounded-2xl bg-white shadow-xl shadow-gray-100 border-none focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_RESTAURANTS.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(restaurant => (
          <Card key={restaurant.id} className="cursor-pointer group hover:scale-[1.02] transition-all duration-300 border-none shadow-xl shadow-gray-200/50">
            <div onClick={() => { setSelectedRestaurant(restaurant); setView('restaurant'); }}>
              <div className="h-40 relative">
                <img src={restaurant.image} className="w-full h-full object-cover" alt={restaurant.name} />
                <div className="absolute top-2 right-2 flex gap-1">
                   <Badge color="green">Aberto</Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-black text-gray-900 text-lg group-hover:text-orange-600 transition-colors">{restaurant.name}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{restaurant.category} • {restaurant.deliveryTime}</p>
                <div className="flex items-center gap-1 mt-3">
                  <span className="text-orange-500 font-bold text-xs">📍 {restaurant.landmark}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRestaurant = () => selectedRestaurant && (
    <div className="space-y-6 animate-fadeIn pb-24">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('home')} className="p-3 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50">⬅️</button>
        <h2 className="text-2xl font-black text-gray-900">{selectedRestaurant.name}</h2>
      </div>

      <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <img src={selectedRestaurant.image} className="w-full h-full object-cover" alt={selectedRestaurant.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
           <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-1">{selectedRestaurant.category}</p>
           <h3 className="text-white text-3xl font-black leading-tight">{selectedRestaurant.name}</h3>
           <p className="text-white/60 text-xs font-medium mt-2 flex items-center gap-2">📍 {selectedRestaurant.landmark}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 uppercase tracking-tighter">
          <span className="w-2 h-6 bg-orange-600 rounded-full"></span>
          Cardápio Disponível
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {selectedRestaurant.menu.map(item => (
            <Card key={item.id} className="flex p-4 gap-4 border-none shadow-lg shadow-gray-100 hover:scale-[1.01] transition-all">
              <img src={item.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm" alt={item.name} />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-gray-900 text-sm">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 font-medium line-clamp-2 mt-1">{item.description}</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-black text-orange-600 text-lg">{item.price} MT</span>
                  <button 
                    onClick={() => addToCart(item)} 
                    className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-orange-200 active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 max-w-lg mx-auto z-40">
          <Button onClick={() => setView('cart')} className="w-full py-5 shadow-2xl flex justify-between px-8 rounded-3xl bg-orange-600">
            <span className="flex items-center gap-2 font-black uppercase text-xs tracking-widest">🛒 Ver Carrinho <Badge color="orange">{cart.length}</Badge></span>
            <span className="font-black text-xl">{cartTotal} MT</span>
          </Button>
        </div>
      )}
    </div>
  );

  const renderCart = () => (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => setView(selectedRestaurant ? 'restaurant' : 'home')} className="p-3 bg-white rounded-full shadow-sm border border-gray-100">⬅️</button>
        <h2 className="text-2xl font-black text-gray-900">Minha Carrinha</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-xl shadow-gray-100">
          <p className="text-7xl mb-6">📦</p>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Vazio por aqui em Nampula.</p>
          <Button onClick={() => setView('home')} className="mt-8 px-12 rounded-2xl">Voltar ao Mercado</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm border-none">
                <div className="flex gap-4 items-center">
                  <img src={item.image} className="w-14 h-14 rounded-xl object-cover" alt="" />
                  <div>
                    <p className="font-black text-gray-900 text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-orange-600 font-bold">{item.price} MT</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                   <button onClick={() => {
                     setCart(prev => prev.map(i => i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i).filter(i => i.quantity > 0))
                   }} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-gray-600 hover:text-orange-600 transition-colors">-</button>
                   <span className="w-6 text-center font-black text-sm">{item.quantity}</span>
                   <button onClick={() => addToCart(item)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-gray-600 hover:text-orange-600 transition-colors">+</button>
                </div>
              </div>
            ))}
          </div>

          <Card className="p-8 space-y-5 rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50">
            <h4 className="font-black text-gray-900 uppercase text-[10px] tracking-[0.2em] border-b border-gray-50 pb-4">Resumo da Conta</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Subtotal Itens</span>
                <span>{cartTotal} MT</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Taxa Nampula Hub</span>
                <span>50 MT</span>
              </div>
              <div className="flex justify-between font-black text-2xl border-t border-gray-50 pt-5 text-gray-900">
                <span>Total</span>
                <span className="text-orange-600">{cartTotal + 50} MT</span>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Métodos de Pagamento em Moçambique 🇲🇿</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border-2 border-transparent hover:border-red-500 hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-gray-100" 
                onClick={() => handlePlaceOrder('MPESA')}
              >
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-3 shadow-lg shadow-red-200">M</div>
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">M-Pesa</span>
                <span className="text-[9px] text-gray-400 mt-1 font-mono">{CONTACTS.MPESA}</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border-2 border-transparent hover:border-yellow-500 hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-gray-100" 
                onClick={() => handlePlaceOrder('EMOLA')}
              >
                <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-3 shadow-lg shadow-yellow-200">E</div>
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">e-Mola</span>
                <span className="text-[9px] text-gray-400 mt-1 font-mono">{CONTACTS.EMOLA}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('home')} className="p-3 bg-white rounded-full shadow-sm border border-gray-100">⬅️</button>
        <h2 className="text-2xl font-black text-gray-900">Meus Pedidos</h2>
      </div>

      {visibleHistory.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border-none">
           <p className="text-7xl mb-6">📜</p>
           <p className="text-gray-400 font-black uppercase tracking-widest text-xs">A carrinha está vazia.</p>
           <Button onClick={() => setView('home')} className="mt-8 px-12 rounded-2xl">Pedir Agora</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] text-center px-10 leading-relaxed mb-6">O seu histórico é permanente para sua segurança jurídica e fiscal. 🔐</p>
          {visibleHistory.map(order => (
            <Card key={order.id} className="p-6 border-none shadow-xl shadow-gray-100 hover:shadow-2xl transition-all rounded-[2rem]">
               <div className="flex justify-between items-start mb-5">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl">🛒</div>
                    <div>
                      <h4 className="font-black text-gray-900 text-sm leading-tight">{order.restaurantName}</h4>
                      <p className="text-[9px] text-gray-400 uppercase font-bold mt-1 tracking-widest">#{order.id} • {new Date(order.timestamp).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="font-black text-orange-600 text-xl">{order.total} MT</p>
                    <Badge color={order.status === 'DELIVERED' ? 'green' : order.status === 'REFUSED' ? 'red' : 'orange'}>
                      {order.status}
                    </Badge>
                 </div>
               </div>
               <div className="flex gap-2 pt-5 border-t border-gray-50">
                  <button 
                    onClick={() => { setActiveOrderId(order.id); setView('tracking'); }} 
                    className="flex-[2] text-[10px] py-3 bg-orange-50 text-orange-600 rounded-xl font-black uppercase tracking-wider hover:bg-orange-100 transition-colors"
                  >
                    Ver Pedido
                  </button>
                  <button 
                    onClick={() => shareToWhatsApp(order)}
                    className="flex-1 text-[10px] py-3 bg-green-50 text-green-600 rounded-xl font-black uppercase tracking-wider hover:bg-green-100 transition-colors"
                  >
                    Partilhar 📲
                  </button>
                  <button 
                    onClick={() => onDeleteOrder(order.id)}
                    className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    🗑️
                  </button>
               </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-10 animate-fadeIn text-center pb-20">
      <div className="relative pt-10">
        <div className={`w-40 h-40 ${activeOrder?.status === 'DELIVERED' ? 'bg-green-100' : 'bg-orange-100'} rounded-full mx-auto flex items-center justify-center shadow-2xl relative z-10 ${activeOrder?.status !== 'DELIVERED' && activeOrder?.status !== 'REFUSED' ? 'animate-pulse' : ''}`}>
          <span className="text-8xl">{activeOrder?.status === 'DELIVERED' ? '🏁' : activeOrder?.status === 'REFUSED' ? '❌' : '🛵'}</span>
        </div>
        <div className="mt-10 space-y-2">
          <h2 className="text-4xl font-black text-gray-900 leading-tight">
            {activeOrder?.status === 'PENDING' && 'Validando...'}
            {activeOrder?.status === 'PREPARING' && 'Cozinhando!'}
            {activeOrder?.status === 'READY_FOR_PICKUP' && 'Pronto!'}
            {activeOrder?.status === 'OUT_FOR_DELIVERY' && 'A Caminho!'}
            {activeOrder?.status === 'DELIVERED' && 'Recebido!'}
            {activeOrder?.status === 'REFUSED' && 'Cancelado.'}
          </h2>
          <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Protocolo de Segurança #{activeOrder?.id}</p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
         <button 
          onClick={() => activeOrder && shareToWhatsApp(activeOrder)}
          className="px-8 py-3 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-100"
         >
           Partilhar Status 📲
         </button>
      </div>

      {activeOrder?.status === 'OUT_FOR_DELIVERY' && (
        <Card className="max-w-sm mx-auto p-10 border-none shadow-[0_35px_60px_-15px_rgba(249,115,22,0.15)] animate-bounce-in bg-white rounded-[3rem]">
           <h3 className="font-black text-gray-900 mb-2 uppercase text-xs tracking-widest">Código de Recepção</h3>
           <p className="text-[10px] text-gray-500 mb-8 font-medium leading-relaxed">O estafeta aguarda a sua validação. Insira o código de 4 dígitos para confirmar a recepção correta do pedido.</p>
           <div className="space-y-6">
             <input 
               type="text" 
               maxLength={4}
               placeholder="0000"
               className={`w-full text-center text-5xl font-black tracking-[1.5rem] p-6 rounded-3xl border-4 outline-none transition-all shadow-inner bg-gray-50 ${codeError ? 'border-red-500 text-red-600 ring-4 ring-red-50' : 'border-gray-100 focus:border-orange-500 focus:bg-white'}`}
               value={inputCode}
               onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
             />
             <Button className="w-full py-6 font-black text-xl shadow-2xl shadow-orange-200 rounded-2xl uppercase tracking-[0.2em]" onClick={handleConfirmDelivery}>
               Validar Entrega
             </Button>
           </div>
        </Card>
      )}

      {activeOrder?.status === 'DELIVERED' && (
        <div className="bg-green-600 p-8 rounded-[2.5rem] shadow-2xl shadow-green-100 max-w-sm mx-auto animate-bounce-in">
           <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">✔</span>
           </div>
           <p className="text-white font-black uppercase tracking-widest text-sm">Entrega Concluída</p>
           <p className="text-white/80 text-[10px] font-bold mt-2">Obrigado por confiar no Moz Delivery!</p>
        </div>
      )}

      <div className="max-w-xs mx-auto pt-6">
        <button onClick={() => setView('home')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors">
          Voltar para Nampula Central
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto p-4 min-h-screen bg-gray-50 pb-10">
      {view === 'home' && renderHome()}
      {view === 'restaurant' && renderRestaurant()}
      {view === 'cart' && renderCart()}
      {view === 'tracking' && renderTracking()}
      {view === 'history' && renderHistory()}
    </div>
  );
};

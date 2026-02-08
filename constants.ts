
// @google/genai coding guidelines followed.
import { Restaurant } from './types';

export const NAMPULA_LANDMARKS = [
  'Cantinho do Sabor',
  'White Lounge',
  'MOOD BLACKSHEEP',
  'Grill 21',
  'Mercado Central',
  'Aeroporto de Nampula',
  'Catedral de Nampula'
];

export const NEIGHBORHOODS = [
  { name: 'Central', baseFee: 50 },
  { name: 'Muhala', baseFee: 80 },
  { name: 'Muatala', baseFee: 70 },
  { name: 'Napipine', baseFee: 90 },
  { name: 'Natikiri', baseFee: 120 }
];

export const CONTACTS = {
  WHATSAPP: '877674794',
  MPESA: '858697954',
  EMOLA: '877674794',
  EMAIL: 'nunesjuniorlatinhoinovacoes@gmail.com'
};

// Fixed: Explicitly typed as Restaurant[] and added the required 'type' property to each item.
export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Cantinho do Sabor',
    category: 'Moçambicana',
    rating: 4.8,
    deliveryTime: '20-30 min',
    landmark: 'Centro da Cidade',
    image: 'https://picsum.photos/seed/sabor/400/250',
    type: 'RESTAURANT',
    menu: [
      { id: 'm1', name: 'Frango à Zambeziana', price: 450, description: 'Frango grelhado com coco e pimenta.', image: 'https://picsum.photos/seed/frango/100/100' },
      { id: 'm2', name: 'Matapa com Camarão', price: 380, description: 'Folhas de mandioquinha com amendoim e camarão.', image: 'https://picsum.photos/seed/matapa/100/100' }
    ]
  },
  {
    id: '2',
    name: 'White Lounge',
    category: 'Internacional',
    rating: 4.5,
    deliveryTime: '35-45 min',
    landmark: 'Bairro Central',
    image: 'https://picsum.photos/seed/white/400/250',
    type: 'RESTAURANT',
    menu: [
      { id: 'm3', name: 'Hambúrguer Gourmet', price: 550, description: 'Carne bovina 180g, queijo cheddar e bacon.', image: 'https://picsum.photos/seed/burger/100/100' },
      { id: 'm4', name: 'Pizza Margherita', price: 600, description: 'Molho de tomate fresco e manjericão.', image: 'https://picsum.photos/seed/pizza/100/100' }
    ]
  },
  {
    id: '3',
    name: 'MOOD BLACKSHEEP',
    category: 'Bebidas & Petiscos',
    rating: 4.7,
    deliveryTime: '15-25 min',
    landmark: 'Muhala Extension',
    image: 'https://picsum.photos/seed/mood/400/250',
    type: 'RESTAURANT',
    menu: [
      { id: 'm5', name: 'Combo de Cervejas (6x)', price: 900, description: 'Balde com 6 Laurentinas geladas.', image: 'https://picsum.photos/seed/beer/100/100' },
      { id: 'm6', name: 'Asinhas Picantes', price: 320, description: 'Asinhas de frango com molho de piripiri.', image: 'https://picsum.photos/seed/wings/100/100' }
    ]
  }
];


export type UserRole = 'CUSTOMER' | 'DRIVER' | 'MANAGER' | 'OWNER';

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  image: string;
  landmark?: string;
  menu: MenuItem[];
  type: 'RESTAURANT' | 'MARKET' | 'TAKEAWAY';
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'REFUSED';

export interface Order {
  id: string;
  customerName: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: 'MPESA' | 'EMOLA' | 'CASH' | 'CARD';
  neighborhood: string;
  prepTime?: string;
  driverId?: string;
  timestamp: number;
  confirmationCode?: string;
  isDeletedByCustomer?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING';
  targetRole: UserRole;
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: number;
  details: string;
}

export interface SystemUser {
  id: string;
  name: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  email: string;
}

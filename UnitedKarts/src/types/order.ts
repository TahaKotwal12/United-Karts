import { Address, User } from './auth';
import { Restaurant, FoodItem, FoodVariant } from './restaurant';

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  deliveryPartnerId?: string;
  deliveryAddressId: string;
  orderNumber: string;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'cancelled' | 'refunded';
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  specialInstructions?: string;
  cancellationReason?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  customer?: User;
  restaurant?: Restaurant;
  deliveryPartner?: User;
  deliveryAddress?: Address;
  items?: OrderItem[];
  tracking?: OrderTracking[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  foodItemId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  createdAt: string;
  
  // Related data
  foodItem?: FoodItem;
  variant?: FoodVariant;
}

export interface OrderTracking {
  id: string;
  orderId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'cancelled' | 'refunded';
  latitude?: number;
  longitude?: number;
  notes?: string;
  createdAt: string;
}

export interface CartItem {
  foodItemId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  
  // Related data for display
  foodItem?: FoodItem;
  variant?: FoodVariant;
}

export interface Cart {
  restaurantId: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  
  // Related data
  restaurant?: Restaurant;
}

export interface CreateOrderRequest {
  restaurantId: string;
  deliveryAddressId: string;
  items: {
    foodItemId: string;
    variantId?: string;
    quantity: number;
    specialInstructions?: string;
  }[];
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  specialInstructions?: string;
  couponCode?: string;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'cancelled' | 'refunded';
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export interface CancelOrderRequest {
  orderId: string;
  reason: string;
}

export interface OrderReviewRequest {
  orderId: string;
  rating: number;
  review?: string;
}

export interface OrderFilters {
  status?: string[];
  paymentStatus?: string[];
  dateFrom?: string;
  dateTo?: string;
  restaurantId?: string;
  customerId?: string;
  deliveryPartnerId?: string;
}

export interface OrderListParams {
  filters?: OrderFilters;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'totalAmount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  orderHistory: Order[];
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description?: string;
  couponType: 'percentage' | 'fixed_amount' | 'free_delivery';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

export interface ValidateCouponRequest {
  code: string;
  orderAmount: number;
  restaurantId?: string;
}

export interface ValidateCouponResponse {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  message?: string;
}

export interface PaymentIntent {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  clientSecret?: string;
  createdAt: string;
}

export interface CreatePaymentIntentRequest {
  orderId: string;
  paymentMethod: 'card' | 'upi' | 'wallet';
}

export interface VerifyPaymentRequest {
  paymentIntentId: string;
  paymentId: string;
}

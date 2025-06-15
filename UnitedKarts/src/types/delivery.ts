import { User } from './auth';
import { Order } from './order';

export interface DeliveryPartner {
  id: string;
  userId: string;
  vehicleType: 'bicycle' | 'motorcycle' | 'car';
  vehicleNumber: string;
  licenseNumber: string;
  currentLatitude?: number;
  currentLongitude?: number;
  availabilityStatus: 'available' | 'busy' | 'offline';
  rating: number;
  totalRatings: number;
  totalDeliveries: number;
  documentsJson?: Record<string, any>;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  user?: User;
}

export interface DeliveryPartnerLocation {
  deliveryPartnerId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

export interface AvailableOrder {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantLatitude: number;
  restaurantLongitude: number;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  totalAmount: number;
  estimatedEarnings: number;
  estimatedDistance: number;
  estimatedTime: number;
  createdAt: string;
  
  // Related data
  order?: Order;
}

export interface DeliveryEarnings {
  deliveryPartnerId: string;
  orderId: string;
  baseAmount: number;
  distanceBonus: number;
  timeBonus: number;
  tipAmount: number;
  totalEarnings: number;
  date: string;
  createdAt: string;
}

export interface DeliveryStats {
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  averageRating: number;
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  onlineHours: number;
  averageDeliveryTime: number;
}

export interface UpdateLocationRequest {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

export interface AcceptOrderRequest {
  orderId: string;
  estimatedPickupTime?: string;
}

export interface UpdateDeliveryStatusRequest {
  orderId: string;
  status: 'accepted' | 'picked_up' | 'in_transit' | 'delivered';
  latitude?: number;
  longitude?: number;
  notes?: string;
  proofImage?: string;
}

export interface DeliveryPartnerFilters {
  availabilityStatus?: string[];
  vehicleType?: string[];
  minRating?: number;
  isVerified?: boolean;
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
}

export interface DeliveryPartnerListParams {
  filters?: DeliveryPartnerFilters;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'totalDeliveries' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface DeliveryPartnerListResponse {
  deliveryPartners: DeliveryPartner[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface DeliveryState {
  profile: DeliveryPartner | null;
  availableOrders: AvailableOrder[];
  activeOrder: Order | null;
  orderHistory: Order[];
  earnings: DeliveryEarnings[];
  stats: DeliveryStats | null;
  currentLocation: DeliveryPartnerLocation | null;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CreateDeliveryPartnerRequest {
  userId: string;
  vehicleType: 'bicycle' | 'motorcycle' | 'car';
  vehicleNumber: string;
  licenseNumber: string;
  documents?: {
    licenseImage?: string;
    vehicleRegistration?: string;
    insurance?: string;
    profilePhoto?: string;
  };
}

export interface UpdateDeliveryPartnerRequest {
  vehicleType?: 'bicycle' | 'motorcycle' | 'car';
  vehicleNumber?: string;
  licenseNumber?: string;
  availabilityStatus?: 'available' | 'busy' | 'offline';
  documents?: {
    licenseImage?: string;
    vehicleRegistration?: string;
    insurance?: string;
    profilePhoto?: string;
  };
}

export interface DeliveryRoute {
  orderId: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimatedDistance: number;
  estimatedTime: number;
  actualDistance?: number;
  actualTime?: number;
  route?: {
    coordinates: Array<[number, number]>;
    instructions: string[];
  };
}

export interface DeliveryNotification {
  id: string;
  deliveryPartnerId: string;
  type: 'new_order' | 'order_cancelled' | 'payment_received' | 'rating_received';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Generic API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// API Request/Response Interfaces
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    role: string;
    profileImage?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    status: string;
  };
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface OTPResponse {
  message: string;
  expiresIn: number;
}

export interface RestaurantListResponse {
  restaurants: Array<{
    id: string;
    name: string;
    description?: string;
    image?: string;
    coverImage?: string;
    cuisineType?: string;
    rating: number;
    totalRatings: number;
    avgDeliveryTime?: number;
    minOrderAmount: number;
    deliveryFee: number;
    isOpen: boolean;
    distance?: number;
  }>;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface MenuResponse {
  restaurant: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    coverImage?: string;
    rating: number;
    totalRatings: number;
    avgDeliveryTime?: number;
    minOrderAmount: number;
    deliveryFee: number;
    isOpen: boolean;
  };
  categories: Array<{
    id: string;
    name: string;
    description?: string;
    image?: string;
    sortOrder: number;
  }>;
  items: Array<{
    id: string;
    categoryId?: string;
    name: string;
    description?: string;
    price: number;
    discountPrice?: number;
    image?: string;
    isVeg: boolean;
    rating: number;
    totalRatings: number;
    status: string;
    variants?: Array<{
      id: string;
      name: string;
      priceAdjustment: number;
      isDefault: boolean;
    }>;
  }>;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  customerId: string;
  restaurantId: string;
  deliveryPartnerId?: string;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  restaurant?: {
    id: string;
    name: string;
    image?: string;
    phone: string;
  };
  deliveryAddress?: {
    id: string;
    title: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items?: Array<{
    id: string;
    foodItemId: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    specialInstructions?: string;
    foodItem?: {
      id: string;
      name: string;
      image?: string;
      isVeg: boolean;
    };
    variant?: {
      id: string;
      name: string;
    };
  }>;
}

export interface OrderTrackingResponse {
  orderId: string;
  currentStatus: string;
  estimatedDeliveryTime?: string;
  deliveryPartner?: {
    id: string;
    name: string;
    phone: string;
    vehicleType: string;
    vehicleNumber: string;
    rating: number;
  };
  restaurant: {
    id: string;
    name: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  deliveryAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
  };
  tracking: Array<{
    id: string;
    status: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
    createdAt: string;
  }>;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

export interface DeliveryPartnerResponse {
  id: string;
  userId: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  availabilityStatus: string;
  rating: number;
  totalRatings: number;
  totalDeliveries: number;
  isVerified: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    profileImage?: string;
  };
}

export interface AvailableOrdersResponse {
  orders: Array<{
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
  }>;
  total: number;
}

export interface EarningsResponse {
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  earnings: Array<{
    id: string;
    orderId: string;
    baseAmount: number;
    distanceBonus: number;
    timeBonus: number;
    tipAmount: number;
    totalEarnings: number;
    date: string;
    createdAt: string;
  }>;
}

export interface CouponValidationResponse {
  isValid: boolean;
  coupon?: {
    id: string;
    code: string;
    title: string;
    description?: string;
    couponType: string;
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number;
  };
  discountAmount?: number;
  message?: string;
}

export interface PaymentIntentResponse {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  clientSecret?: string;
  razorpayOrderId?: string;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    data?: Record<string, any>;
    createdAt: string;
  }>;
  unreadCount: number;
}

// Request Types
export interface CreateOrderRequest {
  restaurantId: string;
  deliveryAddressId: string;
  items: Array<{
    foodItemId: string;
    variantId?: string;
    quantity: number;
    specialInstructions?: string;
  }>;
  paymentMethod: string;
  specialInstructions?: string;
  couponCode?: string;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationUpdateRequest {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiValidationError extends ApiError {
  validationErrors: ValidationError[];
}

// Socket Event Types
export interface SocketOrderUpdate {
  orderId: string;
  status: string;
  message: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface SocketLocationUpdate {
  deliveryPartnerId: string;
  orderId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface SocketNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, any>;
  timestamp: string;
}

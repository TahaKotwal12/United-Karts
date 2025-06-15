export const API_CONFIG = {
  BASE_URL: 'https://api.unitedkarts.com/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // User endpoints
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    ADDRESSES: '/users/addresses',
    ADD_ADDRESS: '/users/addresses',
    UPDATE_ADDRESS: '/users/addresses',
    DELETE_ADDRESS: '/users/addresses',
  },
  
  // Restaurant endpoints
  RESTAURANTS: {
    LIST: '/restaurants',
    DETAIL: '/restaurants',
    MENU: '/restaurants/{id}/menu',
    SEARCH: '/restaurants/search',
    NEARBY: '/restaurants/nearby',
  },
  
  // Order endpoints
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: '/orders',
    CANCEL: '/orders/{id}/cancel',
    TRACKING: '/orders/{id}/tracking',
    REVIEW: '/orders/{id}/review',
    UPDATE_STATUS: '/orders/{id}/status',
  },
  
  // Delivery endpoints
  DELIVERY: {
    AVAILABLE_ORDERS: '/delivery/orders/available',
    ACCEPT_ORDER: '/delivery/orders/{id}/accept',
    UPDATE_STATUS: '/delivery/orders/{id}/status',
    UPDATE_LOCATION: '/delivery/location',
    EARNINGS: '/delivery/earnings',
    HISTORY: '/delivery/history',
  },
  
  // Admin/Restaurant Owner endpoints
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ORDERS: '/admin/orders',
    MENU: '/admin/menu',
    ADD_MENU_ITEM: '/admin/menu/items',
    UPDATE_MENU_ITEM: '/admin/menu/items',
    DELETE_MENU_ITEM: '/admin/menu/items',
  },
  
  // Payment endpoints
  PAYMENTS: {
    CREATE: '/payments/create',
    VERIFY: '/payments/verify',
    REFUND: '/payments/refund',
  },
  
  // Coupon endpoints
  COUPONS: {
    VALIDATE: '/coupons/validate',
    AVAILABLE: '/coupons/available',
  },
  
  // Categories endpoint
  CATEGORIES: '/categories',
};

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

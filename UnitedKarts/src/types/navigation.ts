import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';

// Root Stack Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Customer: NavigatorScreenParams<CustomerTabParamList>;
  Delivery: NavigatorScreenParams<DeliveryTabParamList>;
  Restaurant: NavigatorScreenParams<RestaurantTabParamList>;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  OTPVerification: {
    phone: string;
    isRegistration?: boolean;
  };
  RoleSelection: {
    user: {
      phone: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  ForgotPassword: undefined;
  ResetPassword: {
    phone: string;
    otp: string;
  };
};

// Customer Tab Navigator
export type CustomerTabParamList = {
  Home: NavigatorScreenParams<CustomerHomeStackParamList>;
  Search: NavigatorScreenParams<CustomerSearchStackParamList>;
  Orders: NavigatorScreenParams<CustomerOrdersStackParamList>;
  Profile: NavigatorScreenParams<CustomerProfileStackParamList>;
};

// Customer Home Stack
export type CustomerHomeStackParamList = {
  HomeMain: undefined;
  RestaurantList: {
    category?: string;
    searchQuery?: string;
    filters?: any;
  };
  RestaurantDetail: {
    restaurantId: string;
  };
  Menu: {
    restaurantId: string;
    categoryId?: string;
  };
  FoodItemDetail: {
    foodItemId: string;
    restaurantId: string;
  };
  Cart: {
    restaurantId: string;
  };
  Checkout: {
    restaurantId: string;
  };
  OrderTracking: {
    orderId: string;
  };
};

// Customer Search Stack
export type CustomerSearchStackParamList = {
  SearchMain: undefined;
  SearchResults: {
    query: string;
    filters?: any;
  };
  RestaurantDetail: {
    restaurantId: string;
  };
  Menu: {
    restaurantId: string;
  };
};

// Customer Orders Stack
export type CustomerOrdersStackParamList = {
  OrderHistory: undefined;
  OrderDetail: {
    orderId: string;
  };
  OrderTracking: {
    orderId: string;
  };
  OrderReview: {
    orderId: string;
  };
  ReorderConfirm: {
    orderId: string;
  };
};

// Customer Profile Stack
export type CustomerProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  AddressManagement: undefined;
  AddAddress: {
    editAddressId?: string;
  };
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  OrderHistory: undefined;
  Favorites: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
};

// Delivery Tab Navigator
export type DeliveryTabParamList = {
  Dashboard: NavigatorScreenParams<DeliveryDashboardStackParamList>;
  Orders: NavigatorScreenParams<DeliveryOrdersStackParamList>;
  Earnings: NavigatorScreenParams<DeliveryEarningsStackParamList>;
  Profile: NavigatorScreenParams<DeliveryProfileStackParamList>;
};

// Delivery Dashboard Stack
export type DeliveryDashboardStackParamList = {
  DashboardMain: undefined;
  AvailableOrders: undefined;
  OrderDetail: {
    orderId: string;
  };
  ActiveDelivery: {
    orderId: string;
  };
  Navigation: {
    orderId: string;
    destination: 'pickup' | 'delivery';
  };
};

// Delivery Orders Stack
export type DeliveryOrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetail: {
    orderId: string;
  };
  DeliveryHistory: undefined;
  ActiveDelivery: {
    orderId: string;
  };
};

// Delivery Earnings Stack
export type DeliveryEarningsStackParamList = {
  EarningsMain: undefined;
  EarningsDetail: {
    period: 'today' | 'week' | 'month';
  };
  PayoutHistory: undefined;
  TaxDocuments: undefined;
};

// Delivery Profile Stack
export type DeliveryProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  VehicleInfo: undefined;
  Documents: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
};

// Restaurant Tab Navigator
export type RestaurantTabParamList = {
  Dashboard: NavigatorScreenParams<RestaurantDashboardStackParamList>;
  Orders: NavigatorScreenParams<RestaurantOrdersStackParamList>;
  Menu: NavigatorScreenParams<RestaurantMenuStackParamList>;
  Analytics: NavigatorScreenParams<RestaurantAnalyticsStackParamList>;
  Profile: NavigatorScreenParams<RestaurantProfileStackParamList>;
};

// Restaurant Dashboard Stack
export type RestaurantDashboardStackParamList = {
  DashboardMain: undefined;
  OrderQueue: undefined;
  OrderDetail: {
    orderId: string;
  };
  QuickStats: undefined;
};

// Restaurant Orders Stack
export type RestaurantOrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetail: {
    orderId: string;
  };
  OrderHistory: undefined;
};

// Restaurant Menu Stack
export type RestaurantMenuStackParamList = {
  MenuMain: undefined;
  AddFoodItem: {
    categoryId?: string;
  };
  EditFoodItem: {
    foodItemId: string;
  };
  CategoryManagement: undefined;
  AddCategory: undefined;
  EditCategory: {
    categoryId: string;
  };
};

// Restaurant Analytics Stack
export type RestaurantAnalyticsStackParamList = {
  AnalyticsMain: undefined;
  SalesReport: {
    period: 'today' | 'week' | 'month' | 'year';
  };
  PopularItems: undefined;
  CustomerInsights: undefined;
  ReviewsAnalytics: undefined;
};

// Restaurant Profile Stack
export type RestaurantProfileStackParamList = {
  ProfileMain: undefined;
  EditRestaurant: undefined;
  BusinessHours: undefined;
  DeliverySettings: undefined;
  PaymentSettings: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<
  AuthStackParamList,
  T
>;

export type CustomerTabScreenProps<T extends keyof CustomerTabParamList> = BottomTabScreenProps<
  CustomerTabParamList,
  T
>;

export type CustomerHomeStackScreenProps<T extends keyof CustomerHomeStackParamList> = StackScreenProps<
  CustomerHomeStackParamList,
  T
>;

export type DeliveryTabScreenProps<T extends keyof DeliveryTabParamList> = BottomTabScreenProps<
  DeliveryTabParamList,
  T
>;

export type RestaurantTabScreenProps<T extends keyof RestaurantTabParamList> = BottomTabScreenProps<
  RestaurantTabParamList,
  T
>;

// Common navigation props
export interface NavigationProps {
  navigation: any;
  route: any;
}

// Location types for navigation
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface NavigationLocation extends LocationCoordinates {
  address?: string;
  name?: string;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

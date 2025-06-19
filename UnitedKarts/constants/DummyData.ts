// Enums matching database schema
export type UserRole = 'customer' | 'admin' | 'delivery_partner' | 'restaurant_owner';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type RestaurantStatus = 'active' | 'inactive' | 'suspended';
export type FoodStatus = 'available' | 'unavailable' | 'out_of_stock';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet';
export type VehicleType = 'bicycle' | 'motorcycle' | 'car';
export type AvailabilityStatus = 'available' | 'busy' | 'offline';
export type CouponType = 'percentage' | 'fixed_amount' | 'free_delivery';
export type NotificationType = 'order_update' | 'promotion' | 'system';

// User interface matching database schema
export interface User {
  core_mstr_united_kart_users_id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  profile_image?: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Address interface
export interface Address {
  core_mstr_united_kart_addresses_id: string;
  user_id: string;
  title: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at: string;
}

// Restaurant interface matching database schema
export interface Restaurant {
  core_mstr_united_kart_restaurants_id: string;
  owner_id: string;
  name: string;
  description?: string;
  phone: string;
  email?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  image?: string;
  cover_image?: string;
  cuisine_type?: string;
  avg_delivery_time?: number;
  min_order_amount: number;
  delivery_fee: number;
  rating: number;
  total_ratings: number;
  status: RestaurantStatus;
  is_open: boolean;
  opening_time?: string;
  closing_time?: string;
  created_at: string;
  updated_at: string;
}

// Category interface
export interface Category {
  core_mstr_united_kart_categories_id: string;
  name: string;
  description?: string;
  image?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// Food item interface matching database schema
export interface FoodItem {
  core_mstr_united_kart_food_items_id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  image?: string;
  is_veg: boolean;
  ingredients?: string;
  allergens?: string;
  calories?: number;
  prep_time?: number;
  status: FoodStatus;
  rating: number;
  total_ratings: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Food variant interface
export interface FoodVariant {
  core_mstr_united_kart_food_variants_id: string;
  food_item_id: string;
  name: string;
  price_adjustment: number;
  is_default: boolean;
  created_at: string;
}

// Order interface matching database schema
export interface Order {
  core_mstr_united_kart_orders_id: string;
  customer_id: string;
  restaurant_id: string;
  delivery_partner_id?: string;
  delivery_address_id: string;
  order_number: string;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  payment_method?: PaymentMethod;
  payment_status: PaymentStatus;
  payment_id?: string;
  order_status: OrderStatus;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  special_instructions?: string;
  cancellation_reason?: string;
  rating?: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

// Order item interface
export interface OrderItem {
  core_mstr_united_kart_order_items_id: string;
  order_id: string;
  food_item_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  created_at: string;
}

// Cart item interface (for frontend use)
export interface CartItem {
  food_item: FoodItem;
  variant?: FoodVariant;
  quantity: number;
  special_instructions?: string;
}

// Delivery partner interface
export interface DeliveryPartner {
  core_mstr_united_kart_delivery_partners_id: string;
  user_id: string;
  vehicle_type: VehicleType;
  vehicle_number: string;
  license_number: string;
  current_latitude?: number;
  current_longitude?: number;
  availability_status: AvailabilityStatus;
  rating: number;
  total_ratings: number;
  total_deliveries: number;
  documents_json?: any;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Coupon interface
export interface Coupon {
  core_mstr_united_kart_coupons_id: string;
  code: string;
  title: string;
  description?: string;
  coupon_type: CouponType;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

// Review interface
export interface Review {
  core_mstr_united_kart_reviews_id: string;
  order_id: string;
  customer_id: string;
  restaurant_id?: string;
  delivery_partner_id?: string;
  rating: number;
  review_text?: string;
  review_type: string;
  created_at: string;
}

// Notification interface
export interface Notification {
  core_mstr_united_kart_notifications_id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  is_read: boolean;
  data_json?: any;
  created_at: string;
}

// Legacy interfaces for backward compatibility (simplified versions)
export interface SimpleRestaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  cuisine: string[];
  isPromoted?: boolean;
  distance: string;
  description: string;
}

export interface SimpleFoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  rating: number;
  restaurantId: string;
  isPopular?: boolean;
}

export interface SimpleCategory {
  id: string;
  name: string;
  image: string;
  color: string;
}

export interface SimpleCartItem extends SimpleFoodItem {
  quantity: number;
}

export interface SimpleOrder {
  id: string;
  items: SimpleCartItem[];
  restaurant: SimpleRestaurant;
  total: number;
  status: 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  orderTime: string;
  deliveryTime: string;
  address: string;
}

export const categories: SimpleCategory[] = [
  {
    id: '1',
    name: 'Pizza',
    image: '🍕',
    color: '#ff6b6b',
  },
  {
    id: '2',
    name: 'Burger',
    image: '🍔',
    color: '#4ecdc4',
  },
  {
    id: '3',
    name: 'Indian',
    image: '🍛',
    color: '#45b7d1',
  },
  {
    id: '4',
    name: 'Chinese',
    image: '🥡',
    color: '#f9ca24',
  },
  {
    id: '5',
    name: 'Desserts',
    image: '🍰',
    color: '#f0932b',
  },
  {
    id: '6',
    name: 'Beverages',
    image: '🥤',
    color: '#eb4d4b',
  },
];

export const restaurants: SimpleRestaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    rating: 4.5,
    deliveryTime: '25-30 min',
    deliveryFee: 2.99,
    cuisine: ['Italian', 'Pizza'],
    isPromoted: true,
    distance: '1.2 km',
    description: 'Authentic Italian pizzas with fresh ingredients',
  },
  {
    id: '2',
    name: 'Burger Junction',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    rating: 4.3,
    deliveryTime: '20-25 min',
    deliveryFee: 1.99,
    cuisine: ['American', 'Fast Food'],
    distance: '0.8 km',
    description: 'Juicy burgers and crispy fries',
  },
  {
    id: '3',
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    rating: 4.7,
    deliveryTime: '30-35 min',
    deliveryFee: 3.49,
    cuisine: ['Indian', 'Vegetarian'],
    isPromoted: true,
    distance: '2.1 km',
    description: 'Traditional Indian cuisine with authentic spices',
  },
  {
    id: '4',
    name: 'Dragon Wok',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400',
    rating: 4.2,
    deliveryTime: '25-30 min',
    deliveryFee: 2.49,
    cuisine: ['Chinese', 'Asian'],
    distance: '1.5 km',
    description: 'Fresh Chinese dishes with bold flavors',
  },
  {
    id: '5',
    name: 'Sweet Treats',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    rating: 4.6,
    deliveryTime: '15-20 min',
    deliveryFee: 1.49,
    cuisine: ['Desserts', 'Bakery'],
    distance: '0.5 km',
    description: 'Delicious cakes, pastries and desserts',
  },
];

export const foodItems: SimpleFoodItem[] = [
  // Pizza Palace items
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    category: 'Pizza',
    isVeg: true,
    rating: 4.5,
    restaurantId: '1',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with mozzarella cheese and tomato sauce',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    category: 'Pizza',
    isVeg: false,
    rating: 4.7,
    restaurantId: '1',
  },
  // Burger Junction items
  {
    id: '3',
    name: 'Classic Beef Burger',
    description: 'Juicy beef patty with lettuce, tomato, onion, and special sauce',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'Burger',
    isVeg: false,
    rating: 4.4,
    restaurantId: '2',
    isPopular: true,
  },
  {
    id: '4',
    name: 'Veggie Burger',
    description: 'Plant-based patty with fresh vegetables and avocado',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=400',
    category: 'Burger',
    isVeg: true,
    rating: 4.2,
    restaurantId: '2',
  },
  // Spice Garden items
  {
    id: '5',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken pieces',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400',
    category: 'Indian',
    isVeg: false,
    rating: 4.8,
    restaurantId: '3',
    isPopular: true,
  },
  {
    id: '6',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese in rich tomato and cream sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    category: 'Indian',
    isVeg: true,
    rating: 4.6,
    restaurantId: '3',
  },
  // Dragon Wok items
  {
    id: '7',
    name: 'Kung Pao Chicken',
    description: 'Spicy stir-fried chicken with peanuts and vegetables',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400',
    category: 'Chinese',
    isVeg: false,
    rating: 4.3,
    restaurantId: '4',
  },
  {
    id: '8',
    name: 'Vegetable Fried Rice',
    description: 'Wok-fried rice with mixed vegetables and soy sauce',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    category: 'Chinese',
    isVeg: true,
    rating: 4.1,
    restaurantId: '4',
  },
  // Sweet Treats items
  {
    id: '9',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with creamy chocolate frosting',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    category: 'Desserts',
    isVeg: true,
    rating: 4.7,
    restaurantId: '5',
    isPopular: true,
  },
  {
    id: '10',
    name: 'Cheesecake',
    description: 'Creamy New York style cheesecake with berry topping',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
    category: 'Desserts',
    isVeg: true,
    rating: 4.5,
    restaurantId: '5',
  },
];

export const sampleOrders: SimpleOrder[] = [
  {
    id: '1',
    items: [
      { ...foodItems[0], quantity: 2 },
      { ...foodItems[1], quantity: 1 },
    ],
    restaurant: restaurants[0],
    total: 41.97,
    status: 'on_the_way',
    orderTime: '2024-01-15T18:30:00Z',
    deliveryTime: '2024-01-15T19:00:00Z',
    address: '123 Main St, City Center',
  },
  {
    id: '2',
    items: [
      { ...foodItems[4], quantity: 1 },
      { ...foodItems[5], quantity: 1 },
    ],
    restaurant: restaurants[2],
    total: 30.47,
    status: 'delivered',
    orderTime: '2024-01-14T19:15:00Z',
    deliveryTime: '2024-01-14T20:00:00Z',
    address: '456 Oak Ave, Downtown',
  },
];

export const popularItems = foodItems.filter(item => item.isPopular);
export const promotedRestaurants = restaurants.filter(restaurant => restaurant.isPromoted);

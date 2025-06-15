export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  image?: string;
  coverImage?: string;
  cuisineType?: string;
  avgDeliveryTime?: number;
  minOrderAmount: number;
  deliveryFee: number;
  rating: number;
  totalRatings: number;
  status: 'active' | 'inactive' | 'suspended';
  isOpen: boolean;
  openingTime?: string;
  closingTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  isVeg: boolean;
  ingredients?: string;
  allergens?: string;
  calories?: number;
  prepTime?: number;
  status: 'available' | 'unavailable' | 'out_of_stock';
  rating: number;
  totalRatings: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  variants?: FoodVariant[];
  category?: Category;
}

export interface FoodVariant {
  id: string;
  foodItemId: string;
  name: string;
  priceAdjustment: number;
  isDefault: boolean;
  createdAt: string;
}

export interface RestaurantFilters {
  cuisineType?: string;
  minRating?: number;
  maxDeliveryTime?: number;
  minOrderAmount?: number;
  maxDeliveryFee?: number;
  isVegOnly?: boolean;
  sortBy?: 'rating' | 'deliveryTime' | 'deliveryFee' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

export interface RestaurantSearchParams {
  query?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  filters?: RestaurantFilters;
  page?: number;
  limit?: number;
}

export interface RestaurantListResponse {
  restaurants: Restaurant[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface MenuResponse {
  categories: Category[];
  items: FoodItem[];
  restaurant: Restaurant;
}

export interface RestaurantState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  menu: MenuResponse | null;
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  filters: RestaurantFilters;
  searchQuery: string;
}

export interface CreateRestaurantRequest {
  name: string;
  description?: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  image?: string;
  coverImage?: string;
  cuisineType?: string;
  avgDeliveryTime?: number;
  minOrderAmount: number;
  deliveryFee: number;
  openingTime?: string;
  closingTime?: string;
}

export interface UpdateRestaurantRequest extends Partial<CreateRestaurantRequest> {
  id: string;
}

export interface CreateFoodItemRequest {
  restaurantId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  isVeg: boolean;
  ingredients?: string;
  allergens?: string;
  calories?: number;
  prepTime?: number;
  variants?: Omit<FoodVariant, 'id' | 'foodItemId' | 'createdAt'>[];
}

export interface UpdateFoodItemRequest extends Partial<CreateFoodItemRequest> {
  id: string;
}

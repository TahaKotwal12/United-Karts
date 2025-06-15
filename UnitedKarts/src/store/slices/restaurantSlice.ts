import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RestaurantState, Restaurant, MenuResponse, Category, RestaurantFilters } from '../../types/restaurant';

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  menu: null,
  categories: [],
  isLoading: false,
  error: null,
  filters: {},
  searchQuery: '',
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
    },
    setCurrentRestaurant: (state, action: PayloadAction<Restaurant | null>) => {
      state.currentRestaurant = action.payload;
    },
    setMenu: (state, action: PayloadAction<MenuResponse | null>) => {
      state.menu = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setFilters: (state, action: PayloadAction<RestaurantFilters>) => {
      state.filters = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMenu: (state) => {
      state.menu = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setRestaurants,
  setCurrentRestaurant,
  setMenu,
  setCategories,
  setFilters,
  setSearchQuery,
  clearError,
  clearMenu,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;

// Selectors
export const selectRestaurants = (state: { restaurant: RestaurantState }) => state.restaurant.restaurants;
export const selectCurrentRestaurant = (state: { restaurant: RestaurantState }) => state.restaurant.currentRestaurant;
export const selectMenu = (state: { restaurant: RestaurantState }) => state.restaurant.menu;
export const selectCategories = (state: { restaurant: RestaurantState }) => state.restaurant.categories;
export const selectRestaurantLoading = (state: { restaurant: RestaurantState }) => state.restaurant.isLoading;
export const selectRestaurantError = (state: { restaurant: RestaurantState }) => state.restaurant.error;
export const selectRestaurantFilters = (state: { restaurant: RestaurantState }) => state.restaurant.filters;
export const selectSearchQuery = (state: { restaurant: RestaurantState }) => state.restaurant.searchQuery;

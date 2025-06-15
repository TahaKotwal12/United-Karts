import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryState, DeliveryPartner, AvailableOrder, DeliveryEarnings, DeliveryStats, DeliveryPartnerLocation } from '../../types/delivery';
import { Order } from '../../types/order';

const initialState: DeliveryState = {
  profile: null,
  availableOrders: [],
  activeOrder: null,
  orderHistory: [],
  earnings: [],
  stats: null,
  currentLocation: null,
  isOnline: false,
  isLoading: false,
  error: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProfile: (state, action: PayloadAction<DeliveryPartner | null>) => {
      state.profile = action.payload;
    },
    setAvailableOrders: (state, action: PayloadAction<AvailableOrder[]>) => {
      state.availableOrders = action.payload;
    },
    setActiveOrder: (state, action: PayloadAction<Order | null>) => {
      state.activeOrder = action.payload;
    },
    setOrderHistory: (state, action: PayloadAction<Order[]>) => {
      state.orderHistory = action.payload;
    },
    setEarnings: (state, action: PayloadAction<DeliveryEarnings[]>) => {
      state.earnings = action.payload;
    },
    setStats: (state, action: PayloadAction<DeliveryStats | null>) => {
      state.stats = action.payload;
    },
    setCurrentLocation: (state, action: PayloadAction<DeliveryPartnerLocation | null>) => {
      state.currentLocation = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
      if (state.profile) {
        state.profile.availabilityStatus = action.payload ? 'available' : 'offline';
      }
    },
    addAvailableOrder: (state, action: PayloadAction<AvailableOrder>) => {
      state.availableOrders.unshift(action.payload);
    },
    removeAvailableOrder: (state, action: PayloadAction<string>) => {
      state.availableOrders = state.availableOrders.filter(order => order.id !== action.payload);
    },
    updateActiveOrder: (state, action: PayloadAction<Order>) => {
      if (state.activeOrder?.id === action.payload.id) {
        state.activeOrder = action.payload;
      }
    },
    addToOrderHistory: (state, action: PayloadAction<Order>) => {
      state.orderHistory.unshift(action.payload);
    },
    addEarning: (state, action: PayloadAction<DeliveryEarnings>) => {
      state.earnings.unshift(action.payload);
    },
    updateProfile: (state, action: PayloadAction<Partial<DeliveryPartner>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearActiveOrder: (state) => {
      state.activeOrder = null;
    },
    reset: (state) => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setError,
  setProfile,
  setAvailableOrders,
  setActiveOrder,
  setOrderHistory,
  setEarnings,
  setStats,
  setCurrentLocation,
  setOnlineStatus,
  addAvailableOrder,
  removeAvailableOrder,
  updateActiveOrder,
  addToOrderHistory,
  addEarning,
  updateProfile,
  clearError,
  clearActiveOrder,
  reset,
} = deliverySlice.actions;

export default deliverySlice.reducer;

// Selectors
export const selectDeliveryProfile = (state: { delivery: DeliveryState }) => state.delivery.profile;
export const selectAvailableOrders = (state: { delivery: DeliveryState }) => state.delivery.availableOrders;
export const selectActiveOrder = (state: { delivery: DeliveryState }) => state.delivery.activeOrder;
export const selectDeliveryOrderHistory = (state: { delivery: DeliveryState }) => state.delivery.orderHistory;
export const selectDeliveryEarnings = (state: { delivery: DeliveryState }) => state.delivery.earnings;
export const selectDeliveryStats = (state: { delivery: DeliveryState }) => state.delivery.stats;
export const selectDeliveryCurrentLocation = (state: { delivery: DeliveryState }) => state.delivery.currentLocation;
export const selectIsOnline = (state: { delivery: DeliveryState }) => state.delivery.isOnline;
export const selectDeliveryLoading = (state: { delivery: DeliveryState }) => state.delivery.isLoading;
export const selectDeliveryError = (state: { delivery: DeliveryState }) => state.delivery.error;

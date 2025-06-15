import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderState, Order } from '../../types/order';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  cart: null,
  isLoading: false,
  error: null,
  orderHistory: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.orderHistory.unshift(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
      
      const historyIndex = state.orderHistory.findIndex(order => order.id === action.payload.id);
      if (historyIndex !== -1) {
        state.orderHistory[historyIndex] = action.payload;
      }
    },
    setOrderHistory: (state, action: PayloadAction<Order[]>) => {
      state.orderHistory = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setOrders,
  setCurrentOrder,
  addOrder,
  updateOrder,
  setOrderHistory,
  clearCurrentOrder,
  clearError,
} = orderSlice.actions;

export default orderSlice.reducer;

// Selectors
export const selectOrders = (state: { order: OrderState }) => state.order.orders;
export const selectCurrentOrder = (state: { order: OrderState }) => state.order.currentOrder;
export const selectOrderHistory = (state: { order: OrderState }) => state.order.orderHistory;
export const selectOrderLoading = (state: { order: OrderState }) => state.order.isLoading;
export const selectOrderError = (state: { order: OrderState }) => state.order.error;

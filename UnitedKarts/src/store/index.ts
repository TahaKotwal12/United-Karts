import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import authSlice from './slices/authSlice';
// import cartSlice from './slices/cartSlice';
// import orderSlice from './slices/orderSlice';
// import restaurantSlice from './slices/restaurantSlice';
import locationSlice from './slices/locationSlice';
// import deliverySlice from './slices/deliverySlice';
import orderSlice from './slices/orderSlice';
import cartSlice from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    // API
    [baseApi.reducerPath]: baseApi.reducer,
    
    // Slices
    auth: authSlice,
    cart: cartSlice,
    order: orderSlice,
    restaurant: restaurantSlice,
    location: locationSlice,
    delivery: deliverySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store for use in app
export default store;

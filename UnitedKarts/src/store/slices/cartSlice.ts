import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem } from '../../types/order';
import { Restaurant } from '../../types/restaurant';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    initializeCart: (state, action: PayloadAction<{ restaurantId: string; restaurant?: Restaurant }>) => {
      state.cart = {
        restaurantId: action.payload.restaurantId,
        items: [],
        subtotal: 0,
        taxAmount: 0,
        deliveryFee: action.payload.restaurant?.deliveryFee || 0,
        discountAmount: 0,
        totalAmount: 0,
        restaurant: action.payload.restaurant,
      };
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (!state.cart) return;
      
      const existingItemIndex = state.cart.items.findIndex(
        item => 
          item.foodItemId === action.payload.foodItemId && 
          item.variantId === action.payload.variantId
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item
        state.cart.items[existingItemIndex].quantity += action.payload.quantity;
        state.cart.items[existingItemIndex].totalPrice = 
          state.cart.items[existingItemIndex].quantity * state.cart.items[existingItemIndex].unitPrice;
      } else {
        // Add new item
        state.cart.items.push(action.payload);
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },
    updateCartItem: (state, action: PayloadAction<{ foodItemId: string; variantId?: string; quantity: number }>) => {
      if (!state.cart) return;
      
      const itemIndex = state.cart.items.findIndex(
        item => 
          item.foodItemId === action.payload.foodItemId && 
          item.variantId === action.payload.variantId
      );
      
      if (itemIndex >= 0) {
        if (action.payload.quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.cart.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          state.cart.items[itemIndex].quantity = action.payload.quantity;
          state.cart.items[itemIndex].totalPrice = 
            state.cart.items[itemIndex].quantity * state.cart.items[itemIndex].unitPrice;
        }
        
        // Recalculate totals
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ foodItemId: string; variantId?: string }>) => {
      if (!state.cart) return;
      
      state.cart.items = state.cart.items.filter(
        item => 
          !(item.foodItemId === action.payload.foodItemId && 
            item.variantId === action.payload.variantId)
      );
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },
    applyCoupon: (state, action: PayloadAction<{ couponCode: string; discountAmount: number }>) => {
      if (!state.cart) return;
      
      state.cart.couponCode = action.payload.couponCode;
      state.cart.discountAmount = action.payload.discountAmount;
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeCoupon: (state) => {
      if (!state.cart) return;
      
      state.cart.couponCode = undefined;
      state.cart.discountAmount = 0;
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },
    calculateTotals: (state) => {
      if (!state.cart) return;
      
      // Calculate subtotal
      state.cart.subtotal = state.cart.items.reduce((total, item) => total + item.totalPrice, 0);
      
      // Calculate tax (assuming 5% tax rate)
      state.cart.taxAmount = state.cart.subtotal * 0.05;
      
      // Calculate total
      state.cart.totalAmount = 
        state.cart.subtotal + 
        state.cart.taxAmount + 
        state.cart.deliveryFee - 
        state.cart.discountAmount;
    },
    clearCart: (state) => {
      state.cart = null;
      state.error = null;
    },
    updateDeliveryFee: (state, action: PayloadAction<number>) => {
      if (!state.cart) return;
      
      state.cart.deliveryFee = action.payload;
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },
  },
});

export const {
  setLoading,
  setError,
  initializeCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  calculateTotals,
  clearCart,
  updateDeliveryFee,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCart = (state: { cart: CartState }) => state.cart.cart;
export const selectCartItems = (state: { cart: CartState }) => state.cart.cart?.items || [];
export const selectCartItemCount = (state: { cart: CartState }) => 
  state.cart.cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.cart?.subtotal || 0;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.cart?.totalAmount || 0;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectCartRestaurant = (state: { cart: CartState }) => state.cart.cart?.restaurant;

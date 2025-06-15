import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
  selectedAddress: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

const initialState: LocationState = {
  currentLocation: null,
  selectedAddress: null,
  isLoading: false,
  error: null,
  permissionGranted: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentLocation: (state, action: PayloadAction<{ latitude: number; longitude: number; address?: string }>) => {
      state.currentLocation = action.payload;
    },
    setSelectedAddress: (state, action: PayloadAction<{ latitude: number; longitude: number; address: string }>) => {
      state.selectedAddress = action.payload;
    },
    setPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLocation: (state) => {
      state.currentLocation = null;
      state.selectedAddress = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentLocation,
  setSelectedAddress,
  setPermissionGranted,
  clearError,
  clearLocation,
} = locationSlice.actions;

export default locationSlice.reducer;

// Selectors
export const selectCurrentLocation = (state: { location: LocationState }) => state.location.currentLocation;
export const selectSelectedAddress = (state: { location: LocationState }) => state.location.selectedAddress;
export const selectLocationLoading = (state: { location: LocationState }) => state.location.isLoading;
export const selectLocationError = (state: { location: LocationState }) => state.location.error;
export const selectPermissionGranted = (state: { location: LocationState }) => state.location.permissionGranted;

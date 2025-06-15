import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { ENV } from '../../config/environment';
import { ApiResponse, ApiError } from '../../types/api';

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: ENV.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// Base query with re-authentication
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );
      
      if (refreshResult.data) {
        // Store the new token
        const { token, refreshToken: newRefreshToken } = (refreshResult.data as any).data;
        api.dispatch({
          type: 'auth/setTokens',
          payload: { token, refreshToken: newRefreshToken },
        });
        
        // Retry the original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch({ type: 'auth/logout' });
      }
    } else {
      // No refresh token, logout user
      api.dispatch({ type: 'auth/logout' });
    }
  }
  
  return result;
};

// Transform response to handle API wrapper
const transformResponse = (response: ApiResponse<any>) => {
  if (response.success) {
    return response.data;
  }
  throw new Error(response.message || 'API Error');
};

// Transform error response
const transformErrorResponse = (response: any): ApiError => {
  if (response.data) {
    return {
      success: false,
      message: response.data.message || 'An error occurred',
      errors: response.data.errors,
      statusCode: response.status,
    };
  }
  
  return {
    success: false,
    message: response.error || 'Network error',
    statusCode: response.status,
  };
};

// Create the base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Restaurant',
    'Menu',
    'Order',
    'DeliveryPartner',
    'Category',
    'Address',
    'Coupon',
    'Notification',
  ],
  endpoints: () => ({}),
});

// Export hooks
export const {
  // Will be populated by individual API slices
} = baseApi;

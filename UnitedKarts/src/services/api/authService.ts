import axios, { AxiosResponse } from 'axios';
import { ENV } from '../../config/environment';
import { API_ENDPOINTS } from '../../config/api';
import {
  LoginRequest,
  RegisterRequest,
  OTPVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  RefreshTokenRequest,
} from '../../types/auth';
import { ApiResponse, LoginResponse, OTPResponse, RefreshTokenResponse } from '../../types/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Token will be added by Redux middleware
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // This will be handled by RTK Query middleware
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return response.data.data;
  },

  // Verify OTP
  verifyOTP: async (otpData: OTPVerificationRequest): Promise<OTPResponse> => {
    const response = await apiClient.post<ApiResponse<OTPResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      otpData
    );
    return response.data.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<OTPResponse> => {
    const response = await apiClient.post<ApiResponse<OTPResponse>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return response.data.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      API_ENDPOINTS.AUTH.REFRESH,
      data
    );
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.LOGOUT
    );
    return response.data.data;
  },
};

export default authService;

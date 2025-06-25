import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserStatus } from '@/constants/DummyData';

interface User {
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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  phone: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on app start
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      // In a real app, you would check AsyncStorage or secure storage
      // For demo purposes, we'll simulate this
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking stored auth:', error);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, create a mock user based on email
      let role: UserRole = 'customer';
      if (email.includes('restaurant')) {
        role = 'restaurant_owner';
      } else if (email.includes('delivery')) {
        role = 'delivery_partner';
      }

      const mockUser: User = {
        core_mstr_united_kart_users_id: 'user-' + Date.now(),
        email,
        phone: '+1234567890',
        first_name: 'John',
        last_name: 'Doe',
        role,
        status: 'active',
        email_verified: true,
        phone_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(mockUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser: User = {
        core_mstr_united_kart_users_id: 'user-' + Date.now(),
        email: userData.email,
        phone: userData.phone,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        status: 'active',
        email_verified: false,
        phone_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    // In a real app, you would also clear stored tokens
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

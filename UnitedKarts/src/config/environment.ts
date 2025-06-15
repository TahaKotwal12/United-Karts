import Config from 'react-native-dotenv';

export const ENV = {
  // API Configuration
  API_BASE_URL: Config.API_BASE_URL || 'https://api.unitedkarts.com/api/v1',
  SOCKET_URL: Config.SOCKET_URL || 'wss://api.unitedkarts.com',
  
  // Maps Configuration
  GOOGLE_MAPS_API_KEY: Config.GOOGLE_MAPS_API_KEY || '',
  GOOGLE_PLACES_API_KEY: Config.GOOGLE_PLACES_API_KEY || '',
  
  // Payment Configuration
  RAZORPAY_KEY_ID: Config.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: Config.RAZORPAY_KEY_SECRET || '',
  
  // Firebase Configuration
  FIREBASE_PROJECT_ID: Config.FIREBASE_PROJECT_ID || '',
  FIREBASE_APP_ID: Config.FIREBASE_APP_ID || '',
  FIREBASE_MESSAGING_SENDER_ID: Config.FIREBASE_MESSAGING_SENDER_ID || '',
  
  // App Configuration
  APP_NAME: Config.APP_NAME || 'United Karts',
  APP_VERSION: Config.APP_VERSION || '1.0.0',
  ENVIRONMENT: Config.ENVIRONMENT || 'development',
};

export const isDevelopment = ENV.ENVIRONMENT === 'development';
export const isProduction = ENV.ENVIRONMENT === 'production';
export const isStaging = ENV.ENVIRONMENT === 'staging';

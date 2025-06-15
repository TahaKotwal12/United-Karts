import 'dotenv/config';

export default {
  name: "UnitedKarts",
  slug: "UnitedKarts",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    apiBaseUrl: process.env.API_BASE_URL,
    socketUrl: process.env.SOCKET_URL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appName: process.env.APP_NAME,
    appVersion: process.env.APP_VERSION,
    environment: process.env.ENVIRONMENT
  }
}; 
import React, { useEffect } from 'react';
import { router } from 'expo-router';

export default function RestaurantDashboardScreen() {
  useEffect(() => {
    // Redirect to the new restaurant tab system
    router.replace('/restaurant/(tabs)');
  }, []);

  return null;
}

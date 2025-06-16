import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AppIndex() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // User is authenticated, navigate to appropriate dashboard
        switch (user.role) {
          case 'restaurant_owner':
            router.replace('/restaurant-dashboard');
            break;
          case 'delivery_partner':
            router.replace('/delivery-dashboard');
            break;
          case 'customer':
          default:
            router.replace('/(tabs)');
            break;
        }
      } else {
        // User is not authenticated, start onboarding flow
        router.replace('/onboarding');
      }
    }
  }, [isAuthenticated, isLoading, user]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // This should not be reached, but just in case
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

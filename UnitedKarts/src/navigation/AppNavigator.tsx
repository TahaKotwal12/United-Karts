import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';
import { RootStackParamList } from '../types/navigation';

// Import Navigators
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import DeliveryNavigator from './DeliveryNavigator';
import RestaurantNavigator from './RestaurantNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const getRoleBasedNavigator = () => {
    if (!isAuthenticated || !user) {
      return <Stack.Screen name="Auth" component={AuthNavigator} />;
    }

    switch (user.role) {
      case 'customer':
        return <Stack.Screen name="Customer" component={CustomerNavigator} />;
      case 'delivery_partner':
        return <Stack.Screen name="Delivery" component={DeliveryNavigator} />;
      case 'restaurant_owner':
      case 'admin':
        return <Stack.Screen name="Restaurant" component={RestaurantNavigator} />;
      default:
        return <Stack.Screen name="Auth" component={AuthNavigator} />;
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {getRoleBasedNavigator()}
    </Stack.Navigator>
  );
};

export default AppNavigator;

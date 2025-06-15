import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomerTabParamList, CustomerHomeStackParamList } from '../types/navigation';
import { colors } from '../config/colors';

// Import Customer Screens
import HomeScreen from '../screens/customer/HomeScreen/HomeScreen';
import RestaurantListScreen from '../screens/customer/RestaurantListScreen/RestaurantListScreen';
import RestaurantDetailScreen from '../screens/customer/RestaurantDetailScreen/RestaurantDetailScreen';
import MenuScreen from '../screens/customer/MenuScreen/MenuScreen';
import CartScreen from '../screens/customer/CartScreen/CartScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen/CheckoutScreen';
import OrderTrackingScreen from '../screens/customer/OrderTrackingScreen/OrderTrackingScreen';
import OrderHistoryScreen from '../screens/customer/OrderHistoryScreen/OrderHistoryScreen';
import ProfileScreen from '../screens/customer/ProfileScreen/ProfileScreen';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const HomeStack = createStackNavigator<CustomerHomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="RestaurantList" component={RestaurantListScreen} />
      <HomeStack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <HomeStack.Screen name="Menu" component={MenuScreen} />
      <HomeStack.Screen name="Cart" component={CartScreen} />
      <HomeStack.Screen name="Checkout" component={CheckoutScreen} />
      <HomeStack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </HomeStack.Navigator>
  );
};

const CustomerNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <span>🏠</span>,
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={RestaurantListScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: () => <span>🔍</span>,
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderHistoryScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: () => <span>📋</span>,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => <span>👤</span>,
        }}
      />
    </Tab.Navigator>
  );
};

export default CustomerNavigator;

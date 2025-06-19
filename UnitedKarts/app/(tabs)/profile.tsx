import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppContext, useCart, useFavorites } from '@/contexts/AppContext';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state } = useAppContext();
  const { cartItemCount } = useCart();
  const { favorites } = useFavorites();

  const menuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      subtitle: 'View your order history',
      icon: 'list.bullet' as any,
      onPress: () => router.push('/orders' as any),
    },
    {
      id: 'favorites',
      title: 'Favorites',
      subtitle: `${favorites.length} saved restaurants`,
      icon: 'heart.fill' as any,
      onPress: () => Alert.alert('Favorites', 'Favorites feature coming soon!'),
    },
    {
      id: 'addresses',
      title: 'Delivery Addresses',
      subtitle: 'Manage your addresses',
      icon: 'location.fill' as any,
      onPress: () => Alert.alert('Addresses', 'Address management coming soon!'),
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      subtitle: 'Manage payment options',
      icon: 'creditcard.fill' as any,
      onPress: () => Alert.alert('Payment', 'Payment methods coming soon!'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage your preferences',
      icon: 'bell.fill' as any,
      onPress: () => Alert.alert('Notifications', 'Notification settings coming soon!'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help with your orders',
      icon: 'questionmark.circle.fill' as any,
      onPress: () => Alert.alert('Help', 'Help & support coming soon!'),
    },
    {
      id: 'about',
      title: 'About UnitedKarts',
      subtitle: 'App version 1.0.0',
      icon: 'info.circle.fill' as any,
      onPress: () => Alert.alert('About', 'UnitedKarts Food Delivery App v1.0.0'),
    },
  ];

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          Alert.alert('Logged Out', 'You have been logged out successfully.');
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {state.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {state.currentUser.name}
            </Text>
            <Text style={[styles.userEmail, { color: colors.icon }]}>
              {state.currentUser.email}
            </Text>
            <Text style={[styles.userPhone, { color: colors.icon }]}>
              {state.currentUser.phone}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.secondary }]}
            onPress={handleEditProfile}
          >
            <IconSymbol name="pencil" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {state.orders.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Orders</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {favorites.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Favorites</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {cartItemCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>In Cart</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}>
                <IconSymbol name={item.icon} size={20} color={colors.primary} />
              </View>
              
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuSubtitle, { color: colors.icon }]}>
                  {item.subtitle}
                </Text>
              </View>
              
              <IconSymbol name="chevron.right" size={16} color={colors.icon} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.accent }]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});

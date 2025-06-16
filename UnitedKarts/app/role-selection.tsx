import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function RoleSelectionScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Order food from your favorite restaurants',
      icon: 'person.fill',
      route: '/(tabs)',
      color: colors.primary,
    },
    {
      id: 'restaurant',
      title: 'Restaurant Partner',
      subtitle: 'Manage your restaurant and orders',
      icon: 'house.fill',
      route: '/restaurant-dashboard',
      color: colors.success,
    },
    {
      id: 'delivery',
      title: 'Delivery Partner',
      subtitle: 'Deliver orders and earn money',
      icon: 'car',
      route: '/delivery-dashboard',
      color: colors.warning,
    },
  ];

  const handleRoleSelect = (route: string) => {
    // Navigate to login for authentication first
    router.push('/auth/login' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome to</Text>
        <Text style={[styles.appName, { color: colors.primary }]}>UnitedKarts</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Choose how you want to use the app
        </Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
                borderColor: role.color,
              }
            ]}
            onPress={() => handleRoleSelect(role.route)}
            activeOpacity={0.8}
          >
            <View style={[styles.roleIcon, { backgroundColor: role.color }]}>
              <IconSymbol name={role.icon as any} size={32} color="white" />
            </View>
            
            <View style={styles.roleContent}>
              <Text style={[styles.roleTitle, { color: colors.text }]}>
                {role.title}
              </Text>
              <Text style={[styles.roleSubtitle, { color: colors.icon }]}>
                {role.subtitle}
              </Text>
            </View>
            
            <IconSymbol name="chevron.right" size={20} color={colors.icon} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.icon }]}>
          You can switch between roles anytime in settings
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  rolesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

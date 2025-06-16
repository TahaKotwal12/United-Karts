import React, { useState } from 'react';
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

export default function RestaurantDashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isOnline, setIsOnline] = useState(true);

  // Mock data for restaurant dashboard
  const todayStats = {
    orders: 24,
    revenue: 485.50,
    avgOrderValue: 20.23,
    rating: 4.6,
  };

  const recentOrders = [
    {
      id: '1001',
      customerName: 'John Doe',
      items: ['Margherita Pizza', 'Garlic Bread'],
      total: 18.99,
      status: 'preparing',
      time: '2 min ago',
    },
    {
      id: '1002',
      customerName: 'Jane Smith',
      items: ['Pepperoni Pizza', 'Coke'],
      total: 22.50,
      status: 'ready',
      time: '5 min ago',
    },
    {
      id: '1003',
      customerName: 'Mike Johnson',
      items: ['Veggie Pizza'],
      total: 15.99,
      status: 'delivered',
      time: '15 min ago',
    },
  ];

  const menuItems = [
    { id: '1', name: 'Manage Menu', icon: 'list.bullet', action: () => Alert.alert('Menu', 'Menu management coming soon!') },
    { id: '2', name: 'Analytics', icon: 'star.fill', action: () => Alert.alert('Analytics', 'Analytics coming soon!') },
    { id: '3', name: 'Promotions', icon: 'plus', action: () => Alert.alert('Promotions', 'Promotions coming soon!') },
    { id: '4', name: 'Settings', icon: 'pencil', action: () => Alert.alert('Settings', 'Settings coming soon!') },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return colors.warning;
      case 'ready': return colors.primary;
      case 'delivered': return colors.success;
      default: return colors.icon;
    }
  };

  const handleOrderAction = (orderId: string, action: string) => {
    Alert.alert('Order Action', `${action} order #${orderId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Restaurant Dashboard</Text>
        <TouchableOpacity
          style={[
            styles.statusToggle,
            { backgroundColor: isOnline ? colors.success : colors.accent }
          ]}
          onPress={() => setIsOnline(!isOnline)}
        >
          <Text style={styles.statusText}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.restaurantName, { color: colors.text }]}>Pizza Palace</Text>
          <Text style={[styles.restaurantAddress, { color: colors.icon }]}>
            123 Food Street, Downtown
          </Text>
          <View style={styles.restaurantStats}>
            <View style={styles.statItem}>
              <IconSymbol name="star.fill" size={16} color={colors.warning} />
              <Text style={[styles.statText, { color: colors.text }]}>4.6 Rating</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol name="clock" size={16} color={colors.icon} />
              <Text style={[styles.statText, { color: colors.text }]}>25-30 min</Text>
            </View>
          </View>
        </View>

        {/* Today's Stats */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Performance</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{todayStats.orders}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Orders</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.success }]}>${todayStats.revenue}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Revenue</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.warning }]}>${todayStats.avgOrderValue}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Avg Order</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{todayStats.rating}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Orders</Text>
          
          {recentOrders.map((order) => (
            <View key={order.id} style={[styles.orderCard, { borderLeftColor: getStatusColor(order.status) }]}>
              <View style={styles.orderHeader}>
                <Text style={[styles.orderId, { color: colors.text }]}>#{order.id}</Text>
                <Text style={[styles.orderTime, { color: colors.icon }]}>{order.time}</Text>
              </View>
              
              <Text style={[styles.customerName, { color: colors.text }]}>{order.customerName}</Text>
              <Text style={[styles.orderItems, { color: colors.icon }]}>
                {order.items.join(', ')}
              </Text>
              
              <View style={styles.orderFooter}>
                <Text style={[styles.orderTotal, { color: colors.primary }]}>
                  ${order.total.toFixed(2)}
                </Text>
                
                <View style={styles.orderActions}>
                  {order.status === 'preparing' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleOrderAction(order.id, 'Mark Ready')}
                    >
                      <Text style={styles.actionButtonText}>Mark Ready</Text>
                    </TouchableOpacity>
                  )}
                  
                  {order.status === 'ready' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.success }]}
                      onPress={() => handleOrderAction(order.id, 'Mark Picked Up')}
                    >
                      <Text style={styles.actionButtonText}>Picked Up</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.actionCard, { backgroundColor: colors.secondary }]}
                onPress={item.action}
              >
                <IconSymbol name={item.icon as any} size={24} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.text }]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  statusToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    marginBottom: 12,
  },
  restaurantStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  orderCard: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderTime: {
    fontSize: 12,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 12,
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

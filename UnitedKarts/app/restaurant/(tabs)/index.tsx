import React, { useState, useEffect } from 'react';
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
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { RefreshControl } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface RestaurantStats {
  todayOrders: number;
  todayRevenue: number;
  avgOrderValue: number;
  rating: number;
  totalRatings: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  items: string[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered';
  createdAt: string;
  estimatedTime?: number;
}

export default function RestaurantDashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<RestaurantStats>({
    todayOrders: 24,
    todayRevenue: 36412.50, // ₹485.50 * 75 (approx USD to INR)
    avgOrderValue: 1517.25, // ₹20.23 * 75
    rating: 4.6,
    totalRatings: 156,
    pendingOrders: 3,
    preparingOrders: 5,
    readyOrders: 2,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([
    {
      id: '1',
      orderNumber: 'UK001',
      customerName: 'Rajesh Kumar',
      items: ['Margherita Pizza', 'Garlic Bread'],
      totalAmount: 1424.25, // ₹18.99 * 75
      status: 'pending',
      createdAt: '2 min ago',
      estimatedTime: 25,
    },
    {
      id: '2',
      orderNumber: 'UK002',
      customerName: 'Priya Sharma',
      items: ['Pepperoni Pizza', 'Coke'],
      totalAmount: 1687.50, // ₹22.50 * 75
      status: 'preparing',
      createdAt: '5 min ago',
      estimatedTime: 20,
    },
    {
      id: '3',
      orderNumber: 'UK003',
      customerName: 'Amit Patel',
      items: ['Veggie Pizza'],
      totalAmount: 1199.25, // ₹15.99 * 75
      status: 'ready_for_pickup',
      createdAt: '8 min ago',
    },
  ]);

  const quickActions = [
    { 
      id: '1', 
      name: 'View All Orders', 
      icon: 'list.bullet.clipboard', 
      action: () => router.push('/restaurant/(tabs)/orders'),
      badge: stats.pendingOrders + stats.preparingOrders + stats.readyOrders,
    },
    { 
      id: '2', 
      name: 'Manage Menu', 
      icon: 'menucard', 
      action: () => router.push('/restaurant/(tabs)/menu'),
    },
    { 
      id: '3', 
      name: 'Analytics', 
      icon: 'chart.bar', 
      action: () => router.push('/restaurant/(tabs)/analytics'),
    },
    { 
      id: '4', 
      name: 'Settings', 
      icon: 'gear', 
      action: () => router.push('/restaurant/settings'),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'confirmed': return colors.primary;
      case 'preparing': return colors.accent;
      case 'ready_for_pickup': return colors.success;
      case 'picked_up': return colors.success;
      case 'delivered': return colors.icon;
      default: return colors.icon;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'New Order';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'ready_for_pickup': return 'Ready';
      case 'picked_up': return 'Picked Up';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const handleOrderAction = (orderId: string, action: string) => {
    const order = recentOrders.find(o => o.id === orderId);
    if (!order) return;

    let newStatus: RecentOrder['status'];
    switch (action) {
      case 'confirm':
        newStatus = 'confirmed';
        break;
      case 'start_preparing':
        newStatus = 'preparing';
        break;
      case 'mark_ready':
        newStatus = 'ready_for_pickup';
        break;
      default:
        return;
    }

    setRecentOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );

    // Update stats
    setStats(prev => ({
      ...prev,
      pendingOrders: prev.pendingOrders - (order.status === 'pending' ? 1 : 0),
      preparingOrders: prev.preparingOrders + (newStatus === 'preparing' ? 1 : 0) - (order.status === 'preparing' ? 1 : 0),
      readyOrders: prev.readyOrders + (newStatus === 'ready_for_pickup' ? 1 : 0) - (order.status === 'ready_for_pickup' ? 1 : 0),
    }));
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    Alert.alert(
      'Status Updated',
      `Restaurant is now ${!isOnline ? 'ONLINE' : 'OFFLINE'}`,
      [{ text: 'OK' }]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Data has been updated');
    }, 1000);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
 <ThemedView>
          <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>Pizza Palace</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.statusToggle,
            { backgroundColor: isOnline ? colors.success : colors.accent }
          ]}
          onPress={toggleOnlineStatus}
        >
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
 </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Today's Stats */}
 <ThemedView style={styles.section}>
 <ThemedText type="subtitle">Today's Performance</ThemedText>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <IconSymbol name="bag.fill" size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.todayOrders}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Orders</Text>
            </View>
            
            <View style={styles.statCard}>
              <IconSymbol name="indianrupee.circle.fill" size={24} color={colors.success} />
              <Text style={[styles.statValue, { color: colors.text }]}>₹{stats.todayRevenue.toLocaleString('en-IN')}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Revenue</Text>
            </View>
            
            <View style={styles.statCard}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={colors.warning} />
              <Text style={[styles.statValue, { color: colors.text }]}>₹{stats.avgOrderValue.toLocaleString('en-IN')}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Avg Order</Text>
            </View>
            
            <View style={styles.statCard}>
              <IconSymbol name="star.fill" size={24} color={colors.warning} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.rating}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Rating</Text>
            </View>
          </View>
 </ThemedView>

        {/* Order Status Overview */}
 <ThemedView style={styles.section}>
 <ThemedText type="subtitle">Order Status</ThemedText>
          
          <View style={styles.orderStatusGrid}>
            <View style={[styles.statusCard, { backgroundColor: colors.warning + '20' }]}>
              <Text style={[styles.statusValue, { color: colors.warning }]}>{stats.pendingOrders}</Text>
              <Text style={[styles.statusLabel, { color: colors.text }]}>Pending</Text>
            </View>
            
            <View style={[styles.statusCard, { backgroundColor: colors.accent + '20' }]}>
              <Text style={[styles.statusValue, { color: colors.accent }]}>{stats.preparingOrders}</Text>
              <Text style={[styles.statusLabel, { color: colors.text }]}>Preparing</Text>
            </View>
            
            <View style={[styles.statusCard, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.statusValue, { color: colors.success }]}>{stats.readyOrders}</Text>
              <Text style={[styles.statusLabel, { color: colors.text }]}>Ready</Text>
            </View>
          </View>
 </ThemedView>

        {/* Recent Orders */}
 <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
 <ThemedText type="subtitle">Recent Orders</ThemedText>
            <TouchableOpacity onPress={() => router.push('/restaurant/(tabs)/orders')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentOrders.map((order) => (
            <View key={order.id} style={[styles.orderCard, { borderLeftColor: getStatusColor(order.status) }]}>
              <View style={styles.orderHeader}>
                <Text style={[styles.orderNumber, { color: colors.text }]}>#{order.orderNumber}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusBadgeText}>{getStatusText(order.status)}</Text>
                </View>
              </View>
              
              <Text style={[styles.customerName, { color: colors.text }]}>{order.customerName}</Text>
              <Text style={[styles.orderItems, { color: colors.icon }]}>
                {order.items.join(', ')}
              </Text>
              
              <View style={styles.orderFooter}>
                <View>
                  <Text style={[styles.orderTotal, { color: colors.primary }]}>
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.orderTime, { color: colors.icon }]}>{order.createdAt}</Text>
                </View>
                
                <View style={styles.orderActions}>
                  {order.status === 'pending' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleOrderAction(order.id, 'confirm')}
                    >
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.accent }]}
                      onPress={() => handleOrderAction(order.id, 'start_preparing')}
                    >
                      <Text style={styles.actionButtonText}>Start</Text>
                    </TouchableOpacity>
                  )}
                  
                  {order.status === 'preparing' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.success }]}
                      onPress={() => handleOrderAction(order.id, 'mark_ready')}
                    >
                      <Text style={styles.actionButtonText}>Ready</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
 </ThemedView>

        {/* Quick Actions */}
 <ThemedView style={styles.section}>
 <ThemedText type="subtitle">Quick Actions</ThemedText>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.actionCard, { backgroundColor: colors.secondary }]}
                onPress={item.action}
              >
                {item.badge && item.badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <IconSymbol name={item.icon as any} size={24} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.text }]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
 </ThemedView>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
 </ThemedView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
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
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  orderStatusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
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
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
  orderTime: {
    fontSize: 10,
    marginTop: 2,
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
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});

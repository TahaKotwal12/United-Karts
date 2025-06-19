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

export default function DeliveryDashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isOnline, setIsOnline] = useState(true);

  // Mock data for delivery dashboard
  const todayStats = {
    deliveries: 12,
    earnings: 156.80,
    avgDeliveryTime: 18,
    rating: 4.8,
  };

  const availableOrders = [
    {
      id: '2001',
      restaurant: 'Pizza Palace',
      customer: 'John Doe',
      pickupAddress: '123 Food Street',
      deliveryAddress: '456 Oak Ave',
      distance: '2.3 km',
      earnings: 8.50,
      estimatedTime: '25 min',
    },
    {
      id: '2002',
      restaurant: 'Burger Junction',
      customer: 'Jane Smith',
      pickupAddress: '789 Main St',
      deliveryAddress: '321 Pine Rd',
      distance: '1.8 km',
      earnings: 6.75,
      estimatedTime: '20 min',
    },
  ];

  const activeDelivery = {
    id: '2003',
    restaurant: 'Spice Garden',
    customer: 'Mike Johnson',
    pickupAddress: '555 Curry Lane',
    deliveryAddress: '777 Spice Ave',
    distance: '3.1 km',
    earnings: 9.25,
    status: 'picked_up',
    customerPhone: '+1 234 567 8901',
  };

  const quickActions = [
    { id: '1', name: 'Earnings', icon: 'star.fill', action: () => Alert.alert('Earnings', 'Earnings details coming soon!') },
    { id: '2', name: 'History', icon: 'clock', action: () => Alert.alert('History', 'Delivery history coming soon!') },
    { id: '3', name: 'Support', icon: 'questionmark.circle.fill', action: () => Alert.alert('Support', 'Support coming soon!') },
    { id: '4', name: 'Settings', icon: 'pencil', action: () => Alert.alert('Settings', 'Settings coming soon!') },
  ];

  const handleAcceptOrder = (orderId: string) => {
    Alert.alert('Order Accepted', `You have accepted order #${orderId}`);
  };

  const handleDeliveryAction = (action: string) => {
    Alert.alert('Delivery Action', `${action} completed`);
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
        <Text style={[styles.title, { color: colors.text }]}>Delivery Dashboard</Text>
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
        {/* Driver Info */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.driverName, { color: colors.text }]}>Alex Rodriguez</Text>
          <Text style={[styles.driverInfo, { color: colors.icon }]}>
            Vehicle: Honda Civic • License: ABC123
          </Text>
          <View style={styles.driverStats}>
            <View style={styles.statItem}>
              <IconSymbol name="star.fill" size={16} color={colors.warning} />
              <Text style={[styles.statText, { color: colors.text }]}>4.8 Rating</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={[styles.statText, { color: colors.text }]}>98% Success</Text>
            </View>
          </View>
        </View>

        {/* Today's Stats */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Performance</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{todayStats.deliveries}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Deliveries</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.success }]}>${todayStats.earnings}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Earnings</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.warning }]}>{todayStats.avgDeliveryTime}m</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Avg Time</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{todayStats.rating}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Active Delivery */}
        {activeDelivery && (
          <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Delivery</Text>
            
            <View style={[styles.deliveryCard, { borderLeftColor: colors.primary }]}>
              <View style={styles.deliveryHeader}>
                <Text style={[styles.orderId, { color: colors.text }]}>#{activeDelivery.id}</Text>
                <Text style={[styles.earnings, { color: colors.success }]}>
                  ${activeDelivery.earnings.toFixed(2)}
                </Text>
              </View>
              
              <Text style={[styles.restaurantName, { color: colors.text }]}>
                {activeDelivery.restaurant}
              </Text>
              <Text style={[styles.customerName, { color: colors.icon }]}>
                Customer: {activeDelivery.customer}
              </Text>
              
              <View style={styles.addressContainer}>
                <View style={styles.addressRow}>
                  <IconSymbol name="location" size={16} color={colors.accent} />
                  <Text style={[styles.address, { color: colors.text }]}>
                    Pickup: {activeDelivery.pickupAddress}
                  </Text>
                </View>
                <View style={styles.addressRow}>
                  <IconSymbol name="location.fill" size={16} color={colors.success} />
                  <Text style={[styles.address, { color: colors.text }]}>
                    Delivery: {activeDelivery.deliveryAddress}
                  </Text>
                </View>
              </View>
              
              <View style={styles.deliveryActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={() => Alert.alert('Call Customer', activeDelivery.customerPhone)}
                >
                  <IconSymbol name="plus" size={16} color="white" />
                  <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.success }]}
                  onPress={() => handleDeliveryAction('Mark Delivered')}
                >
                  <IconSymbol name="checkmark.circle.fill" size={16} color="white" />
                  <Text style={styles.actionButtonText}>Delivered</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Available Orders */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Orders</Text>
          
          {availableOrders.map((order) => (
            <View key={order.id} style={[styles.orderCard, { borderLeftColor: colors.warning }]}>
              <View style={styles.orderHeader}>
                <Text style={[styles.orderId, { color: colors.text }]}>#{order.id}</Text>
                <Text style={[styles.earnings, { color: colors.success }]}>
                  ${order.earnings.toFixed(2)}
                </Text>
              </View>
              
              <Text style={[styles.restaurantName, { color: colors.text }]}>
                {order.restaurant}
              </Text>
              <Text style={[styles.customerName, { color: colors.icon }]}>
                Customer: {order.customer}
              </Text>
              
              <View style={styles.orderInfo}>
                <View style={styles.infoItem}>
                  <IconSymbol name="location" size={14} color={colors.icon} />
                  <Text style={[styles.infoText, { color: colors.icon }]}>{order.distance}</Text>
                </View>
                <View style={styles.infoItem}>
                  <IconSymbol name="clock" size={14} color={colors.icon} />
                  <Text style={[styles.infoText, { color: colors.icon }]}>{order.estimatedTime}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.acceptButton, { backgroundColor: colors.primary }]}
                onPress={() => handleAcceptOrder(order.id)}
              >
                <Text style={styles.acceptButtonText}>Accept Order</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((item) => (
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
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  driverInfo: {
    fontSize: 14,
    marginBottom: 12,
  },
  driverStats: {
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
  deliveryCard: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 12,
  },
  orderCard: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  earnings: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    marginBottom: 8,
  },
  addressContainer: {
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  orderInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.48,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  acceptButton: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 14,
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

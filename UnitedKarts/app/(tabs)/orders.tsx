import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { sampleOrders, Order } from '@/constants/DummyData';

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return colors.warning;
      case 'on_the_way':
        return colors.primary;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.accent;
      default:
        return colors.icon;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'on_the_way':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'clock';
      case 'on_the_way':
        return 'car';
      case 'delivered':
        return 'checkmark.circle.fill';
      case 'cancelled':
        return 'xmark.circle.fill';
      default:
        return 'clock';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderId, { color: colors.text }]}>Order #{order.id}</Text>
          <Text style={[styles.orderDate, { color: colors.icon }]}>
            {formatDate(order.orderTime)}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <IconSymbol name={getStatusIcon(order.status)} size={12} color="white" />
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      {/* Restaurant Info */}
      <View style={styles.restaurantInfo}>
        <Image source={{ uri: order.restaurant.image }} style={styles.restaurantImage} />
        <View style={styles.restaurantDetails}>
          <Text style={[styles.restaurantName, { color: colors.text }]}>
            {order.restaurant.name}
          </Text>
          <Text style={[styles.restaurantAddress, { color: colors.icon }]}>
            {order.address}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.itemsSection}>
        <Text style={[styles.itemsTitle, { color: colors.text }]}>Items:</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={[styles.itemQuantity, { color: colors.icon }]}>
              {item.quantity}x
            </Text>
            <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.itemPrice, { color: colors.primary }]}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={[styles.orderFooter, { borderTopColor: colors.border }]}>
        <View style={styles.totalSection}>
          <Text style={[styles.totalLabel, { color: colors.icon }]}>Total</Text>
          <Text style={[styles.totalAmount, { color: colors.text }]}>
            ${order.total.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          {order.status === 'delivered' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            >
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                Reorder
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.actionButtonTextPrimary}>Track Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (sampleOrders.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Orders</Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <IconSymbol name="list.bullet" size={80} color={colors.icon} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No orders yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
            When you place your first order, it will appear here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Orders</Text>
        <TouchableOpacity>
          <IconSymbol name="line.horizontal.3.decrease" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Orders */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Orders</Text>
          {sampleOrders
            .filter(order => order.status === 'preparing' || order.status === 'on_the_way')
            .map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
        </View>

        {/* Past Orders */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Past Orders</Text>
          {sampleOrders
            .filter(order => order.status === 'delivered' || order.status === 'cancelled')
            .map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  orderCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  restaurantAddress: {
    fontSize: 12,
  },
  itemsSection: {
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    width: 24,
  },
  itemName: {
    flex: 1,
    fontSize: 12,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderFooter: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonTextPrimary: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});

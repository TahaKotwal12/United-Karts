import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface OrderItem {
  id: string;
  foodItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  variantName?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  estimatedDeliveryTime?: string;
  specialInstructions?: string;
  deliveryAddress: string;
  deliveryPartnerName?: string;
}

export default function RestaurantOrdersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'UK001',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      items: [
        {
          id: '1',
          foodItemName: 'Margherita Pizza',
          quantity: 1,
          unitPrice: 1199.25, // ₹15.99 * 75
          totalPrice: 1199.25,
          variantName: 'Large',
        },
        {
          id: '2',
          foodItemName: 'Garlic Bread',
          quantity: 2,
          unitPrice: 299.25, // ₹3.99 * 75
          totalPrice: 598.50,
          specialInstructions: 'Extra garlic',
        },
      ],
      subtotal: 1797.75, // ₹23.97 * 75
      taxAmount: 180.00, // ₹2.40 * 75
      deliveryFee: 224.25, // ₹2.99 * 75
      discountAmount: 0,
      totalAmount: 2202.00, // ₹29.36 * 75
      status: 'pending',
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      createdAt: '2 min ago',
      estimatedDeliveryTime: '25-30 min',
      specialInstructions: 'Ring the doorbell twice',
      deliveryAddress: 'A-123, Sector 15, Noida, Uttar Pradesh 201301',
    },
    {
      id: '2',
      orderNumber: 'UK002',
      customerName: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      items: [
        {
          id: '3',
          foodItemName: 'Pepperoni Pizza',
          quantity: 1,
          unitPrice: 1424.25, // ₹18.99 * 75
          totalPrice: 1424.25,
          variantName: 'Medium',
        },
        {
          id: '4',
          foodItemName: 'Coke',
          quantity: 1,
          unitPrice: 224.25, // ₹2.99 * 75
          totalPrice: 224.25,
        },
      ],
      subtotal: 1648.50, // ₹21.98 * 75
      taxAmount: 165.00, // ₹2.20 * 75
      deliveryFee: 224.25, // ₹2.99 * 75
      discountAmount: 150.00, // ₹2.00 * 75
      totalAmount: 1887.75, // ₹25.17 * 75
      status: 'preparing',
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      createdAt: '5 min ago',
      estimatedDeliveryTime: '20-25 min',
      deliveryAddress: 'B-456, Connaught Place, New Delhi 110001',
      deliveryPartnerName: 'Amit Singh',
    },
    {
      id: '3',
      orderNumber: 'UK003',
      customerName: 'Vikram Patel',
      customerPhone: '+91 76543 21098',
      items: [
        {
          id: '5',
          foodItemName: 'Veggie Pizza',
          quantity: 1,
          unitPrice: 1274.25, // ₹16.99 * 75
          totalPrice: 1274.25,
          variantName: 'Large',
          specialInstructions: 'No onions',
        },
      ],
      subtotal: 1274.25, // ₹16.99 * 75
      taxAmount: 127.50, // ₹1.70 * 75
      deliveryFee: 224.25, // ₹2.99 * 75
      discountAmount: 0,
      totalAmount: 1626.00, // ₹21.68 * 75
      status: 'ready_for_pickup',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      createdAt: '8 min ago',
      estimatedDeliveryTime: '15-20 min',
      deliveryAddress: 'C-789, Bandra West, Mumbai, Maharashtra 400050',
      deliveryPartnerName: 'Ravi Kumar',
    },
  ]);

  const filterOptions = [
    { key: 'all', label: 'All Orders', count: orders.length },
    { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { key: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { key: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready_for_pickup').length },
    { key: 'completed', label: 'Completed', count: orders.filter(o => ['delivered', 'picked_up'].includes(o.status)).length },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'pending' && order.status === 'pending') ||
      (selectedFilter === 'preparing' && order.status === 'preparing') ||
      (selectedFilter === 'ready' && order.status === 'ready_for_pickup') ||
      (selectedFilter === 'completed' && ['delivered', 'picked_up'].includes(order.status));

    const matchesSearch = searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'confirmed': return colors.primary;
      case 'preparing': return colors.accent;
      case 'ready_for_pickup': return colors.success;
      case 'picked_up': return colors.success;
      case 'delivered': return colors.icon;
      case 'cancelled': return colors.accent;
      default: return colors.icon;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'New Order';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'ready_for_pickup': return 'Ready for Pickup';
      case 'picked_up': return 'Picked Up';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleOrderAction = (orderId: string, action: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let newStatus: Order['status'];
    let actionText = '';

    switch (action) {
      case 'confirm':
        newStatus = 'confirmed';
        actionText = 'Order confirmed';
        break;
      case 'start_preparing':
        newStatus = 'preparing';
        actionText = 'Started preparing';
        break;
      case 'mark_ready':
        newStatus = 'ready_for_pickup';
        actionText = 'Order ready for pickup';
        break;
      case 'mark_picked_up':
        newStatus = 'picked_up';
        actionText = 'Order picked up';
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Order',
          'Are you sure you want to cancel this order?',
          [
            { text: 'No', style: 'cancel' },
            { 
              text: 'Yes', 
              style: 'destructive',
              onPress: () => {
                setOrders(prev => 
                  prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' as Order['status'] } : o)
                );
                Alert.alert('Success', 'Order cancelled');
              }
            },
          ]
        );
        return;
      default:
        return;
    }

    setOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );

    Alert.alert('Success', actionText);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Orders updated');
    }, 1000);
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: colors.card, shadowColor: colors.shadow, borderLeftColor: getStatusColor(order.status) }]}
      onPress={() => openOrderDetails(order)}
      activeOpacity={0.8}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderNumber, { color: colors.text }]}>#{order.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusBadgeText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      <Text style={[styles.customerName, { color: colors.text }]}>{order.customerName}</Text>
      <Text style={[styles.customerPhone, { color: colors.icon }]}>{order.customerPhone}</Text>

      <View style={styles.orderItems}>
        {order.items.slice(0, 2).map((item, index) => (
          <Text key={index} style={[styles.itemText, { color: colors.icon }]}>
            {item.quantity}x {item.foodItemName} {item.variantName ? `(${item.variantName})` : ''}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={[styles.moreItems, { color: colors.icon }]}>
            +{order.items.length - 2} more items
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <View>
          <Text style={[styles.orderTotal, { color: colors.primary }]}>
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </Text>
          <Text style={[styles.orderTime, { color: colors.icon }]}>{order.createdAt}</Text>
        </View>

        <View style={styles.orderActions}>
          {order.status === 'pending' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.accent }]}
                onPress={() => handleOrderAction(order.id, 'cancel')}
              >
                <Text style={styles.actionButtonText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => handleOrderAction(order.id, 'confirm')}
              >
                <Text style={styles.actionButtonText}>Accept</Text>
              </TouchableOpacity>
            </>
          )}

          {order.status === 'confirmed' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.accent }]}
              onPress={() => handleOrderAction(order.id, 'start_preparing')}
            >
              <Text style={styles.actionButtonText}>Start Preparing</Text>
            </TouchableOpacity>
          )}

          {order.status === 'preparing' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success }]}
              onPress={() => handleOrderAction(order.id, 'mark_ready')}
            >
              <Text style={styles.actionButtonText}>Mark Ready</Text>
            </TouchableOpacity>
          )}

          {order.status === 'ready_for_pickup' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success }]}
              onPress={() => handleOrderAction(order.id, 'mark_picked_up')}
            >
              <Text style={styles.actionButtonText}>Picked Up</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Orders</Text>
        <TouchableOpacity onPress={onRefresh}>
          <IconSymbol name="arrow.clockwise" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.secondary }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search orders..."
          placeholderTextColor={colors.icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Order Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {filterOptions.map((filter) => {
            const isSelected = selectedFilter === filter.key;
            const getFilterIcon = (key: string) => {
              switch (key) {
                case 'all': return 'list.bullet';
                case 'pending': return 'clock';
                case 'preparing': return 'gear';
                case 'ready': return 'checkmark.circle';
                case 'completed': return 'checkmark.circle.fill';
                default: return 'list.bullet';
              }
            };
            
            return (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => setSelectedFilter(filter.key as any)}
              >
                <IconSymbol 
                  name={getFilterIcon(filter.key) as any} 
                  size={16} 
                  color={isSelected ? 'white' : colors.icon} 
                />
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? 'white' : colors.text }
                  ]}
                >
                  {filter.label}
                </Text>
                {filter.count > 0 && (
                  <View style={[styles.filterBadge, { backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : colors.primary }]}>
                    <Text style={[styles.filterBadgeText, { color: 'white' }]}>
                      {filter.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="list.bullet.clipboard" size={48} color={colors.icon} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No orders found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
              {searchQuery ? 'Try adjusting your search' : 'Orders will appear here when customers place them'}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Order Details Modal */}
      <Modal
        visible={showOrderDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowOrderDetails(false)}
      >
        {selectedOrder && (
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <TouchableOpacity onPress={() => setShowOrderDetails(false)}>
                <IconSymbol name="xmark" size={24} color={colors.icon} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Order Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Order Info */}
              <View style={[styles.detailSection, { backgroundColor: colors.card }]}>
                <Text style={[styles.detailSectionTitle, { color: colors.text }]}>Order Information</Text>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Order Number:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>#{selectedOrder.orderNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Status:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedOrder.status) }]}>
                    <Text style={styles.statusBadgeText}>{getStatusText(selectedOrder.status)}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Order Time:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedOrder.createdAt}</Text>
                </View>
                {selectedOrder.estimatedDeliveryTime && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.icon }]}>Estimated Time:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedOrder.estimatedDeliveryTime}</Text>
                  </View>
                )}
              </View>

              {/* Customer Info */}
              <View style={[styles.detailSection, { backgroundColor: colors.card }]}>
                <Text style={[styles.detailSectionTitle, { color: colors.text }]}>Customer Information</Text>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Name:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedOrder.customerName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Phone:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedOrder.customerPhone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Address:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedOrder.deliveryAddress}</Text>
                </View>
                {selectedOrder.specialInstructions && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.icon }]}>Instructions:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedOrder.specialInstructions}</Text>
                  </View>
                )}
              </View>

              {/* Order Items */}
              <View style={[styles.detailSection, { backgroundColor: colors.card }]}>
                <Text style={[styles.detailSectionTitle, { color: colors.text }]}>Order Items</Text>
                {selectedOrder.items.map((item, index) => (
                  <View key={index} style={styles.itemDetailRow}>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: colors.text }]}>
                        {item.foodItemName} {item.variantName ? `(${item.variantName})` : ''}
                      </Text>
                      {item.specialInstructions && (
                        <Text style={[styles.itemInstructions, { color: colors.icon }]}>
                          Note: {item.specialInstructions}
                        </Text>
                      )}
                    </View>
                    <View style={styles.itemPricing}>
                      <Text style={[styles.itemQuantity, { color: colors.icon }]}>x{item.quantity}</Text>
                      <Text style={[styles.itemPrice, { color: colors.text }]}>₹{item.totalPrice.toLocaleString('en-IN')}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Payment Summary */}
              <View style={[styles.detailSection, { backgroundColor: colors.card }]}>
                <Text style={[styles.detailSectionTitle, { color: colors.text }]}>Payment Summary</Text>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Subtotal:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Tax:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>₹{selectedOrder.taxAmount.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Delivery Fee:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>₹{selectedOrder.deliveryFee.toLocaleString('en-IN')}</Text>
                </View>
                {selectedOrder.discountAmount > 0 && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.icon }]}>Discount:</Text>
                    <Text style={[styles.detailValue, { color: colors.success }]}>-₹{selectedOrder.discountAmount.toLocaleString('en-IN')}</Text>
                  </View>
                )}
                <View style={[styles.detailRow, styles.totalRow]}>
                  <Text style={[styles.detailLabel, { color: colors.text, fontWeight: 'bold' }]}>Total:</Text>
                  <Text style={[styles.detailValue, { color: colors.primary, fontWeight: 'bold', fontSize: 18 }]}>
                    ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Payment Method:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedOrder.paymentMethod.toUpperCase()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.icon }]}>Payment Status:</Text>
                  <Text style={[styles.detailValue, { color: selectedOrder.paymentStatus === 'paid' ? colors.success : colors.warning }]}>
                    {selectedOrder.paymentStatus.toUpperCase()}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  orderCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 12,
    marginBottom: 8,
  },
  orderItems: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 12,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 12,
    fontStyle: 'italic',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bottomSpacing: {
    height: 100,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 8,
  },
  itemDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemInstructions: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 12,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    minHeight: 44,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  filterBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

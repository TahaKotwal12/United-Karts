import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SimpleOrder } from '@/constants/DummyData';

interface QuickReorderProps {
  recentOrders: SimpleOrder[];
  onReorder: (order: SimpleOrder) => void;
}

export function QuickReorder({ recentOrders, onReorder }: QuickReorderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (recentOrders.length === 0) {
    return null;
  }

  const renderOrderItem = ({ item }: { item: SimpleOrder }) => (
    <TouchableOpacity
      style={[styles.orderItem, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
      onPress={() => onReorder(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.restaurant.image }} style={styles.restaurantImage} />
      <View style={styles.orderDetails}>
        <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
          {item.restaurant.name}
        </Text>
        <Text style={[styles.orderItems, { color: colors.icon }]} numberOfLines={1}>
          {item.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
        </Text>
        <View style={styles.orderMeta}>
          <Text style={[styles.orderTotal, { color: colors.primary }]}>
            ${item.total.toFixed(2)}
          </Text>
          <Text style={[styles.orderDate, { color: colors.icon }]}>
            {new Date(item.orderTime).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.reorderButton, { backgroundColor: colors.primary }]}
        onPress={() => onReorder(item)}
      >
        <IconSymbol name="arrow.clockwise" size={16} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Quick Reorder</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Order again from your recent purchases
        </Text>
      </View>
      <FlatList
        data={recentOrders.slice(0, 5)} // Show only last 5 orders
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.ordersList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  ordersList: {
    paddingHorizontal: 20,
  },
  orderItem: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  orderDetails: {
    flex: 1,
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 12,
    marginBottom: 8,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
  },
  reorderButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

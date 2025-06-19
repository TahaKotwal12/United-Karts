import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCart } from '@/contexts/AppContext';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartItemCount } = useCart();

  const deliveryFee = 2.99;
  const serviceFee = 1.99;
  const tax = cartTotal * 0.08; // 8% tax
  const totalAmount = cartTotal + deliveryFee + serviceFee + tax;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(id) },
        ]
      );
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }
    router.push('/checkout' as any);
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Cart</Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <IconSymbol name="cart" size={80} color={colors.icon} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
            Add some delicious food to get started
          </Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/search' as any)}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={[styles.clearButton, { color: colors.accent }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {cart.map((item) => (
            <View
              key={item.id}
              style={[styles.cartItem, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.itemDescription, { color: colors.icon }]} numberOfLines={2}>
                  {item.description}
                </Text>
                
                <View style={styles.itemFooter}>
                  <Text style={[styles.itemPrice, { color: colors.primary }]}>
                    ${item.price.toFixed(2)}
                  </Text>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={[styles.quantityButton, { backgroundColor: colors.secondary }]}
                      onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <IconSymbol name="minus" size={16} color={colors.text} />
                    </TouchableOpacity>
                    
                    <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
                    
                    <TouchableOpacity
                      style={[styles.quantityButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <IconSymbol name="plus" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
              >
                <IconSymbol name="trash" size={20} color={colors.accent} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={[styles.summaryContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.icon }]}>
              Subtotal ({cartItemCount} items)
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${cartTotal.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.icon }]}>Delivery Fee</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${deliveryFee.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.icon }]}>Service Fee</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${serviceFee.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.icon }]}>Tax</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${tax.toFixed(2)}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={[styles.checkoutContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout • ${totalAmount.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
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
  clearButton: {
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 32,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  itemsContainer: {
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  itemImage: {
    width: 80,
    height: 80,
  },
  itemDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutContainer: {
    padding: 20,
    borderTopWidth: 1,
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 20,
  },
});

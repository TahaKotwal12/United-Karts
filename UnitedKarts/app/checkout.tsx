import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCart, useAppContext } from '@/contexts/AppContext';

export default function CheckoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { cart, cartTotal, clearCart } = useCart();
  const { state, dispatch } = useAppContext();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const deliveryFee = 2.99;
  const serviceFee = 1.99;
  const tax = cartTotal * 0.08;
  const totalAmount = cartTotal + deliveryFee + serviceFee + tax;

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'creditcard.fill' },
    { id: 'cash', name: 'Cash on Delivery', icon: 'plus' },
  ];

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty.');
      return;
    }

    // Create new order
    const newOrder = {
      id: Date.now().toString(),
      items: cart,
      restaurant: { 
        id: '1', 
        name: 'Mixed Order',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        rating: 4.5,
        deliveryTime: '25-30 min',
        deliveryFee: deliveryFee,
        cuisine: ['Mixed'],
        distance: '1.2 km',
        description: 'Multiple restaurants'
      },
      total: totalAmount,
      status: 'preparing' as const,
      orderTime: new Date().toISOString(),
      deliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      address: state.currentUser.address,
    };

    // Add order to state
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    
    // Clear cart
    clearCart();

    Alert.alert(
      'Order Placed!',
      `Your order has been placed successfully. Order ID: #${newOrder.id}`,
      [
        {
          text: 'Track Order',
          onPress: () => {
            router.replace('/orders' as any);
          },
        },
      ]
    );
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
        <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="location.fill" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Address</Text>
          </View>
          <Text style={[styles.address, { color: colors.text }]}>
            {state.currentUser.address}
          </Text>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={[styles.changeButtonText, { color: colors.primary }]}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="list.bullet" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
          </View>
          
          {cart.map((item) => (
            <View key={item.id} style={styles.orderItem}>
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
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.icon }]}>Subtotal</Text>
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
          
          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="creditcard.fill" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
          </View>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                {
                  borderColor: selectedPayment === method.id ? colors.primary : colors.border,
                  backgroundColor: selectedPayment === method.id ? colors.secondary : 'transparent',
                }
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <IconSymbol name={method.icon as any} size={20} color={colors.icon} />
              <Text style={[styles.paymentMethodText, { color: colors.text }]}>
                {method.name}
              </Text>
              <View style={[
                styles.radioButton,
                {
                  borderColor: selectedPayment === method.id ? colors.primary : colors.border,
                  backgroundColor: selectedPayment === method.id ? colors.primary : 'transparent',
                }
              ]}>
                {selectedPayment === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Delivery Instructions */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="pencil" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Instructions</Text>
          </View>
          
          <TextInput
            style={[
              styles.instructionsInput,
              {
                backgroundColor: colors.secondary,
                color: colors.text,
                borderColor: colors.border,
              }
            ]}
            placeholder="Add delivery instructions (optional)"
            placeholderTextColor={colors.icon}
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.checkoutContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.placeOrderButton, { backgroundColor: colors.primary }]}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderButtonText}>
            Place Order • ${totalAmount.toFixed(2)}
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  address: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  changeButton: {
    alignSelf: 'flex-start',
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQuantity: {
    fontSize: 14,
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  instructionsInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  checkoutContainer: {
    padding: 20,
    borderTopWidth: 1,
  },
  placeOrderButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 20,
  },
});

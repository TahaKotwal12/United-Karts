import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SimpleFoodItem } from '@/constants/DummyData';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCart } from '@/contexts/AppContext';

interface FoodItemCardProps {
  item: SimpleFoodItem;
  style?: any;
}

export function FoodItemCard({ item, style }: FoodItemCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Convert SimpleFoodItem to CartItem format
    addToCart({
      food_item: {
        core_mstr_united_kart_food_items_id: item.id,
        restaurant_id: item.restaurantId,
        category_id: item.category,
        name: item.name,
        description: item.description,
        price: item.price,
        discount_price: undefined,
        image: item.image,
        is_veg: item.isVeg,
        ingredients: undefined,
        allergens: undefined,
        calories: undefined,
        prep_time: undefined,
        status: 'available' as const,
        rating: item.rating,
        total_ratings: 0,
        sort_order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      quantity: 1,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.shadow }, style]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.badges}>
              <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? colors.success : colors.accent }]}>
                <View style={[styles.vegDot, { backgroundColor: item.isVeg ? colors.success : colors.accent }]} />
              </View>
              {item.isPopular && (
                <View style={[styles.popularBadge, { backgroundColor: colors.warning }]}>
                  <IconSymbol name="star.fill" size={10} color="white" />
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={12} color={colors.warning} />
            <Text style={[styles.rating, { color: colors.text }]}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={[styles.description, { color: colors.icon }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.footer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${item.price.toFixed(2)}
          </Text>
          
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <IconSymbol name="plus" size={16} color="white" />
            <Text style={styles.addText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    width: 80,
    height: 80,
    minWidth: 80,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vegBadge: {
    width: 16,
    height: 16,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

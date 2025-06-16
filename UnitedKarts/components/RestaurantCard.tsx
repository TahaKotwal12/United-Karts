import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { SimpleRestaurant } from '@/constants/DummyData';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useFavorites } from '@/contexts/AppContext';

interface RestaurantCardProps {
  restaurant: SimpleRestaurant;
  style?: any;
}

export function RestaurantCard({ restaurant, style }: RestaurantCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isRestaurantFavorite = isFavorite(restaurant.id);

  const handlePress = () => {
    router.push(`/restaurant/${restaurant.id}` as any);
  };

  const handleFavoritePress = () => {
    if (isRestaurantFavorite) {
      removeFromFavorites(restaurant.id);
    } else {
      addToFavorites(restaurant.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.shadow }, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        {restaurant.isPromoted && (
          <View style={[styles.promotedBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.promotedText}>PROMOTED</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: colors.card }]}
          onPress={handleFavoritePress}
        >
          <IconSymbol
            name={isRestaurantFavorite ? "heart.fill" : "heart"}
            size={20}
            color={isRestaurantFavorite ? colors.accent : colors.icon}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={[styles.description, { color: colors.icon }]} numberOfLines={1}>
          {restaurant.description}
        </Text>
        
        <View style={styles.cuisineContainer}>
          {restaurant.cuisine.slice(0, 2).map((cuisine, index) => (
            <View key={index} style={[styles.cuisineTag, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.cuisineText, { color: colors.icon }]}>{cuisine}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={14} color={colors.warning} />
            <Text style={[styles.rating, { color: colors.text }]}>{restaurant.rating}</Text>
          </View>
          
          <View style={styles.deliveryInfo}>
            <IconSymbol name="clock" size={14} color={colors.icon} />
            <Text style={[styles.deliveryTime, { color: colors.icon }]}>{restaurant.deliveryTime}</Text>
          </View>
          
          <View style={styles.deliveryInfo}>
            <IconSymbol name="location" size={14} color={colors.icon} />
            <Text style={[styles.distance, { color: colors.icon }]}>{restaurant.distance}</Text>
          </View>
        </View>
        
        <View style={styles.feeContainer}>
          <Text style={[styles.deliveryFee, { color: colors.icon }]}>
            Delivery: ${restaurant.deliveryFee.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  promotedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  promotedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  cuisineContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cuisineTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  cuisineText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  deliveryTime: {
    fontSize: 12,
    marginLeft: 4,
  },
  distance: {
    fontSize: 12,
    marginLeft: 4,
  },
  feeContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  deliveryFee: {
    fontSize: 12,
    fontWeight: '500',
  },
});

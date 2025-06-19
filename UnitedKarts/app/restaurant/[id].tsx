import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FoodItemCard } from '@/components/FoodItemCard';
import { restaurants, foodItems } from '@/constants/DummyData';
import { useFavorites } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const restaurant = restaurants.find(r => r.id === id);
  const restaurantItems = foodItems.filter(item => item.restaurantId === id);
  const categories = [...new Set(restaurantItems.map(item => item.category))];
  
  const filteredItems = selectedCategory 
    ? restaurantItems.filter(item => item.category === selectedCategory)
    : restaurantItems;

  const isRestaurantFavorite = restaurant ? isFavorite(restaurant.id) : false;

  if (!restaurant) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Restaurant not found</Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleFavoritePress = () => {
    if (isRestaurantFavorite) {
      removeFromFavorites(restaurant.id);
    } else {
      addToFavorites(restaurant.id);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
          
          {/* Back Button */}
          <TouchableOpacity
            style={[styles.backIconButton, { backgroundColor: colors.card }]}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>
          
          {/* Favorite Button */}
          <TouchableOpacity
            style={[styles.favoriteIconButton, { backgroundColor: colors.card }]}
            onPress={handleFavoritePress}
          >
            <IconSymbol
              name={isRestaurantFavorite ? "heart.fill" : "heart"}
              size={24}
              color={isRestaurantFavorite ? colors.accent : colors.icon}
            />
          </TouchableOpacity>
          
          {/* Promoted Badge */}
          {restaurant.isPromoted && (
            <View style={[styles.promotedBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.promotedText}>PROMOTED</Text>
            </View>
          )}
        </View>

        {/* Restaurant Info */}
        <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.restaurantName, { color: colors.text }]}>
            {restaurant.name}
          </Text>
          <Text style={[styles.description, { color: colors.icon }]}>
            {restaurant.description}
          </Text>
          
          <View style={styles.cuisineContainer}>
            {restaurant.cuisine.map((cuisine, index) => (
              <View key={index} style={[styles.cuisineTag, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.cuisineText, { color: colors.icon }]}>{cuisine}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <IconSymbol name="star.fill" size={16} color={colors.warning} />
              <Text style={[styles.statText, { color: colors.text }]}>{restaurant.rating}</Text>
            </View>
            
            <View style={styles.statItem}>
              <IconSymbol name="clock" size={16} color={colors.icon} />
              <Text style={[styles.statText, { color: colors.text }]}>{restaurant.deliveryTime}</Text>
            </View>
            
            <View style={styles.statItem}>
              <IconSymbol name="location" size={16} color={colors.icon} />
              <Text style={[styles.statText, { color: colors.text }]}>{restaurant.distance}</Text>
            </View>
          </View>
          
          <View style={[styles.deliveryInfo, { borderTopColor: colors.border }]}>
            <Text style={[styles.deliveryFee, { color: colors.icon }]}>
              Delivery Fee: ${restaurant.deliveryFee.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Menu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <TouchableOpacity
              style={[
                styles.categoryFilter,
                {
                  backgroundColor: !selectedCategory ? colors.primary : colors.secondary,
                  borderColor: !selectedCategory ? colors.primary : colors.border,
                }
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryFilterText,
                  { color: !selectedCategory ? 'white' : colors.text }
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryFilter,
                  {
                    backgroundColor: selectedCategory === category ? colors.primary : colors.secondary,
                    borderColor: selectedCategory === category ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryFilterText,
                    { color: selectedCategory === category ? 'white' : colors.text }
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {filteredItems.map((item) => (
            <FoodItemCard key={item.id} item={item} />
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
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backIconButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteIconButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  promotedBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  promotedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  cuisineTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  cuisineText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  deliveryInfo: {
    borderTopWidth: 1,
    paddingTop: 16,
    alignItems: 'center',
  },
  deliveryFee: {
    fontSize: 14,
    fontWeight: '500',
  },
  categorySection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryScroll: {
    paddingLeft: 20,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});

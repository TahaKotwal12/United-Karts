import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { RestaurantCard } from '@/components/RestaurantCard';
import { FoodItemCard } from '@/components/FoodItemCard';
import { LocationPicker } from '@/components/LocationPicker';
import { PromotionalBanner } from '@/components/PromotionalBanner';
import { QuickReorder } from '@/components/QuickReorder';
import {
  categories,
  restaurants,
  popularItems,
  promotedRestaurants,
  sampleOrders,
  SimpleOrder,
} from '@/constants/DummyData';
import { useAppContext } from '@/contexts/AppContext';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state } = useAppContext();
  const [currentLocation, setCurrentLocation] = useState(state.currentUser.address);
  const [greeting, setGreeting] = useState('Good evening');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const handleLocationChange = (location: string, coordinates?: { latitude: number; longitude: number }) => {
    setCurrentLocation(location);
    // Here you would typically update the user's location in the context/database
  };

  const handleOfferPress = (offer: any) => {
    Alert.alert(
      offer.title,
      `${offer.subtitle}\nValid until: ${new Date(offer.validUntil).toLocaleDateString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: offer.buttonText, onPress: () => router.push('/search' as any) },
      ]
    );
  };

  const handleReorder = (order: SimpleOrder) => {
    Alert.alert(
      'Reorder',
      `Would you like to reorder from ${order.restaurant.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reorder', 
          onPress: () => {
            // Add items to cart and navigate to restaurant
            router.push(`/restaurant/${order.restaurant.id}` as any);
          }
        },
      ]
    );
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.categoryItem, { backgroundColor: colors.card }]}
      onPress={() => router.push('/search' as any)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Text style={styles.categoryEmoji}>{item.image}</Text>
      </View>
      <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPopularItem = ({ item }: { item: any }) => (
    <View style={styles.popularItemContainer}>
      <FoodItemCard item={item} />
    </View>
  );

  // Get trending restaurants based on ratings and recent orders
  const trendingRestaurants = restaurants
    .filter(r => r.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Weather-based suggestions (mock implementation)
  const getWeatherBasedSuggestions = () => {
    const hour = new Date().getHours();
    if (hour < 10) {
      return categories.filter(c => c.name === 'Beverages');
    } else if (hour > 18) {
      return categories.filter(c => ['Pizza', 'Indian', 'Chinese'].includes(c.name));
    }
    return categories.slice(0, 3);
  };

  const weatherSuggestions = getWeatherBasedSuggestions();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.icon }]}>{greeting}</Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {state.currentUser.name}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/profile' as any)}
          >
            <IconSymbol name="person.fill" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Location Picker */}
        <LocationPicker
          currentLocation={currentLocation}
          onLocationChange={handleLocationChange}
        />

        {/* Search Bar */}
        <TouchableOpacity
          style={[styles.searchContainer, { backgroundColor: colors.secondary }]}
          onPress={() => router.push('/search' as any)}
        >
          <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
          <Text style={[styles.searchPlaceholder, { color: colors.icon }]}>
            Search for restaurants, food...
          </Text>
        </TouchableOpacity>

        {/* Promotional Banners */}
        <PromotionalBanner onOfferPress={handleOfferPress} />

        {/* Quick Reorder */}
        <QuickReorder 
          recentOrders={sampleOrders.filter(order => order.status === 'delivered')} 
          onReorder={handleReorder} 
        />

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Weather-based Suggestions */}
        {weatherSuggestions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Perfect for Today
              </Text>
              <IconSymbol name="sun.max.fill" size={20} color={colors.warning} />
            </View>
            <FlatList
              data={weatherSuggestions}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        )}

        {/* Trending Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trending Now
            </Text>
            <TouchableOpacity onPress={() => router.push('/search' as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {trendingRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </View>

        {/* Popular Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Popular Items
            </Text>
            <TouchableOpacity onPress={() => router.push('/search' as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularItems}
            renderItem={renderPopularItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularItemsList}
          />
        </View>

        {/* Featured Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Featured Restaurants
            </Text>
            <TouchableOpacity onPress={() => router.push('/search' as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {promotedRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </View>

        {/* All Restaurants */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            All Restaurants
          </Text>
          {restaurants.slice(0, 3).map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
          <TouchableOpacity
            style={[styles.viewMoreButton, { backgroundColor: colors.secondary }]}
            onPress={() => router.push('/search' as any)}
          >
            <Text style={[styles.viewMoreText, { color: colors.primary }]}>
              View More Restaurants
            </Text>
            <IconSymbol name="arrow.right" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Bottom spacing for tab bar */}
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
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchPlaceholder: {
    fontSize: 16,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  popularItemsList: {
    paddingHorizontal: 20,
  },
  popularItemContainer: {
    width: 280,
    marginRight: 16,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});

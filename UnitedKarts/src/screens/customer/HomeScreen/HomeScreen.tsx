import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { CustomerHomeStackScreenProps } from '../../../types/navigation';
import { colors } from '../../../config/colors';
import { textStyles } from '../../../config/typography';
import { selectUser } from '../../../store/slices/authSlice';

type Props = CustomerHomeStackScreenProps<'HomeMain'>;

// Dummy Data
const categories = [
  { id: '1', name: 'Pizza', emoji: '🍕' },
  { id: '2', name: 'Burger', emoji: '🍔' },
  { id: '3', name: 'Chinese', emoji: '🥡' },
  { id: '4', name: 'Indian', emoji: '🍛' },
  { id: '5', name: 'Desserts', emoji: '🍰' },
  { id: '6', name: 'Drinks', emoji: '🥤' },
];

const featuredRestaurants = [
  {
    id: '1',
    name: 'Pizza Palace',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '25-30 min',
    deliveryFee: 'Free',
    image: '🍕',
    discount: '20% OFF',
  },
  {
    id: '2',
    name: 'Burger King',
    cuisine: 'Fast Food',
    rating: 4.2,
    deliveryTime: '20-25 min',
    deliveryFee: '₹29',
    image: '🍔',
    discount: '₹100 OFF',
  },
  {
    id: '3',
    name: 'Spice Garden',
    cuisine: 'Indian',
    rating: 4.7,
    deliveryTime: '30-35 min',
    deliveryFee: 'Free',
    image: '🍛',
    discount: '15% OFF',
  },
];

const popularItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    restaurant: 'Pizza Palace',
    price: 299,
    image: '🍕',
    rating: 4.6,
  },
  {
    id: '2',
    name: 'Chicken Burger',
    restaurant: 'Burger King',
    price: 199,
    image: '🍔',
    rating: 4.3,
  },
  {
    id: '3',
    name: 'Butter Chicken',
    restaurant: 'Spice Garden',
    price: 349,
    image: '🍛',
    rating: 4.8,
  },
];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = useSelector(selectUser);

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Text style={styles.categoryEmoji}>{item.emoji}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRestaurant = ({ item }: { item: typeof featuredRestaurants[0] }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
    >
      <View style={styles.restaurantImageContainer}>
        <Text style={styles.restaurantImage}>{item.image}</Text>
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}
      </View>
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
        <View style={styles.restaurantMeta}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
          <Text style={styles.deliveryFee}>{item.deliveryFee}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPopularItem = ({ item }: { item: typeof popularItems[0] }) => (
    <TouchableOpacity style={styles.popularItem}>
      <Text style={styles.popularItemImage}>{item.image}</Text>
      <View style={styles.popularItemInfo}>
        <Text style={styles.popularItemName}>{item.name}</Text>
        <Text style={styles.popularItemRestaurant}>{item.restaurant}</Text>
        <View style={styles.popularItemMeta}>
          <Text style={styles.popularItemPrice}>₹{item.price}</Text>
          <Text style={styles.popularItemRating}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName}! 👋</Text>
            <Text style={styles.location}>📍 Delivering to Home</Text>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.cartIcon}>🛒</Text>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search for restaurants, food...</Text>
        </TouchableOpacity>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>🎉 Free delivery on orders above ₹199</Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RestaurantList')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredRestaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.restaurantsList}
          />
        </View>

        {/* Popular Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Near You</Text>
          <FlatList
            data={popularItems}
            renderItem={renderPopularItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    ...textStyles.h3,
    color: colors.textPrimary,
  },
  location: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchPlaceholder: {
    ...textStyles.body,
    color: colors.textLight,
  },
  banner: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bannerText: {
    ...textStyles.bodyMedium,
    color: colors.textWhite,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seeAll: {
    ...textStyles.caption,
    color: colors.primary,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    minWidth: 80,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    ...textStyles.caption,
    color: colors.textPrimary,
  },
  restaurantsList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginRight: 16,
    width: 280,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    height: 120,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  restaurantImage: {
    fontSize: 48,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    ...textStyles.small,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    ...textStyles.bodyMedium,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  restaurantCuisine: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    ...textStyles.small,
    color: colors.textPrimary,
  },
  deliveryTime: {
    ...textStyles.small,
    color: colors.textSecondary,
  },
  deliveryFee: {
    ...textStyles.small,
    color: colors.success,
  },
  popularItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
  },
  popularItemImage: {
    fontSize: 40,
    marginRight: 12,
  },
  popularItemInfo: {
    flex: 1,
  },
  popularItemName: {
    ...textStyles.bodyMedium,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  popularItemRestaurant: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  popularItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popularItemPrice: {
    ...textStyles.bodyMedium,
    color: colors.primary,
    fontWeight: 'bold',
  },
  popularItemRating: {
    ...textStyles.small,
    color: colors.textPrimary,
  },
});

export default HomeScreen;

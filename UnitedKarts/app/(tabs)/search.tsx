import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { RestaurantCard } from '@/components/RestaurantCard';
import { FoodItemCard } from '@/components/FoodItemCard';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { VoiceSearch } from '@/components/VoiceSearch';
import {
  categories,
  restaurants,
  foodItems,
  SimpleRestaurant,
  SimpleFoodItem,
} from '@/constants/DummyData';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'food'>('restaurants');
  const [showFilters, setShowFilters] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'pizza near me',
    'chinese food',
    'vegetarian options',
    'burger restaurants',
  ]);
  const [filters, setFilters] = useState({
    priceRange: [0, 50] as [number, number],
    deliveryTime: 60,
    rating: 0,
    cuisines: [] as string[],
    dietaryPreferences: [] as string[],
    sortBy: 'popularity' as 'popularity' | 'rating' | 'delivery_time' | 'price',
    isVegOnly: false,
    freeDelivery: false,
  });

  // Filter restaurants based on search query and category
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || 
      restaurant.cuisine.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  // Filter food items based on search query and category
  const filteredFoodItems = foodItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        {
          backgroundColor: selectedCategory === item.name ? colors.primary : colors.secondary,
          borderColor: selectedCategory === item.name ? colors.primary : colors.border,
        }
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
    >
      <Text style={styles.categoryEmoji}>{item.image}</Text>
      <Text
        style={[
          styles.categoryChipText,
          {
            color: selectedCategory === item.name ? 'white' : colors.text,
          }
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const handleVoiceSearchResult = (query: string) => {
    setSearchQuery(query);
    // Add to search history
    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setFilters({
      priceRange: [0, 50],
      deliveryTime: 60,
      rating: 0,
      cuisines: [],
      dietaryPreferences: [],
      sortBy: 'popularity',
      isVegOnly: false,
      freeDelivery: false,
    });
  };

  const hasActiveFilters = filters.rating > 0 || filters.cuisines.length > 0 || 
    filters.dietaryPreferences.length > 0 || filters.isVegOnly || filters.freeDelivery ||
    filters.priceRange[1] < 50 || filters.deliveryTime < 60;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Search</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowVoiceSearch(true)}
          >
            <IconSymbol name="mic.fill" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerButton, hasActiveFilters && { backgroundColor: colors.primary }]}
            onPress={() => setShowFilters(true)}
          >
            <IconSymbol 
              name="line.horizontal.3.decrease" 
              size={20} 
              color={hasActiveFilters ? 'white' : colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.secondary }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search for restaurants, food..."
          placeholderTextColor={colors.icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <IconSymbol name="xmark.circle.fill" size={20} color={colors.icon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowVoiceSearch(true)}>
            <IconSymbol name="mic.fill" size={20} color={colors.icon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search History */}
      {searchQuery === '' && searchHistory.length > 0 && (
        <View style={styles.searchHistorySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Searches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.searchHistoryList}>
              {searchHistory.map((query, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.historyChip, { backgroundColor: colors.secondary }]}
                  onPress={() => setSearchQuery(query)}
                >
                  <IconSymbol name="clock" size={14} color={colors.icon} />
                  <Text style={[styles.historyText, { color: colors.text }]}>{query}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.activeFiltersList}>
              {filters.rating > 0 && (
                <View style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                  <Text style={styles.activeFilterText}>{filters.rating}+ stars</Text>
                </View>
              )}
              {filters.cuisines.map((cuisine) => (
                <View key={cuisine} style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                  <Text style={styles.activeFilterText}>{cuisine}</Text>
                </View>
              ))}
              {filters.isVegOnly && (
                <View style={[styles.activeFilterChip, { backgroundColor: colors.success }]}>
                  <Text style={styles.activeFilterText}>Vegetarian</Text>
                </View>
              )}
              {filters.freeDelivery && (
                <View style={[styles.activeFilterChip, { backgroundColor: colors.primary }]}>
                  <Text style={styles.activeFilterText}>Free Delivery</Text>
                </View>
              )}
              <TouchableOpacity onPress={clearFilters}>
                <Text style={[styles.clearFiltersText, { color: colors.primary }]}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabContainer, { backgroundColor: colors.secondary }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'restaurants' ? colors.primary : 'transparent',
            }
          ]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'restaurants' ? 'white' : colors.text,
              }
            ]}
          >
            Restaurants ({filteredRestaurants.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'food' ? colors.primary : 'transparent',
            }
          ]}
          onPress={() => setActiveTab('food')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'food' ? 'white' : colors.text,
              }
            ]}
          >
            Food ({filteredFoodItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'restaurants' ? (
          <View style={styles.results}>
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <IconSymbol name="magnifyingglass" size={48} color={colors.icon} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No restaurants found
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
                  Try adjusting your search or filters
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.results}>
            {filteredFoodItems.length > 0 ? (
              filteredFoodItems.map((item) => (
                <FoodItemCard key={item.id} item={item} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <IconSymbol name="magnifyingglass" size={48} color={colors.icon} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No food items found
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
                  Try adjusting your search or filters
                </Text>
              </View>
            )}
          </View>
        )}
        
        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      {/* Voice Search Modal */}
      <VoiceSearch
        visible={showVoiceSearch}
        onClose={() => setShowVoiceSearch(false)}
        onSearchResult={handleVoiceSearchResult}
      />
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
    marginRight: 8,
  },
  categoriesSection: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  results: {
    paddingHorizontal: 20,
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
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchHistorySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchHistoryList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  historyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  historyText: {
    fontSize: 14,
  },
  activeFiltersSection: {
    marginBottom: 16,
  },
  activeFiltersList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  activeFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeFilterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});

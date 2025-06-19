import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface FilterOptions {
  priceRange: [number, number];
  deliveryTime: number;
  rating: number;
  cuisines: string[];
  dietaryPreferences: string[];
  sortBy: 'popularity' | 'rating' | 'delivery_time' | 'price';
  isVegOnly: boolean;
  freeDelivery: boolean;
}

interface AdvancedFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const CUISINES = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Thai', 'Japanese', 'American', 'Mediterranean'];
const DIETARY_PREFERENCES = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Low-Carb', 'Halal'];
const SORT_OPTIONS = [
  { key: 'popularity', label: 'Popularity' },
  { key: 'rating', label: 'Rating' },
  { key: 'delivery_time', label: 'Delivery Time' },
  { key: 'price', label: 'Price' },
];

export function AdvancedFilters({ visible, onClose, onApplyFilters, currentFilters }: AdvancedFiltersProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [0, 50],
      deliveryTime: 60,
      rating: 0,
      cuisines: [],
      dietaryPreferences: [],
      sortBy: 'popularity',
      isVegOnly: false,
      freeDelivery: false,
    };
    setFilters(defaultFilters);
  };

  const toggleCuisine = (cuisine: string) => {
    setFilters(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine]
    }));
  };

  const toggleDietaryPreference = (preference: string) => {
    setFilters(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <IconSymbol name="xmark" size={24} color={colors.icon} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={[styles.resetText, { color: colors.primary }]}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Range */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Range</Text>
            <View style={styles.priceRangeContainer}>
              <Text style={[styles.priceLabel, { color: colors.icon }]}>
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </Text>
            </View>
            <View style={styles.buttonRow}>
              {[10, 20, 30, 40, 50].map((price) => (
                <TouchableOpacity
                  key={price}
                  style={[
                    styles.priceButton,
                    {
                      backgroundColor: filters.priceRange[1] === price ? colors.primary : colors.secondary,
                    }
                  ]}
                  onPress={() => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: [0, price] 
                  }))}
                >
                  <Text
                    style={[
                      styles.priceButtonText,
                      { color: filters.priceRange[1] === price ? 'white' : colors.text }
                    ]}
                  >
                    ${price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Delivery Time */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Max Delivery Time</Text>
            <Text style={[styles.valueLabel, { color: colors.icon }]}>
              {filters.deliveryTime} minutes
            </Text>
            <View style={styles.buttonRow}>
              {[15, 30, 45, 60, 90].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    {
                      backgroundColor: filters.deliveryTime === time ? colors.primary : colors.secondary,
                    }
                  ]}
                  onPress={() => setFilters(prev => ({ 
                    ...prev, 
                    deliveryTime: time 
                  }))}
                >
                  <Text
                    style={[
                      styles.timeButtonText,
                      { color: filters.deliveryTime === time ? 'white' : colors.text }
                    ]}
                  >
                    {time}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Minimum Rating */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Minimum Rating</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    {
                      backgroundColor: filters.rating >= rating ? colors.warning : colors.secondary,
                    }
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, rating }))}
                >
                  <IconSymbol 
                    name="star.fill" 
                    size={16} 
                    color={filters.rating >= rating ? 'white' : colors.icon} 
                  />
                  <Text 
                    style={[
                      styles.ratingText,
                      { color: filters.rating >= rating ? 'white' : colors.icon }
                    ]}
                  >
                    {rating}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cuisines */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cuisines</Text>
            <View style={styles.chipContainer}>
              {CUISINES.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: filters.cuisines.includes(cuisine) 
                        ? colors.primary 
                        : colors.secondary,
                      borderColor: filters.cuisines.includes(cuisine) 
                        ? colors.primary 
                        : colors.border,
                    }
                  ]}
                  onPress={() => toggleCuisine(cuisine)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: filters.cuisines.includes(cuisine) ? 'white' : colors.text,
                      }
                    ]}
                  >
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Dietary Preferences */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Dietary Preferences</Text>
            <View style={styles.chipContainer}>
              {DIETARY_PREFERENCES.map((preference) => (
                <TouchableOpacity
                  key={preference}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: filters.dietaryPreferences.includes(preference) 
                        ? colors.primary 
                        : colors.secondary,
                      borderColor: filters.dietaryPreferences.includes(preference) 
                        ? colors.primary 
                        : colors.border,
                    }
                  ]}
                  onPress={() => toggleDietaryPreference(preference)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: filters.dietaryPreferences.includes(preference) ? 'white' : colors.text,
                      }
                    ]}
                  >
                    {preference}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort By */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sort By</Text>
            <View style={styles.sortContainer}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortOption,
                    {
                      backgroundColor: filters.sortBy === option.key 
                        ? colors.primary 
                        : colors.secondary,
                    }
                  ]}
                  onPress={() => setFilters(prev => ({ 
                    ...prev, 
                    sortBy: option.key as FilterOptions['sortBy'] 
                  }))}
                >
                  <Text
                    style={[
                      styles.sortText,
                      {
                        color: filters.sortBy === option.key ? 'white' : colors.text,
                      }
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Filters */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Filters</Text>
            
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Vegetarian Only</Text>
              <Switch
                value={filters.isVegOnly}
                onValueChange={(value) => setFilters(prev => ({ ...prev, isVegOnly: value }))}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={filters.isVegOnly ? 'white' : colors.icon}
              />
            </View>

            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Free Delivery</Text>
              <Switch
                value={filters.freeDelivery}
                onValueChange={(value) => setFilters(prev => ({ ...prev, freeDelivery: value }))}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={filters.freeDelivery ? 'white' : colors.icon}
              />
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.primary }]}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceRangeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  sliderContainer: {
    marginVertical: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortContainer: {
    gap: 8,
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  priceButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  priceButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

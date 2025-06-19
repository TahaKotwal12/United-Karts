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
  Modal,
  Image,
  Switch,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface FoodVariant {
  id: string;
  name: string;
  priceAdjustment: number;
  isDefault: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  isVeg: boolean;
  ingredients?: string;
  allergens?: string;
  calories?: number;
  prepTime?: number;
  status: 'available' | 'unavailable' | 'out_of_stock';
  rating: number;
  totalRatings: number;
  categoryId: string;
  variants?: FoodVariant[];
}

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export default function RestaurantMenuScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Pizza', description: 'Delicious pizzas', isActive: true, sortOrder: 1 },
    { id: '2', name: 'Appetizers', description: 'Starters and sides', isActive: true, sortOrder: 2 },
    { id: '3', name: 'Beverages', description: 'Drinks and refreshments', isActive: true, sortOrder: 3 },
    { id: '4', name: 'Desserts', description: 'Sweet treats', isActive: true, sortOrder: 4 },
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      price: 1199.25, // ₹15.99 * 75
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
      isVeg: true,
      ingredients: 'Tomato sauce, Mozzarella cheese, Fresh basil, Olive oil',
      allergens: 'Gluten, Dairy',
      calories: 280,
      prepTime: 15,
      status: 'available',
      rating: 4.5,
      totalRatings: 124,
      categoryId: '1',
      variants: [
        { id: '1', name: 'Small', priceAdjustment: -225, isDefault: false }, // ₹-3 * 75
        { id: '2', name: 'Medium', priceAdjustment: 0, isDefault: true },
        { id: '3', name: 'Large', priceAdjustment: 300, isDefault: false }, // ₹4 * 75
      ],
    },
    {
      id: '2',
      name: 'Chicken Tikka Pizza',
      description: 'Spicy chicken tikka with mozzarella cheese and tandoori sauce',
      price: 1424.25, // ₹18.99 * 75
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      isVeg: false,
      ingredients: 'Tandoori sauce, Mozzarella cheese, Chicken tikka, Onions, Bell peppers',
      allergens: 'Gluten, Dairy',
      calories: 320,
      prepTime: 15,
      status: 'available',
      rating: 4.7,
      totalRatings: 89,
      categoryId: '1',
      variants: [
        { id: '4', name: 'Small', priceAdjustment: -225, isDefault: false },
        { id: '5', name: 'Medium', priceAdjustment: 0, isDefault: true },
        { id: '6', name: 'Large', priceAdjustment: 300, isDefault: false },
      ],
    },
    {
      id: '3',
      name: 'Garlic Naan',
      description: 'Soft Indian bread with garlic and butter',
      price: 524.25, // ₹6.99 * 75
      image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400',
      isVeg: true,
      ingredients: 'Flour, Garlic, Butter, Yogurt, Herbs',
      allergens: 'Gluten, Dairy',
      calories: 180,
      prepTime: 8,
      status: 'available',
      rating: 4.3,
      totalRatings: 67,
      categoryId: '2',
    },
    {
      id: '4',
      name: 'Masala Chai',
      description: 'Traditional Indian spiced tea',
      price: 224.25, // ₹2.99 * 75
      image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
      isVeg: true,
      calories: 140,
      prepTime: 5,
      status: 'available',
      rating: 4.0,
      totalRatings: 45,
      categoryId: '3',
    },
    {
      id: '5',
      name: 'Paneer Butter Masala',
      description: 'Creamy tomato curry with cottage cheese cubes',
      price: 1874.25, // ₹24.99 * 75
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      isVeg: true,
      ingredients: 'Paneer, Tomatoes, Cream, Butter, Spices',
      allergens: 'Dairy',
      calories: 350,
      prepTime: 20,
      status: 'available',
      rating: 4.6,
      totalRatings: 156,
      categoryId: '1',
    },
    {
      id: '6',
      name: 'Gulab Jamun',
      description: 'Sweet milk dumplings in sugar syrup',
      price: 374.25, // ₹4.99 * 75
      image: 'https://images.unsplash.com/photo-1571167530149-c72f2d8b4b52?w=400',
      isVeg: true,
      ingredients: 'Milk powder, Sugar, Cardamom, Rose water',
      allergens: 'Dairy',
      calories: 250,
      prepTime: 5,
      status: 'available',
      rating: 4.4,
      totalRatings: 78,
      categoryId: '4',
    },
  ]);

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    isVeg: true,
    status: 'available',
    categoryId: '1',
  });

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return colors.success;
      case 'unavailable': return colors.warning;
      case 'out_of_stock': return colors.accent;
      default: return colors.icon;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'unavailable': return 'Unavailable';
      case 'out_of_stock': return 'Out of Stock';
      default: return status;
    }
  };

  const handleToggleItemStatus = (itemId: string) => {
    setMenuItems(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const newStatus = item.status === 'available' ? 'unavailable' : 'available';
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems(prev => prev.filter(item => item.id !== itemId));
            Alert.alert('Success', 'Menu item deleted');
          },
        },
      ]
    );
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setNewItem(item);
    setShowEditItem(true);
  };

  const handleSaveItem = () => {
    if (!newItem.name || !newItem.description || !newItem.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (showEditItem && selectedItem) {
      // Update existing item
      setMenuItems(prev =>
        prev.map(item =>
          item.id === selectedItem.id ? { ...item, ...newItem } as MenuItem : item
        )
      );
      Alert.alert('Success', 'Menu item updated');
    } else {
      // Add new item
      const newMenuItem: MenuItem = {
        ...newItem,
        id: Date.now().toString(),
        rating: 0,
        totalRatings: 0,
      } as MenuItem;
      setMenuItems(prev => [...prev, newMenuItem]);
      Alert.alert('Success', 'Menu item added');
    }

    setShowAddItem(false);
    setShowEditItem(false);
    setNewItem({
      name: '',
      description: '',
      price: 0,
      isVeg: true,
      status: 'available',
      categoryId: '1',
    });
    setSelectedItem(null);
  };

  const MenuItemCard = ({ item }: { item: MenuItem }) => (
    <View style={[styles.menuItemCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.itemTitleContainer}>
            <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.itemBadges}>
              <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? colors.success : colors.accent }]}>
                <View style={[styles.vegDot, { backgroundColor: item.isVeg ? colors.success : colors.accent }]} />
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusBadgeText}>{getStatusText(item.status)}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.secondary }]}
              onPress={() => handleEditItem(item)}
            >
              <IconSymbol name="pencil" size={16} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.secondary }]}
              onPress={() => handleDeleteItem(item.id)}
            >
              <IconSymbol name="trash" size={16} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.itemDescription, { color: colors.icon }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.itemDetails}>
          <View style={styles.itemMeta}>
            <Text style={[styles.itemPrice, { color: colors.primary }]}>
              ₹{item.price.toLocaleString('en-IN')}
            </Text>
            {item.discountPrice && (
              <Text style={[styles.itemDiscountPrice, { color: colors.accent }]}>
                ₹{item.discountPrice.toLocaleString('en-IN')}
              </Text>
            )}
          </View>
          
          <View style={styles.itemStats}>
            <View style={styles.statItem}>
              <IconSymbol name="star.fill" size={12} color={colors.warning} />
              <Text style={[styles.statText, { color: colors.icon }]}>
                {item.rating.toFixed(1)} ({item.totalRatings})
              </Text>
            </View>
            {item.prepTime && (
              <View style={styles.statItem}>
                <IconSymbol name="clock" size={12} color={colors.icon} />
                <Text style={[styles.statText, { color: colors.icon }]}>
                  {item.prepTime} min
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.itemFooter}>
          <Switch
            value={item.status === 'available'}
            onValueChange={() => handleToggleItemStatus(item.id)}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={item.status === 'available' ? 'white' : colors.icon}
          />
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            {item.status === 'available' ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Menu Management</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddItem(true)}
        >
          <IconSymbol name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.secondary }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search menu items..."
          placeholderTextColor={colors.icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === 'all' ? colors.primary : colors.card,
                borderColor: selectedCategory === 'all' ? colors.primary : colors.border,
              }
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <IconSymbol 
              name="list.bullet" 
              size={16} 
              color={selectedCategory === 'all' ? 'white' : colors.icon} 
            />
            <Text
              style={[
                styles.categoryChipText,
                { color: selectedCategory === 'all' ? 'white' : colors.text }
              ]}
            >
              All ({menuItems.length})
            </Text>
          </TouchableOpacity>
          
          {categories.map((category) => {
            const count = menuItems.filter(item => item.categoryId === category.id).length;
            const isSelected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <IconSymbol 
                  name={category.id === '1' ? 'menucard' : category.id === '2' ? 'bag' : category.id === '3' ? 'star' : 'heart'} 
                  size={16} 
                  color={isSelected ? 'white' : colors.icon} 
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: isSelected ? 'white' : colors.text }
                  ]}
                >
                  {category.name} ({count})
                </Text>
                {count > 0 && (
                  <View style={[styles.categoryBadge, { backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : colors.primary }]}>
                    <Text style={[styles.categoryBadgeText, { color: isSelected ? 'white' : 'white' }]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="menucard" size={48} color={colors.icon} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No menu items found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first menu item to get started'}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add/Edit Item Modal */}
      <Modal
        visible={showAddItem || showEditItem}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowAddItem(false);
          setShowEditItem(false);
          setNewItem({
            name: '',
            description: '',
            price: 0,
            isVeg: true,
            status: 'available',
            categoryId: '1',
          });
          setSelectedItem(null);
        }}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => {
                setShowAddItem(false);
                setShowEditItem(false);
                setNewItem({
                  name: '',
                  description: '',
                  price: 0,
                  isVeg: true,
                  status: 'available',
                  categoryId: '1',
                });
                setSelectedItem(null);
              }}
            >
              <IconSymbol name="xmark" size={24} color={colors.icon} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {showEditItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </Text>
            <TouchableOpacity onPress={handleSaveItem}>
              <Text style={[styles.saveButton, { color: colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Basic Information */}
            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Basic Information</Text>
              
              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Item Name *</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  placeholder="Enter item name"
                  placeholderTextColor={colors.icon}
                  value={newItem.name}
                  onChangeText={(text) => setNewItem(prev => ({ ...prev, name: text }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, { backgroundColor: colors.secondary, color: colors.text }]}
                  placeholder="Enter item description"
                  placeholderTextColor={colors.icon}
                  value={newItem.description}
                  onChangeText={(text) => setNewItem(prev => ({ ...prev, description: text }))}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Price *</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  placeholder="0.00"
                  placeholderTextColor={colors.icon}
                  value={newItem.price?.toString()}
                  onChangeText={(text) => setNewItem(prev => ({ ...prev, price: parseFloat(text) || 0 }))}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Category *</Text>
                <View style={[styles.pickerContainer, { backgroundColor: colors.secondary }]}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryOption,
                          {
                            backgroundColor: newItem.categoryId === category.id ? colors.primary : 'transparent',
                          }
                        ]}
                        onPress={() => setNewItem(prev => ({ ...prev, categoryId: category.id }))}
                      >
                        <Text
                          style={[
                            styles.categoryOptionText,
                            { color: newItem.categoryId === category.id ? 'white' : colors.text }
                          ]}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>

            {/* Additional Details */}
            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Additional Details</Text>
              
              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Ingredients</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  placeholder="List ingredients separated by commas"
                  placeholderTextColor={colors.icon}
                  value={newItem.ingredients}
                  onChangeText={(text) => setNewItem(prev => ({ ...prev, ingredients: text }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Allergens</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  placeholder="List allergens separated by commas"
                  placeholderTextColor={colors.icon}
                  value={newItem.allergens}
                  onChangeText={(text) => setNewItem(prev => ({ ...prev, allergens: text }))}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formField, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>Calories</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                    placeholder="0"
                    placeholderTextColor={colors.icon}
                    value={newItem.calories?.toString()}
                    onChangeText={(text) => setNewItem(prev => ({ ...prev, calories: parseInt(text) || undefined }))}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.formField, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>Prep Time (min)</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                    placeholder="0"
                    placeholderTextColor={colors.icon}
                    value={newItem.prepTime?.toString()}
                    onChangeText={(text) => setNewItem(prev => ({ ...prev, prepTime: parseInt(text) || undefined }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.switchField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Vegetarian</Text>
                <Switch
                  value={newItem.isVeg}
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, isVeg: value }))}
                  trackColor={{ false: colors.border, true: colors.success }}
                  thumbColor={newItem.isVeg ? 'white' : colors.icon}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  menuItemCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemBadges: {
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
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  itemDiscountPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  itemStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    fontSize: 10,
    marginLeft: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 12,
    marginLeft: 8,
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
    paddingHorizontal: 40,
  },
  bottomSpacing: {
    height: 100,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderRadius: 8,
    padding: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    minHeight: 44,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  categoryBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

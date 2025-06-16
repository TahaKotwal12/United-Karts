import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Location from 'expo-location';

interface LocationPickerProps {
  currentLocation: string;
  onLocationChange: (location: string, coordinates?: { latitude: number; longitude: number }) => void;
}

interface SavedAddress {
  id: string;
  title: string;
  address: string;
  coordinates?: { latitude: number; longitude: number };
}

const SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: '1',
    title: 'Home',
    address: '123 Main St, City Center',
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
  },
  {
    id: '2',
    title: 'Work',
    address: '456 Business Ave, Downtown',
    coordinates: { latitude: 37.7849, longitude: -122.4094 },
  },
  {
    id: '3',
    title: 'Gym',
    address: '789 Fitness Blvd, Sports District',
    coordinates: { latitude: 37.7649, longitude: -122.4294 },
  },
];

export function LocationPicker({ currentLocation, onLocationChange }: LocationPickerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const filteredAddresses = SAVED_ADDRESSES.filter(address =>
    address.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get your current location.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const currentAddress = `${address[0].street || ''} ${address[0].city || ''}, ${address[0].region || ''}`.trim();
        onLocationChange(currentAddress, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const selectAddress = (address: SavedAddress) => {
    onLocationChange(address.address, address.coordinates);
    setModalVisible(false);
  };

  const renderAddressItem = ({ item }: { item: SavedAddress }) => (
    <TouchableOpacity
      style={[styles.addressItem, { backgroundColor: colors.card }]}
      onPress={() => selectAddress(item)}
    >
      <View style={[styles.addressIcon, { backgroundColor: colors.secondary }]}>
        <IconSymbol 
          name={item.title === 'Home' ? 'house.fill' : item.title === 'Work' ? 'building.2.fill' : 'location.fill'} 
          size={16} 
          color={colors.primary} 
        />
      </View>
      <View style={styles.addressDetails}>
        <Text style={[styles.addressTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.addressText, { color: colors.icon }]} numberOfLines={2}>
          {item.address}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={16} color={colors.icon} />
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.locationContainer}
        onPress={() => setModalVisible(true)}
      >
        <IconSymbol name="location.fill" size={16} color={colors.primary} />
        <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={1}>
          {currentLocation}
        </Text>
        <IconSymbol name="chevron.down" size={16} color={colors.icon} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <IconSymbol name="xmark" size={24} color={colors.icon} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Location</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Search */}
          <View style={[styles.searchContainer, { backgroundColor: colors.secondary }]}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search for area, street name..."
              placeholderTextColor={colors.icon}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Current Location Button */}
          <TouchableOpacity
            style={[styles.currentLocationButton, { backgroundColor: colors.primary }]}
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            <IconSymbol 
              name={isLoadingLocation ? "arrow.clockwise" : "location.fill"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.currentLocationText}>
              {isLoadingLocation ? 'Getting location...' : 'Use current location'}
            </Text>
          </TouchableOpacity>

          {/* Saved Addresses */}
          <View style={styles.savedAddressesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Saved Addresses</Text>
            <FlatList
              data={filteredAddresses}
              renderItem={renderAddressItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: '500',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  currentLocationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  savedAddressesSection: {
    flex: 1,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
  },
});

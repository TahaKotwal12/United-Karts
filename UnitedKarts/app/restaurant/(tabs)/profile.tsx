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
  Switch,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface RestaurantProfile {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  image: string;
  coverImage: string;
  cuisineType: string;
  avgDeliveryTime: number;
  minOrderAmount: number;
  deliveryFee: number;
  rating: number;
  totalRatings: number;
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
  fssaiLicense: string;
  gstin: string;
  bankDetails: { accountNumber: string; ifscCode: string };
  closingTime: string;
}

interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'bank' | 'wallet';
  name: string;
  details: string;
  isActive: boolean;
}

export default function RestaurantProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);

  const [profile, setProfile] = useState<RestaurantProfile>({
    id: '1',
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine with traditional recipes passed down through generations. Specializing in North Indian and South Indian delicacies with fresh spices and ingredients.',
    phone: '+91 98765 43210',
    email: 'info@spicegarden.in',
    address: {
      line1: 'Shop No. 15, Food Court Complex',
      line2: 'Sector 18, Noida',
      city: 'Noida',
      state: 'Uttar Pradesh',
      postalCode: '201301',
    },
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    cuisineType: 'Indian',
    avgDeliveryTime: 30,
    minOrderAmount: 1125.00, // ₹15.00 * 75
    deliveryFee: 224.25, // ₹2.99 * 75
    rating: 4.6,
    totalRatings: 1247,
    isOpen: true,
    openingTime: '10:00',
    closingTime: '22:00',
    fssaiLicense: '12345678901234', // Dummy FSSAI number
    gstin: '07ABCDE1234F1Z5', // Dummy GSTIN
    bankDetails: { accountNumber: '9876543210', ifscCode: 'HDFC0001234' }, // Dummy bank details
    closingTime: '22:00',
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'upi',
      name: 'Google Pay',
      details: 'spicegarden@okaxis',
      isActive: true,
    },
    {
      id: '2',
      type: 'upi',
      name: 'PhonePe',
      details: '9876543210@ybl',
      isActive: true,
    },
    {
      id: '3',
      type: 'bank',
      name: 'HDFC Bank',
      details: 'Account: ****1234',
      isActive: true,
    },
    {
      id: '4',
      type: 'card',
      name: 'Credit Card',
      details: 'Visa ****5678',
      isActive: false,
    },
  ]);

  const [editedProfile, setEditedProfile] = useState<RestaurantProfile>(profile);

  const menuItems = [
    {
      id: '1',
      title: 'Business Hours',
      icon: 'clock',
      action: () => Alert.alert('Business Hours', 'Configure your operating hours'),
    },
    {
      id: '2',
      title: 'Payment Settings',
      icon: 'qrcode',
      action: () => setShowPaymentSettings(true),
    },
    {
      id: '3',
      title: 'UPI & Bank Details',
      icon: 'creditcard.and.123',
      action: () => setShowPaymentSettings(true),
    },
    {
      id: '4',
      title: 'Reviews & Ratings',
      icon: 'star',
      action: () => Alert.alert('Reviews', 'View and respond to customer reviews'),
    },
    {
      id: '5',
      title: 'Promotions & Offers',
      icon: 'tag',
      action: () => Alert.alert('Promotions', 'Create and manage promotional offers'),
    },
    {
      id: '6',
      title: 'Notifications',
      icon: 'bell',
      action: () => Alert.alert('Notifications', 'Manage notification preferences'),
    },
    {
      id: '7',
      title: 'Support & Help',
      icon: 'questionmark.circle',
      action: () => Alert.alert('Support', 'Contact customer support'),
    },
    {
      id: '8',
      title: 'Terms & Privacy',
      icon: 'doc.text',
      action: () => Alert.alert('Legal', 'View terms of service and privacy policy'),
    },
  ];

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setShowEditProfile(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'upi': return 'qrcode';
      case 'card': return 'creditcard';
      case 'bank': return 'building.2';
      case 'wallet': return 'bag';
      default: return 'creditcard';
    }
  };

  const PaymentMethodCard = ({ method }: { method: PaymentMethod }) => (
    <View style={[styles.paymentCard, { backgroundColor: colors.secondary }]}>
      <View style={styles.paymentCardHeader}>
        <View style={styles.paymentCardLeft}>
          <View style={[styles.paymentIcon, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol name={getPaymentIcon(method.type) as any} size={20} color={colors.primary} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentName, { color: colors.text }]}>{method.name}</Text>
            <Text style={[styles.paymentDetails, { color: colors.icon }]}>{method.details}</Text>
          </View>
        </View>
        <Switch
          value={method.isActive}
          onValueChange={(value) => {
            setPaymentMethods(prev =>
              prev.map(p => p.id === method.id ? { ...p, isActive: value } : p)
            );
          }}
          trackColor={{ false: colors.border, true: colors.success }}
          thumbColor={method.isActive ? 'white' : colors.icon}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity onPress={() => setShowEditProfile(true)}>
          <IconSymbol name="pencil" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverImageContainer}>
          <Image source={{ uri: profile.coverImage }} style={styles.coverImage} />
          <View style={styles.coverOverlay} />
        </View>

        {/* Restaurant Info */}
        <View style={[styles.profileSection, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: profile.image }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={[styles.restaurantName, { color: colors.text }]}>{profile.name}</Text>
              <Text style={[styles.cuisineType, { color: colors.icon }]}>{profile.cuisineType} Cuisine</Text>
              <View style={styles.ratingContainer}>
                <IconSymbol name="star.fill" size={16} color={colors.warning} />
                <Text style={[styles.rating, { color: colors.text }]}>
                  {profile.rating.toFixed(1)} ({profile.totalRatings} reviews)
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: profile.isOpen ? colors.success : colors.accent }]}>
              <Text style={styles.statusText}>{profile.isOpen ? 'OPEN' : 'CLOSED'}</Text>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.icon }]}>{profile.description}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <IconSymbol name="phone" size={16} color={colors.icon} />
              <Text style={[styles.detailText, { color: colors.text }]}>{profile.phone}</Text>
            </View>
            <View style={styles.detailItem}>
              <IconSymbol name="envelope" size={16} color={colors.icon} />
              <Text style={[styles.detailText, { color: colors.text }]}>{profile.email}</Text>
            </View>
            <View style={styles.detailItem}>
              <IconSymbol name="location" size={16} color={colors.icon} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {profile.address.line1}, {profile.address.city}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <IconSymbol name="clock" size={16} color={colors.icon} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {profile.openingTime} - {profile.closingTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <IconSymbol name="clock" size={20} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{profile.avgDeliveryTime} min</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Avg Delivery</Text>
            </View>
            
            <View style={styles.statCard}>
              <IconSymbol name="indianrupee.circle" size={20} color={colors.success} />
              <Text style={[styles.statValue, { color: colors.text }]}>₹{profile.minOrderAmount.toLocaleString('en-IN')}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Min Order</Text>
            </View>
            
            <View style={styles.statCard}>
              <IconSymbol name="truck.box" size={20} color={colors.warning} />
              <Text style={[styles.statValue, { color: colors.text }]}>₹{profile.deliveryFee.toLocaleString('en-IN')}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Delivery Fee</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods Preview */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Methods</Text>
            <TouchableOpacity onPress={() => setShowPaymentSettings(true)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentPreview}>
            {paymentMethods.filter(p => p.isActive).slice(0, 2).map((method) => (
              <View key={method.id} style={styles.paymentPreviewItem}>
                <IconSymbol name={getPaymentIcon(method.type) as any} size={16} color={colors.primary} />
                <Text style={[styles.paymentPreviewText, { color: colors.text }]}>{method.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Options */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings & More</Text>
          
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}>
                  <IconSymbol name={item.icon as any} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.icon} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.accent }]}
            onPress={handleLogout}
          >
            <IconSymbol name="arrow.right.square" size={20} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Payment Settings Modal */}
      <Modal
        visible={showPaymentSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPaymentSettings(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowPaymentSettings(false)}>
              <IconSymbol name="xmark" size={24} color={colors.icon} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Payment Settings</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Active Payment Methods</Text>
              <Text style={[styles.formSectionSubtitle, { color: colors.icon }]}>
                Manage how customers can pay for their orders
              </Text>
              
              {paymentMethods.map((method) => (
                <PaymentMethodCard key={method.id} method={method} />
              ))}
            </View>

            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Add New Payment Method</Text>
              
              <TouchableOpacity style={[styles.addPaymentButton, { backgroundColor: colors.secondary }]}>
                <IconSymbol name="plus" size={20} color={colors.primary} />
                <Text style={[styles.addPaymentText, { color: colors.primary }]}>Add UPI ID</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.addPaymentButton, { backgroundColor: colors.secondary }]}>
                <IconSymbol name="plus" size={20} color={colors.primary} />
                <Text style={[styles.addPaymentText, { color: colors.primary }]}>Add Bank Account</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.addPaymentButton, { backgroundColor: colors.secondary }]}>
                <IconSymbol name="plus" size={20} color={colors.primary} />
                <Text style={[styles.addPaymentText, { color: colors.primary }]}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowEditProfile(false)}>
              <IconSymbol name="xmark" size={24} color={colors.icon} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={[styles.saveButton, { color: colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Basic Information */}
            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Basic Information</Text>
              
              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Restaurant Name</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  value={editedProfile.name}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, { backgroundColor: colors.secondary, color: colors.text }]}
                  value={editedProfile.description}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, description: text }))}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Cuisine Type</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  value={editedProfile.cuisineType}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, cuisineType: text }))}
                />
              </View>
            </View>

            {/* Contact Information */}
            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Contact Information</Text>
              
              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Phone Number</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  value={editedProfile.phone}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phone: text }))}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Email Address</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  value={editedProfile.email}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Regulatory Information */}
            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Regulatory Information</Text>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>FSSAI License Number</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  value={editedProfile.fssaiLicense}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, fssaiLicense: text }))}
                  keyboardType="default"
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>GSTIN</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  value={editedProfile.gstin}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, gstin: text }))}
                  keyboardType="default"
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Bank Details */}
            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Bank Details for Payouts</Text>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Bank Account Number</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  value={editedProfile.bankDetails.accountNumber}
                  onChangeText={(text) => setEditedProfile(prev => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, accountNumber: text }
                  }))}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>IFSC Code</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  value={editedProfile.bankDetails.ifscCode}
                  onChangeText={(text) => setEditedProfile(prev => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, ifscCode: text }
                  }))}
                  keyboardType="default"
                  autoCapitalize="characters"
                />
              </View>
            </View>


            {/* Restaurant Photos Placeholder */}
            {/* Business Settings */}
            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Business Settings</Text>
              
              <View style={styles.formRow}>
                <View style={[styles.formField, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>Avg Delivery Time (min)</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                    value={editedProfile.avgDeliveryTime.toString()}
                    onChangeText={(text) => setEditedProfile(prev => ({ 
                      ...prev, 
                      avgDeliveryTime: parseInt(text) || 0 
                    }))}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.formField, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>Min Order Amount (₹)</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                    value={editedProfile.minOrderAmount.toString()}
                    onChangeText={(text) => setEditedProfile(prev => ({ 
                      ...prev, 
                      minOrderAmount: parseFloat(text) || 0 
                    }))}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Delivery Fee (₹)</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.secondary, color: colors.text }]}
                  value={editedProfile.deliveryFee.toString()}
                  onChangeText={(text) => setEditedProfile(prev => ({ 
                    ...prev, 
                    deliveryFee: parseFloat(text) || 0 
                  }))}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.switchField}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Currently Open</Text>
                <Switch
                  value={editedProfile.isOpen}
                  onValueChange={(value) => setEditedProfile(prev => ({ ...prev, isOpen: value }))}
                  trackColor={{ false: colors.border, true: colors.success }}
                  thumbColor={editedProfile.isOpen ? 'white' : colors.icon}
                />
              </View>
            </View>

            {/* Restaurant Photos */}
            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Restaurant Photos</Text>
              <Text style={[styles.formSectionSubtitle, { color: colors.icon }]}>
                Showcase your restaurant and food to customers.
              </Text>
              {/* Placeholder for photo upload and display */}
              <View style={styles.photoUploadPlaceholder}>
                <IconSymbol name="photo.on.rectangle.angled" size={40} color={colors.icon} />
                <Text style={[styles.photoUploadText, { color: colors.icon }]}>Tap to add photos</Text>
              </View>
            </View>

            {/* Reviews and Ratings Placeholder */}
            <View style={[styles.formSection, { backgroundColor: colors.card }]}>
              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Customer Reviews & Ratings</Text>
              {/* Placeholder for reviews and ratings list */}
              <Text style={[styles.formSectionSubtitle, { color: colors.icon }]}>Display list of customer reviews here.</Text>
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
  content: {
    flex: 1,
  },
  coverImageContainer: {
    height: 150,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  profileSection: {
    margin: 20,
    marginTop: -30,
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cuisineType: {
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  paymentPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  paymentPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  paymentPreviewText: {
    fontSize: 12,
    marginLeft: 6,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    marginBottom: 8,
  },
  formSectionSubtitle: {
    fontSize: 14,
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
  switchField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  paymentDetails: {
    fontSize: 12,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

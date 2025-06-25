import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function RestaurantOnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Restaurant Information
  const [restaurantName, setRestaurantName] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Address Information
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Business Information
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [avgDeliveryTime, setAvgDeliveryTime] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');

  // Indian Business Details
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [gstin, setGstin] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // Document Uploads
  const [restaurantPhotos, setRestaurantPhotos] = useState<string[]>([]); // To store image URIs

  const totalSteps = 3;

  const cuisineOptions = [
    'Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Thai', 
    'Japanese', 'Mediterranean', 'Fast Food', 'Vegetarian', 'Vegan', 'Other'
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!restaurantName || !description || !cuisineType || !phone) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
    } else if (currentStep === 2) {
      if (!addressLine1 || !city || !state || !postalCode) {
        Alert.alert('Error', 'Please fill in all required address fields');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!minOrderAmount || !deliveryFee || !avgDeliveryTime || !openingTime || !closingTime) {
      Alert.alert('Error', 'Please fill in all business information');
      return;
    }

    setLoading(true);

    // Simulate API call to create restaurant
    setTimeout(() => {
      setLoading(false);
        Alert.alert(
          'Success!',
          'Your restaurant has been registered successfully. We will review your application and get back to you within 24 hours.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/restaurant/(tabs)' as any),
            },
          ]
        );
    }, 2000);
  };

  const handleDocumentUpload = async (documentType: string) => {
    // Placeholder for document upload logic
    // This should ideally open a file picker or camera
    Alert.alert('Upload Document', `Simulating upload for ${documentType}`);
    // In a real app, you would use libraries like expo-document-picker or expo-image-picker
  };

  const handlePhotoUpload = async () => {
    // Placeholder for photo upload logic
    // This should ideally open an image picker or camera
    Alert.alert('Upload Photo', 'Simulating photo upload');
    // In a real app, you would use libraries like expo-image-picker
    // After successful upload, add the image URI to restaurantPhotos state
    // Example: setRestaurantPhotos([...restaurantPhotos, uploadedImageUri]);
  };

  const renderDocumentUpload = (label: string, fileType: string) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label} *</Text>
      <Pressable
        style={[styles.uploadButton, { backgroundColor: colors.secondary, borderColor: colors.border }]}
        onPress={() => handleDocumentUpload(label)}
      >
        <IconSymbol name="doc.fill" size={20} color={colors.icon} />
        <Text style={[styles.uploadButtonText, { color: colors.text }]}>Upload {fileType}</Text>
      </Pressable>
      {/* Add preview/status indicator here */}
    </View>
  );

  const renderPhotoUpload = () => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>Restaurant Photos *</Text>
      <View style={styles.photoUploadContainer}>
        {restaurantPhotos.map((photoUri, index) => (
          <View key={index} style={styles.photoPreview}>
            {/* Replace with actual Image component in a real app */}
            <View style={[styles.photoPlaceholder, { backgroundColor: colors.border }]}>
              <Text style={{ color: colors.icon }}>Photo {index + 1}</Text>
            </View>
            {/* Add option to remove photo */}
          </View>
        ))}
        <Pressable
          style={[styles.addPhotoButton, { backgroundColor: colors.secondary, borderColor: colors.border }]}
          onPress={handlePhotoUpload}
        >
          <IconSymbol name="camera.fill" size={30} color={colors.icon} />
        </Pressable>
      </View>
      {/* Add guidelines for photos */}
      <Text style={[styles.guidelinesText, { color: colors.icon }]}>
        Upload at least 3-5 high-quality photos of your restaurant and signature dishes.
      </Text>
    </View>
  );

  const renderStep4 = () => (
    <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Indian Business Details & Documents</Text>
      <Text style={[styles.stepDescription, { color: colors.icon }]}>
        Provide necessary business and bank details for verification and payouts.
      </Text>

      {renderDocumentUpload('FSSAI License', 'FSSAI License (PDF or Image)')}
      {renderDocumentUpload('GST Certificate', 'GST Certificate (PDF or Image)')}
      {renderDocumentUpload('PAN Card', 'PAN Card (Image)')}

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>GSTIN (Optional)</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter GSTIN"
            placeholderTextColor={colors.icon}
            value={gstin}
            onChangeText={setGstin}
            autoCapitalize="characters"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Bank Account Number *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="creditcard.fill" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter bank account number"
            placeholderTextColor={colors.icon}
            value={bankAccountNumber}
            onChangeText={setBankAccountNumber}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>IFSC Code *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="building.columns.fill" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter IFSC code"
            placeholderTextColor={colors.icon}
            value={ifscCode}
            onChangeText={setIfscCode}
            autoCapitalize="characters"
          />
        </View>
      </View>

      {renderPhotoUpload()}

    </View>
  );

  // Update totalSteps to include the new step
  const totalSteps = 4;


  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              {
                backgroundColor: index + 1 <= currentStep ? colors.primary : colors.border,
              }
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                { color: index + 1 <= currentStep ? 'white' : colors.icon }
              ]}
            >
              {index + 1}
            </Text>
          </View>
          {index < totalSteps - 1 && (
            <View
              style={[
                styles.stepLine,
                { backgroundColor: index + 1 < currentStep ? colors.primary : colors.border }
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Restaurant Information</Text>
      <Text style={[styles.stepDescription, { color: colors.icon }]}>
        Tell us about your restaurant
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Restaurant Name *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="house.fill" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter restaurant name"
            placeholderTextColor={colors.icon}
            value={restaurantName}
            onChangeText={setRestaurantName}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
        <View style={[styles.inputWrapper, styles.textAreaWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, styles.textArea, { color: colors.text }]}
            placeholder="Describe your restaurant and specialties"
            placeholderTextColor={colors.icon}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Cuisine Type *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cuisineScroll}>
          {cuisineOptions.map((cuisine) => (
            <TouchableOpacity
              key={cuisine}
              style={[
                styles.cuisineChip,
                {
                  backgroundColor: cuisineType === cuisine ? colors.primary : colors.secondary,
                  borderColor: cuisineType === cuisine ? colors.primary : colors.border,
                }
              ]}
              onPress={() => setCuisineType(cuisine)}
            >
              <Text
                style={[
                  styles.cuisineChipText,
                  { color: cuisineType === cuisine ? 'white' : colors.text }
                ]}
              >
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Restaurant Phone *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="phone" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Restaurant phone number"
            placeholderTextColor={colors.icon}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Restaurant Email</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="person.fill" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Restaurant email (optional)"
            placeholderTextColor={colors.icon}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Restaurant Address</Text>
      <Text style={[styles.stepDescription, { color: colors.icon }]}>
        Where is your restaurant located?
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Address Line 1 *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="location.fill" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Street address"
            placeholderTextColor={colors.icon}
            value={addressLine1}
            onChangeText={setAddressLine1}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Address Line 2</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="location" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Apartment, suite, etc. (optional)"
            placeholderTextColor={colors.icon}
            value={addressLine2}
            onChangeText={setAddressLine2}
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={[styles.label, { color: colors.text }]}>City *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="City"
              placeholderTextColor={colors.icon}
              value={city}
              onChangeText={setCity}
            />
          </View>
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={[styles.label, { color: colors.text }]}>State *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="State"
              placeholderTextColor={colors.icon}
              value={state}
              onChangeText={setState}
            />
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Postal Code *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Postal code"
            placeholderTextColor={colors.icon}
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Business Information</Text>
      <Text style={[styles.stepDescription, { color: colors.icon }]}>
        Set up your business details
      </Text>

      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={[styles.label, { color: colors.text }]}>Min Order Amount *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Text style={[styles.currencySymbol, { color: colors.icon }]}>$</Text>
            <TextInput // TODO: Change currency symbol to ₹ or use a dynamic approach based on region
              style={[styles.input, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.icon}
              value={minOrderAmount}
              onChangeText={setMinOrderAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={[styles.label, { color: colors.text }]}>Delivery Fee *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Text style={[styles.currencySymbol, { color: colors.icon }]}>$</Text>
            <TextInput // TODO: Change currency symbol to ₹
              style={[styles.input, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.icon}
              value={deliveryFee}
              onChangeText={setDeliveryFee}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Average Delivery Time *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="clock" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="e.g., 30 (minutes)"
            placeholderTextColor={colors.icon}
            value={avgDeliveryTime}
            onChangeText={setAvgDeliveryTime}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={[styles.label, { color: colors.text }]}>Opening Time *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="09:00"
              placeholderTextColor={colors.icon}
              value={openingTime}
              onChangeText={setOpeningTime}
            />
          </View>
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={[styles.label, { color: colors.text }]}>Closing Time *</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="22:00"
              placeholderTextColor={colors.icon}
              value={closingTime}
              onChangeText={setClosingTime}
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.primary }]}>Restaurant Setup</Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Step {currentStep} of {totalSteps}
            </Text>
          </View>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Form Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: colors.primary }]}
              onPress={handleNext}
              disabled={loading}
            >
              <Text style={styles.nextButtonText}>
                {loading ? 'Submitting...' : currentStep === totalSteps ? 'Complete Setup' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  textArea: {
    marginLeft: 0,
    minHeight: 80,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  cuisineScroll: {
    marginTop: 8,
  },
  cuisineChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  cuisineChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  photoUploadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }, // Placeholder style
  addPhotoButton: { width: 80, height: 80, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  guidelinesText: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

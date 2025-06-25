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
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { VehicleType } from '@/constants/DummyData';

export default function DeliveryOnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Personal Information
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Vehicle Information
  const [vehicleType, setVehicleType] = useState<VehicleType>('motorcycle');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');

  // Documents
  const [drivingLicense, setDrivingLicense] = useState('');
  const [vehicleRegistration, setVehicleRegistration] = useState('');
  const [insurance, setInsurance] = useState('');
  const [backgroundCheck, setBackgroundCheck] = useState(false);

  const totalSteps = 3;

  const vehicleOptions = [
    {
      id: 'bicycle' as VehicleType,
      title: 'Bicycle',
      description: 'Eco-friendly, perfect for short distances',
      icon: '🚲',
      color: colors.success,
    },
    {
      id: 'motorcycle' as VehicleType,
      title: 'Motorcycle',
      description: 'Fast and efficient for city deliveries',
      icon: '🏍️',
      color: colors.primary,
    },
    {
      id: 'car' as VehicleType,
      title: 'Car',
      description: 'Best for large orders and long distances',
      icon: '🚗',
      color: colors.warning,
    },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!emergencyContact || !emergencyPhone) {
        Alert.alert('Error', 'Please fill in emergency contact information');
        return;
      }
    } else if (currentStep === 2) {
      if (!vehicleNumber || !licenseNumber) {
        Alert.alert('Error', 'Please fill in all required vehicle information');
        return;
      }
      if (vehicleType !== 'bicycle' && (!vehicleMake || !vehicleModel || !vehicleYear)) {
        Alert.alert('Error', 'Please fill in vehicle details');
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
    if (!drivingLicense || !vehicleRegistration || !insurance || !backgroundCheck) {
      Alert.alert('Error', 'Please complete all document requirements');
      return;
    }

    setLoading(true);

    // Simulate API call to create delivery partner profile
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success!',
        'Your delivery partner application has been submitted successfully. We will verify your documents and get back to you within 48 hours.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/delivery-dashboard' as any),
          },
        ]
      );
    }, 2000);
  };

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
      <Text style={[styles.stepTitle, { color: colors.text }]}>Personal Information</Text>
      <Text style={[styles.stepDescription, { color: colors.icon }]}>
        Additional details for safety and security
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Emergency Contact Name *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="person.fill" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Full name of emergency contact"
            placeholderTextColor={colors.icon}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Emergency Contact Phone *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="phone" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Emergency contact phone number"
            placeholderTextColor={colors.icon}
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: colors.secondary, borderColor: colors.primary }]}>
        <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          This information is kept confidential and only used in case of emergencies during deliveries.
        </Text>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Vehicle Information</Text>
      <Text style={[styles.stepDescription, { color: colors.icon }]}>
        Tell us about your delivery vehicle
      </Text>

      {/* Vehicle Type Selection */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Vehicle Type *</Text>
        <View style={styles.vehicleOptions}>
          {vehicleOptions.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.vehicleOption,
                {
                  backgroundColor: vehicleType === vehicle.id ? vehicle.color + '20' : colors.secondary,
                  borderColor: vehicleType === vehicle.id ? vehicle.color : colors.border,
                }
              ]}
              onPress={() => setVehicleType(vehicle.id)}
            >
              <Text style={styles.vehicleEmoji}>{vehicle.icon}</Text>
              <View style={styles.vehicleContent}>
                <Text style={[styles.vehicleTitle, { color: colors.text }]}>{vehicle.title}</Text>
                <Text style={[styles.vehicleDescription, { color: colors.icon }]}>{vehicle.description}</Text>
              </View>
              <View style={[
                styles.radioButton,
                {
                  borderColor: vehicleType === vehicle.id ? vehicle.color : colors.border,
                  backgroundColor: vehicleType === vehicle.id ? vehicle.color : 'transparent',
                }
              ]}>
                {vehicleType === vehicle.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Vehicle Details */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          {vehicleType === 'bicycle' ? 'Bicycle' : 'Vehicle'} Number/Plate *
        </Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="car" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={vehicleType === 'bicycle' ? 'Bicycle identification' : 'License plate number'}
            placeholderTextColor={colors.icon}
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
            autoCapitalize="characters"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Driving License Number *</Text>
        <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <IconSymbol name="creditcard.fill" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Your driving license number"
            placeholderTextColor={colors.icon}
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            autoCapitalize="characters"
          />
        </View>
      </View>

      {vehicleType !== 'bicycle' && (
        <>
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>Make *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Honda, Toyota, etc."
                  placeholderTextColor={colors.icon}
                  value={vehicleMake}
                  onChangeText={setVehicleMake}
                />
              </View>
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>Model *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Civic, Camry, etc."
                  placeholderTextColor={colors.icon}
                  value={vehicleModel}
                  onChangeText={setVehicleModel}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Year *</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="2020"
                placeholderTextColor={colors.icon}
                value={vehicleYear}
                onChangeText={setVehicleYear}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={[styles.formContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Documents & Verification</Text>
      <Text style={[styles.stepDescription, { color: colors.icon }]}>
        Upload required documents for verification
      </Text>

      <View style={styles.documentContainer}>
        <TouchableOpacity
          style={[
            styles.documentItem,
            {
              backgroundColor: drivingLicense ? colors.success + '20' : colors.secondary,
              borderColor: drivingLicense ? colors.success : colors.border,
            }
          ]}
          onPress={() => {
            setDrivingLicense('uploaded');
            Alert.alert('Document Upload', 'Driving license uploaded successfully!');
          }}
        >
          <IconSymbol 
            name={drivingLicense ? "checkmark.circle.fill" : "plus"} 
            size={24} 
            color={drivingLicense ? colors.success : colors.icon} 
          />
          <View style={styles.documentContent}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>Driving License</Text>
            <Text style={[styles.documentStatus, { color: drivingLicense ? colors.success : colors.icon }]}>
              {drivingLicense ? 'Uploaded' : 'Required'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.documentItem,
            {
              backgroundColor: vehicleRegistration ? colors.success + '20' : colors.secondary,
              borderColor: vehicleRegistration ? colors.success : colors.border,
            }
          ]}
          onPress={() => {
            setVehicleRegistration('uploaded');
            Alert.alert('Document Upload', 'Vehicle registration uploaded successfully!');
          }}
        >
          <IconSymbol 
            name={vehicleRegistration ? "checkmark.circle.fill" : "plus"} 
            size={24} 
            color={vehicleRegistration ? colors.success : colors.icon} 
          />
          <View style={styles.documentContent}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>
              {vehicleType === 'bicycle' ? 'ID Proof' : 'Vehicle Registration'}
            </Text>
            <Text style={[styles.documentStatus, { color: vehicleRegistration ? colors.success : colors.icon }]}>
              {vehicleRegistration ? 'Uploaded' : 'Required'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.documentItem,
            {
              backgroundColor: insurance ? colors.success + '20' : colors.secondary,
              borderColor: insurance ? colors.success : colors.border,
            }
          ]}
          onPress={() => {
            setInsurance('uploaded');
            Alert.alert('Document Upload', 'Insurance document uploaded successfully!');
          }}
        >
          <IconSymbol 
            name={insurance ? "checkmark.circle.fill" : "plus"} 
            size={24} 
            color={insurance ? colors.success : colors.icon} 
          />
          <View style={styles.documentContent}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>Insurance Certificate</Text>
            <Text style={[styles.documentStatus, { color: insurance ? colors.success : colors.icon }]}>
              {insurance ? 'Uploaded' : 'Required'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Background Check Consent */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setBackgroundCheck(!backgroundCheck)}
      >
        <View style={[
          styles.checkbox,
          {
            backgroundColor: backgroundCheck ? colors.primary : 'transparent',
            borderColor: backgroundCheck ? colors.primary : colors.border,
          }
        ]}>
          {backgroundCheck && (
            <IconSymbol name="checkmark.circle.fill" size={16} color="white" />
          )}
        </View>
        <Text style={[styles.checkboxText, { color: colors.text }]}>
          I consent to a background check for safety verification
        </Text>
      </TouchableOpacity>

      <View style={[styles.infoBox, { backgroundColor: colors.secondary, borderColor: colors.warning }]}>
        <IconSymbol name="info.circle.fill" size={20} color={colors.warning} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          All documents will be verified within 48 hours. You'll receive an email confirmation once approved.
        </Text>
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
            <Text style={[styles.title, { color: colors.primary }]}>Delivery Partner Setup</Text>
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
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  vehicleOptions: {
    gap: 12,
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  vehicleEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  vehicleContent: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  vehicleDescription: {
    fontSize: 14,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  documentContainer: {
    gap: 12,
    marginBottom: 24,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  documentContent: {
    flex: 1,
    marginLeft: 16,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  documentStatus: {
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
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

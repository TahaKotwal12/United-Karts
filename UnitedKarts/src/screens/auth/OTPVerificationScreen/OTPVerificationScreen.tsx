import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../../types/navigation';
import { colors } from '../../../config/colors';
import { textStyles } from '../../../config/typography';
import Button from '../../../components/common/Button';

type Props = AuthStackScreenProps<'OTPVerification'>;

export const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phone, isRegistration } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (isRegistration) {
        navigation.navigate('RoleSelection', {
          user: {
            phone: phone,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
        });
      } else {
        navigation.navigate('Login');
      }
    }, 2000);
  };

  const handleResendOTP = () => {
    if (timer === 0) {
      setTimer(60);
      Alert.alert('Success', 'OTP sent successfully');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Verify Phone Number</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to {phone}
        </Text>
      </View>

      {/* OTP Input */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={[styles.input, { fontSize: 24, letterSpacing: 8 }]}
            placeholder="123456"
            placeholderTextColor={colors.textLight}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />
        </View>

        <Button
          title="Verify OTP"
          onPress={handleVerifyOTP}
          loading={loading}
          variant="primary"
          size="large"
          fullWidth
          style={styles.verifyButton}
        />

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code?{' '}
          </Text>
          <Button
            title={timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            onPress={handleResendOTP}
            variant="ghost"
            size="small"
            disabled={timer > 0}
          />
        </View>

        {/* Demo OTP */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Demo OTP: 123456</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    ...textStyles.h1,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    ...textStyles.bodyMedium,
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  verifyButton: {
    marginBottom: 30,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  resendText: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
  demoContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  demoTitle: {
    ...textStyles.bodyMedium,
    color: colors.primary,
  },
});

export default OTPVerificationScreen;

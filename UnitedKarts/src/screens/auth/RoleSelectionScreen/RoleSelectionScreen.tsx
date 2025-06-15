import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { AuthStackScreenProps } from '../../../types/navigation';
import { colors } from '../../../config/colors';
import { textStyles } from '../../../config/typography';
import Button from '../../../components/common/Button';
import { loginSuccess } from '../../../store/slices/authSlice';

type Props = AuthStackScreenProps<'RoleSelection'>;

const roles = [
  {
    id: 'customer',
    title: 'Customer',
    subtitle: 'Order food from your favorite restaurants',
    emoji: '🍽️',
    description: 'Browse restaurants, place orders, and track deliveries',
  },
  {
    id: 'delivery_partner',
    title: 'Delivery Partner',
    subtitle: 'Earn money by delivering food',
    emoji: '🚚',
    description: 'Accept delivery requests and earn on your schedule',
  },
  {
    id: 'restaurant_owner',
    title: 'Restaurant Owner',
    subtitle: 'Manage your restaurant and orders',
    emoji: '🏪',
    description: 'List your restaurant, manage menu, and receive orders',
  },
];

export const RoleSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user } = route.params;
  const [selectedRole, setSelectedRole] = useState<string>('customer');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const dummyUser = {
        id: '1',
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: selectedRole as any,
        profileImage: undefined,
        isEmailVerified: true,
        isPhoneVerified: true,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(loginSuccess({
        user: dummyUser,
        token: 'dummy_token_123',
        refreshToken: 'dummy_refresh_token_123',
      }));

      setLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          How would you like to use United Karts?
        </Text>
      </View>

      {/* Role Options */}
      <View style={styles.content}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              selectedRole === role.id && styles.selectedRoleCard,
            ]}
            onPress={() => handleRoleSelect(role.id)}
          >
            <View style={styles.roleHeader}>
              <Text style={styles.roleEmoji}>{role.emoji}</Text>
              <View style={styles.roleInfo}>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedRole === role.id && styles.selectedRadioButton,
              ]}>
                {selectedRole === role.id && <View style={styles.radioButtonInner} />}
              </View>
            </View>
            <Text style={styles.roleDescription}>{role.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          variant="primary"
          size="large"
          fullWidth
        />
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
    paddingBottom: 30,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedRoleCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  roleSubtitle: {
    ...textStyles.caption,
    color: colors.textSecondary,
  },
  roleDescription: {
    ...textStyles.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default RoleSelectionScreen;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../config/colors';
import { textStyles } from '../config/typography';

const DeliveryNavigator: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🚚 Delivery Partner Dashboard</Text>
        <Text style={styles.subtitle}>Manage your deliveries and earnings</Text>
        <Text style={styles.note}>Coming Soon!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    ...textStyles.h2,
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  note: {
    ...textStyles.bodyMedium,
    color: colors.primary,
    textAlign: 'center',
  },
});

export default DeliveryNavigator;
